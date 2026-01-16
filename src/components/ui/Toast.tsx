'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '@/lib/context';

export default function Toast() {
    const { toast } = useApp();

    return (
        <AnimatePresence>
            {toast && (
                <motion.div
                    initial={{ opacity: 0, y: -20, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: -20, x: '-50%' }}
                    className="fixed top-5 left-1/2 z-[80]"
                >
                    <div
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg ${toast.type === 'success'
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                            }`}
                    >
                        {toast.type === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <AlertCircle className="w-5 h-5" />
                        )}
                        <span className="font-medium">{toast.message}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
