'use client';

import { motion } from 'framer-motion';
import {
    Zap, TrendingUp, ArrowRight, Users, CheckCircle,
    Rocket, MousePointer2, Video, Camera, FileText
} from 'lucide-react';
import { useApp } from '@/lib/context';
import { useLanguage, Language } from '@/lib/i18n';
import FomoPopup from '@/components/FomoPopup';
import { useState, useEffect } from 'react';

interface LoginPageProps {
    onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
    const { loginWithGoogle } = useApp();
    const { language, setLanguage, t } = useLanguage();
    const [contentCount, setContentCount] = useState(3492);

    const langOptions: { code: Language; label: string; flag: string }[] = [
        { code: 'id', label: 'ID', flag: '🇮🇩' },
        { code: 'en', label: 'EN', flag: '🇺🇸' },
        { code: 'zh', label: '中文', flag: '🇨🇳' },
        { code: 'ru', label: 'RU', flag: '🇷🇺' },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setContentCount(prev => prev + Math.floor(Math.random() * 3) + 1);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const coreFeatures = [
        { icon: <Users className="w-6 h-6" />, titleKey: 'landing.feature1.title', descKey: 'landing.feature1.desc' },
        { icon: <Camera className="w-6 h-6" />, titleKey: 'landing.feature2.title', descKey: 'landing.feature2.desc' },
        { icon: <FileText className="w-6 h-6" />, titleKey: 'landing.feature3.title', descKey: 'landing.feature3.desc' },
        { icon: <Video className="w-6 h-6" />, titleKey: 'landing.feature4.title', descKey: 'landing.feature4.desc' }
    ];

    const agilityStats = [
        { val: "10x", labelKey: 'landing.agility.speed' },
        { val: "85%", labelKey: 'landing.agility.reduction' },
        { val: "24/7", labelKey: 'landing.agility.liveSystem' },
        { val: "0.0s", labelKey: 'landing.agility.latency' }
    ];

    return (
        <div className="bg-[#050911] text-slate-200 selection:bg-red-500/30 overflow-x-hidden font-pjs">

            {/* Header / Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-[#050911]/80 backdrop-blur-xl border-b border-white/5 px-4">
                <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20">
                            <Zap className="text-white w-5 h-5 fill-current" />
                        </div>
                        <span className="font-black text-xl tracking-tighter text-white">AFFIMATE <span className="text-red-500">SUPER APPS.</span></span>
                    </div>
                    <div className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-500">
                        <button onClick={() => scrollToSection('why')} className="hover:text-red-500 transition-colors">{t('landing.nav.vision')}</button>
                        <button onClick={() => scrollToSection('features')} className="hover:text-red-500 transition-colors">{t('landing.nav.toolkit')}</button>
                        <button onClick={() => scrollToSection('agility')} className="hover:text-red-500 transition-colors">{t('landing.nav.agility')}</button>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Language Switcher */}
                        <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/5">
                            {langOptions.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => setLanguage(lang.code)}
                                    className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${language === lang.code ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {lang.flag}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={loginWithGoogle}
                            className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-600/20 active:scale-95"
                        >
                            {t('landing.nav.login')}
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-32 pb-20">
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px]" />
                    <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[140px]" />
                </div>

                <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-widest"
                        >
                            <Rocket className="w-3.5 h-3.5 fill-current" />
                            {t('landing.hero.badge')}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tighter uppercase"
                        >
                            {t('landing.hero.title1')} <span className="text-white/40">{t('landing.hero.title2')}</span> <br />
                            {t('landing.hero.title3')} <br />
                            <span className="text-white">{t('landing.hero.title4')}</span> <br />
                            <span className="text-red-500 italic block mt-2">{t('landing.hero.title5')}</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl font-medium"
                        >
                            {t('landing.hero.desc')} <span className="text-white font-bold">{t('landing.hero.augmented')}</span> {t('landing.hero.desc2')}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap gap-4 pt-4"
                        >
                            <button
                                onClick={loginWithGoogle}
                                className="px-10 py-5 bg-red-600 hover:bg-red-500 text-white rounded-[24px] font-black text-lg transition-all shadow-2xl shadow-red-600/30 flex items-center gap-3 active:scale-95 group"
                            >
                                {t('landing.hero.cta')}
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column: Visual Mockup UI */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative z-10 bg-[#0f172a]/40 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-2xl overflow-hidden min-h-[480px]">
                            <div className="flex gap-2 mb-10">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-orange-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center">
                                        <TrendingUp className="w-8 h-8 text-red-500" />
                                    </div>
                                    <div className="flex-grow h-1.5 bg-white/5 rounded-full relative overflow-hidden">
                                        <div className="absolute left-0 top-0 h-full w-[75%] bg-gradient-to-r from-red-600 to-orange-500" />
                                        <div className="absolute left-[75%] top-[-3px] w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_#ef4444]" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{t('landing.hero.efficiency')}</div>
                                        <div className="text-xl font-black text-white">75% {t('landing.hero.inc')}</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                        <div className="flex-grow">
                                            <div className="text-white font-bold text-sm">{t('landing.hero.optimized')}</div>
                                            <div className="text-slate-500 text-xs mt-1">{t('landing.hero.readyNow')}</div>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                                        <div className="w-6 h-6 rounded bg-red-500/20 flex items-center justify-center">
                                            <MousePointer2 className="w-4 h-4 text-red-500 fill-current" />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="text-white font-bold text-sm">{t('landing.hero.autoDraft')}</div>
                                            <div className="text-slate-500 text-xs mt-1">{t('landing.hero.following')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-6 left-6 bg-red-600 p-6 rounded-3xl border border-white/20 shadow-2xl">
                                <div className="text-3xl font-black text-white flex items-center gap-2">
                                    {contentCount.toLocaleString()}
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                    </span>
                                </div>
                                <div className="text-[10px] text-white/70 font-black uppercase tracking-widest mt-1">{t('landing.hero.contentGen')}</div>
                            </div>

                            <div className="absolute top-10 right-6 bg-slate-900/90 p-4 rounded-2xl border border-white/10 shadow-2xl text-center">
                                <div className="text-xl font-black text-red-500">{t('landing.hero.live')}</div>
                                <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1">{t('landing.hero.trendSync')}</div>
                            </div>
                        </div>
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
                    </motion.div>
                </div>
            </section>

            {/* --- VISION SECTION --- */}
            <section id="why" className="py-32 px-4 bg-slate-900/20">
                <div className="max-w-[1400px] mx-auto text-center space-y-6">
                    <motion.div {...fadeIn}>
                        <span className="text-red-500 font-black uppercase tracking-[0.4em] text-[10px]">{t('landing.vision.label')}</span>
                        <h2 className="text-4xl md:text-6xl font-black text-white max-w-5xl mx-auto leading-tight uppercase tracking-tighter mt-4">
                            {t('landing.vision.title1')} <br />
                            {t('landing.vision.title2')} <span className="text-red-500">{t('landing.vision.title3')}</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium mt-6">
                            {t('landing.vision.desc')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- TOOLKIT SECTION --- */}
            <section id="features" className="py-32 px-4 relative">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-24 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">{t('landing.toolkit.title')} <span className="text-red-500">{t('landing.toolkit.title2')}</span></h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{t('landing.toolkit.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {coreFeatures.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="p-10 rounded-[40px] bg-white/2 border border-white/5 hover:bg-white/5 hover:border-red-500/30 transition-all group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-red-600/20 flex items-center justify-center text-red-500 mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-red-600/10">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">{t(item.titleKey)}</h3>
                                <p className="text-slate-500 leading-relaxed font-medium text-sm">{t(item.descKey)}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- AGILITY SECTION --- */}
            <section id="agility" className="py-24 px-4 overflow-hidden">
                <div className="max-w-[1400px] mx-auto bg-gradient-to-br from-red-600/90 to-orange-600/90 rounded-[60px] p-8 md:p-20 relative shadow-2xl shadow-red-600/20">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px] -mr-96 -mt-96" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-white">
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-6xl font-black leading-[0.9] uppercase tracking-tighter">
                                {t('landing.agility.title1')} <br /> {t('landing.agility.title2')} <br /> {t('landing.agility.title3')}
                            </h2>
                            <p className="text-white/80 text-lg font-medium leading-relaxed">
                                {t('landing.agility.desc')} <span className="text-white font-bold">{t('landing.agility.word')}</span> {t('landing.agility.desc2')}
                            </p>
                            <div className="flex items-center gap-6 pt-4">
                                <div className="flex -space-x-4 pl-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-2 border-red-600 bg-slate-800 overflow-hidden relative shadow-lg">
                                            <img src={`/avatars/av${i}.png`} alt="Creator Avatar" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-2 border-red-600 bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                                        5k+
                                    </div>
                                </div>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">{t('landing.agility.join')}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 font-pjs">
                            {agilityStats.map((stat, i) => (
                                <div key={i} className="bg-white/10 backdrop-blur-md p-8 rounded-[32px] border border-white/20 hover:scale-105 transition-transform cursor-default">
                                    <div className="text-4xl font-black mb-1">{stat.val}</div>
                                    <div className="text-[10px] text-white/60 font-black uppercase tracking-widest">{t(stat.labelKey)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="py-40 px-4 bg-gradient-to-b from-transparent to-red-600/5">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <motion.div {...fadeIn}>
                        <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">
                            {t('landing.cta.title1')} <br /> {t('landing.cta.title2')}
                        </h2>
                        <p className="text-slate-400 text-xl font-medium mt-8">
                            {t('landing.cta.desc')}
                        </p>
                        <div className="pt-12">
                            <button
                                onClick={loginWithGoogle}
                                className="bg-red-600 hover:bg-red-500 text-white px-14 py-7 rounded-[32px] font-black text-2xl transition-all shadow-[0_20px_50px_rgba(239,68,68,0.3)] hover:scale-105 active:scale-95 uppercase tracking-wider flex items-center gap-4 mx-auto"
                            >
                                {t('landing.cta.button')}
                                <ArrowRight className="w-8 h-8" />
                            </button>
                        </div>
                    </motion.div>

                    <div className="flex justify-center items-center gap-12 pt-12 grayscale opacity-40">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" className="h-6 invert" alt="QRIS" />
                        <span className="font-black text-xl text-white">AFFIMATE.</span>
                    </div>
                </div>
            </section>

            {/* --- FOMO POPUP --- */}
            <FomoPopup demo={true} />

            {/* --- FOOTER --- */}
            <footer className="py-8 border-t border-white/5 px-4 bg-[#050911]">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-widest uppercase text-slate-600">
                    <div className="flex items-center gap-3">
                        <span>&copy; 2026 Affimate</span>
                        <span className="w-1 h-1 bg-slate-800 rounded-full" />
                        <span>{t('landing.footer.powered')}</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-red-500 transition-colors">{t('landing.footer.privacy')}</a>
                        <a href="#" className="hover:text-red-500 transition-colors">{t('landing.footer.terms')}</a>
                    </div>
                </div>
            </footer>

        </div>
    );
}
