<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TodoListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "title" => $this->title,
            "description" => $this->description,
            "project_id" => $this->project_id,
            "tags" => json_decode($this->tags, true) ?? [], // Decode JSON string to array
            "createdAt" => $this->created_at,
            "updatedAt" => $this->updated_at,
            "todoIds" => $this->todo->pluck('id'),
        ];
    }
}
