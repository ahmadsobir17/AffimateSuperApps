'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, UserCheck, Sparkles, Crown, Lock } from 'lucide-react';
import { useApp } from '@/lib/context';
import { generateCharacter } from '@/lib/api';
import {
    CHARACTER_STYLES,
    AGE_OPTIONS,
    ETHNICITY_OPTIONS,
    HAIR_STYLES,
    HAIR_COLORS,
    BODY_TYPES,
    OUTFIT_OPTIONS,
} from '@/lib/constants';
import GlassPanel from '@/components/ui/GlassPanel';
import Select from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import LoaderOverlay from '@/components/ui/Loader';

export default function CharacterPanel() {
    const { isTrialMode, activeGender, setActiveGender, showToast, apiKey, deductBalance } = useApp();

    // Form State
    const [style, setStyle] = useState('Photorealistic');
    const [age, setAge] = useState('25 years old');
    const [ethnicity, setEthnicity] = useState('Indonesian asian');
    const [hair, setHair] = useState('natural hair');
    const [hairColor, setHairColor] = useState('black');
    const [body, setBody] = useState('average fit body');
    const [outfit, setOutfit] = useState('casual t-shirt and jeans');
    const [prompt, setPrompt] = useState('');

    // Result State
    const [isLoading, setIsLoading] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);

    const handleGenerate = async () => {
        const cost = 0.01; // $0.01 per character

        if (!deductBalance(cost)) {
            return;
        }

        setIsLoading(true);

        try {
            const activity = prompt.trim() || 'posing confidently looking at the camera, simple professional background';

            const fullPrompt = `[STYLE]: ${style}.
[SUBJECT]: A ${age} ${ethnicity} ${activeGender}.
[FEATURES]: ${hairColor} ${hair}, ${body} body type.
[OUTFIT]: Wearing ${outfit}.
[ACTION/CONTEXT]: ${activity}.
[QUALITY]: Highly detailed, sharp focus, professional photography, 8k, cinematic lighting, photorealistic skin texture.`;

            const result = await generateCharacter(fullPrompt, apiKey);

            if (result) {
                setResultImage(`data:image/png;base64,${result}`);
                showToast('Karakter Custom berhasil dibuat!', 'success');
            } else {
                throw new Error('Gagal generate gambar');
            }
        } catch (error) {
            showToast('Gagal membuat karakter: ' + (error as Error).message, 'error');
        } finally {
            setIsLoading(false);
        }
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
                        <User className="w-4 h-4" /> Membuat Karakter AI
                    </h2>

                    <div className="space-y-4">
                        {/* Gender Selection */}
                        <div>
                            <label className="text-xs text-slate-400 font-medium mb-2 block">
                                1. Gender (Basic)
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {(['Male', 'Female'] as const).map((gender) => (
                                    <motion.button
                                        key={gender}
                                        onClick={() => setActiveGender(gender)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`py-3 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${activeGender === gender
                                            ? 'bg-slate-700 text-white ring-1 ring-red-500'
                                            : 'bg-slate-800 text-slate-400'
                                            }`}
                                    >
                                        {gender === 'Male' ? (
                                            <User className="w-5 h-5" />
                                        ) : (
                                            <UserCheck className="w-5 h-5" />
                                        )}
                                        {gender === 'Male' ? 'Pria' : 'Wanita'}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Detailed Features */}
                        <div className="relative space-y-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700">
                                <Sparkles className="w-3 h-3 text-red-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Detail Karakter
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <Select
                                        label="Visual Style"
                                        options={CHARACTER_STYLES}
                                        value={style}
                                        onChange={(e) => setStyle(e.target.value)}
                                    />
                                </div>
                                <Select
                                    label="Umur (Age)"
                                    options={AGE_OPTIONS}
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                                <Select
                                    label="Ras / Etnis"
                                    options={ETHNICITY_OPTIONS}
                                    value={ethnicity}
                                    onChange={(e) => setEthnicity(e.target.value)}
                                />
                                <Select
                                    label="Gaya Rambut"
                                    options={HAIR_STYLES}
                                    value={hair}
                                    onChange={(e) => setHair(e.target.value)}
                                />
                                <Select
                                    label="Warna Rambut"
                                    options={HAIR_COLORS}
                                    value={hairColor}
                                    onChange={(e) => setHairColor(e.target.value)}
                                />
                                <Select
                                    label="Bentuk Tubuh"
                                    options={BODY_TYPES}
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                />
                                <Select
                                    label="Gaya Pakaian"
                                    options={OUTFIT_OPTIONS}
                                    value={outfit}
                                    onChange={(e) => setOutfit(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Prompt Input */}
                        <Textarea
                            label="Aktivitas & Lokasi (Opsional)"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="isi sesuai keinginan mu..."
                            className="h-20"
                        />

                        {/* Generate Button */}
                        <Button
                            onClick={handleGenerate}
                            isLoading={isLoading}
                            icon={<Sparkles className="w-4 h-4" />}
                            className="w-full relative overflow-hidden group"
                        >
                            <div className="flex flex-col items-center">
                                <span>{isLoading ? 'Generating...' : 'Generate Character'}</span>
                                {!isLoading && (
                                    <span className="text-[10px] opacity-70 group-hover:opacity-100 transition-opacity">
                                        Estimasi Biaya: $0.01
                                    </span>
                                )}
                            </div>
                        </Button>
                    </div>
                </GlassPanel>
            </div>

            {/* Right Column - Result */}
            <div className="lg:col-span-8">
                <GlassPanel className="p-4 min-h-[500px] flex flex-col relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {isLoading && <LoaderOverlay message="Sedang menggambar karakter..." />}
                    </AnimatePresence>

                    {resultImage ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full h-full flex items-center justify-center bg-black/20 rounded-lg"
                        >
                            <img
                                src={resultImage}
                                alt="Generated Character"
                                className="max-w-full max-h-full object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-2xl"
                            />
                        </motion.div>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-slate-500 h-full">
                            <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">Karakter Kosong</p>
                            <p className="text-sm opacity-75">Isi detail dan mulai generate</p>
                        </div>
                    )}
                </GlassPanel>
            </div>
        </motion.div>
    );
}
