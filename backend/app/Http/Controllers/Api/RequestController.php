<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRequestRequest;
use App\Http\Requests\UpdateRequestRequest;
use App\Models\Request;
use App\Models\RequestComment;
use App\Models\RequestParticipant;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Auth;
use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="Requests API",
 *     version="1.0.0",
 *     description="API for managing requests"
 * )
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 */
class RequestController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     * 
     * @OA\Get(
     *     path="/api/requests",
     *     summary="Get all requests",
     *     tags={"Requests"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="mine",
     *         in="query",
     *         description="Filter by requests created by current user",
     *         required=false,
     *         @OA\Schema(type="boolean")
     *     ),
     *     @OA\Parameter(
     *         name="assigned",
     *         in="query",
     *         description="Filter by requests assigned to current user",
     *         required=false,
     *         @OA\Schema(type="boolean")
     *     ),
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Filter by request status",
     *         required=false,
     *         @OA\Schema(type="string", enum={"open", "in_progress", "blocked", "resolved", "closed"})
     *     ),
     *     @OA\Parameter(
     *         name="q",
     *         in="query",
     *         description="Search by title or body",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="sort",
     *         in="query",
     *         description="Sort field",
     *         required=false,
     *         @OA\Schema(type="string", enum={"created_at", "status", "title"})
     *     ),
     *     @OA\Parameter(
     *         name="order",
     *         in="query",
     *         description="Sort order",
     *         required=false,
     *         @OA\Schema(type="string", enum={"asc", "desc"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Request")),
     *             @OA\Property(property="current_page", type="integer"),
     *             @OA\Property(property="per_page", type="integer"),
     *             @OA\Property(property="total", type="integer"),
     *             @OA\Property(property="last_page", type="integer")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function index(HttpRequest $request): JsonResponse
    {
        // Authorization is handled by middleware (ensureRole + scopeWorkspace)

        $query = Request::with(['creator', 'assignee', 'participants']);

        // Filter by mine (created by user)
        if ($request->has('mine') && $request->boolean('mine')) {
            $query->where('creator_id', Auth::id());
        }

        // Filter by assigned to user
        if ($request->has('assigned') && $request->boolean('assigned')) {
            $query->where('assignee_id', Auth::id());
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search by title or body
        if ($request->has('q') && !empty($request->q)) {
            $searchTerm = $request->q;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('body', 'like', "%{$searchTerm}%");
            });
        }

        // Sort by field
        $sortField = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        $requests = $query->paginate(15);

        return response()->json($requests);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequestRequest $request): JsonResponse
    {
        // Authorization is handled by middleware (ensureRole + scopeWorkspace)

        $data = $request->validated();
        $data['creator_id'] = Auth::id();

        $newRequest = Request::create($data);

        // Add creator as participant (no role needed in simple RBAC)
        RequestParticipant::create([
            'request_id' => $newRequest->id,
            'user_id' => Auth::id(),
        ]);

        // Add assignee as participant if set (no role needed in simple RBAC)
        if (isset($data['assignee_id'])) {
            RequestParticipant::create([
                'request_id' => $newRequest->id,
                'user_id' => $data['assignee_id'],
            ]);
        }

        $newRequest->load(['creator', 'assignee', 'participants']);

        return response()->json($newRequest, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request): JsonResponse
    {
        // Authorization is handled by middleware (ensureRole + scopeWorkspace)

        $request->load(['creator', 'assignee', 'participants.user', 'comments.user']);

        return response()->json($request);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequestRequest $request, Request $requestModel): JsonResponse
    {
        // Authorization is handled by middleware (ensureRole + scopeWorkspace)

        $data = $request->validated();
        $requestModel->update($data);

        $requestModel->load(['creator', 'assignee', 'participants']);

        return response()->json($requestModel);
    }

    /**
     * Add a comment to the request.
     */
    public function comment(HttpRequest $request, Request $requestModel): JsonResponse
    {
        // Authorization is handled by middleware (ensureRole + scopeWorkspace)

        $request->validate([
            'body' => 'required|string',
        ]);

        $comment = RequestComment::create([
            'request_id' => $requestModel->id,
            'user_id' => Auth::id(),
            'body' => $request->body,
        ]);

        $comment->load('user');

        return response()->json($comment, 201);
    }

    /**
     * Assign the request to a user.
     */
    public function assign(HttpRequest $request, Request $requestModel): JsonResponse
    {
        // Authorization is handled by middleware (ensureRole + scopeWorkspace)

        $request->validate([
            'assignee_id' => 'required|exists:users,id',
        ]);

        $requestModel->update(['assignee_id' => $request->assignee_id]);

        // Ensure participant row exists (no role needed in simple RBAC)
        if ($request->assignee_id !== $requestModel->creator_id) {
            RequestParticipant::updateOrCreate(
                [
                    'request_id' => $requestModel->id,
                    'user_id' => $request->assignee_id,
                ],
                []
            );
        }

        $requestModel->load(['creator', 'assignee', 'participants']);

        return response()->json($requestModel);
    }

    /**
     * Update the status of the request.
     */
    public function status(HttpRequest $request, Request $requestModel): JsonResponse
    {
        // Authorization is handled by middleware (ensureRole + scopeWorkspace)

        $request->validate([
            'status' => 'required|in:open,in_progress,blocked,resolved,closed',
        ]);

        $requestModel->update(['status' => $request->status]);

        $requestModel->load(['creator', 'assignee', 'participants']);

        return response()->json($requestModel);
    }
}
