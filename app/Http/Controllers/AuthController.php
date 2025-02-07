<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Notifications\UserActionNotification;
use App\Jobs\SendWelcomeEmail;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255|unique:users',
            'emailid' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'nullable|string',
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'emailid' => $validated['emailid'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'Guest',
        ]);

        $action = 'has been added';

        // Notify all admins about the new user registration
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new UserActionNotification($user, " {$action}."));
        }

        // Notify the new user
        $user_action = 'You have been successfully added to our team. Welcome onboard!';
        $user->notify(new UserActionNotification($user, $user_action));

        // Dispatch email queue job for the user
        dispatch(new SendWelcomeEmail($user));

        // Dispatch email queue job for each admin
        /*foreach ($admins as $admin) {
            dispatch(new SendWelcomeEmail($admin));
        }*/

        return response()->json(['message' => 'User created successfully'], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'emailid' => 'required|string|email',
            'password' => 'required|string|min:8',
        ]);

        // ✅ Specify `emailid` explicitly for authentication
        if (Auth::attempt(['emailid' => $validated['emailid'], 'password' => $validated['password']])) {
            $user = Auth::user();
            return response()->json(['token' => $user->createToken('Admin Dashboard')->plainTextToken]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function changePassword(Request $request)
    {
        // Validate input
        $request->validate([
            'currentpassword' => 'required',
            'newpassword' => 'required|min:8|confirmed',
        ]);

        $user = Auth::user();

        // Check if current password matches
        if (!Hash::check($request->currentpassword, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 403);
        }

        // Update password
        $user->password = Hash::make($request->newpassword);
        $user->save();

        // Send notification for password change
        $user->notify(new UserActionNotification($user, 'You have changed your password.'));

        return response()->json(['message' => 'Password updated successfully'], 200);
    }
}
