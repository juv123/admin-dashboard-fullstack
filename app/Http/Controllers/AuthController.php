<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Notifications\UserActionNotification;

class AuthController extends Controller
{
    protected $fillable = [
        'username',
        'emailid',
        'password',
        'role',
    ];
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
            'role' => $validated['role'],
        ]);

        return response()->json(['message' => 'User created successfully'], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'emailid' => 'required|string|email',
            'password' => 'required|string|min:8',
        ]);

        if (Auth::attempt($validated)) {
            $user = Auth::user();
            return response()->json(['token' => $user->createToken('Admin Dashboard')->plainTextToken]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function user(Request $request)
    {
        /*$user = $request->user();

    return response()->json([
        'id' => $user->id,
        'username' => $user->username,
        'emailid' => $user->emailid,
        'role'=>$user->role,
        'created_at' => $user->created_at,
        'updated_at' => $user->updated_at,
        'password' => $user->password,
    ]);*/
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
            $action = 'Changed his Password';
        //Send the notification
        $user->notify(new UserActionNotification($user, $action));
        return response()->json(['message' => 'Password updated successfully'], 200);
            
       
        }
        
    }
