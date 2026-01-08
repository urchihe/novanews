<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Repositories\ArticleRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    protected ArticleRepository $articles;

    public function __construct(ArticleRepository $articles)
    {
        $this->articles = $articles;
    }

    public function index(Request $request): JsonResponse
    {
        $filters = [
            'keyword' => $request->query('keyword'),
            'categories' => $request->query('categories'),
            'sources' => $request->query('sources'),
            'authors' => $request->query('authors'),
            'from_date' => $request->query('from_date'),
            'to_date' => $request->query('to_date'),
        ];

        $articles = $this->articles->all($filters);

        return response()->json($articles);
    }
}
