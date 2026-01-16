'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoaderOverlayProps {
    message?: string;
}

export default function LoaderOverlay({ message = 'Memproses...' }: LoaderOverlayProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/90 backdrop-blur z-20 flex flex-col items-center justify-center rounded-lg"
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mb-4"
            />
            <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-red-500 text-sm font-mono"
            >
                {message}
            </motion.p>
        </motion.div>
    );
}

export function ShimmerSkeleton() {
    return (
        <div className="relative overflow-hidden bg-slate-800 rounded-lg">
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    );
}

export function ImageSlotLoader({ index }: { index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square bg-slate-800 rounded-lg flex flex-col items-center justify-center border border-slate-700 relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-shimmer" />
            <Loader2 className="w-8 h-8 text-slate-500 animate-spin z-10" />
            <span className="text-[10px] text-slate-400 mt-2 z-10">Antri...</span>
        </motion.div>
    );
}
