<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Notifications\UserActionNotification;
class UserController extends Controller
{
  public function index(){ //list all users
  return User::all();
  }
  public function create(Request $request){//create user
    $request->validate([
        'username'=>'required|string|max:255',
        'emailid'=>'required|email|unique:users,emailid',
         'password'=>'string|min:8|confirmed',
         'role'=>'string|max:255',
    ]);
    try{
     $user=User::create([
        'username'=>$request->username,
        'emailid'=>$request->emailid,
         'password'=>$request->password,
         'role'=>$request->role,
     ]);
     return response()->json([
        'message' => 'User created successfully!',
        'user' => $user
    ], 201);
    }catch(\Exception $e){
        return response()->json([
            'message' => 'Error creating user.',
            'error' => $e->getMessage()
        ], 500);

    }
  
  }
 public function update(Request $request, int $id){
   $user=User::findorFail($id);
   $request->validate([
    'username'=>'required|string|max:255',
    'emailid'=>'required|email|unique:users,emailid',
     'password'=>'required|string|min:8|confirmed',
     'role'=>'required|string|max:255',
]);
$user->update([
   'username'=>$request->username,
    'emailid'=>$request->emailid,
     'password' => Hash::make($request->password),
      'role'=>$request->role,
]);
return response()->json(['message' => 'User updated successfully!', 'user' => $user]);

  }
  public function delete(int $id){
    $user=User::findOrFail($id);
    $user->delete();
    $action = 'has been removed'; 
          // Notify all admins about the role change
      $admins = User::where('role', 'admin')->get(); // Fetch all admins
      foreach ($admins as $admin) {
          $admin->notify(new UserActionNotification($user, "{$user->name} has {$action}."));
      }
    return response()->json(['message' => 'User has been deleted!']);
  }
  public function updateRole(Request $request, int $id)
  {
      $user = User::findOrFail($id); // Find the user by ID
      $oldRole = $user->role; // Capture the old role for notification
      $user->role = $request->input('role'); // Update the role
      $user->save(); // Save the user
  
      // Define the action for the notification
      $action = 'has been assigned to the ' . $user->role . ' role'; 
      $user_action= ',Congratulations!.you have been assigned to  ' . $user->role . ' role.'; 
  
      // Send notification to the assigned user
      $user->notify(new UserActionNotification($user, $user_action));
  
      // Notify all admins about the role change
      $admins = User::where('role', 'admin')->get(); // Fetch all admins
      foreach ($admins as $admin) {
          $admin->notify(new UserActionNotification($user, "{$user->name} has {$action}."));
      }
  
      return response()->json(['message' => 'Requested user role has been updated!']);
  }
    public function findTotalUsers()
 {
    $totalUsers = \App\Models\User::count();
    $users = User::whereRaw('LOWER(role) = ?', ['user'])->count();
   $guests = User::whereRaw('LOWER(role) = ?', ['guest'])->count();
    return response()->json(['Total_users' => $totalUsers,'users'=>$users,'guests'=>$guests]);
 }
 

}
