'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, X, ExternalLink, AlertCircle, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (apiKey: string) => void;
}

export default function ApiKeyModal({ isOpen, onClose, onSubmit }: ApiKeyModalProps) {
    const [apiKey, setApiKey] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!apiKey.trim()) {
            setError('API Key tidak boleh kosong!');
            return;
        }

        if (apiKey.length < 30) {
            setError('API Key tidak valid! Pastikan format sudah benar.');
            return;
        }

        setError('');
        onSubmit(apiKey.trim());
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                    >
                        <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <Key className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-white">Masukkan API Key</h2>
                                            <p className="text-xs text-white/80">Google Gemini API Key</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <form onSubmit={handleSubmit} className="p-5 space-y-4">
                                {/* Info Box */}
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                    <div className="flex gap-2">
                                        <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                        <div className="text-xs text-blue-300">
                                            <p className="font-semibold mb-1">Cara Mendapatkan API Key:</p>
                                            <ol className="list-decimal list-inside space-y-0.5 text-blue-300/80">
                                                <li>Buka Google AI Studio</li>
                                                <li>Klik "Get API Key"</li>
                                                <li>Copy dan paste API Key ke sini</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>

                                {/* API Key Input */}
                                <div>
                                    <label className="block text-xs text-slate-400 mb-2">
                                        API Key <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => {
                                            setApiKey(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="AIzaSy..."
                                        className="w-full px-4 py-3 rounded-lg text-sm bg-slate-900 border border-slate-700 text-white 
                      transition-all focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 
                      placeholder:text-slate-500 font-mono"
                                    />
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-xs text-red-400 mt-2 flex items-center gap-1"
                                        >
                                            <AlertCircle className="w-3 h-3" />
                                            {error}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Features List */}
                                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                                    <p className="text-xs text-slate-400 mb-2 font-semibold">Yang Bisa Kamu Akses:</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        {[
                                            'Generate Character AI',
                                            'Foto Studio AI',
                                            'Script Generator',
                                            'VEO Vision Prompt',
                                            'Text-to-Speech',
                                            'Auto Analyze'
                                        ].map((feature) => (
                                            <div key={feature} className="flex items-center gap-1.5 text-slate-300">
                                                <Check className="w-3 h-3 text-green-500" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={onClose}
                                        className="flex-1"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="trial"
                                        icon={<Key className="w-4 h-4" />}
                                        className="flex-1"
                                    >
                                        Mulai Sekarang
                                    </Button>
                                </div>

                                {/* Get API Key Link */}
                                <a
                                    href="https://aistudio.google.com/apikey"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-red-400 transition-colors pt-2"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    Dapatkan API Key Gratis di Google AI Studio
                                </a>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
