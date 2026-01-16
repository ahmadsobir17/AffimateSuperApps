'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassPanelProps {
    children: ReactNode;
    className?: string;
}

export default function GlassPanel({ children, className = '' }: GlassPanelProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-slate-800/70 backdrop-blur-xl border border-white/5 rounded-xl shadow-xl ${className}`}
        >
            {children}
        </motion.div>
    );
}
