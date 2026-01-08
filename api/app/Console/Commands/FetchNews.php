<?php

namespace App\Console\Commands;

use App\Services\NewsAggregatorService;
use Illuminate\Console\Command;

class FetchNews extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'news:fetch';

    /**
     * The console command description.
     */
    protected $description = 'Fetch news articles from all sources';

    protected NewsAggregatorService $aggregator;

    public function __construct(NewsAggregatorService $aggregator)
    {
        parent::__construct();

        $this->aggregator = $aggregator;
    }

    public function handle(): void
    {
        $this->info('Fetching news...');
        $this->aggregator->fetchAll();
        $this->info('Done fetching news.');
    }
}
