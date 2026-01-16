'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Wallet, Zap, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import GlassPanel from '@/components/ui/GlassPanel';

export default function PaymentSuccessPage() {
    const router = useRouter();

    const [mounted, setMounted] = (require('react').useState)(false);
    (require('react').useEffect)(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-[#050911] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glare */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg"
            >
                <GlassPanel className="p-8 md:p-12 text-center border-white/10 relative overflow-hidden">
                    {/* Success Icon Animation */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.2
                        }}
                        className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative"
                    >
                        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                        <CheckCircle className="w-12 h-12 text-green-500 relative z-10" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h1 className="text-3xl font-black text-white mb-4">
                            Pembayaran <span className="text-green-500">Berhasil!</span>
                        </h1>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Terima kasih bro! Kredit Affimate kamu akan segera bertambah secara otomatis. Silakan kembali ke aplikasi untuk melanjutkan kreasi konten viralmu.
                        </p>
                    </motion.div>

                    {/* Order Details Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-10 space-y-3"
                    >
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Status Transaksi</span>
                            <span className="text-green-400 font-bold px-2 py-0.5 bg-green-400/10 rounded-full text-[10px] uppercase tracking-widest">
                                Completed
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Platform</span>
                            <span className="text-white font-medium flex items-center gap-2">
                                <Zap className="w-3 h-3 text-red-500" />
                                Affimate Super App
                            </span>
                        </div>
                    </motion.div>

                    <div className="space-y-4">
                        <Button
                            onClick={() => router.push('/')}
                            className="w-full py-4 shadow-xl shadow-red-500/10"
                            variant="primary"
                            icon={<ArrowRight className="w-4 h-4" />}
                        >
                            Kembali ke Dashboard
                        </Button>

                        <p className="text-[10px] text-slate-600 font-medium uppercase tracking-[0.2em]">
                            Automated System • Secure Transaction
                        </p>
                    </div>

                    {/* Floating Particles for Premium Look */}
                    {mounted && [...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -20, 0],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 3 + i,
                                repeat: Infinity,
                                delay: i * 0.5,
                            }}
                            className="absolute w-1 h-1 bg-white/20 rounded-full"
                            style={{
                                top: `${(i * 17) % 100}%`, // Deterministic but looks random
                                left: `${(i * 23) % 100}%`,
                            }}
                        />
                    ))}
                </GlassPanel>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 flex justify-center gap-6 grayscale opacity-30"
                >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" alt="QRIS" className="h-4 brightness-0 invert" />
                </motion.div>
            </motion.div>
        </div>
    );
}
