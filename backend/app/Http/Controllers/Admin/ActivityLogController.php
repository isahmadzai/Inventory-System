<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Resources\ActivityLogResource;
use App\Services\ActivityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityLogController extends BaseController
{
    public function __construct(
        protected ActivityService $activityService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20);
        $logs = $this->activityService->getPaginated($perPage);
        return $this->successResponse(ActivityLogResource::collection($logs), 'Activity logs retrieved successfully');
    }

    public function recent(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 10);
        $logs = $this->activityService->getRecent($limit);
        return $this->successResponse(ActivityLogResource::collection($logs), 'Recent activity retrieved successfully');
    }
}
