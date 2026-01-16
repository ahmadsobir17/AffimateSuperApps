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

export default function Navbar() {
    const { currentPanel, setCurrentPanel } = useApp();

    return (
        <div className="sticky top-0 z-40 flex justify-center w-full px-4 pt-4 mb-4">
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-1 p-1.5 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-x-auto no-scrollbar max-w-full"
            >
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPanel === item.id;

                    return (
                        <motion.button
                            key={item.id}
                            onClick={() => setCurrentPanel(item.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`px-3 sm:px-4 py-2.5 text-xs font-black rounded-xl flex items-center justify-center gap-2 whitespace-nowrap transition-all ${isActive
                                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className="w-5 h-5 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">{item.label}</span>
                        </motion.button>
                    );
                })}
            </motion.nav>
        </div>
    );
}
