'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Users, DollarSign, Gift, ArrowRight, Link } from 'lucide-react';
import { useApp } from '@/lib/context';
import { useLanguage } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface AffiliateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AffiliateModal({ isOpen, onClose }: AffiliateModalProps) {
    const { user, showToast, referralCode, referralEarnings } = useApp();
    const { t } = useLanguage();
    const [redeemCode, setRedeemCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasRefInUrl, setHasRefInUrl] = useState(false);

    // Auto-detect ?ref=CODE from URL
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const refCode = params.get('ref');
            if (refCode) {
                setRedeemCode(refCode.toUpperCase());
                setHasRefInUrl(true);
            }
        }
    }, []);

    const handleCopy = () => {
        if (referralCode) {
            const link = `https://affimate.axiamasi.com/?ref=${referralCode}`;
            navigator.clipboard.writeText(link);
            showToast(t('affiliate.linkCopied'), 'success');
        }
    };

    const handleRedeem = async () => {
        if (!redeemCode) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase.rpc('redeem_referral_code', { p_code: redeemCode });

            if (error) throw error;

            if (data === 'SUCCESS') {
                showToast(t('affiliate.success'), 'success');
                setRedeemCode('');
            } else if (data === 'ALREADY_REFERRED') {
                showToast(t('affiliate.alreadyReferred'), 'error');
            } else if (data === 'INVALID_CODE') {
                showToast(t('affiliate.invalidCode'), 'error');
            } else if (data === 'SELF_REFERRAL') {
                showToast(t('affiliate.selfReferral'), 'error');
            }
        } catch (error) {
            showToast('Gagal redeem: ' + (error as Error).message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-2xl p-6 shadow-2xl overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{t('affiliate.title')}</h2>
                            <p className="text-xs text-slate-400">{t('affiliate.subtitle')}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Stats Card */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div className="text-xs text-slate-400 mb-1">{t('affiliate.earnings')}</div>
                                <div className="text-2xl font-bold text-green-400 flex items-center gap-1">
                                    <DollarSign className="w-5 h-5" />
                                    {referralEarnings.toFixed(2)}
                                </div>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div className="text-xs text-slate-400 mb-1">{t('affiliate.commission')}</div>
                                <div className="text-2xl font-bold text-white">10%</div>
                                <div className="text-[10px] text-green-400">{t('affiliate.lifetime')}</div>
                            </div>
                        </div>

                        {/* Your Link */}
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('affiliate.yourLink')}</label>
                            <div
                                onClick={handleCopy}
                                className="flex items-center justify-between bg-slate-900 border-2 border-dashed border-slate-700 rounded-xl p-4 cursor-pointer hover:border-green-500 group transition-all"
                            >
                                <code className="text-xs sm:text-sm font-bold text-white truncate max-w-[220px]">
                                    {referralCode ? `https://affimate.axiamasi.com/?ref=${referralCode}` : t('common.loading')}
                                </code>
                                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-green-500 group-hover:text-black transition-colors shrink-0">
                                    <Copy className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-500 text-center">
                                {t('affiliate.copyHint')}
                            </p>
                        </div>

                        <div className="w-full h-px bg-slate-800" />

                        {/* Redeem Code */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-yellow-500">
                                <Gift className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase">{t('affiliate.haveCode')}</span>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={redeemCode}
                                    onChange={(e) => setRedeemCode(e.target.value)}
                                    placeholder={t('affiliate.enterCode')}
                                    className="bg-slate-900 border-slate-700 focus:border-yellow-500 text-center uppercase font-bold tracking-widest"
                                />
                                <Button
                                    onClick={handleRedeem}
                                    isLoading={isLoading}
                                    className="px-4 bg-yellow-600 hover:bg-yellow-500 text-black font-bold"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
