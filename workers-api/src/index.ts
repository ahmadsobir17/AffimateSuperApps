export interface Env {
    DUITKU_MERCHANT_CODE: string;
    DUITKU_API_KEY: string;
    SUPABASE_URL: string;
    SUPABASE_SERVICE_KEY: string;
    CORS_ORIGIN: string;
}

// Simple MD5 implementation for Workers (no CryptoJS needed)
async function md5(message: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('MD5', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// CORS headers
function corsHeaders(origin: string) {
    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
}

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

        // Signature = md5(merchantCode + merchantOrderId + paymentAmount + apiKey)
        const signatureStr = merchantCode + merchantOrderId + amt + apiKey;
        const signature = await md5(signatureStr);

        // Use the Workers URL for callback
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
            itemDetails: [
                {
                    name: cleanProductDetails,
                    price: amt,
                    quantity: 1
                }
            ]
        };

        const response = await fetch('https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders(env.CORS_ORIGIN)
            }
        });
    } catch (error) {
        console.error('Checkout Error:', error);
        return new Response(JSON.stringify({ statusMessage: 'Internal Server Error', statusCode: '500' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders(env.CORS_ORIGIN)
            }
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
            formData.forEach((value, key) => {
                body[key] = value;
            });
        }

        console.log('Duitku Callback Received:', body);

        const { merchantCode, amount, merchantOrderId, signature, resultCode, reference } = body;
        const apiKey = env.DUITKU_API_KEY;

        // Signature verification
        const calcSignature = await md5(merchantCode + amount + merchantOrderId + apiKey);

        if (signature !== calcSignature) {
            console.error('INVALID CALLBACK SIGNATURE');
            return new Response('Invalid Signature', { status: 400 });
        }

        if (resultCode === '00') {
            console.log(`PAYMENT SUCCESS for Order: ${merchantOrderId}, Reference: ${reference}`);

            // TODO: Update Supabase to add credits to user
            // Example:
            // const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
            // await supabase.from('profiles').update({ credits: newBalance }).eq('email', userEmail);

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

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: corsHeaders(env.CORS_ORIGIN)
            });
        }

        // Route handling
        if (path === '/duitku/checkout' && request.method === 'POST') {
            return handleCheckout(request, env);
        }

        if (path === '/payment/callback' && request.method === 'POST') {
            return handleCallback(request, env);
        }

        // Health check
        if (path === '/' || path === '/health') {
            return new Response(JSON.stringify({ status: 'ok', service: 'affimate-api' }), {
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders(env.CORS_ORIGIN)
                }
            });
        }

        return new Response('Not Found', { status: 404 });
    }
};
