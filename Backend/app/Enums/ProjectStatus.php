<?php

namespace App\Enums;

enum ProjectStatus: string
{
    case Active = 'active';
    case Archived = 'archived';
    case Completed = 'completed';
    case InProgress = 'in progress';
    case OnHold = 'on hold';
}