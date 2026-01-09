<?php

namespace Tests\Unit\Services;

use App\Services\Sources\GuardianService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class GuardianServiceTest extends TestCase
{
    use NewsServiceTestTrait;

    public function test_fetch_skips_when_api_key_missing()
    {
        config(['news_source.guardian-api.api_key' => null]);
        config(['news_source.guardian-api.url' => 'http://fake-url']);

        $service = new GuardianService($this->mockRepo());
        Log::shouldReceive('error')->once();
        $service->fetch();
    }

    public function test_fetch_creates_new_article()
    {
        config(['news_source.guardian-api.api_key' => 'test-key']);
        config(['news_source.guardian-api.url' => 'http://fake-url']);

        Http::fake([
            'http://fake-url*' => Http::response([
                'response' => [
                    'results' => [[
                        'webTitle' => 'Test Article',
                        'webUrl' => 'http://guardian.com/test',
                        'webPublicationDate' => '2026-01-09T00:00:00Z',
                        'fields' => ['headline' => 'Test Headline', 'byline' => 'John Doe'],
                        'blocks' => ['main' => ['elements' => [['assets' => [['file' => 'http://image.jpg']]]]]],
                    ]],
                ],
            ], 200),
        ]);

        $repo = $this->mockRepo(false);
        $repo->expects($this->once())->method('create');

        $service = new GuardianService($repo);
        $service->fetch();
    }
}
