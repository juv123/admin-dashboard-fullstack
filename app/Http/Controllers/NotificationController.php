<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index(Request $request)
{
    $notifications = $request->user()->notifications;

    return response()->json([
        'status' => 'success',
        'notifications' => $notifications,
    ]);
}
    
}
