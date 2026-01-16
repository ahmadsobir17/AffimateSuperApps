/**
 * OpenRouter-based API Functions for Affimate Super Apps
 * 
 * All AI features go through the Workers API /llm endpoint.
 * API key is stored securely in Workers secrets.
 */

import { API_BASE_URL } from './apiConfig';

// ============================================
// TEXT GENERATION FUNCTIONS
// ============================================

/**
 * Analyze product images and generate description
 */
export async function analyzeProductOR(images: string[]): Promise<string | null> {
    const prompt = 'Analisa foto produk ini secara detail. Deskripsikan material, warna, bentuk, tekstur, dan fitur utamanya dalam satu paragraf ringkas untuk keperluan fotografi komersial. Fokus pada visual fisik.';

    try {
        const response = await fetch(`${API_BASE_URL}/llm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'vision',
                imageBase64: images[0],
                prompt: images.length > 1
                    ? `${prompt} (Ada ${images.length} foto referensi)`
                    : prompt,
            }),
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.result;
    } catch (error) {
        console.error('analyzeProductOR error:', error);
        throw error;
    }
}

/**
 * Generate video script, caption, or hashtags
 */
export async function generateScriptOR(prompt: string, images: string[]): Promise<string | null> {
    try {
        const action = images.length > 0 ? 'vision' : 'generate';

        const response = await fetch(`${API_BASE_URL}/llm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action,
                imageBase64: images[0],
                prompt,
            }),
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.result;
    } catch (error) {
        console.error('generateScriptOR error:', error);
        throw error;
    }
}

/**
 * Generate VEO/Sora video prompt from image
 */
export async function generateVeoPromptOR(prompt: string, imageBase64: string): Promise<string | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/llm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'vision',
                imageBase64,
                prompt,
            }),
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.result;
    } catch (error) {
        console.error('generateVeoPromptOR error:', error);
        throw error;
    }
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
    try {
        const response = await fetch(`${API_BASE_URL}/llm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'product-image',
                prompt,
                imageBase64: frontImage,
                backImage,
                customModelImage,
            }),
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.result;
    } catch (error) {
        console.error('generateProductImageOR error:', error);
        throw error;
    }
}

/**
 * Generate character/human image using Gemini 2.5 Flash Image via OpenRouter
 */
export async function generateCharacterOR(prompt: string): Promise<string | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/llm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'image',
                prompt,
            }),
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.result;
    } catch (error) {
        console.error('generateCharacterOR error:', error);
        throw error;
    }
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

