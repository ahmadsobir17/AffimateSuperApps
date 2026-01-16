// API Configuration
// Change this URL after deploying Workers to Cloudflare
// Updated for OpenRouter Migration

// For development, you can run workers locally with: cd workers-api && npm run dev
// For production, this should be your deployed Workers URL

// Hardcode Worker URL to prevent 405 error from misconfigured Cloudflare Pages env
export const API_BASE_URL = 'https://affimate-api.agusahmad1997.workers.dev';

// Helper function to make API calls
export async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
}
