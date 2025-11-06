<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // For API routes or JSON requests, do not redirect to a web login route.
        // Returning null ensures a 401 JSON response instead of throwing when 'login' route is missing.
        if ($request->is('api/*') || $request->expectsJson()) {
            return null;
        }

        return route('login');
    }
}
