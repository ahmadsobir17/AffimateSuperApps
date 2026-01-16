'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Wallet, ArrowRight, Zap, CheckCircle2, QrCode, CreditCard, Sparkles } from 'lucide-react';
import { useApp } from '@/lib/context';
import GlassPanel from './ui/GlassPanel';
import Button from './ui/Button';
import { Input } from './ui/Input';
import CryptoJS from 'crypto-js';

interface TopUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TOP_UP_PACKAGES = [
    { idr: 50000, credits: 3, label: 'Starter Pack', icon: '🌱' },
    { idr: 100000, credits: 7, label: 'Creator Pack', icon: '🔥', popular: true },
    { idr: 250000, credits: 20, label: 'Pro Pack', icon: '🚀' },
    { idr: 500000, credits: 50, label: 'Agency Pack', icon: '👑' },
];

export default function TopUpModal({ isOpen, onClose }: TopUpModalProps) {
    const { userEmail, showToast, exchangeRate } = useApp();
    const [selectedPackage, setSelectedPackage] = useState<typeof TOP_UP_PACKAGES[0] | null>(null);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<'VC' | 'SP'>('SP'); // VC: Card, SP: QRIS (ShopeePay)
    const [isLoading, setIsLoading] = useState(false);

    // Final calculations
    // If custom amount is entered, we assume 1 Credit = Rp 15,000 (slightly more expensive than packages)
    const activeIdrAmount = selectedPackage ? selectedPackage.idr : (parseInt(customAmount.replace(/\D/g, '')) || 0);
    const activeCredits = selectedPackage ? selectedPackage.credits : Math.floor(activeIdrAmount / 15000);

    const handleDuitkuCheckout = async () => {
        if (activeIdrAmount < 10000) {
            showToast('Minimal top up Rp 10.000', 'error');
            return;
        }

        setIsLoading(true);

        try {
            const payload = {
                paymentAmount: activeIdrAmount,
                paymentMethod,
                productDetails: `Top Up ${activeCredits} Credits`,
                email: userEmail || 'guest@affimate.com',
                customerVaName: userEmail?.split('@')[0] || 'Affimate User'
            };

            const response = await fetch('/api/duitku/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log('Checkout Response:', data);

            if (data?.paymentUrl) {
                showToast('Mengarahkan ke halaman pembayaran...', 'success');
                window.location.href = data.paymentUrl;
            } else {
                const errorMsg = data.statusMessage || 'Gagal membuat transaksi';
                console.error('Duitku Error:', data);
                throw new Error(errorMsg);
            }
        } catch (error) {
            console.error('Payment Error:', error);
            showToast('Gagal memproses pembayaran. Silakan coba lagi.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-3xl relative"
                    >
                        <GlassPanel className="p-6 md:p-10 border border-white/10 overflow-hidden relative max-h-[90vh] overflow-y-auto">
                            {/* Abstract Decor */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -z-10" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -z-10" />

                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                                        <Wallet className="w-8 h-8 text-red-500" />
                                        Isi Ulang Kredit
                                    </h2>
                                    <p className="text-slate-400 mt-2">Pilih paket atau masukkan jumlah custom yang kamu mau.</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Left Side: Package & Custom */}
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="grid grid-cols-2 gap-3">
                                        {TOP_UP_PACKAGES.map((pkg) => (
                                            <motion.div
                                                key={pkg.idr}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    setSelectedPackage(pkg);
                                                    setCustomAmount('');
                                                }}
                                                className={`relative p-4 rounded-xl cursor-pointer transition-all border ${selectedPackage?.idr === pkg.idr && !customAmount
                                                    ? 'bg-red-500/10 border-red-500 shadow-lg shadow-red-500/10'
                                                    : 'bg-slate-900/50 border-white/5 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xl">{pkg.icon}</span>
                                                    <h3 className="font-bold text-white text-sm">{pkg.label}</h3>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                                                        {pkg.credits} Credits
                                                    </p>
                                                    <div className="text-red-500 font-black mt-1">
                                                        Rp {(pkg.idr / 1000).toLocaleString('id-ID')}rb
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="relative">
                                        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            <Sparkles className="w-3 h-3 text-yellow-500" />
                                            <span>Atau Masukkan Custom Amount</span>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                                                <DollarSign className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                value={customAmount}
                                                onChange={(e) => {
                                                    // Allow only numbers
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    setCustomAmount(Number(val).toLocaleString('id-ID'));
                                                    setSelectedPackage(null);
                                                }}
                                                placeholder="Contoh: 50.000"
                                                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white font-bold focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all placeholder:text-slate-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Method & Review */}
                                <div className="lg:col-span-5 space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Metode Pembayaran</label>
                                        <div className="space-y-2">
                                            <div
                                                onClick={() => setPaymentMethod('SP')}
                                                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer border transition-all ${paymentMethod === 'SP' ? 'bg-red-500/10 border-red-500' : 'bg-slate-900/50 border-white/5 hover:border-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                                        <QrCode className="w-5 h-5 text-red-500" />
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-bold text-white block">QRIS</span>
                                                        <span className="text-[10px] text-slate-500">Scan via Dana, OVO, ShopeePay...</span>
                                                    </div>
                                                </div>
                                                {paymentMethod === 'SP' && <CheckCircle2 className="w-5 h-5 text-red-500" />}
                                            </div>

                                            <div
                                                onClick={() => setPaymentMethod('VC')}
                                                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer border transition-all ${paymentMethod === 'VC' ? 'bg-red-500/10 border-red-500' : 'bg-slate-900/50 border-white/5 hover:border-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                                        <CreditCard className="w-5 h-5 text-red-500" />
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-bold text-white block">Kartu Kredit</span>
                                                        <span className="text-[10px] text-slate-500">Visa, Mastercard, JCB...</span>
                                                    </div>
                                                </div>
                                                {paymentMethod === 'VC' && <CheckCircle2 className="w-5 h-5 text-red-500" />}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900/80 rounded-2xl p-6 border border-white/5 space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-500">Estimasi Kredit</span>
                                                <span className="text-white font-bold">{activeCredits} Credits</span>
                                            </div>
                                            <div className="h-px bg-white/5 my-2" />
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-400 font-bold">Total Pembayaran</span>
                                                <span className="text-red-500 font-black text-2xl">
                                                    Rp {activeIdrAmount.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleDuitkuCheckout}
                                            isLoading={isLoading}
                                            className="w-full py-5 text-lg shadow-2xl"
                                            variant="primary"
                                            icon={<ArrowRight className="w-5 h-5" />}
                                            disabled={activeIdrAmount < 10000}
                                        >
                                            Bayar Sekarang
                                        </Button>

                                        <div className="flex items-center justify-center pt-2">
                                            <div className="flex gap-2 items-center">
                                                <span className="text-[10px] text-slate-500 font-bold mr-2 uppercase tracking-widest">Supported by</span>
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" alt="QRIS" className="h-4 brightness-0 invert opacity-50" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
