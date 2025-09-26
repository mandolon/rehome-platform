<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Request as RequestModel;
use App\Models\RequestComment;
use App\Models\RequestParticipant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Validation\Rule;

class RequestController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        // List requests visible to the user: creator, assignee, participant, or admin
        /** @var User $user */
        $user = $request->user();

        $query = RequestModel::query()
            ->with(['creator:id,name,email', 'assignee:id,name,email'])
            ->when(!$user->isAdmin(), function ($q) use ($user) {
                $q->where(function ($inner) use ($user) {
                    $inner->where('creator_id', $user->id)
                        ->orWhere('assignee_id', $user->id)
                        ->orWhereExists(function ($sub) use ($user) {
                            $sub->selectRaw('1')
                                ->from('request_participants as rp')
                                ->whereColumn('rp.request_id', 'requests.id')
                                ->where('rp.user_id', $user->id);
                        });
                });
            })
            ->orderByDesc('id');

        return response()->json($query->paginate(20));
    }

    public function show(Request $request, RequestModel $requestModel)
    {
        $this->authorize('view', $requestModel);
        $requestModel->load(['creator:id,name,email', 'assignee:id,name,email', 'comments.user:id,name,email']);
        return response()->json($requestModel);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'assignee_id' => ['nullable', 'integer', 'exists:users,id'],
        ]);

        /** @var User $user */
        $user = $request->user();
        $model = RequestModel::create([
            'title' => $data['title'],
            'status' => 'open',
            'assignee_id' => $data['assignee_id'] ?? null,
            'creator_id' => $user->id,
        ]);

        return response()->json($model->fresh(), 201);
    }

    public function update(Request $request, RequestModel $requestModel)
    {
        $this->authorize('update', $requestModel);

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'assignee_id' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
        ]);

        $requestModel->fill($data);
        $requestModel->save();

        return response()->json($requestModel);
    }

    public function comment(Request $request, RequestModel $requestModel)
    {
        $this->authorize('comment', $requestModel);

        $data = $request->validate([
            'body' => ['required', 'string'],
        ]);

        $comment = RequestComment::create([
            'request_id' => $requestModel->id,
            'user_id' => $request->user()->id,
            'body' => $data['body'],
        ]);

        return response()->json($comment, 201);
    }

    public function assign(Request $request, RequestModel $requestModel)
    {
        $this->authorize('assign', $requestModel);

        $data = $request->validate([
            'assignee_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        $requestModel->assignee_id = $data['assignee_id'];
        $requestModel->save();

        // Ensure the assignee is participant at least as contributor
        RequestParticipant::updateOrCreate(
            [
                'request_id' => $requestModel->id,
                'user_id' => $data['assignee_id'],
            ],
            [
                'role' => 'contributor',
            ]
        );

        return response()->json($requestModel->fresh());
    }

    public function setStatus(Request $request, RequestModel $requestModel)
    {
        $this->authorize('update', $requestModel);

        $data = $request->validate([
            'status' => ['required', Rule::in(RequestModel::STATUSES)],
        ]);

        $requestModel->status = $data['status'];
        $requestModel->save();

        return response()->json($requestModel);
    }

    public function destroy(RequestModel $requestModel)
    {
        $this->authorize('delete', $requestModel);
        
        $requestModel->delete();
        
        return response()->json(['message' => 'Request deleted successfully']);
    }
}
