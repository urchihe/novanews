<?php

namespace Tests\Unit\Services;

use App\Contracts\ArticleRepositoryInterface;

trait NewsServiceTestTrait
{
    protected function mockRepo(bool $exists = false)
    {
        $repo = $this->createMock(ArticleRepositoryInterface::class);
        $repo->method('exists')->willReturn($exists);

        return $repo;
    }
}
