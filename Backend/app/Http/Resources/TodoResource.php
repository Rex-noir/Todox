<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TodoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'completed' => $this->completed,
            'due_date' => $this->due_date,
            'priority' => $this->priority,
            'todoList_id' => $this->todo_list_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
