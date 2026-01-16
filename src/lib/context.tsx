'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppState, PanelType, ToastMessage } from '@/types';
import { supabase } from './supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AppContextType extends AppState {
    setIsTrialMode: (value: boolean) => void;
    setTrialCount: (value: number) => void;
    setCurrentPanel: (panel: PanelType) => void;
    setActiveGender: (gender: 'Male' | 'Female') => void;
    setAffimateMassMode: (value: boolean) => void;
    userEmail: string;
    setUserEmail: (email: string) => void;
    toast: ToastMessage | null;
    showToast: (message: string, type: 'success' | 'error') => void;
    apiKey: string;
    setApiKey: (key: string) => void;
    balance: number;
    setBalance: (value: number) => void;
    deductBalance: (amount: number) => boolean;
    exchangeRate: number;
    user: SupabaseUser | null;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [isTrialMode, setIsTrialMode] = useState(false);
    const [trialCount, setTrialCount] = useState(0);
    const [currentPanel, setCurrentPanel] = useState<PanelType>('character');
    const [activeGender, setActiveGender] = useState<'Male' | 'Female'>('Male');
    const [affimateMassMode, setAffimateMassMode] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [toast, setToast] = useState<ToastMessage | null>(null);
    const [apiKey, setApiKey] = useState('');
    const [balance, setBalance] = useState(10); // Start with $10.00
    const [exchangeRate, setExchangeRate] = useState(16000); // Default fallback
    const [user, setUser] = useState<SupabaseUser | null>(null);

    // Fetch Real-time Exchange Rate (Every 5 minutes)
    useEffect(() => {
        const fetchRate = async () => {
            try {
                // Frankfurter is very clean and reliable
                const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=IDR');
                const data = await res.json();
                if (data?.rates?.IDR) {
                    setExchangeRate(data.rates.IDR);
                    console.log(`[FX] Kurs Terupdate: Rp ${data.rates.IDR.toLocaleString('id-ID')} @ ${new Date().toLocaleTimeString()}`);
                }
            } catch (error) {
                // Fallback to er-api if Frankfurter fails
                try {
                    const res = await fetch('https://open.er-api.com/v6/latest/USD');
                    const data = await res.json();
                    if (data?.rates?.IDR) {
                        setExchangeRate(data.rates.IDR);
                    }
                } catch (e) {
                    console.error('Semua API Kurs Gagal:', e);
                }
            }
        };

        fetchRate();
        const interval = setInterval(fetchRate, 5 * 60 * 1000); // Update setiap 5 menit
        return () => clearInterval(interval);
    }, []);

    // Initial Auth Sync
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
                setUserEmail(session.user.email || '');
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser(session.user);
                setUserEmail(session.user.email || '');
            } else {
                setUser(null);
                setUserEmail('');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) showToast('Gagal login: ' + error.message, 'error');
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            showToast('Gagal logout: ' + error.message, 'error');
        } else {
            showToast('Berhasil logout', 'success');
            // Hard refresh to clear all states
            window.location.reload();
        }
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        const id = Date.now().toString();
        setToast({ id, message, type });

        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const deductBalance = (amount: number): boolean => {
        if (balance >= amount) {
            setBalance(prev => prev - amount);
            return true;
        }
        showToast('Saldo tidak cukup! Silakan top-up.', 'error');
        return false;
    };

    return (
        <AppContext.Provider
            value={{
                isTrialMode,
                trialCount,
                currentPanel,
                activeGender,
                affimateMassMode,
                setIsTrialMode,
                setTrialCount,
                setCurrentPanel,
                setActiveGender,
                setAffimateMassMode,
                userEmail,
                setUserEmail,
                toast,
                showToast,
                apiKey,
                setApiKey,
                balance,
                setBalance,
                deductBalance,
                exchangeRate,
                user,
                loginWithGoogle,
                logout,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
