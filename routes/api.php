<?php

use App\Http\Controllers\DoorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::prefix('v1')->group(function () {
    Route::post('/door/access-attempt', [DoorController::class, 'handleAccessAttempt']);
    Route::get('/door/{door}/unlock-command', [DoorController::class, 'checkUnlockCommand']);
});
