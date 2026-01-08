<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Contracts\ArticleRepositoryInterface;
use App\Models\Article;
use Illuminate\Pagination\LengthAwarePaginator;

class ArticleRepository implements ArticleRepositoryInterface
{
    protected int $perPage = 15;

    /**
     * @param array{
     *   keyword?: string,
     *   categories?: string|array<int, string>,
     *   sources?: string|array<int, string>,
     *   authors?: string|array<int, string>,
     *   from_date?: string,
     *   to_date?: string
     * } $filters
     * @return LengthAwarePaginator<int, Article>
     */
    public function all(array $filters = []): LengthAwarePaginator
    {
        $query = Article::query()->with(['category', 'source', 'author']);

        if (! empty($filters['keyword'])) {
            $keyword = $filters['keyword'];
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                    ->orWhere('content', 'like', "%{$keyword}%");
            });
        }

        if (! empty($filters['categories'])) {
            $categories = is_array($filters['categories'])
                ? array_map('intval', $filters['categories'])
                : [(int) $filters['categories']];
            $query->whereIn('category_id', $categories);
        }

        if (! empty($filters['sources'])) {
            $sources = is_array($filters['sources'])
                ? array_map('intval', $filters['sources'])
                : [(int) $filters['sources']];

            $query->whereIn('source_id', $sources);
        }
        if (! empty($filters['authors'])) {
            $authors = is_array($filters['authors'])
                ? array_map('intval', $filters['authors'])
                : [(int) $filters['authors']];

            $query->whereIn('author_id', $authors);
        }

        if (! empty($filters['from_date'])) {
            $query->whereDate('published_at', '>=', $filters['from_date']);
        }

        if (! empty($filters['to_date'])) {
            $query->whereDate('published_at', '<=', $filters['to_date']);
        }

        return $query->latest()->paginate($this->perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Article
    {
        return Article::create($data);
    }

    /**
     * @param  array<string, mixed>  $conditions
     */
    public function exists(array $conditions): bool
    {
        return Article::where($conditions)->exists();
    }
}
