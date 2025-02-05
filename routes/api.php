<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AuthController;
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/users/total', [UserController::class, 'findTotalUsers']);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::get('/users', [UserController::class, 'index']);
Route::middleware('auth:sanctum')->delete('/users/{id}/delete', [UserController::class, 'delete']);
Route::middleware('auth:sanctum')->put('/users/{id}/update/role', [UserController::class, 'updateRole']);
Route::middleware('auth:sanctum')->get('/profile', [ProfileController::class, 'show']);
Route::middleware('auth:sanctum')->put('/profile/update', [ProfileController::class, 'update']);
Route::middleware('auth:sanctum')->put('/changepassword', [AuthController::class, 'changePassword']);
Route::middleware('auth:sanctum')->get('/notifications', [NotificationController::class, 'index']);
