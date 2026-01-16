'use client';

import { motion } from 'framer-motion';
import { User, Camera, FileText, Video } from 'lucide-react';
import { useApp } from '@/lib/context';
import { PanelType } from '@/types';

const navItems: { id: PanelType; label: string; icon: typeof User }[] = [
    { id: 'character', label: 'Character', icon: User },
    { id: 'image', label: 'Foto Studio', icon: Camera },
    { id: 'script', label: 'Script & VO', icon: FileText },
    { id: 'veo', label: 'VEO Vision', icon: Video },
];

export default function BottomNav() {
    const { currentPanel, setCurrentPanel } = useApp();

    return (
        <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex items-center gap-2 p-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-black/50 overflow-x-auto max-w-[90vw]"
        >
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPanel === item.id;

                return (
                    <motion.button
                        key={item.id}
                        onClick={() => setCurrentPanel(item.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2.5 text-sm font-medium rounded-full flex items-center gap-2 whitespace-nowrap transition-all ${isActive
                                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{item.label}</span>
                    </motion.button>
                );
            })}
        </motion.nav>
    );
}
