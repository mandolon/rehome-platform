<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::with(['owner', 'users'])
            ->when($request->user()->role !== 'admin', function ($query) use ($request) {
                return $query->where(function ($q) use ($request) {
                    $q->where('owner_id', $request->user()->id)
                      ->orWhereHas('users', function ($userQuery) use ($request) {
                          $userQuery->where('user_id', $request->user()->id);
                      });
                });
            });

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%')
                  ->orWhere('client_name', 'like', '%' . $request->search . '%');
            });
        }

        $projects = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'budget' => 'nullable|numeric|min:0',
            'client_name' => 'nullable|string|max:255',
            'project_type' => 'required|in:residential,commercial,industrial,infrastructure,renovation',
            'location' => 'nullable|string|max:255',
        ]);

        $project = Project::create([
            'name' => $request->name,
            'description' => $request->description,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'budget' => $request->budget,
            'owner_id' => $request->user()->id,
            'client_name' => $request->client_name,
            'project_type' => $request->project_type,
            'location' => $request->location,
        ]);

        $project->load(['owner', 'users']);

        return response()->json($project, 201);
    }

    public function show(Request $request, Project $project)
    {
        $this->authorize('view', $project);

        $project->load(['owner', 'users', 'tasks.assignedUser', 'files.uploader']);

        return response()->json($project);
    }

    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:active,completed,on_hold,cancelled',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'budget' => 'nullable|numeric|min:0',
            'client_name' => 'nullable|string|max:255',
            'project_type' => 'sometimes|in:residential,commercial,industrial,infrastructure,renovation',
            'location' => 'nullable|string|max:255',
        ]);

        $project->update($request->only([
            'name', 'description', 'status', 'start_date', 'end_date',
            'budget', 'client_name', 'project_type', 'location'
        ]));

        $project->load(['owner', 'users', 'tasks.assignedUser', 'files.uploader']);

        return response()->json($project);
    }

    public function destroy(Request $request, Project $project)
    {
        $this->authorize('delete', $project);

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }

    public function addUser(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:project_manager,architect,contractor,client,viewer',
        ]);

        $project->users()->syncWithoutDetaching([
            $request->user_id => [
                'role' => $request->role,
                'joined_at' => now(),
            ]
        ]);

        return response()->json(['message' => 'User added to project successfully']);
    }

    public function removeUser(Request $request, Project $project, $userId)
    {
        $this->authorize('update', $project);

        $project->users()->detach($userId);

        return response()->json(['message' => 'User removed from project successfully']);
    }

    public function dashboard(Request $request)
    {
        $user = $request->user();
        
        $projects = Project::with(['tasks'])
            ->when($user->role !== 'admin', function ($query) use ($user) {
                return $query->where(function ($q) use ($user) {
                    $q->where('owner_id', $user->id)
                      ->orWhereHas('users', function ($userQuery) use ($user) {
                          $userQuery->where('user_id', $user->id);
                      });
                });
            })
            ->get();

        $stats = [
            'total_projects' => $projects->count(),
            'active_projects' => $projects->where('status', 'active')->count(),
            'completed_projects' => $projects->where('status', 'completed')->count(),
            'total_tasks' => $projects->sum(function ($project) {
                return $project->tasks->count();
            }),
            'completed_tasks' => $projects->sum(function ($project) {
                return $project->tasks->where('status', 'completed')->count();
            }),
        ];

        return response()->json([
            'projects' => $projects->take(5),
            'stats' => $stats,
        ]);
    }
}