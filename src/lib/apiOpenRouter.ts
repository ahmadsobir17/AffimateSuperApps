/**
 * OpenRouter-based API Functions for Affimate Super Apps
 * 
 * All AI features go through the Workers API /llm endpoint.
 * API key is stored securely in Workers secrets.
 */

import { API_BASE_URL } from './apiConfig';

// Helper for robust fetch with error handling
async function fetchLLM(body: any) {
    const url = `${API_BASE_URL}/llm`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const contentType = response.headers.get('content-type');
        const text = await response.text();

        if (!response.ok) {
            throw new Error(`Server Error (${response.status}): ${text.slice(0, 100)}...`);
        }

        if (!text) {
            throw new Error('Server returned empty response');
        }

        if (!contentType || !contentType.includes('application/json')) {
            console.error('Non-JSON Response:', text);
            throw new Error(`Invalid response format (not JSON). Response preview: ${text.slice(0, 50)}...`);
        }

        try {
            const data = JSON.parse(text);
            if (!data.success) throw new Error(data.error || 'Unknown API error');
            return data.result;
        } catch (e) {
            console.error('JSON Parse Error:', e, 'Raw Text:', text);
            throw new Error('Failed to parse API response');
        }
    } catch (error) {
        console.error('fetchLLM Error:', error);
        throw error;
    }
}

// ============================================
// TEXT GENERATION FUNCTIONS
// ============================================

/**
 * Analyze product images and generate description
 */
export async function analyzeProductOR(images: string[]): Promise<string | null> {
    const prompt = 'Analisa foto produk ini secara detail. Deskripsikan material, warna, bentuk, tekstur, dan fitur utamanya dalam satu paragraf ringkas untuk keperluan fotografi komersial. Fokus pada visual fisik.';

    return fetchLLM({
        action: 'vision',
        imageBase64: images[0],
        prompt: images.length > 1 ? `${prompt} (Ada ${images.length} foto referensi)` : prompt,
    });
}

/**
 * Generate video script, caption, or hashtags
 */
export async function generateScriptOR(prompt: string, images: string[]): Promise<string | null> {
    const action = images.length > 0 ? 'vision' : 'generate';
    return fetchLLM({
        action,
        imageBase64: images[0],
        prompt,
    });
}

/**
 * Generate VEO/Sora video prompt from image
 */
export async function generateVeoPromptOR(prompt: string, imageBase64: string): Promise<string | null> {
    return fetchLLM({
        action: 'vision',
        imageBase64,
        prompt,
    });
}

// ============================================
// IMAGE GENERATION FUNCTIONS
// ============================================

/**
 * Generate product image using Gemini 2.5 Flash Image via OpenRouter
 */
export async function generateProductImageOR(
    prompt: string,
    frontImage: string,
    backImage?: string | null,
    customModelImage?: string | null
): Promise<string | null> {
    return fetchLLM({
        action: 'product-image',
        prompt,
        imageBase64: frontImage,
        backImage,
        customModelImage,
    });
}

/**
 * Generate character/human image using Gemini 2.5 Flash Image via OpenRouter
 */
export async function generateCharacterOR(prompt: string): Promise<string | null> {
    return fetchLLM({
        action: 'image',
        prompt,
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
}

