<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\ProjectFile;
use App\Models\TaskFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function uploadProjectFile(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $request->validate([
            'file' => 'required|file|max:51200', // 50MB max
            'category' => 'required|in:blueprint,design,permit,photo,document,other',
            'description' => 'nullable|string|max:500',
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $fileName = time() . '_' . $originalName;
        $filePath = $file->storeAs('projects/' . $project->id, $fileName, 'public');

        $projectFile = ProjectFile::create([
            'project_id' => $project->id,
            'name' => $fileName,
            'original_name' => $originalName,
            'file_path' => $filePath,
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'uploaded_by' => $request->user()->id,
            'category' => $request->category,
            'description' => $request->description,
        ]);

        $projectFile->load('uploader');

        return response()->json($projectFile, 201);
    }

    public function uploadTaskFile(Request $request, Task $task)
    {
        $this->authorize('update', $task->project);

        $request->validate([
            'file' => 'required|file|max:51200', // 50MB max
            'description' => 'nullable|string|max:500',
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $fileName = time() . '_' . $originalName;
        $filePath = $file->storeAs('tasks/' . $task->id, $fileName, 'public');

        $taskFile = TaskFile::create([
            'task_id' => $task->id,
            'name' => $fileName,
            'original_name' => $originalName,
            'file_path' => $filePath,
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'uploaded_by' => $request->user()->id,
            'description' => $request->description,
        ]);

        $taskFile->load('uploader');

        return response()->json($taskFile, 201);
    }

    public function downloadProjectFile(Request $request, Project $project, ProjectFile $file)
    {
        $this->authorize('view', $project);

        if ($file->project_id !== $project->id) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return Storage::disk('public')->download($file->file_path, $file->original_name);
    }

    public function downloadTaskFile(Request $request, Task $task, TaskFile $file)
    {
        $this->authorize('view', $task->project);

        if ($file->task_id !== $task->id) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return Storage::disk('public')->download($file->file_path, $file->original_name);
    }

    public function deleteProjectFile(Request $request, Project $project, ProjectFile $file)
    {
        $this->authorize('update', $project);

        if ($file->project_id !== $project->id) {
            return response()->json(['message' => 'File not found'], 404);
        }

        // Only file uploader or project owner can delete
        if ($file->uploaded_by !== $request->user()->id && $project->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Storage::disk('public')->delete($file->file_path);
        $file->delete();

        return response()->json(['message' => 'File deleted successfully']);
    }

    public function deleteTaskFile(Request $request, Task $task, TaskFile $file)
    {
        $this->authorize('update', $task->project);

        if ($file->task_id !== $task->id) {
            return response()->json(['message' => 'File not found'], 404);
        }

        // Only file uploader or project owner can delete
        if ($file->uploaded_by !== $request->user()->id && $task->project->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Storage::disk('public')->delete($file->file_path);
        $file->delete();

        return response()->json(['message' => 'File deleted successfully']);
    }

    public function getProjectFiles(Request $request, Project $project)
    {
        $this->authorize('view', $project);

        $query = $project->files()->with('uploader');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $files = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($files);
    }

    public function getTaskFiles(Request $request, Task $task)
    {
        $this->authorize('view', $task->project);

        $files = $task->files()->with('uploader')->orderBy('created_at', 'desc')->get();

        return response()->json($files);
    }
}