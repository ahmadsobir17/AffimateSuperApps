export interface Env {
    DUITKU_MERCHANT_CODE: string;
    DUITKU_API_KEY: string;
    SUPABASE_URL: string;
    SUPABASE_SERVICE_KEY: string;
    CORS_ORIGIN: string;
    OPENROUTER_API_KEY: string;
    OPENROUTER_DEFAULT_MODEL: string;
}

// Image generation model
const IMAGE_GENERATION_MODEL = 'google/gemini-2.5-flash-image-preview';

// Simple MD5 implementation for Workers (no CryptoJS needed)
async function md5(message: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('MD5', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// CORS headers - Updated to be dynamic
function corsHeaders(request: Request, env: Env) {
    const origin = request.headers.get('Origin');
    // Allow the configured origin OR any localhost origin for development
    const allowedOrigin = (origin && (origin === env.CORS_ORIGIN || origin.includes('localhost')))
        ? origin
        : env.CORS_ORIGIN;

    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
    };
}

// ============================================
// OPENROUTER LLM HANDLERS
// ============================================

interface OpenRouterMessage {
    role: 'system' | 'user' | 'assistant';
    content: string | { type: string; text?: string; image_url?: { url: string } }[];
}

// Handle LLM requests via OpenRouter
async function handleLLM(request: Request, env: Env): Promise<Response> {
    try {
        let body: any;
        try {
            body = await request.json();
        } catch (e) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid JSON body' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...corsHeaders(request, env) }
            });
        }

        const { action, messages, prompt, systemPrompt, imageBase64, inputImages, model, temperature, maxTokens, backImage, customModelImage } = body;

        const apiKey = env.OPENROUTER_API_KEY;
        const defaultModel = env.OPENROUTER_DEFAULT_MODEL || 'google/gemini-2.0-flash-exp:free';

        if (!apiKey) {
            return new Response(JSON.stringify({ success: false, error: 'OpenRouter API key not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...corsHeaders(request, env) }
            });
        }

        let result: string | null = null;
        let selectedModel = model || defaultModel;

        switch (action) {
            case 'chat':
                if (!messages) {
                    return new Response(JSON.stringify({ success: false, error: 'Messages required' }), {
                        status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(request, env) }
                    });
                }
                result = await callOpenRouter(apiKey, selectedModel, messages, temperature, maxTokens);
                break;

            case 'generate':
                if (!prompt) {
                    return new Response(JSON.stringify({ success: false, error: 'Prompt required' }), {
                        status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(request, env) }
                    });
                }
                const genMessages: OpenRouterMessage[] = [];
                if (systemPrompt) genMessages.push({ role: 'system', content: systemPrompt });
                genMessages.push({ role: 'user', content: prompt });
                result = await callOpenRouter(apiKey, selectedModel, genMessages, temperature, maxTokens);
                break;

            case 'vision':
                if (!imageBase64 || !prompt) {
                    return new Response(JSON.stringify({ success: false, error: 'imageBase64 and prompt required' }), {
                        status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(request, env) }
                    });
                }
                const visionMessages: OpenRouterMessage[] = [{
                    role: 'user',
                    content: [
                        { type: 'image_url', image_url: { url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/png;base64,${imageBase64}` } },
                        { type: 'text', text: prompt }
                    ]
                }];
                result = await callOpenRouter(apiKey, selectedModel, visionMessages, temperature, maxTokens);
                break;

            case 'image':
                if (!prompt) {
                    return new Response(JSON.stringify({ success: false, error: 'Prompt required' }), {
                        status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(request, env) }
                    });
                }
                result = await generateImageOpenRouter(apiKey, prompt, inputImages);
                break;

            case 'product-image':
                if (!prompt || !imageBase64) {
                    return new Response(JSON.stringify({ success: false, error: 'prompt and imageBase64 required' }), {
                        status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(request, env) }
                    });
                }
                const productImages = [imageBase64];
                if (backImage) productImages.push(backImage);
                if (customModelImage) productImages.push(customModelImage);
                result = await generateImageOpenRouter(apiKey, prompt, productImages);
                break;

            default:
                return new Response(JSON.stringify({ success: false, error: 'Invalid action' }), {
                    status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(request, env) }
                });
        }

        return new Response(JSON.stringify({ success: true, result, model: selectedModel }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders(request, env) }
        });

    } catch (error) {
        console.error('LLM Error:', error);
        return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
            status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders(request, env) }
        });
    }
}

// Call OpenRouter chat completions API
async function callOpenRouter(
    apiKey: string,
    model: string,
    messages: OpenRouterMessage[],
    temperature?: number,
    maxTokens?: number
): Promise<string> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://affimate.axiamasi.com',
            'X-Title': 'Affimate Super Apps',
        },
        body: JSON.stringify({
            model,
            messages,
            temperature: temperature ?? 0.7,
            max_tokens: maxTokens ?? 4096,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.error?.message || `OpenRouter API Error: ${response.status}`);
    }

    const data = await response.json() as any;
    return data.choices?.[0]?.message?.content || '';
}

// Generate image via OpenRouter
async function generateImageOpenRouter(
    apiKey: string,
    prompt: string,
    inputImages?: string[]
): Promise<string | null> {
    const contentParts: any[] = [];

    if (inputImages && inputImages.length > 0) {
        for (const img of inputImages) {
            contentParts.push({
                type: 'image_url',
                image_url: { url: img.startsWith('data:') ? img : `data:image/png;base64,${img}` },
            });
        }
    }

    contentParts.push({ type: 'text', text: prompt });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://affimate.axiamasi.com',
            'X-Title': 'Affimate Super Apps',
        },
        body: JSON.stringify({
            model: IMAGE_GENERATION_MODEL,
            messages: [{ role: 'user', content: contentParts }],
            modalities: ['text', 'image'],
        }),
    });

    if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.error?.message || `OpenRouter Image API Error: ${response.status}`);
    }

    const data = await response.json() as any;
    const content = data.choices?.[0]?.message?.content;

    if (Array.isArray(content)) {
        for (const part of content) {
            if (part.type === 'image_url' && part.image_url?.url) {
                const url = part.image_url.url;
                if (url.startsWith('data:')) return url.split(',')[1];
                return url;
            }
        }
    }

    return null;
}

// ============================================
// DUITKU PAYMENT HANDLERS
// ============================================

// Handle Duitku Checkout
async function handleCheckout(request: Request, env: Env): Promise<Response> {
    try {
        const body = await request.json() as any;
        const { paymentAmount, productDetails, email, paymentMethod, customerVaName, returnUrl } = body;

        const amt = Math.floor(Number(paymentAmount));
        const cleanProductDetails = (productDetails || 'Top Up Credits').replace(/[^\w\s]/gi, '');

        const merchantCode = env.DUITKU_MERCHANT_CODE;
        const apiKey = env.DUITKU_API_KEY;
        const merchantOrderId = `AFF${Date.now()}`;

        const signatureStr = merchantCode + merchantOrderId + amt + apiKey;
        const signature = await md5(signatureStr);

        const workerUrl = new URL(request.url);
        const callbackUrl = `${workerUrl.origin}/payment/callback`;

        const payload = {
            merchantCode,
            paymentAmount: amt,
            paymentMethod: paymentMethod || 'NQ',
            merchantOrderId,
            productDetails: cleanProductDetails,
            email,
            customerVaName: customerVaName || 'User',
            callbackUrl,
            returnUrl: returnUrl || 'https://affimate.axiamasi.com/payment/success',
            signature,
            itemDetails: [{ name: cleanProductDetails, price: amt, quantity: 1 }]
        };

        const response = await fetch('https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders(request, env) }
        });
    } catch (error) {
        console.error('Checkout Error:', error);
        return new Response(JSON.stringify({ statusMessage: 'Internal Server Error', statusCode: '500' }), {
            status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders(env.CORS_ORIGIN) }
        });
    }
}

// Handle Payment Callback
async function handleCallback(request: Request, env: Env): Promise<Response> {
    try {
        const contentType = request.headers.get('content-type') || '';
        let body: any = {};

        if (contentType.includes('application/json')) {
            body = await request.json();
        } else {
            const formData = await request.formData();
            formData.forEach((value, key) => { body[key] = value; });
        }

        console.log('Duitku Callback Received:', body);

        const { merchantCode, amount, merchantOrderId, signature, resultCode, reference } = body;
        const apiKey = env.DUITKU_API_KEY;
        const calcSignature = await md5(merchantCode + amount + merchantOrderId + apiKey);

        if (signature !== calcSignature) {
            console.error('INVALID CALLBACK SIGNATURE');
            return new Response('Invalid Signature', { status: 400 });
        }

        if (resultCode === '00') {
            console.log(`PAYMENT SUCCESS for Order: ${merchantOrderId}, Reference: ${reference}`);
            return new Response('OK', { status: 200 });
        } else {
            console.log(`PAYMENT FAILED/PENDING for Order: ${merchantOrderId}, Code: ${resultCode}`);
            return new Response('OK', { status: 200 });
        }
    } catch (error) {
        console.error('Callback Error:', error);
        return new Response('Error', { status: 500 });
    }
}

// ============================================
// MAIN ROUTER
// ============================================

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders(request, env) });
        }

        // LLM Routes
        if (path === '/llm' && request.method === 'POST') {
            return handleLLM(request, env);
        }

        // Payment Routes
        if (path === '/duitku/checkout' && request.method === 'POST') {
            return handleCheckout(request, env);
        }

        if (path === '/payment/callback' && request.method === 'POST') {
            return handleCallback(request, env);
        }

        // Health check
        if (path === '/' || path === '/health') {
            return new Response(JSON.stringify({
                status: 'ok',
                service: 'affimate-api',
                endpoints: ['/llm', '/duitku/checkout', '/payment/callback'],
                hasOpenRouterKey: !!env.OPENROUTER_API_KEY,
            }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders(request, env) }
            });
        }

        return new Response('Not Found', { status: 404 });
    }
};

