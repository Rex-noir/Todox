<?php

namespace App\Http\Controllers;

use App\Http\Requests\TodoListRequest;
use App\Http\Resources\TodoListResource;
use App\Models\Project;
use App\Models\TodoList;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TodolistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /** @var User */
        $user = Auth::user();
        $todoLists = $user->todoLists()->with('todo')->get();
        return TodoListResource::collection($todoLists);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TodoListRequest $request)
    {
        $todoList = new TodoList($request->validated());
        $todoList->user()->associate($request->user());
        if ($request->validated("project_id")) {
            $project = Project::findOrFail($request->validated("project_id"));
            $todoList->project()->associate($project);
        }
        $todoList->save();

        return new TodoListResource($todoList);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $todoList = TodoList::with('todo')->findOrFail($id);
        $this->authorize("view", $todoList);
        return new TodoListResource($todoList);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TodoListRequest $request, string $id)
    {
        $todoList = TodoList::findOrFail($id);
        $todoList->update($request->validated());

        return response(null, 204);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TodoListRequest $request, string $id)
    {
        $todoList = TodoList::findOrFail($id);
        $todoList->delete();
        return response(null, 204);
    }
}
