<?php

declare(strict_types=1);

namespace App\Services;

use App\Services\Sources\GuardianService;
use App\Services\Sources\NewsAPIService;
use App\Services\Sources\NYTimesService;

class NewsAggregatorService
{
    /**
     * @var array<int, mixed>
     */
    protected array $sources;

    public function __construct(
        NewsAPIService $newsApi,
        GuardianService $guardian,
        NYTimesService $nyTimes
    ) {
        $this->sources = [$newsApi, $guardian, $nyTimes];
    }

    public function fetchAll(): void
    {
        foreach ($this->sources as $sourceService) {
            try {
                $sourceService->fetch();
            } catch (\Exception $e) {
                \Log::error("Failed fetching articles: {$e->getMessage()}");
            }
        }
    }
}
