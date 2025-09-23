<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class TaskController extends Controller
{
    /**
     * Display a listing of the tasks.
     */
    public function index(Request $request)
    {
        try {
            $tasks = Task::query()
                ->when($request->project_id, function ($query) use ($request) {
                    $query->where('project_id', $request->project_id);
                })
                ->when($request->assigned_user_id, function ($query) use ($request) {
                    $query->where('assigned_user_id', $request->assigned_user_id);
                })
                ->when($request->status, function ($query) use ($request) {
                    $query->where('status', $request->status);
                })
                ->when($request->priority, function ($query) use ($request) {
                    $query->where('priority', $request->priority);
                })
                ->when($request->with, function ($query) use ($request) {
                    $with = explode(',', $request->with);
                    $query->with($with);
                })
                ->orderBy('created_at', 'desc')
                ->paginate($request->per_page ?? 15);

            return TaskResource::collection($tasks);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve tasks',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created task in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        try {
            $task = Task::create($request->validated());
            
            return new TaskResource($task);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to create task',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified task.
     */
    public function show(Request $request, Task $task)
    {
        try {
            if ($request->with) {
                $with = explode(',', $request->with);
                $task->load($with);
            }
            
            return new TaskResource($task);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Task not found'
            ], Response::HTTP_NOT_FOUND);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve task',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified task in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        try {
            $task->update($request->validated());
            
            return new TaskResource($task);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Task not found'
            ], Response::HTTP_NOT_FOUND);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to update task',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified task from storage.
     */
    public function destroy(Task $task)
    {
        try {
            $task->delete();
            
            return response()->json([
                'message' => 'Task deleted successfully'
            ], Response::HTTP_OK);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Task not found'
            ], Response::HTTP_NOT_FOUND);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to delete task',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}