'use client';

import { motion } from 'framer-motion';
import { Zap, Github, Twitter, Instagram, Mail, Shield, CircleHelp, ExternalLink } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-slate-800 bg-slate-900/30 backdrop-blur-sm pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                                <Zap className="text-white w-4 h-4" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white">
                                Affimate<span className="text-red-500">.</span>
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Super App AI revolusioner untuk para Content Creator dan Affiliator. Ciptakan konten viral dalam hitungan detik.
                        </p>
                        <div className="flex items-center gap-4 pt-4">
                            {[Twitter, Instagram, Github].map((Icon, i) => (
                                <motion.a
                                    key={i}
                                    href="#"
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-white/5"
                                >
                                    <Icon className="w-4 h-4" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Products Links */}
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase text-[10px] tracking-widest bg-white/5 inline-block px-2 py-1 rounded">Fitur Super</h4>
                        <ul className="space-y-4">
                            {['Character Studio', 'Product Studio', 'Script Generator', 'Video Animation (VEO)'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-slate-400 hover:text-red-500 text-sm transition-colors flex items-center gap-2 group">
                                        <div className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-red-500 transition-colors" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase text-[10px] tracking-widest bg-white/5 inline-block px-2 py-1 rounded">Bantuan</h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'Dokumentasi API', icon: ExternalLink },
                                { label: 'Pusat Bantuan', icon: CircleHelp },
                                { label: 'Kebijakan Privasi', icon: Shield },
                                { label: 'Kontak CS', icon: Mail },
                            ].map((item) => (
                                <li key={item.label}>
                                    <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                                        <item.icon className="w-4 h-4 text-slate-600 group-hover:text-red-500" />
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* App Install Placeholder */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-red-500/20 transition-all" />
                        <h4 className="font-bold text-white mb-2 text-sm flex items-center gap-2">
                            Install App
                        </h4>
                        <p className="text-[10px] text-slate-500 mb-4 leading-relaxed">
                            Gunakan Affimate sebagai aplikasi mobile PWA untuk akses lebih cepat di HP kamu.
                        </p>
                        <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-white text-[10px] font-bold transition-all uppercase tracking-widest">
                            Install Now
                        </button>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest flex flex-col md:flex-row items-center gap-2 text-center md:text-left">
                        <span>&copy; {currentYear} <span className="text-white font-black">Affimate Super App</span>.</span>
                        <span className="hidden md:block opacity-20">|</span>
                        <span>Designed and Built by <a href="https://axiamasi.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-500 transition-colors">axiamasi.com</a></span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-slate-600 text-[10px] font-bold uppercase">v0.1.0-beta</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-slate-400 text-[10px] font-bold uppercase">All Systems Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
