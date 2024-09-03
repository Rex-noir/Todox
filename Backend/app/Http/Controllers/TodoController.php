<?php

namespace App\Http\Controllers;

use App\Http\Requests\TodoRequest;
use App\Http\Resources\TodoResource;
use App\Models\Todo;
use App\Models\TodoList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $todos = $user->todos;

        return TodoResource::collection($todos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TodoRequest $request)
    {
        $todo = new Todo($request->validated());
        $todo->user()->associate(Auth::user());
        if ($request->validated("todoList_id")) {
            $todoList = TodoList::find($request->validated("todoList_id"));
            $todo->todoList()->associate($todoList);
        }

        $todo->save();

        return new TodoResource($todo);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TodoRequest $request, string $id)
    {
        /** @var Todo */
        $todo = Todo::find($id);
        $todo->update($request->validated());
        $changes = $todo->getChanges();
        return response()->json(['data' => $changes], 200);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TodoRequest $request, string $id)
    {
        /**
         * @var Todo $todo.
         */
        $todo = Todo::findOrFail($id);

        $this->authorize('delete', $todo);
        $todo->delete();

        return response(null, 204);
    }
}
