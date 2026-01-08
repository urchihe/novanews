<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Source;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SourceController extends Controller
{
    /**
     * Return all sources with id and name
     */
    public function index(Request $request): JsonResponse
    {
        $sources = Source::select('id', 'name')->get();

        return response()->json([
            'status' => 'success',
            'data' => $sources,
        ]);
    }
}
