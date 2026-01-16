'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, AlignLeft, Hash, UploadCloud, X, Sparkles, Crown, Lock, Scissors, Timer, Copy, Mic } from 'lucide-react';
import { useApp } from '@/lib/context';
import { generateScript, analyzeProduct, generateTTS, fileToBase64 } from '@/lib/api';
import {
    PLATFORM_OPTIONS,
    DURATION_OPTIONS,
    TONE_OPTIONS,
    LANGUAGE_OPTIONS,
    STRUCTURE_OPTIONS,
    TTS_VOICES,
    PRICING,
} from '@/lib/constants';
import GlassPanel from '@/components/ui/GlassPanel';
import Select from '@/components/ui/Select';
import { Input, Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toggle from '@/components/ui/Toggle';
import LoaderOverlay from '@/components/ui/Loader';

type ScriptMode = 'script' | 'caption' | 'hashtag';

export default function ScriptPanel() {
    const { isTrialMode, showToast, apiKey, deductBalance } = useApp();

    // Image State
    const [images, setImages] = useState<string[]>([]);

    // Form State
    const [mode, setMode] = useState<ScriptMode>('script');
    const [productDesc, setProductDesc] = useState('');
    const [audience, setAudience] = useState('');
    const [platform, setPlatform] = useState('TikTok');
    const [duration, setDuration] = useState('15-30 detik');
    const [tone, setTone] = useState('Santai & Viral');
    const [language, setLanguage] = useState('Bahasa Indonesia Gaul');
    const [structure, setStructure] = useState('Hook-Problem-Solution');
    const [points, setPoints] = useState('');
    const [veoMode, setVeoMode] = useState(false);
    const [veoDuration, setVeoDuration] = useState('5 seconds');
    const [veoSceneCount, setVeoSceneCount] = useState(5);

    // TTS State
    const [ttsVoice, setTtsVoice] = useState('Kore');
    const [ttsTemp, setTtsTemp] = useState(1.0);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    // Result State
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isTtsLoading, setIsTtsLoading] = useState(false);
    const [result, setResult] = useState('');

    const handleImageUpload = async (files: FileList) => {
        const newImages: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const base64 = await fileToBase64(files[i]);
            newImages.push(base64);
        }
        setImages(newImages);
        showToast(`${files.length} Foto dimuat`, 'success');
    };

    const handleAnalyze = async () => {
        if (images.length === 0) {
            showToast('Upload foto dulu!', 'error');
            return;
        }

        if (!deductBalance(0.005)) return;
        setIsAnalyzing(true);
        try {
            const result = await analyzeProduct(images, apiKey);
            if (result) {
                setProductDesc(result.trim());
                showToast('Analisa selesai!', 'success');
            }
        } catch (error) {
            showToast('Gagal analisa: ' + (error as Error).message, 'error');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGenerate = async () => {
        if (!productDesc) {
            showToast('Isi Deskripsi Produk dulu!', 'error');
            return;
        }


        if (!deductBalance(PRICING.SCRIPT)) return;
        setIsLoading(true);

        let prompt = '';

        if (mode === 'script') {
            if (veoMode) {
                prompt = `Act as an AI Video Director & Scriptwriter.
Create a VIDEO SCRIPT for product: ${productDesc}, aimed at ${platform}.

[CRITICAL REQUIREMENT]:
You MUST break the script down into SCENES that are exactly ${veoDuration} long each.
This is for Google VEO 3 generation.

[SETTINGS]:
- Chunk Duration: ${veoDuration} per scene.
- Atmosphere: ${tone}
- Language for Audio: ${language}
- Key Points: ${points}

${images.length > 0 ? '[VISUAL REF]: Use the attached images to describe the product accurately.' : ''}

[OUTPUT FORMAT - STRICT]:
Do NOT include markdown bolding (**). Write simply.

SCENE 1 [${veoDuration}]
VISUAL: (Describe camera angle, lighting, physics, and movement in English for AI Prompt)
AUDIO: (Write the dialogue/voiceover in ${language})

SCENE 2 [${veoDuration}]
VISUAL: (Next 5-7s action shot description in English)
AUDIO: (Dialogue/VO in ${language})

(Continue for ${veoSceneCount} scenes)`;
            } else {
                prompt = `Act as an expert Video Copywriter for ${platform}.
Create a script using the "${structure}" framework.

[CONTEXT]:
- Product: ${productDesc}
- Audience: ${audience}
- Tone: ${tone}
- Language: ${language} (Natural spoken style)
- Duration: ${duration}
- Key Points: ${points}

${images.length > 0 ? '[VISUAL CONTEXT]: Use attached images for visual details.' : ''}

[STRICT OUTPUT FORMAT]:
1. No markdown bolding (**).
2. No intro/outro fluff.
3. Structure:

SCENE 1
VISUAL: (Action/Camera)
TEXT: (Overlay Text)
AUDIO: (Spoken dialogue)

SCENE 2... (and so on)`;
            }
        } else if (mode === 'caption') {
            prompt = `Write 3 engaging captions for ${platform} about: ${productDesc}. Audience: ${audience}. Tone: ${tone}. Language: ${language}. Rules: No bolding (**). List Option 1, 2, 3. Include CTA & Emojis.`;
        } else if (mode === 'hashtag') {
            prompt = `Generate strategic hashtags for: ${productDesc}. Target: ${audience}. Platform: ${platform}. Rules: Output ONLY hashtags. Group: Broad, Niche, Location. No bolding (**).`;
        }

        try {
            const text = await generateScript(prompt, images, apiKey);
            if (text) {
                const cleanText = text.replace(/\*\*/g, '').replace(/__/g, '').replace(/##/g, '').trim();
                setResult(cleanText);
                showToast('Selesai!', 'success');
            }
        } catch (error) {
            setResult('Error: ' + (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateTTS = async () => {
        if (!result) {
            showToast('Generate script/caption dulu!', 'error');
            return;
        }


        if (!deductBalance(PRICING.TTS)) return;
        setIsTtsLoading(true);
        try {
            // Extract audio text from script
            let textToSpeak = '';
            const lines = result.split('\n');
            const cleanLines: string[] = [];

            lines.forEach((line) => {
                if (line.match(/^(?:AUDIO|NARASI|NARRATOR|VO|VOICEOVER|HOST|SPEAKER)\s*:/i)) {
                    let cleanLine = line.replace(/^(?:AUDIO|NARASI|NARRATOR|VO|VOICEOVER|HOST|SPEAKER)\s*:\s*/i, '');
                    cleanLine = cleanLine.replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '');
                    cleanLine = cleanLine.replace(/["*_#\-]/g, '').trim();
                    if (cleanLine.length > 1) cleanLines.push(cleanLine);
                }
            });

            textToSpeak = cleanLines.join('. ');

            if (cleanLines.length === 0) {
                textToSpeak = result
                    .replace(/VISUAL:.*$/gim, '')
                    .replace(/SCENE \d+/gim, '')
                    .replace(/\[.*?\]/g, '')
                    .replace(/["*_#]/g, '')
                    .trim();
            }

            if (!textToSpeak || textToSpeak.length < 2) {
                throw new Error('Gagal mendeteksi dialog di script.');
            }

            const blob = await generateTTS(textToSpeak, ttsVoice, ttsTemp, apiKey);
            if (blob) {
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                showToast('Audio berhasil dibuat!', 'success');
            }
        } catch (error) {
            showToast('TTS Error: ' + (error as Error).message, 'error');
        } finally {
            setIsTtsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        showToast('Script berhasil disalin!', 'success');
    };

    const tabItems: { id: ScriptMode; label: string; icon: typeof FileText }[] = [
        { id: 'script', label: 'Script', icon: FileText },
        { id: 'caption', label: 'Caption', icon: AlignLeft },
        { id: 'hashtag', label: 'Hashtag', icon: Hash },
    ];

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
                        <FileText className="w-4 h-4" /> Script Generator Pro
                    </h2>

                    {/* Mode Tabs */}
                    <div className="flex p-1 bg-slate-900/50 rounded-lg mb-5 border border-slate-700/50">
                        {tabItems.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setMode(tab.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex-1 py-2 text-xs font-medium rounded-md flex items-center justify-center gap-1 transition-all ${mode === tab.id
                                        ? 'bg-red-600 text-white shadow-lg font-bold'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className="w-3 h-3" />
                                    {tab.label}
                                </motion.button>
                            );
                        })}
                    </div>

                    <div className="space-y-3">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-xs text-slate-400 mb-2">
                                1. Upload Foto Produk (Utama)
                            </label>
                            <div
                                className={`relative min-h-[120px] rounded-lg p-4 text-center cursor-pointer bg-slate-800/50 flex flex-col items-center justify-center group hover:bg-slate-800 transition-all border-2 border-dashed ${images.length > 0 ? 'border-red-500/50' : 'border-slate-700 hover:border-red-500'
                                    }`}
                                onClick={() => document.getElementById('script-file')?.click()}
                            >
                                <input
                                    type="file"
                                    id="script-file"
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        if (e.target.files) handleImageUpload(e.target.files);
                                        e.target.value = '';
                                    }}
                                />

                                {images.length > 0 ? (
                                    <>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {images.map((img, i) => (
                                                <img
                                                    key={i}
                                                    src={`data:image/png;base64,${img}`}
                                                    className="h-16 w-16 object-cover rounded-lg border border-slate-600"
                                                    alt={`Product ${i + 1}`}
                                                />
                                            ))}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setImages([]);
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
                                        <p className="text-xs text-slate-400 font-medium">Klik / Drop Foto Produk</p>
                                        <p className="text-[10px] text-slate-500 mt-1">Support Multiple Images</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-xs text-slate-400">2. Deskripsi / Nama Produk</label>
                                <Button
                                    onClick={handleAnalyze}
                                    isLoading={isAnalyzing}
                                    icon={<Sparkles className="w-4 h-4" />}
                                    className="w-full relative overflow-hidden group"
                                >
                                    <div className="flex flex-col items-center">
                                        <span>{isAnalyzing ? 'Analyzing...' : 'Auto Analisa (Multimodal)'}</span>
                                        {!isAnalyzing && <span className="text-[10px] opacity-70">Biaya: $0.005</span>}
                                    </div>
                                </Button>
                            </div>
                            <Textarea
                                value={productDesc}
                                onChange={(e) => setProductDesc(e.target.value)}
                                placeholder="Contoh: Kopi Gula Aren, kemasan botol kaca..."
                                className="h-20 mb-1"
                            />
                        </div>

                        {/* Detail Target & Gaya */}
                        <div className="relative space-y-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700">
                                <Sparkles className="w-3 h-3 text-red-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Detail Target & Gaya
                                </span>
                            </div>

                            <Input
                                label="Target Audience"
                                value={audience}
                                onChange={(e) => setAudience(e.target.value)}
                                placeholder="Contoh: Gen Z, Ibu Rumah Tangga..."
                            />

                            {/* VEO Mode Toggle */}
                            <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-green-500/10 rounded-md">
                                        <Scissors className="w-4 h-4 text-green-400" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-white">Potong untuk VEO 3</label>
                                        <p className="text-[9px] text-slate-400">Split script jadi potongan scene</p>
                                    </div>
                                </div>
                                <Toggle
                                    checked={veoMode}
                                    onChange={setVeoMode}
                                    color="green"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <Select
                                    label="Platform"
                                    options={PLATFORM_OPTIONS}
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                />

                                {veoMode ? (
                                    <div>
                                        <label className="block text-xs text-green-400 mb-1 font-bold flex items-center gap-1">
                                            <Timer className="w-3 h-3" /> Clip
                                        </label>
                                        <select
                                            value={veoDuration}
                                            onChange={(e) => setVeoDuration(e.target.value)}
                                            className="w-full px-2 py-2 rounded-lg text-xs bg-slate-800 border border-green-500/30 text-white"
                                        >
                                            <option value="5 seconds">⚡ 5s</option>
                                            <option value="7 seconds">🚀 7s</option>
                                        </select>
                                    </div>
                                ) : (
                                    <Select
                                        label="Total Durasi"
                                        options={DURATION_OPTIONS}
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                    />
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Select
                                    label="Gaya Bahasa"
                                    options={TONE_OPTIONS}
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                />
                                <Select
                                    label="Bahasa"
                                    options={LANGUAGE_OPTIONS}
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                />
                            </div>

                            {!veoMode && mode === 'script' && (
                                <Select
                                    label="Struktur Script"
                                    options={STRUCTURE_OPTIONS}
                                    value={structure}
                                    onChange={(e) => setStructure(e.target.value)}
                                />
                            )}

                            <Textarea
                                label="Poin Penting / Keunggulan"
                                value={points}
                                onChange={(e) => setPoints(e.target.value)}
                                placeholder="Isi poin utama, harga, atau promo..."
                                className="h-16"
                            />
                        </div>

                        <Button
                            onClick={handleGenerate}
                            isLoading={isLoading}
                            icon={<Sparkles className="w-4 h-4" />}
                            className="w-full relative overflow-hidden group py-6"
                        >
                            <div className="flex flex-col items-center">
                                <span>{isLoading ? 'Generating...' : `Generate ${mode === 'script' ? 'Video Script' : mode === 'caption' ? 'Caption' : 'Hashtags'}`}</span>
                                {!isLoading && <span className="text-[10px] opacity-70">Biaya: ${PRICING.SCRIPT}</span>}
                            </div>
                        </Button>

                        {/* TTS Section */}
                        {mode === 'script' && (
                            <>
                                <hr className="border-slate-700 my-4" />
                                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs text-slate-400 font-bold">Voice Over Settings</label>
                                        <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                                            Beta
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-[10px] text-slate-400 mb-1">Pilih Karakter Suara</label>
                                            <select
                                                value={ttsVoice}
                                                onChange={(e) => setTtsVoice(e.target.value)}
                                                className="w-full px-2 py-1.5 rounded text-xs bg-slate-800 border border-slate-700 text-white"
                                            >
                                                <optgroup label="✅ Free Voices (Terbuka)">
                                                    {TTS_VOICES.free.map((v) => (
                                                        <option key={v.value} value={v.value}>{v.label}</option>
                                                    ))}
                                                </optgroup>
                                                <optgroup label="👑 Premium Voices (Terbuka)">
                                                    {TTS_VOICES.premium.map((v) => (
                                                        <option key={v.value} value={v.value}>{v.label}</option>
                                                    ))}
                                                </optgroup>
                                            </select>
                                        </div>

                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <label className="text-[10px] text-slate-400">Ekspresi (Temperature)</label>
                                                <span className="text-[10px] text-red-400 font-mono">{ttsTemp}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="2"
                                                step="0.1"
                                                value={ttsTemp}
                                                onChange={(e) => setTtsTemp(parseFloat(e.target.value))}
                                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                                            />
                                            <p className="text-[9px] text-slate-500 mt-1">
                                                0.0 = Stabil | 1.0 = Normal | 2.0 = Sangat Ekspresif
                                            </p>
                                        </div>

                                        <Button
                                            variant="secondary"
                                            onClick={handleGenerateTTS}
                                            isLoading={isTtsLoading}
                                            icon={<Mic className="w-4 h-4" />}
                                            className="w-full relative overflow-hidden group"
                                        >
                                            <div className="flex flex-col items-center">
                                                <span>{isTtsLoading ? 'Generating Audio...' : 'Generate Suara (TTS)'}</span>
                                                {!isTtsLoading && <span className="text-[10px] opacity-70">Biaya: ${PRICING.TTS}</span>}
                                            </div>
                                        </Button>

                                        {audioUrl && (
                                            <audio controls src={audioUrl} className="w-full mt-3 h-8" />
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </GlassPanel>
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-8">
                <GlassPanel className="p-4 min-h-[500px] flex flex-col relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {isLoading && <LoaderOverlay message="Meracik script viral..." />}
                    </AnimatePresence>

                    {result ? (
                        <>
                            <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-700/50">
                                <label className="block text-xs text-slate-400">
                                    {mode === 'script' ? (veoMode ? 'Skenario VEO (Siap Cut)' : 'Naskah Video') : mode === 'caption' ? 'Opsi Caption' : 'Hashtag Strategy'}
                                </label>
                                <button
                                    onClick={copyToClipboard}
                                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                                >
                                    <Copy className="w-3 h-3" /> Copy Text
                                </button>
                            </div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-grow bg-slate-900/50 rounded-lg p-4 text-sm text-slate-300 font-mono whitespace-pre-wrap border border-slate-800 overflow-y-auto max-h-[600px] leading-relaxed"
                            >
                                {result}
                            </motion.div>
                        </>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-slate-500 h-full">
                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">Script Kosong</p>
                            <p className="text-sm opacity-75">Upload produk untuk meracik script</p>
                        </div>
                    )}
                </GlassPanel>
            </div>
        </motion.div>
    );
}
