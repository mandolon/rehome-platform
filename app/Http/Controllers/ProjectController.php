<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class ProjectController extends Controller
{
    /**
     * Display a listing of the projects.
     */
    public function index(Request $request)
    {
        try {
            $projects = Project::query()
                ->when($request->with, function ($query) use ($request) {
                    $with = explode(',', $request->with);
                    $query->with($with);
                })
                ->paginate($request->per_page ?? 15);

            return ProjectResource::collection($projects);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve projects',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created project in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        try {
            $project = Project::create($request->validated());
            
            return new ProjectResource($project);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to create project',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified project.
     */
    public function show(Request $request, Project $project)
    {
        try {
            if ($request->with) {
                $with = explode(',', $request->with);
                $project->load($with);
            }
            
            return new ProjectResource($project);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Project not found'
            ], Response::HTTP_NOT_FOUND);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve project',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified project in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        try {
            $project->update($request->validated());
            
            return new ProjectResource($project);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Project not found'
            ], Response::HTTP_NOT_FOUND);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to update project',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified project from storage.
     */
    public function destroy(Project $project)
    {
        try {
            $project->delete();
            
            return response()->json([
                'message' => 'Project deleted successfully'
            ], Response::HTTP_OK);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Project not found'
            ], Response::HTTP_NOT_FOUND);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to delete project',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}