/**
 * OpenRouter API Client
 * 
 * OpenRouter provides unified access to 100+ LLM models including:
 * - OpenAI GPT-4, GPT-4o
 * - Anthropic Claude 3.5 Sonnet, Claude 3 Opus
 * - Google Gemini 2.0 Flash, Gemini Pro
 * - Meta Llama 3.1
 * - And many more...
 * 
 * Get your API key at: https://openrouter.ai/keys
 */

export interface OpenRouterMessage {
    role: 'system' | 'user' | 'assistant';
    content: string | OpenRouterContentPart[];
}

export interface OpenRouterContentPart {
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
        url: string; // Can be base64 data:image/... or URL
    };
}

export interface OpenRouterRequest {
    model?: string;
    messages: OpenRouterMessage[];
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}

export interface OpenRouterResponse {
    id: string;
    model: string;
    choices: {
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export interface OpenRouterError {
    error: {
        message: string;
        type: string;
        code: string;
    };
}

// Popular models on OpenRouter
export const OPENROUTER_MODELS = {
    // Google - FREE Models 🆓
    'gemini-2.0-flash-exp-free': 'google/gemini-2.0-flash-exp:free',
    'gemini-2.0-flash-thinking-free': 'google/gemini-2.0-flash-thinking-exp:free',

    // Google - Image Generation 🖼️ (Nano Banana)
    'gemini-2.5-flash-image': 'google/gemini-2.5-flash-image-preview',

    // Google - Paid Models
    'gemini-2.0-flash': 'google/gemini-2.0-flash-001',
    'gemini-pro': 'google/gemini-pro-1.5',

    // Anthropic
    'claude-3.5-sonnet': 'anthropic/claude-3.5-sonnet',
    'claude-3-opus': 'anthropic/claude-3-opus',
    'claude-3-haiku': 'anthropic/claude-3-haiku',

    // OpenAI
    'gpt-4o': 'openai/gpt-4o',
    'gpt-4o-mini': 'openai/gpt-4o-mini',
    'gpt-4-turbo': 'openai/gpt-4-turbo',

    // Meta
    'llama-3.1-70b': 'meta-llama/llama-3.1-70b-instruct',
    'llama-3.1-8b': 'meta-llama/llama-3.1-8b-instruct',

    // DeepSeek
    'deepseek-chat': 'deepseek/deepseek-chat',
    'deepseek-coder': 'deepseek/deepseek-coder',

    // Mistral
    'mistral-large': 'mistralai/mistral-large',
    'mixtral-8x7b': 'mistralai/mixtral-8x7b-instruct',
} as const;

// Image generation model
export const IMAGE_GENERATION_MODEL = 'google/gemini-2.5-flash-image-preview';

export type OpenRouterModelKey = keyof typeof OPENROUTER_MODELS;

/**
 * Make a chat completion request to OpenRouter
 */
export async function chatCompletion(
    messages: OpenRouterMessage[],
    options?: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
        apiKey?: string;
    }
): Promise<string> {
    const apiKey = options?.apiKey || process.env.OPENROUTER_API_KEY;
    const defaultModel = process.env.OPENROUTER_DEFAULT_MODEL || OPENROUTER_MODELS['gemini-2.0-flash'];

    if (!apiKey) {
        throw new Error('OpenRouter API key not found. Set OPENROUTER_API_KEY in .env.local');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            'X-Title': 'Affimate Super Apps',
        },
        body: JSON.stringify({
            model: options?.model || defaultModel,
            messages,
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens ?? 4096,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json() as OpenRouterError;
        throw new Error(errorData.error?.message || `OpenRouter API Error: ${response.status}`);
    }

    const data = await response.json() as OpenRouterResponse;
    return data.choices[0]?.message?.content || '';
}

/**
 * Simple text generation helper
 */
export async function generateText(
    prompt: string,
    options?: {
        model?: string;
        systemPrompt?: string;
        temperature?: number;
        maxTokens?: number;
    }
): Promise<string> {
    const messages: OpenRouterMessage[] = [];

    if (options?.systemPrompt) {
        messages.push({ role: 'system', content: options.systemPrompt });
    }

    messages.push({ role: 'user', content: prompt });

    return chatCompletion(messages, options);
}

/**
 * Vision/Multimodal generation - analyze images with text
 */
export async function analyzeImage(
    imageBase64: string,
    prompt: string,
    options?: {
        model?: string;
        temperature?: number;
    }
): Promise<string> {
    // Use a vision-capable model
    const visionModel = options?.model || 'google/gemini-2.0-flash-001';

    const messages: OpenRouterMessage[] = [
        {
            role: 'user',
            content: [
                {
                    type: 'image_url',
                    image_url: {
                        url: imageBase64.startsWith('data:')
                            ? imageBase64
                            : `data:image/png;base64,${imageBase64}`,
                    },
                },
                {
                    type: 'text',
                    text: prompt,
                },
            ],
        },
    ];

    return chatCompletion(messages, {
        model: visionModel,
        temperature: options?.temperature,
    });
}

/**
 * Streaming chat completion (for real-time responses)
 */
export async function* streamChatCompletion(
    messages: OpenRouterMessage[],
    options?: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
        apiKey?: string;
    }
): AsyncGenerator<string, void, unknown> {
    const apiKey = options?.apiKey || process.env.OPENROUTER_API_KEY;
    const defaultModel = process.env.OPENROUTER_DEFAULT_MODEL || OPENROUTER_MODELS['gemini-2.0-flash'];

    if (!apiKey) {
        throw new Error('OpenRouter API key not found');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            'X-Title': 'Affimate Super Apps',
        },
        body: JSON.stringify({
            model: options?.model || defaultModel,
            messages,
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens ?? 4096,
            stream: true,
        }),
    });

    if (!response.ok) {
        throw new Error(`OpenRouter API Error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
        throw new Error('No response body');
    }

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

        for (const line of lines) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                    yield content;
                }
            } catch {
                // Skip invalid JSON
            }
        }
    }
}

/**
 * Generate image using Gemini 2.5 Flash Image via OpenRouter
 * Returns base64 encoded image data
 * 
 * @example
 * const imageBase64 = await generateImage('A cute cat sitting on a couch');
 */
export async function generateImage(
    prompt: string,
    options?: {
        inputImages?: string[]; // Base64 images for editing/reference
        aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
        apiKey?: string;
    }
): Promise<string | null> {
    const apiKey = options?.apiKey || process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        throw new Error('OpenRouter API key not found. Set OPENROUTER_API_KEY in .env.local');
    }

    // Build message content with optional input images
    const contentParts: OpenRouterContentPart[] = [];

    // Add input images if provided (for editing/combining)
    if (options?.inputImages && options.inputImages.length > 0) {
        for (const img of options.inputImages) {
            contentParts.push({
                type: 'image_url',
                image_url: {
                    url: img.startsWith('data:') ? img : `data:image/png;base64,${img}`,
                },
            });
        }
    }

    // Add the prompt
    contentParts.push({
        type: 'text',
        text: prompt,
    });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            'X-Title': 'Affimate Super Apps',
        },
        body: JSON.stringify({
            model: IMAGE_GENERATION_MODEL,
            messages: [
                {
                    role: 'user',
                    content: contentParts,
                },
            ],
            // Request image output
            modalities: ['text', 'image'],
        }),
    });

    if (!response.ok) {
        const errorData = await response.json() as OpenRouterError;
        throw new Error(errorData.error?.message || `OpenRouter Image API Error: ${response.status}`);
    }

    const data = await response.json();

    // Extract image from response
    // OpenRouter returns image in the content array as base64
    const content = data.choices?.[0]?.message?.content;

    if (Array.isArray(content)) {
        for (const part of content) {
            if (part.type === 'image_url' && part.image_url?.url) {
                // Return base64 data (strip data:image/... prefix if present)
                const url = part.image_url.url;
                if (url.startsWith('data:')) {
                    return url.split(',')[1]; // Return just the base64 part
                }
                return url;
            }
        }
    }

    return null;
}

/**
 * Generate product image with reference images
 * Specifically designed for product photography
 */
export async function generateProductImageOR(
    prompt: string,
    frontImage: string,
    backImage?: string | null,
    customModelImage?: string | null,
    options?: {
        apiKey?: string;
    }
): Promise<string | null> {
    const inputImages: string[] = [frontImage];

    if (backImage) {
        inputImages.push(backImage);
    }

    if (customModelImage) {
        inputImages.push(customModelImage);
    }

    return generateImage(prompt, {
        inputImages,
        apiKey: options?.apiKey,
    });
}
