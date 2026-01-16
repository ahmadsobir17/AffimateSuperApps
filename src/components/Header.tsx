'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zap, LogOut, DollarSign, Plus, Menu, X, User, Camera, FileText, Video, Gift, Globe } from 'lucide-react';
import { useApp } from '@/lib/context';
import { useLanguage, Language } from '@/lib/i18n';
import { useState } from 'react';
import { PanelType } from '@/types';
import AffiliateModal from './AffiliateModal';

interface HeaderProps {
    onTopUp?: () => void;
}

const navItems: { id: PanelType; labelKey: string; icon: any }[] = [
    { id: 'character', labelKey: 'panel.character', icon: User },
    { id: 'image', labelKey: 'panel.studio', icon: Camera },
    { id: 'script', labelKey: 'panel.script', icon: FileText },
    { id: 'veo', labelKey: 'panel.veo', icon: Video },
];

export default function Header({ onTopUp }: HeaderProps) {
    const { isTrialMode, userEmail, balance, logout, exchangeRate, currentPanel, setCurrentPanel } = useApp();
    const { language, setLanguage, t } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAffiliateOpen, setIsAffiliateOpen] = useState(false);

    const langOptions: { code: Language; label: string; flag: string }[] = [
        { code: 'id', label: 'ID', flag: '🇮🇩' },
        { code: 'en', label: 'EN', flag: '🇺🇸' },
        { code: 'zh', label: '中文', flag: '🇨🇳' },
        { code: 'ru', label: 'RU', flag: '🇷🇺' },
    ];

    const handleLogout = () => {
        logout();
    };

    const displayName = userEmail ? userEmail.split('@')[0] : 'Tamu';
    const idrBalance = balance * exchangeRate;

    return (
        <>
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 h-[72px] flex items-center"
            >
                <div className="max-w-[1600px] mx-auto px-4 w-full flex items-center justify-between gap-4">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3 shrink-0">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20"
                        >
                            <Zap className="text-white w-5 h-5" />
                        </motion.div>
                        <h1 className="font-black text-lg sm:text-xl tracking-tighter leading-none hidden sm:block">
                            <span className="text-white">AFFIMATE</span>
                            <span className="text-red-500 ml-1">SUPER APPS</span>
                            <span className="text-red-500">.</span>
                        </h1>
                    </div>

                    {/* Center: Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1 p-1 bg-white/5 border border-white/5 rounded-xl">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPanel === item.id;
                            return (
                                <motion.button
                                    key={item.id}
                                    onClick={() => setCurrentPanel(item.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all ${isActive
                                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    <span>{t(item.labelKey)}</span>
                                </motion.button>
                            );
                        })}
                    </nav>

                    {/* Right: Balance & User & Hamburger */}
                    <div className="flex items-center gap-2 sm:gap-4 font-inter">

                        {/* Affiliate Button (Always Visible) */}
                        <motion.button
                            onClick={() => setIsAffiliateOpen(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black border border-yellow-500/20 p-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-2 transition-all"
                        >
                            <Gift className="w-4 h-4" />
                            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Affiliate</span>
                        </motion.button>

                        {/* Language Switcher (Always Visible) */}
                        <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/5">
                            {langOptions.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => setLanguage(lang.code)}
                                    className={`px-1.5 sm:px-2 py-1 text-[10px] sm:text-xs font-bold rounded-md transition-all ${language === lang.code
                                        ? 'bg-red-500 text-white'
                                        : 'text-slate-400 hover:text-white'
                                        }`}
                                    title={lang.label}
                                >
                                    {lang.flag}
                                </button>
                            ))}
                        </div>

                        {/* Balance */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white/5 border border-white/5 rounded-xl pl-3 pr-2 py-1.5 flex items-center gap-3 sm:gap-4"
                        >
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-black text-green-400 flex items-center gap-0.5">
                                    <DollarSign className="w-3 h-3" />
                                    {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                                <div className="flex items-center gap-1">
                                    <span className="text-[9px] text-slate-500 font-bold whitespace-nowrap">
                                        Rp {Math.round(idrBalance).toLocaleString('id-ID')}
                                    </span>
                                    <div className="flex items-center gap-1 bg-green-500/10 px-1 rounded-[2px] hidden xs:flex">
                                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[7px] font-black text-green-500 uppercase tracking-tighter">Live</span>
                                    </div>
                                </div>
                            </div>
                            <motion.button
                                onClick={onTopUp}
                                whileHover={{ scale: 1.1, backgroundColor: '#ef4444' }}
                                whileTap={{ scale: 0.9 }}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/10 shrink-0"
                                title="Top Up Credit"
                            >
                                <Plus className="w-4 h-4" />
                            </motion.button>
                        </motion.div>

                        {/* User Profile (Desktop) */}
                        <div className="hidden sm:flex items-center gap-3 ml-2 border-l border-white/5 pl-4">
                            <div className="text-right">
                                <div className="text-xs font-black text-white capitalize leading-none mb-1">
                                    {displayName}
                                </div>
                                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                                    {isTrialMode ? 'Free Plan' : 'Pro Member'}
                                </div>
                            </div>
                            <motion.button
                                onClick={handleLogout}
                                whileHover={{ scale: 1.1, color: '#ef4444' }}
                                className="p-2 text-slate-500 hover:text-white transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                            </motion.button>
                        </div>

                        {/* Hamburger Button (Mobile/Tablet) */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-slate-400 hover:text-white bg-white/5 border border-white/5 rounded-lg"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="absolute top-[72px] left-0 right-0 bg-slate-900 border-b border-white/5 overflow-hidden lg:hidden z-40 shadow-2xl"
                        >
                            <div className="p-4 space-y-2">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = currentPanel === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setCurrentPanel(item.id);
                                                setIsMenuOpen(false);
                                            }}
                                            className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${isActive
                                                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-bold text-sm uppercase tracking-widest">{t(item.labelKey)}</span>
                                        </button>
                                    );
                                })}

                                {/* Mobile Affiliate */}
                                <button
                                    onClick={() => {
                                        setIsAffiliateOpen(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full p-4 rounded-xl flex items-center gap-4 text-yellow-500 bg-yellow-500/10 font-bold text-sm uppercase tracking-widest"
                                >
                                    <Gift className="w-5 h-5" />
                                    Affiliate Program
                                </button>

                                {/* Mobile Logout */}
                                <div className="pt-4 border-t border-white/5 sm:hidden">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full p-4 rounded-xl flex items-center gap-4 text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-sm uppercase tracking-widest"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Keluar Sesi
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
            <AffiliateModal isOpen={isAffiliateOpen} onClose={() => setIsAffiliateOpen(false)} />
        </>
    );
}
