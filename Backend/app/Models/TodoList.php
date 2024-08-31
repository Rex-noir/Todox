<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TodoList extends Model
{
    use HasFactory;

    protected $fillable = [
        "title",
        "project_id",
        "description",
        "todo_id",
        "tags",
        "user_id"
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function Projects(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function Tasks(): HasMany
    {
        return $this->hasMany(Todo::class);
    }
}
