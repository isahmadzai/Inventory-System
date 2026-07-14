<?php

namespace App\Services;

use App\Models\Notification;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class NotificationService
{
    public function getForUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return Notification::forUser($userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getUnreadCount(int $userId): int
    {
        return Notification::forUser($userId)->unread()->count();
    }

    public function create(array $data): Notification
    {
        return Notification::create($data);
    }

    public function markAsRead(int $id, int $userId): ?Notification
    {
        $notification = Notification::forUser($userId)->find($id);
        if ($notification) {
            $notification->markAsRead();
        }
        return $notification;
    }

    public function markAllAsRead(int $userId): void
    {
        Notification::forUser($userId)->unread()->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    public function delete(int $id, int $userId): bool
    {
        $notification = Notification::forUser($userId)->find($id);
        if ($notification) {
            return $notification->delete();
        }
        return false;
    }
}
