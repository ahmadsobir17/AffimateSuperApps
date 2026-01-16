'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, UploadCloud, X, Clapperboard, Crown, Lock, Copy } from 'lucide-react';
import { useApp } from '@/lib/context';
import { generateVeoPrompt, fileToBase64 } from '@/lib/api';
import { VEO_STYLES, VEO_SHOTS, VEO_CAMERA_MOVEMENTS, PRICING } from '@/lib/constants';
import GlassPanel from '@/components/ui/GlassPanel';
import Select from '@/components/ui/Select';
import { Input, Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import LoaderOverlay from '@/components/ui/Loader';

export default function VeoPanel() {
    const { isTrialMode, showToast, apiKey, deductBalance } = useApp();

    // Image State
    const [image, setImage] = useState<string | null>(null);

    // Form State
    const [style, setStyle] = useState('Cinematic Realistic');
    const [shot, setShot] = useState('Medium Shot');
    const [camera, setCamera] = useState('Static Tripod');
    const [dialogue, setDialogue] = useState('');
    const [instruction, setInstruction] = useState('');

    // Result State
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');

    const handleImageUpload = async (file: File) => {
        try {
            const base64 = await fileToBase64(file);
            setImage(base64);
            showToast('Referensi visual siap!', 'success');
        } catch {
            showToast('Upload gagal', 'error');
        }
    };

    const handleGenerate = async () => {
        if (!image) {
            showToast('Upload gambar referensi dulu!', 'error');
            return;
        }


        if (!deductBalance(PRICING.SCRIPT)) return;
        setIsLoading(true);

        const currentStyle = style;
        const currentShot = shot;
        const currentCamera = camera;
        const currentDialogue = dialogue;

        const prompt = `Analyze this image and create a highly detailed TEXT-TO-VIDEO PROMPT for Google VEO / Sora.

[DIRECTOR SETTINGS]:
- Style: ${currentStyle}
- Shot: ${currentShot}
- Movement: ${currentCamera}
${currentDialogue ? `- Character Dialogue: "${currentDialogue}"` : ''}

[USER INSTRUCTION]: "${instruction}"

[OUTPUT]: Combine into a single, cohesive, descriptive paragraph. Describe lighting, texture, and atmosphere. Output ONLY the prompt text.`;

        try {
            const text = await generateVeoPrompt(prompt, image, apiKey);
            if (text) {
                setResult(text);
                showToast('Berhasil dibuat!', 'success');
            } else {
                throw new Error('Gagal generate prompt');
            }
        } catch (error) {
            setResult('Error: ' + (error as Error).message);
            showToast('Gagal: ' + (error as Error).message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        showToast('Copied!', 'success');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
            {/* Left Column - Controls */}
            <div className="lg:col-span-4 space-y-4">
                <GlassPanel className="p-5">
                    <h2 className="text-red-500 font-semibold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                        <Video className="w-4 h-4" /> VEO 3 Vision Prompt
                    </h2>

                    <div className="space-y-4">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-xs text-slate-400 mb-2">
                                1. Upload Gambar Referensi
                            </label>
                            <div
                                className={`relative min-h-[120px] rounded-lg p-4 text-center cursor-pointer bg-slate-800/50 flex flex-col items-center justify-center group hover:bg-slate-800 transition-all border-2 border-dashed ${image ? 'border-red-500/50' : 'border-slate-700 hover:border-red-500'
                                    }`}
                                onClick={() => document.getElementById('veo-file')?.click()}
                            >
                                <input
                                    type="file"
                                    id="veo-file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
                                        e.target.value = '';
                                    }}
                                />

                                {image ? (
                                    <>
                                        <img
                                            src={`data:image/png;base64,${image}`}
                                            className="h-20 w-20 object-cover rounded-lg border border-slate-600 shadow-md"
                                            alt="Reference"
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setImage(null);
                                            }}
                                            className="absolute top-2 right-2 bg-slate-900/80 text-slate-400 hover:text-red-500 p-1 rounded-full transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="p-3 bg-slate-700/50 rounded-full mb-2">
                                            <UploadCloud className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium">Klik / Drop Referensi Visual</p>
                                        <p className="text-[10px] text-slate-500 mt-1">Single Image Only</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cinematic Controls */}
                        <div className="relative space-y-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700">
                                <Video className="w-3 h-3 text-red-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Cinematic Controls
                                </span>
                            </div>

                            <Select
                                label="2. Gaya Video (Opsional)"
                                options={VEO_STYLES}
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                            />

                            <div className="grid grid-cols-2 gap-2">
                                <Select
                                    label="3. Jenis Bidikan"
                                    options={VEO_SHOTS}
                                    value={shot}
                                    onChange={(e) => setShot(e.target.value)}
                                />
                                <Select
                                    label="4. Pergerakan"
                                    options={VEO_CAMERA_MOVEMENTS}
                                    value={camera}
                                    onChange={(e) => setCamera(e.target.value)}
                                />
                            </div>

                            <Input
                                label="5. Dialog Karakter (Opsional)"
                                value={dialogue}
                                onChange={(e) => setDialogue(e.target.value)}
                                placeholder='Contoh: "Halo, selamat datang!"'
                            />
                        </div>

                        <Textarea
                            label="6. Instruksi Tambahan (Prompt Utama)"
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            placeholder="Contoh: Angin meniup rambut, cahaya matahari sore..."
                            className="h-20"
                        />

                        <Button
                            onClick={handleGenerate}
                            isLoading={isLoading}
                            icon={<Clapperboard className="w-4 h-4" />}
                            className="w-full relative overflow-hidden group"
                        >
                            <div className="flex flex-col items-center">
                                <span>{isLoading ? 'Generating...' : 'Buat Prompt Video'}</span>
                                {!isLoading && <span className="text-[10px] opacity-70">Biaya: ${PRICING.SCRIPT}</span>}
                            </div>
                        </Button>
                    </div>
                </GlassPanel>
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-8">
                <GlassPanel className="p-4 min-h-[500px] flex flex-col relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {isLoading && <LoaderOverlay message="Menganalisis visual..." />}
                    </AnimatePresence>

                    {result ? (
                        <>
                            <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-700/50">
                                <label className="block text-xs text-slate-400">Hasil Vision Prompt</label>
                                <button
                                    onClick={copyToClipboard}
                                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                                >
                                    <Copy className="w-3 h-3" /> Copy
                                </button>
                            </div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-grow bg-slate-900/50 rounded-lg p-4 text-sm text-green-400 font-mono whitespace-pre-wrap border border-slate-800 overflow-y-auto"
                            >
                                {result}
                            </motion.div>
                        </>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-slate-500 h-full">
                            <Clapperboard className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">Prompt Video Kosong</p>
                            <p className="text-sm opacity-75">Upload referensi untuk buat prompt</p>
                        </div>
                    )}
                </GlassPanel>
            </div>
        </motion.div>
    );
}
