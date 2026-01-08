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

class NYTimesService
{
    protected ArticleRepositoryInterface $articleRepo;

    public function __construct(ArticleRepositoryInterface $articleRepo)
    {
        $this->articleRepo = $articleRepo;
    }

    public function fetch(): void
    {
        $apiKey = config('news_source.nytimes.api_key');
        $apiUrl = config('news_source.nytimes.url');

        if (! $apiUrl || ! $apiKey) {
            Log::error('NYTimesService: API URL or API Key not configured.');

            return;
        }
        // Optional: limit & offset for pagination
        $limit = 50;
        $offset = 0;

        try {
            $response = Http::timeout(10)->get($apiUrl, [
                'api-key' => $apiKey,
                'limit' => $limit,
                'offset' => $offset,
            ]);

            if ($response->failed()) {
                Log::error('NYTimesService: Request failed.', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return;
            }

            $articles = $response->json('results', []);

            if (! is_array($articles) || empty($articles)) {
                Log::warning('NYTimesService: No articles found in response.');

                return;
            }

            foreach ($articles as $item) {
                $title = $item['title'] ?? null;
                if (! $title) {
                    continue;
                }

                $sourceName = $item['source'] ?? 'The New York Times';
                $categoryName = $item['section'] ?? 'General';
                $authorName = $item['byline'] ?? 'Unknown';
                $authorName = trim(str_replace(['By ', 'by '], '', $authorName));

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

                /**
                 * Prevent duplicates
                 */
                if ($this->articleRepo->exists([
                    'title' => $title,
                    'source_id' => $source->id,
                ])) {
                    continue;
                }

                /**
                 * IMAGE EXTRACTION (NYTimes multimedia)
                 */
                $imageUrl = null;

                if (! empty($item['multimedia'])) {
                    foreach ($item['multimedia'] as $media) {
                        if (($media['type'] ?? '') === 'image' && ($media['format'] ?? '') === 'Normal') {
                            $imageUrl = $media['url'];
                            break;
                        }
                    }
                }

                /**
                 * CREATE ARTICLE
                 */
                $this->articleRepo->create([
                    'title' => $title,
                    'content' => $item['abstract'] ?? null,
                    'source_id' => $source->id,
                    'author_id' => $author->id,
                    'category_id' => $category->id,
                    'published_at' => $item['pub_date'] ?? now(),
                    'url' => $item['web_url'] ?? null,
                    'urlToImage' => $imageUrl
                        ?? 'https://picsum.photos/seed/nytimes/800/450',
                ]);
            }
        } catch (\Throwable $e) {
            Log::error('NYTimesService: Exception during fetch.', [
                'message' => $e->getMessage(),
            ]);
        }
    }
}
