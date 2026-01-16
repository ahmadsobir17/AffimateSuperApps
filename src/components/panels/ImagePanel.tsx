'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Shirt, RefreshCcw, X, Wand2, Sparkles, Crown, Lock, Download, Edit3, Clapperboard, RefreshCw } from 'lucide-react';
import { useApp } from '@/lib/context';
import { generateProductImage, analyzeProduct, fileToBase64 } from '@/lib/api';
import { MODEL_OPTIONS, STUDIO_THEMES, LIGHTING_OPTIONS, ANGLE_OPTIONS, PRICING } from '@/lib/constants';
import GlassPanel from '@/components/ui/GlassPanel';
import Select from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toggle from '@/components/ui/Toggle';
import LoaderOverlay, { ImageSlotLoader } from '@/components/ui/Loader';

export default function ImagePanel() {
    const { isTrialMode, showToast, apiKey, deductBalance } = useApp();

    // Image State
    const [frontImage, setFrontImage] = useState<string | null>(null);
    const [backImage, setBackImage] = useState<string | null>(null);
    const [customModelImage, setCustomModelImage] = useState<string | null>(null);

    // Form State
    const [description, setDescription] = useState('');
    const [modelOption, setModelOption] = useState('no humans, product focus only');
    const [theme, setTheme] = useState('minimalist white podium with soft lighting');
    const [lighting, setLighting] = useState('soft diffused lighting');
    const [angle, setAngle] = useState('front view eye level');
    const [extraDetails, setExtraDetails] = useState('');
    const [massMode, setMassMode] = useState(false);
    const [genCount, setGenCount] = useState(10);

    // Result State
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState<string[]>([]);

    const handleImageUpload = async (side: 'front' | 'back' | 'model', file: File) => {
        try {
            const base64 = await fileToBase64(file);
            if (side === 'front') {
                setFrontImage(base64);
                showToast('Foto Depan diset!', 'success');
            } else if (side === 'back') {
                setBackImage(base64);
                showToast('Foto Belakang diset!', 'success');
            } else {
                setCustomModelImage(base64);
                showToast('Model berhasil diupload', 'success');
            }
        } catch {
            showToast('Upload gagal', 'error');
        }
    };

    const clearImage = (side: 'front' | 'back' | 'model') => {
        if (side === 'front') setFrontImage(null);
        else if (side === 'back') setBackImage(null);
        else setCustomModelImage(null);
    };

    const handleAnalyze = async () => {
        if (!frontImage) {
            showToast('Upload foto produk tampak depan dulu!', 'error');
            return;
        }

        setIsAnalyzing(true);
        try {
            const images = [frontImage];
            if (backImage) images.push(backImage);

            const result = await analyzeProduct(images, apiKey);
            if (result) {
                setDescription(result.trim());
                showToast('Analisa produk selesai!', 'success');
            }
        } catch (error) {
            showToast('Gagal analisa: ' + (error as Error).message, 'error');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGenerate = async () => {
        if (!frontImage) {
            showToast('Wajib upload Foto Depan!', 'error');
            return;
        }

        if (modelOption === 'custom_model' && !customModelImage) {
            showToast('Anda memilih Custom Model, harap upload foto modelnya!', 'error');
            return;
        }

        const count = massMode ? genCount : 1;
        const cost = count * PRICING.PRODUCT_IMAGE;

        if (!deductBalance(cost)) {
            return;
        }

        setIsLoading(true);
        const newResults: string[] = [];

        try {
            for (let i = 0; i < count; i++) {
                const desc = description || 'Fashion product';
                const prompt = `Professional commercial photography of ${desc}.
[SETTING]:
Theme: ${theme}.
Lighting: ${lighting}.
Camera Angle: ${angle}.
[MODEL]: Model: ${modelOption}.
[DETAILS]: ${extraDetails}
[QUALITY]: 8k, photorealistic, sharp focus, commercial advertisement quality.`;

                const result = await generateProductImage(prompt, frontImage, apiKey, backImage, customModelImage);
                if (result) {
                    newResults.push(`data:image/png;base64,${result}`);
                }
            }

            setResults(newResults);
            showToast('Selesai! Semua gambar berhasil dibuat.', 'success');
        } catch (error) {
            showToast('Proses terhenti: ' + (error as Error).message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const UploadZone = ({ side, image, label, required = false }: {
        side: 'front' | 'back';
        image: string | null;
        label: string;
        required?: boolean;
    }) => (
        <div
            className={`relative min-h-[140px] rounded-lg p-3 text-center cursor-pointer bg-slate-800/50 flex flex-col items-center justify-center group hover:bg-slate-800 transition-all border-2 border-dashed ${image ? (side === 'front' ? 'border-blue-500/50' : 'border-purple-500/50') : 'border-slate-700 hover:border-red-500'
                }`}
            onClick={() => document.getElementById(`file-${side}`)?.click()}
        >
            <input
                type="file"
                id={`file-${side}`}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                    if (e.target.files?.[0]) handleImageUpload(side, e.target.files[0]);
                    e.target.value = '';
                }}
            />

            {image ? (
                <div className="w-full h-full absolute inset-0 bg-slate-800 rounded-lg overflow-hidden">
                    <img
                        src={`data:image/png;base64,${image}`}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        alt={label}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-center">
                        <span className="text-[9px] text-white font-bold">{label}</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            clearImage(side);
                        }}
                        className="absolute top-1 right-1 bg-red-600/80 p-1 rounded-full text-white hover:bg-red-500"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <div className={`p-2 rounded-full mb-2 group-hover:scale-110 transition-transform ${side === 'front' ? 'bg-blue-500/10' : 'bg-purple-500/10'
                        }`}>
                        {side === 'front' ? (
                            <Shirt className="w-5 h-5 text-blue-400" />
                        ) : (
                            <RefreshCcw className="w-5 h-5 text-purple-400" />
                        )}
                    </div>
                    <p className="text-[10px] font-bold text-white">{label}</p>
                    <p className={`text-[9px] mt-0.5 ${required ? 'text-red-400' : 'text-slate-500'}`}>
                        {required ? '*Wajib' : 'Opsional'}
                    </p>
                </div>
            )}
        </div>
    );

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
                        <Camera className="w-4 h-4" /> AI Product Studio
                    </h2>

                    <div className="space-y-4">
                        {/* Upload Zone */}
                        <div>
                            <label className="block text-xs text-slate-400 mb-2">
                                1. Upload Foto Produk (Depan & Belakang)
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <UploadZone side="front" image={frontImage} label="Tampak Depan" required />
                                <UploadZone side="back" image={backImage} label="Tampak Belakang" />
                            </div>
                        </div>

                        {/* Description with Auto Analyze */}
                        <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-xs text-slate-400">2. Deskripsi Produk</label>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleAnalyze}
                                    isLoading={isAnalyzing}
                                    icon={<Sparkles className="w-3 h-3" />}
                                    className="text-[10px] !py-1"
                                >
                                    Buat deskripsi otomatis
                                </Button>
                            </div>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Tulis deskripsi atau klik tombol analisa..."
                                className="h-20 mb-1"
                            />
                            <p className="text-[10px] text-slate-500 italic">
                                *Analisa AI membantu hasil lebih akurat.
                            </p>
                        </div>

                        {/* Studio Controls */}
                        <div className="relative space-y-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-700">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-red-500" />
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Studio Controls
                                    </span>
                                </div>
                                <Toggle
                                    checked={massMode}
                                    onChange={setMassMode}
                                    label="Mode Massal"
                                />
                            </div>

                            <Select
                                label="3. Opsi Model / Karakter"
                                options={MODEL_OPTIONS}
                                value={modelOption}
                                onChange={(e) => setModelOption(e.target.value)}
                            />

                            {modelOption === 'custom_model' && (
                                <div className="mb-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600 border-dashed">
                                    <label className="block text-xs text-slate-400 mb-2">
                                        Upload Foto Model (Wajah/Full Body)
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-600">
                                            {customModelImage ? (
                                                <img
                                                    src={`data:image/png;base64,${customModelImage}`}
                                                    className="w-full h-full object-cover"
                                                    alt="Model"
                                                />
                                            ) : (
                                                <User className="w-6 h-6 text-slate-500" />
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            id="file-model"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) handleImageUpload('model', e.target.files[0]);
                                                e.target.value = '';
                                            }}
                                        />
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => document.getElementById('file-model')?.click()}
                                            className="flex-grow"
                                        >
                                            Pilih Foto Model
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {!massMode && (
                                <div className="space-y-3">
                                    <Select
                                        label="4. Pilih Tema Studio"
                                        options={STUDIO_THEMES}
                                        value={theme}
                                        onChange={(e) => setTheme(e.target.value)}
                                    />
                                    <Select
                                        label="5. Pencahayaan (Lighting)"
                                        options={LIGHTING_OPTIONS}
                                        value={lighting}
                                        onChange={(e) => setLighting(e.target.value)}
                                    />
                                    <Select
                                        label="6. Sudut Kamera (Angle)"
                                        options={ANGLE_OPTIONS}
                                        value={angle}
                                        onChange={(e) => setAngle(e.target.value)}
                                    />
                                </div>
                            )}

                            {massMode && (
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-xs text-slate-400">Jumlah Variasi (Max 30)</label>
                                        <span className="text-[10px] font-mono text-white bg-slate-700 px-2 py-0.5 rounded">
                                            {genCount} Gambar
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="30"
                                        value={genCount}
                                        onChange={(e) => setGenCount(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            )}
                        </div>

                        <Textarea
                            label="Detail Tambahan (Opsional)"
                            value={extraDetails}
                            onChange={(e) => setExtraDetails(e.target.value)}
                            placeholder="Isi jika ingin membatasi kreativitas AI (Opsional)..."
                            className="h-16"
                        />

                        <Button
                            onClick={handleGenerate}
                            isLoading={isLoading}
                            icon={<Wand2 className="w-4 h-4" />}
                            className="w-full relative overflow-hidden group"
                        >
                            <div className="flex flex-col items-center">
                                <span>{isLoading ? 'Generating...' : 'Sulap Jadi Foto Studio'}</span>
                                {!isLoading && (
                                    <span className="text-[10px] opacity-70 group-hover:opacity-100 transition-opacity">
                                        Costs ${(massMode ? genCount : 1) * PRICING.PRODUCT_IMAGE}
                                    </span>
                                )}
                            </div>
                        </Button>
                    </div>
                </GlassPanel>
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-8">
                <GlassPanel className="p-4 min-h-[500px] flex flex-col relative overflow-hidden">
                    {results.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full h-full overflow-y-auto pr-1">
                            {results.map((src, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="aspect-square relative group overflow-hidden rounded-lg"
                                >
                                    <img
                                        src={src}
                                        alt={`Result ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                        <div className="flex items-center justify-around gap-2">
                                            <button
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = src;
                                                    link.download = `affimate-${Date.now()}.png`;
                                                    link.click();
                                                }}
                                                className="p-2 bg-slate-700/80 hover:bg-slate-600 rounded-full text-white transition-all transform hover:scale-110"
                                                title="Download"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 bg-slate-700/80 hover:bg-slate-600 rounded-full text-white transition-all transform hover:scale-110"
                                                title="Edit"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 bg-slate-700/80 hover:bg-slate-600 rounded-full text-white transition-all transform hover:scale-110"
                                                title="Prompt Video"
                                            >
                                                <Clapperboard className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 bg-red-600/80 hover:bg-red-500 rounded-full text-white transition-all transform hover:scale-110"
                                                title="Regenerate"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-slate-500 h-full">
                            <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">Studio Kosong</p>
                            <p className="text-sm opacity-75">Upload produk dan mulai generate</p>
                        </div>
                    )}
                </GlassPanel>
            </div>
        </motion.div>
    );
}

// Need to import User icon
import { User } from 'lucide-react';
