<?php

namespace App\Notifications;

use App\Models\Request;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RequestStatusChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public Request $request;
    public string $oldStatus;
    public string $newStatus;

    /**
     * Create a new notification instance.
     */
    public function __construct(Request $request, string $oldStatus, string $newStatus)
    {
        $this->request = $request;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Request Status Changed: ' . $this->request->title)
            ->line("The request '{$this->request->title}' status has changed from '{$this->oldStatus}' to '{$this->newStatus}'.")
            ->action('View Request', url('/requests/' . $this->request->id))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'request_id' => $this->request->id,
            'request_title' => $this->request->title,
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
            'message' => "Request '{$this->request->title}' status changed from '{$this->oldStatus}' to '{$this->newStatus}'",
        ];
    }
}
