<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    /**
     * Return all authors with id and name
     */
    public function index(Request $request): JsonResponse
    {
        $authors = Author::select('id', 'name')->get();

        return response()->json([
            'status' => 'success',
            'data' => $authors,
        ]);
    }
}
