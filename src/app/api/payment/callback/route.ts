import { NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

export async function POST(request: Request) {
    try {
        // Duitku sends callback as Form Data or JSON. Often Form Data for traditional callbacks.
        // However, many modern systems prefer JSON. Let's handle both.
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

        const {
            merchantCode,
            amount,
            merchantOrderId,
            signature,
            resultCode,
            reference
        } = body;

        const apiKey = process.env.DUITKU_API_KEY || 'e32ed09480a01a28a61eba91cc0dcddb';

        // CALLBACK SIGNATURE VERIFICATION
        // Formula: md5(merchantCode + amount + merchantOrderId + apiKey)
        const calcSignature = CryptoJS.MD5(merchantCode + amount + merchantOrderId + apiKey).toString();

        if (signature !== calcSignature) {
            console.error('INVALID CALLBACK SIGNATURE', { received: signature, calculated: calcSignature });
            return new Response('Invalid Signature', { status: 400 });
        }

        if (resultCode === '00') {
            console.log(`PAYMENT SUCCESS for Order: ${merchantOrderId}, Reference: ${reference}`);

            // TODO: Update your database/balance here
            // Example: const userId = merchantOrderId.split('-')[1];
            // await updateBalance(userId, amount);

            return new Response('OK', { status: 200 });
        } else {
            console.log(`PAYMENT FAILED/PENDING for Order: ${merchantOrderId}, Code: ${resultCode}`);
            return new Response('OK', { status: 200 }); // Still return 200/OK as per Duitku req
        }

    } catch (error) {
        console.error('Callback Error:', error);
        return new Response('Error', { status: 500 });
    }
}
