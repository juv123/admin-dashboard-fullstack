<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Models\User;

class UserActionNotification extends Notification
{
    use Queueable;

    public $action;
    public $user;

    public function __construct(User $user, $action)
    {
        $this->user = $user;
        $this->action = $action;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->line("Hello {$this->user->name},")
                    ->line("Your account has been {$this->action}.")
                    ->action('View Account', url('/profile'))
                    ->line('Thank you for using our application!');
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => "You have " . $this->action,
            'username' => $this->user->username,
            'action' => $this->action,
        ];
    }
}
