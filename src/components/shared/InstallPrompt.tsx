import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isStandalone) return;

    // Check if dismissed previously this session
    if (sessionStorage.getItem('sandhya_install_dismissed')) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // On iOS Safari, show prompt if not in standalone mode
    if (isIosDevice && !isStandalone) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('sandhya_install_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto animate-slide-up">
      <div className="bg-gradient-to-r from-[#191815] to-[#262420] text-white p-4 rounded-2xl shadow-2xl border border-brand-saffron/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white p-0.5 shrink-0 overflow-hidden shadow">
            <img src="/arudhra_logo.png" alt="SANDHYĀ" className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-tight">Install SANDHYĀ App</h4>
            <p className="text-xs text-gray-300">
              {isIOS ? 'Tap Share ⎋ then "Add to Home Screen"' : 'Quick access from your home screen'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3 py-2 bg-brand-saffron hover:bg-brand-gold text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
          )}
          {isIOS && (
            <div className="text-brand-gold text-xs font-semibold px-2 py-1 bg-white/10 rounded-lg flex items-center gap-1">
              <Smartphone className="w-3 h-3" /> Add
            </div>
          )}
          <button
            onClick={handleDismiss}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
