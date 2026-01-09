<?php

namespace Tests\Unit\Services;

use App\Services\Sources\NewsAPIService;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class NewsAPIServiceTest extends TestCase
{
    use NewsServiceTestTrait;

    public function test_fetch_skips_duplicate_article()
    {
        Http::fake([
            '*' => Http::response([
                'articles' => [[
                    'title' => 'Duplicate Article',
                    'url' => 'http://newsapi.org/test',
                    'publishedAt' => '2026-01-09T00:00:00Z',
                    'author' => 'Jane Doe',
                    'source' => ['name' => 'NewsAPI'],
                ]],
            ], 200),
        ]);

        $repo = $this->mockRepo(true); // simulate duplicate
        $repo->expects($this->never())->method('create');

        $service = new NewsAPIService($repo);
        $service->fetch();
    }
}
