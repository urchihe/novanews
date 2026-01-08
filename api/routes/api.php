<?php

declare(strict_types=1);

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SourceController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('categories', [CategoryController::class, 'index']);
Route::get('authors', [AuthorController::class, 'index']);
Route::get('sources', [SourceController::class, 'index']);

Route::prefix('articles')->group(function () {
    Route::get('/', [ArticleController::class, 'index']);
    Route::get('/source/{source}', [ArticleController::class, 'bySource']);
    Route::get('/category/{category}', [ArticleController::class, 'byCategory']);
    Route::get('/search', [ArticleController::class, 'search']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('/me', [UserController::class, 'me']);
    Route::patch('/me/preferences', [UserController::class, 'updatePreferences']);
});
