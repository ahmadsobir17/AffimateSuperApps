'use client';

import { motion } from 'framer-motion';
import { Zap, Github, Twitter, Instagram, Mail, Shield, CircleHelp, ExternalLink } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-slate-800/50 bg-[#050911] py-6">
            <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-widest uppercase text-slate-600">
                <div className="flex items-center gap-3">
                    <span className="text-slate-500">&copy; 2026 Affimate</span>
                    <span className="w-1 h-1 bg-slate-800 rounded-full" />
                    <span>Powered by Axiamasi Strategy</span>
                </div>

                <div className="flex items-center gap-6">
                    <a href="#" className="hover:text-red-500 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-red-500 transition-colors">Terms</a>
                    <div className="flex items-center gap-2 pl-4 border-l border-slate-800">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-slate-500">System Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
