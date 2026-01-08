<?php

declare(strict_types=1);

namespace App\Services\Sources;

use App\Contracts\ArticleRepositoryInterface;
use App\Models\Author;
use App\Models\Category;
use App\Models\Source;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class NewsAPIService
{
    protected ArticleRepositoryInterface $articleRepo;

    public function __construct(ArticleRepositoryInterface $articleRepo)
    {
        $this->articleRepo = $articleRepo;
    }

    public function fetch(): void
    {
        $apiKey = config('news_source.newsapi.api_key');
        $apiUrl = config('news_source.newsapi.url');

        if (! $apiUrl || ! $apiKey) {
            Log::error('NewsAPIService: API URL or API Key not configured.');

            return;
        }

        try {
            $response = Http::timeout(10)->withHeaders([
                'X-Api-Key' => $apiKey,
            ])->get($apiUrl, [
                'q' => 'latest',
                'language' => 'en',
                'pageSize' => 100,
            ]);

            if ($response->failed()) {
                Log::error('NewsAPIService: Request failed.', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return;
            }

            $articles = $response->json('articles', []);

            if (! is_array($articles) || empty($articles)) {
                Log::warning('NewsAPIService: No articles found in response.');

                return;
            }

            foreach ($articles as $item) {
                $title = $item['title'] ?? null;
                if (! $title) {
                    continue;
                }

                $sourceName = $item['source']['name'] ? $item['source']['name'].'(NewsAPI)' : 'NewsAPI';
                $categoryName = $item['category'] ?? 'General';
                $authorName = $item['author'] ?? 'Unknown';

                // Create or update category
                $category = Category::updateOrCreate(
                    ['name' => $categoryName],
                    ['slug' => Str::slug($categoryName)]
                );

                // Create or update author
                $author = Author::updateOrCreate(
                    ['name' => $authorName],
                    ['slug' => Str::slug($authorName)]
                );

                // Create or update source
                $source = Source::updateOrCreate(
                    ['name' => $sourceName],
                    ['slug' => Str::slug($sourceName)]
                );

                // Skip if article already exists
                if ($this->articleRepo->exists([
                    'title' => $title,
                    'source_id' => $source->id,
                ])) {
                    continue;
                }

                // Save article
                $this->articleRepo->create([
                    'title' => $title,
                    'content' => $item['content'] ?? null,
                    'author_id' => $author->id,
                    'source_id' => $source->id,
                    'category_id' => $category->id,
                    'published_at' => $item['publishedAt'] ?? now(),
                    'urlToImage' => $item['urlToImage'] ?? 'https://picsum.photos/seed/4/800/450',
                    'url' => $item['url'] ?? null,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('NewsAPIService: Exception during fetch.', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
