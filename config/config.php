<?php
// Basic app configuration and small helpers
// Environment: 'production' or 'development'
if (!defined('ENVIRONMENT')) {
    define('ENVIRONMENT', getenv('APP_ENV') ?: 'development');
}

// Static asset version (avoid per-request cache busting in production)
// You can set APP_VERSION env var to override.
if (!defined('ASSET_VERSION')) {
    define('ASSET_VERSION', getenv('APP_VERSION') ?: '1.0.0');
}

if (!function_exists('ver')) {
    function ver(): string {
        $v = ASSET_VERSION;
        if ($v === null || $v === '') return '';
        return '?v=' . rawurlencode((string)$v);
    }
}

// HTML escape helper
if (!function_exists('e')) {
    function e($value): string {
        return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
    }
}
