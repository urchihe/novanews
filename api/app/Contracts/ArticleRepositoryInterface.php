<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Models\Article;
use Illuminate\Pagination\LengthAwarePaginator;

interface ArticleRepositoryInterface
{
    public function all(array $filters): LengthAwarePaginator;

    public function create(array $data): Article;

    public function exists(array $conditions): bool;
}
