<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Services\DashboardService;
use App\Services\ActivityService;
use Illuminate\Http\JsonResponse;

class DashboardController extends BaseController
{
    public function __construct(
        protected DashboardService $dashboardService,
        protected ActivityService $activityService,
    ) {}

    public function index(): JsonResponse
    {
        $stats = $this->dashboardService->getStats();
        $recentActivity = $this->activityService->getRecent(10);
        return $this->successResponse([
            'stats' => $stats,
            'recent_activity' => $recentActivity,
        ], 'Dashboard data retrieved successfully');
    }
}
