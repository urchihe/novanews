<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\PreferenceRequest;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class UserController extends Controller
{
    /**
     * Return the authenticated user
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json($user);
    }

    /**
     * Update user preferences
     */
    public function updatePreferences(PreferenceRequest $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validated();

        // Merge with existing preferences, only overwrite provided keys
        $preferences = $user->preferences ?? [];

        foreach ($data as $key => $value) {
            $preferences[$key] = $value;
        }

        $user->preferences = $preferences;
        $user->save();

        return response()->json([
            'message' => 'Preferences updated successfully',
            'user' => $user,
        ]);
    }
}
