<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityService
{
    public function log(string $action, string $module, ?string $description = null, ?Request $request = null, array $properties = []): ActivityLog
    {
        return ActivityLog::create([
            'user_id' => $request?->user()?->id,
            'action' => $action,
            'module' => $module,
            'description' => $description,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'properties' => $properties,
        ]);
    }

    public function getRecent(int $limit = 10)
    {
        return ActivityLog::with('user')->latest()->take($limit)->get();
    }

    public function getPaginated(int $perPage = 15)
    {
        return ActivityLog::with('user')->latest()->paginate($perPage);
    }
}
