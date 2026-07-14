<?php

namespace App\Http\Controllers;

use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends BaseController
{
    public function __construct(
        protected NotificationService $notificationService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $notifications = $this->notificationService->getForUser($request->user()->id, $perPage);
        return $this->successResponse($notifications, 'Notifications retrieved successfully');
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = $this->notificationService->getUnreadCount($request->user()->id);
        return $this->successResponse(['count' => $count], 'Unread count retrieved successfully');
    }

    public function markAsRead(int $id, Request $request): JsonResponse
    {
        $notification = $this->notificationService->markAsRead($id, $request->user()->id);
        if (!$notification) {
            return $this->errorResponse('Notification not found', 404);
        }
        return $this->successResponse($notification, 'Notification marked as read');
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $this->notificationService->markAllAsRead($request->user()->id);
        return $this->successResponse(null, 'All notifications marked as read');
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $result = $this->notificationService->delete($id, $request->user()->id);
        if (!$result) {
            return $this->errorResponse('Notification not found', 404);
        }
        return $this->successResponse(null, 'Notification deleted successfully');
    }
}
