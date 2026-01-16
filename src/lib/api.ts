import { ThemeCategory } from '@/types';
import { SMART_THEMES, LIGHTING_STYLES, CAMERA_ANGLES } from './constants';

export async function makeApiCall(url: string, payload: object) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `API Error: ${res.statusText}`);
    }

    return await res.json();
}

// File to Base64 conversion
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

// PCM Base64 to WAV Blob (for TTS)
export function pcmBase64ToWavBlob(base64PCM: string, sampleRate = 24000): Blob {
    const byteCharacters = atob(base64PCM);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const pcmData = new Uint8Array(byteNumbers);
    const header = new ArrayBuffer(44);
    const view = new DataView(header);
    const dataSize = pcmData.length;
    const fileSize = 36 + dataSize;

    const writeString = (view: DataView, offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
    };

    writeString(view, 0, 'RIFF');
    view.setUint32(4, fileSize, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    return new Blob([header, pcmData], { type: 'audio/wav' });
}

// Generate Character API Call (Using Imagen 3)
export async function generateCharacter(prompt: string, apiKey: string): Promise<string | null> {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`;

    const payload = {
        instances: [{ prompt }],
        parameters: {
            sampleCount: 1,
            aspectRatio: "1:1"
        }
    };

    const data = await makeApiCall(apiUrl, payload);
    return data.predictions?.[0]?.bytesBase64Encoded || null;
}

// Generate Product Image API Call (Using Gemini 2.5 Flash Image - Multimodal Fusion)
export async function generateProductImage(
    prompt: string,
    frontImage: string,
    apiKey: string,
    backImage?: string | null,
    customModelImage?: string | null
): Promise<string | null> {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;

    const parts: { text?: string; inlineData?: { mimeType: string; data: string } }[] = [
        { text: prompt },
        { inlineData: { mimeType: 'image/png', data: frontImage } },
    ];

    if (backImage) {
        parts.push({ inlineData: { mimeType: 'image/png', data: backImage } });
    }

    if (customModelImage) {
        parts.push({ inlineData: { mimeType: 'image/png', data: customModelImage } });
    }

    const payload = {
        contents: [{ parts }],
        generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
            sampleCount: 1
        },
    };

    const data = await makeApiCall(apiUrl, payload);
    return data.candidates?.[0]?.content?.parts?.find((p: { inlineData?: { data: string } }) => p.inlineData)?.inlineData?.data || null;
}

// Analyze Product with Vision API (Using 1.5 Flash - Best Quota/Stability)
export async function analyzeProduct(images: string[], apiKey: string): Promise<string | null> {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const promptText = 'Analisa foto produk ini secara detail. Deskripsikan material, warna, bentuk, tekstur, dan fitur utamanya dalam satu paragraf ringkas untuk keperluan fotografi komersial. Fokus pada visual fisik.';

    const parts: { text?: string; inlineData?: { mimeType: string; data: string } }[] = [
        { text: promptText },
    ];

    images.forEach((base64) => {
        parts.push({ inlineData: { mimeType: 'image/png', data: base64 } });
    });

    const payload = { contents: [{ parts }] };
    const data = await makeApiCall(apiUrl, payload);

    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

// Generate Script (Using 1.5 Flash)
export async function generateScript(prompt: string, images: string[], apiKey: string): Promise<string | null> {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const parts: { text?: string; inlineData?: { mimeType: string; data: string } }[] = [
        { text: prompt },
    ];

    images.forEach((base64) => {
        parts.push({ inlineData: { mimeType: 'image/png', data: base64 } });
    });

    const payload = { contents: [{ parts }] };
    const data = await makeApiCall(apiUrl, payload);

    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

// Generate VEO Prompt (Using 1.5 Flash)
export async function generateVeoPrompt(prompt: string, imageBase64: string, apiKey: string): Promise<string | null> {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const payload = {
        contents: [
            {
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType: 'image/png', data: imageBase64 } },
                ],
            },
        ],
    };

    const data = await makeApiCall(apiUrl, payload);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

// Generate TTS Audio (Using 1.5 Flash)
export async function generateTTS(text: string, voice: string, temperature: number, apiKey: string): Promise<Blob | null> {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text }] }],
        generationConfig: {
            responseModalities: ['AUDIO'],
            temperature,
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
            },
        },
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message || 'TTS API Error');
    }

    const audioBase64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (audioBase64) {
        return pcmBase64ToWavBlob(audioBase64);
    }

    return null;
}

// Generate Animation Prompt
export async function generateAnimationPrompt(imageBase64: string, apiKey: string): Promise<string | null> {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = 'Analisis gambar ini dan buatkan PROMPT VIDEO (Text-to-Video) yang sangat detail untuk Google VEO 3 atau Sora. Jelaskan subjek, gerakan kamera cinematic, pencahayaan, dan atmosfer. Output HANYA prompt bahasa inggris.';

    const payload = {
        contents: [
            {
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType: 'image/png', data: imageBase64 } },
                ],
            },
        ],
    };

    const data = await makeApiCall(apiUrl, payload);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

// Helper detection logic
export function detectCategory(text: string): ThemeCategory {
    const t = text.toLowerCase();
    if (t.match(/baju|kaos|shirt|jersey|hoodie|jaket|jacket|celana|pants|dress|sepatu|sneaker|tas|bag|kain|batik|fashion|outfit|wear/)) return 'fashion';
    if (t.match(/kopi|coffee|makan|food|snack|kripik|cemilan|minum|drink|botol|bottle|kue|cake|roti|sambal|bumbu|kitchen|masak/)) return 'food';
    if (t.match(/hp|phone|laptop|mouse|keyboard|kamera|camera|gadget|elektronik|jam|watch|audio|speaker|headset/)) return 'tech';
    if (t.match(/skincare|serum|sabun|soap|shampoo|parfum|perfume|cream|lotion|kosmetik|makeup|lipstik/)) return 'beauty';
    return 'general';
}

export function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomPrompt(baseDesc: string, manualOverride: string, modelOption: string): string {
    const category = detectCategory(baseDesc);
    const themeList = SMART_THEMES[category];
    const selectedTheme = getRandomElement(themeList);
    const angle = getRandomElement(CAMERA_ANGLES);
    const lighting = getRandomElement(LIGHTING_STYLES);

    let modelInstruction = `Model: ${modelOption}.`;
    if (modelOption === 'custom_model') {
        modelInstruction = 'Model: Use the provided character reference image. Maintain identity.';
    }

    let flavorText = 'Professional product photography.';
    if (category === 'fashion') flavorText = 'High-end fashion editorial lookbook style.';
    if (category === 'food') flavorText = 'Mouth-watering food photography, appetizing.';
    if (category === 'tech') flavorText = 'Sleek modern tech advertisement style.';

    return `${flavorText} Subject: ${baseDesc}. 
${modelInstruction} 
Setting: ${selectedTheme}. 
Angle: ${angle}.
Lighting: ${lighting}. 
Details: ${manualOverride}. 
8k resolution, photorealistic, commercial quality.`;
}
