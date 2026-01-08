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

class GuardianService
{
    protected ArticleRepositoryInterface $articleRepo;

    public function __construct(ArticleRepositoryInterface $articleRepo)
    {
        $this->articleRepo = $articleRepo;
    }

    public function fetch(): void
    {
        $apiKey = config('news_source.guardian-api.api_key');
        $apiUrl = config('news_source.guardian-api.url');

        if (! $apiUrl || ! $apiKey) {
            Log::error('GuardianService: API URL or API Key not configured.');

            return;
        }

        try {
            $response = Http::timeout(10)->get($apiUrl, [
                'api-key' => $apiKey,
                'show-fields' => 'body,headline,byline',
                'show-blocks' => 'main',
                'page-size' => 100,
            ]);

            if ($response->failed()) {
                Log::error('GuardianService: Request failed.', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return;
            }

            $articles = $response->json('response', []);

            foreach ($articles['results'] as $item) {
                $fields = $item['fields'] ?? [];

                $title = $fields['headline'] ?? $item['webTitle'] ?? 'Untitled';

                $sourceName = $item['source'] ?? 'The Guardian';
                $categoryName = $item['sectionName'] ?? 'General';
                $authorName = trim($fields['byline'] ?? 'Unknown');

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
                 * IMAGE EXTRACTION (Guardian blocks)
                 */
                $imageUrl = null;

                if (! empty($item['blocks']['main']['elements'][0]['assets'])) {
                    $assets = $item['blocks']['main']['elements'][0]['assets'];
                    $imageUrl = end($assets)['file'] ?? null;
                }

                /**
                 * CREATE ARTICLE
                 */
                $this->articleRepo->create([
                    'title' => $title,
                    'content' => $fields['body'] ?? null,
                    'source_id' => $source->id,
                    'author_id' => $author->id,
                    'category_id' => $category->id,
                    'published_at' => $item['webPublicationDate'] ?? now(),
                    'url' => $item['webUrl'] ?? null,
                    'urlToImage' => $imageUrl
                        ?? 'https://picsum.photos/seed/guardian/800/450',
                ]);
            }
        } catch (\Throwable $e) {
            Log::error('GuardianService: Exception during fetch.', [
                'message' => $e->getMessage(),
            ]);
        }
    }
}
