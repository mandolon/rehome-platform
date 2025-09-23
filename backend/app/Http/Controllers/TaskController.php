<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request, Project $project)
    {
        $this->authorize('view', $project);

        $query = $project->tasks()->with(['assignedUser', 'creator', 'parentTask', 'subtasks']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $tasks = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($tasks);
    }

    public function store(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date|after:now',
            'estimated_hours' => 'nullable|numeric|min:0',
            'assigned_to' => 'nullable|exists:users,id',
            'parent_task_id' => 'nullable|exists:tasks,id',
        ]);

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $request->priority,
            'due_date' => $request->due_date,
            'estimated_hours' => $request->estimated_hours,
            'assigned_to' => $request->assigned_to,
            'parent_task_id' => $request->parent_task_id,
            'project_id' => $project->id,
            'created_by' => $request->user()->id,
        ]);

        $task->load(['assignedUser', 'creator', 'parentTask']);

        return response()->json($task, 201);
    }

    public function show(Request $request, Task $task)
    {
        $this->authorize('view', $task->project);

        $task->load([
            'assignedUser',
            'creator',
            'parentTask',
            'subtasks.assignedUser',
            'comments.user',
            'files.uploader'
        ]);

        return response()->json($task);
    }

    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task->project);

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:pending,in_progress,completed,cancelled,on_hold',
            'priority' => 'sometimes|in:low,medium,high',
            'due_date' => 'nullable|date',
            'estimated_hours' => 'nullable|numeric|min:0',
            'actual_hours' => 'nullable|numeric|min:0',
            'completion_percentage' => 'nullable|integer|min:0|max:100',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $task->update($request->only([
            'title', 'description', 'status', 'priority', 'due_date',
            'estimated_hours', 'actual_hours', 'completion_percentage', 'assigned_to'
        ]));

        // Auto-update completion percentage based on status
        if ($request->has('status')) {
            if ($request->status === 'completed') {
                $task->update(['completion_percentage' => 100]);
            } elseif ($request->status === 'pending') {
                $task->update(['completion_percentage' => 0]);
            }
        }

        $task->load(['assignedUser', 'creator', 'parentTask', 'subtasks']);

        return response()->json($task);
    }

    public function destroy(Request $request, Task $task)
    {
        $this->authorize('update', $task->project);

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function addComment(Request $request, Task $task)
    {
        $this->authorize('view', $task->project);

        $request->validate([
            'comment' => 'required|string',
            'is_internal' => 'boolean',
        ]);

        $comment = $task->comments()->create([
            'user_id' => $request->user()->id,
            'comment' => $request->comment,
            'is_internal' => $request->boolean('is_internal', false),
        ]);

        $comment->load('user');

        return response()->json($comment, 201);
    }

    public function myTasks(Request $request)
    {
        $user = $request->user();
        
        $query = Task::with(['project', 'creator', 'parentTask'])
            ->where('assigned_to', $user->id);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('overdue')) {
            $query->where('due_date', '<', now())
                  ->where('status', '!=', 'completed');
        }

        $tasks = $query->orderBy('due_date', 'asc')
                      ->orderBy('priority', 'desc')
                      ->paginate(20);

        return response()->json($tasks);
    }
}