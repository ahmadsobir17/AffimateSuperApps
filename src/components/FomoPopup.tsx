'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Check } from 'lucide-react';
import { useApp } from '@/lib/context';
import { FOMO_NAMES, FOMO_LOCATIONS, FOMO_PRODUCTS } from '@/lib/constants';

export default function FomoPopup() {
    const { isTrialMode } = useApp();
    const [isVisible, setIsVisible] = useState(false);
    const [data, setData] = useState({
        name: 'Agus S.',
        location: 'Jakarta, ID',
        time: '1 menit yang lalu',
        product: 'Akses Premium',
        avatar: 'A',
    });

    useEffect(() => {
        if (!isTrialMode) return;

        const showFomo = () => {
            const name = FOMO_NAMES[Math.floor(Math.random() * FOMO_NAMES.length)];
            const location = FOMO_LOCATIONS[Math.floor(Math.random() * FOMO_LOCATIONS.length)];
            const product = FOMO_PRODUCTS[Math.floor(Math.random() * FOMO_PRODUCTS.length)];
            const timeAgo = Math.floor(Math.random() * 5) + 1;

            setData({
                name,
                location: `${location}, ID`,
                time: `${timeAgo} menit yang lalu`,
                product,
                avatar: name.charAt(0),
            });

            setIsVisible(true);

            setTimeout(() => {
                setIsVisible(false);
            }, 4000);
        };

        // Initial delay
        const initialTimer = setTimeout(showFomo, 5000);

        // Recurring
        const interval = setInterval(() => {
            const randomDelay = Math.floor(Math.random() * (15000 - 7000 + 1) + 7000);
            setTimeout(showFomo, randomDelay);
        }, 20000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [isTrialMode]);

    if (!isTrialMode) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    className="fixed bottom-20 right-5 z-50 flex items-center gap-3 bg-slate-800/90 backdrop-blur-md border border-slate-600/50 p-3 rounded-xl shadow-2xl max-w-[300px]"
                >
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                            {data.avatar}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-slate-800">
                            <Check className="w-2 h-2 text-white" />
                        </div>
                    </div>

                    <div className="flex-grow">
                        <p className="text-[10px] text-slate-400 font-medium mb-0.5">{data.time}</p>
                        <p className="text-xs text-white leading-tight">
                            <span className="font-bold text-green-400">{data.name}</span> membeli{' '}
                            <span className="font-bold">{data.product}</span>
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-2 h-2 text-slate-500" />
                            <span className="text-[10px] text-slate-500">{data.location}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-slate-500 hover:text-white transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
