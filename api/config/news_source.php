<?php

return [
    'nytimes' => [
        'api_key' => env('NYT_API_KEY'),
        'url' => env('NYT_API_URL'),
    ],

    'newsapi' => [
        'api_key' => env('NEWS_API_KEY'),
        'url' => env('NEWS_API_URL'),
    ],
    'guardian-api' => [
        'api_key' => env('GUARDIAN_API_KEY'),
        'url' => env('GUARDIAN_API_URL'),
    ],
];
