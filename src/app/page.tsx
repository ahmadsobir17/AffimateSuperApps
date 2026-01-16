'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from '@/lib/context';
import LoginPage from '@/components/LoginPage';
import MainApp from '@/components/MainApp';
import Toast from '@/components/ui/Toast';
import FomoPopup from '@/components/FomoPopup';

function Content() {
  const { user } = useApp();

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LoginPage onLogin={() => { }} />
        </motion.div>
      ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <MainApp />
          <FomoPopup />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <Toast />
      <Content />
    </AppProvider>
  );
}
