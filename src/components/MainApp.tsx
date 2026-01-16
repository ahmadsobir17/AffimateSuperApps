'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '@/lib/context';
import Header from '@/components/Header';
import CharacterPanel from '@/components/panels/CharacterPanel';
import ImagePanel from '@/components/panels/ImagePanel';
import ScriptPanel from '@/components/panels/ScriptPanel';
import VeoPanel from '@/components/panels/VeoPanel';
import TopUpModal from '@/components/TopUpModal';
import Footer from '@/components/Footer';

export default function MainApp() {
    const { currentPanel } = useApp();
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);

    const panelComponents = {
        character: CharacterPanel,
        image: ImagePanel,
        script: ScriptPanel,
        veo: VeoPanel,
    };

    const CurrentPanelComponent = panelComponents[currentPanel];

    return (
        <section className="min-h-screen flex flex-col relative">
            <Header onTopUp={() => setIsTopUpOpen(true)} />

            <main className="flex-grow max-w-7xl mx-auto w-full p-4 md:p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPanel}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <CurrentPanelComponent />
                    </motion.div>
                </AnimatePresence>
            </main>

            <Footer />

            <TopUpModal
                isOpen={isTopUpOpen}
                onClose={() => setIsTopUpOpen(false)}
            />
        </section>
    );
}
