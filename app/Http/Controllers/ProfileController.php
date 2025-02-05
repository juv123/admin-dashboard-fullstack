<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\UserActionNotification;

class ProfileController extends Controller
{
    // Method to show user profile
    public function show()
    {
        // Get the authenticated user
        $user = Auth::user();

        // Return the user data as a JSON response
        return response()->json([
            'user' => $user,
        ]);
    }

    // Method to update user profile
    public function update(Request $request)
    {
        // Get the authenticated user
        $user = Auth::user();

        // Validate the incoming request data (optional)
        $validated = $request->validate([
            'username' => 'string|max:255|unique:users',
            'emailid' => 'email|max:255|unique:users,emailid,' . $user->id,
        ]);

        // Update the user with the validated data
        $user->update($validated);

        // Create a notification action
        $action = 'updated his profile';

        // Send the notification
        $user->notify(new UserActionNotification($user, $action));

    // Return success response with a message
    return response()->json([
        'message' => 'User profile has been updated!',
    ]);

        
    }
}
