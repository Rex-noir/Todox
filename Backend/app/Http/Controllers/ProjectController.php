<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /** @var User */
        $user = Auth::user();
        $projects = $user->projects()->with('todoLists')->get();

        return ProjectResource::collection($projects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProjectRequest $request)
    {
        $project = new Project($request->validated());

        $project->user()->associate($request->user());
        $project->save();

        return response(null, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $project = Project::with('todoLists')->findOrFail($id);
        $this->authorize("view", $project);
        return new ProjectResource($project);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProjectRequest $request, string $id)
    {
        $project = Project::findOrFail($id);
        $project->update($request->validated());
        return response(null, 204);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProjectRequest $request, string $id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return response(null, 204);
    }
}
