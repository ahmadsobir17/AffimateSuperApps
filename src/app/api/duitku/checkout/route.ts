import { NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { paymentAmount, productDetails, email, paymentMethod, customerVaName } = body;

        const amt = Math.floor(Number(paymentAmount));
        const cleanProductDetails = (productDetails || 'Top Up Credits').replace(/[^\w\s]/gi, '');

        const merchantCode = process.env.DUITKU_MERCHANT_CODE || 'DS24402';
        const apiKey = process.env.DUITKU_API_KEY || 'e32ed09480a01a28a61eba91cc0dcddb';
        const merchantOrderId = `AFF${Date.now()}`;

        // Signature = md5(merchantCode + merchantOrderId + paymentAmount + apiKey)
        const signatureStr = merchantCode + merchantOrderId + amt + apiKey;
        const signature = CryptoJS.MD5(signatureStr).toString().toLowerCase();

        const host = request.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const baseUrl = `${protocol}://${host}`;

        const payload = {
            merchantCode,
            paymentAmount: amt, // Number, as per subagent research
            paymentMethod: paymentMethod || 'NQ',
            merchantOrderId,
            productDetails: cleanProductDetails,
            email,
            customerVaName: customerVaName || 'User',
            callbackUrl: `${baseUrl}/api/payment/callback`,
            returnUrl: `${baseUrl}/payment/success`,
            signature,
            itemDetails: [
                {
                    name: cleanProductDetails,
                    price: amt, // Number
                    quantity: 1 // Number
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

        const rawResponse = await response.text();
        console.log('Duitku Full Response:', rawResponse);

        let data;
        try {
            data = JSON.parse(rawResponse);
        } catch (e) {
            return NextResponse.json({
                statusCode: '500',
                statusMessage: 'Duitku response error: ' + rawResponse
            });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Duitku API Route Error:', error);
        return NextResponse.json(
            { statusMessage: 'Internal Server Error', statusCode: '500' },
            { status: 500 }
        );
    }
}
