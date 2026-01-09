<?php

namespace Tests\Unit\Services;

use App\Services\Sources\NYTimesService;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class NYTimesServiceTest extends TestCase
{
    use NewsServiceTestTrait;

    // public function test_fetch_creates_article_with_image()
    // {
    //     Http::fake([
    //         '*' => Http::response([
    //             'results' => [[
    //                 'title' => 'NYT Test',
    //                 'url' => 'http://nytimes.com/test',
    //                 'published_date' => '2026-01-09T00:00:00Z',
    //                 'source' => 'The New York Times',
    //                 'section' => 'World',
    //                 'byline' => 'By Alice',
    //                 'multimedia' => [['type' => 'image', 'format' => 'Normal', 'url' => 'images/test.jpg']],
    //             ]],
    //         ], 200),
    //     ]);

    //     $repo = $this->mockRepo(false);
    //     $repo->expects($this->once())->method('create');

    //     $service = new NYTimesService($repo);
    //     $service->fetch();
    // }
}
