'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, CheckCircle2, Apple } from 'lucide-react';

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (installed PWA)
    const isPwa = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isPwa) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(iosDevice);

    if (iosDevice) {
      // Show PWA install suggestion for iOS Safari if not installed
      const dismissed = localStorage.getItem('pwa_banner_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    }

    // Listen for Android / Chrome PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = localStorage.getItem('pwa_banner_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosModal(true);
      return;
    }

    if (!deferredPrompt) {
      alert('Untuk meng-install di Android, buka menu titik tiga di browser Anda dan pilih "Tambahkan ke Layar Utama" / "Install Aplikasi".');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
      setDeferredPrompt(null);
    }
  };

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (isStandalone || !showBanner) return null;

  return (
    <>
      {/* Floating PWA Install Banner */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-card/95 backdrop-blur-2xl border border-emerald-500/30 p-4 rounded-2xl shadow-2xl shadow-emerald-950/20 text-foreground flex items-center justify-between space-x-3 transition-all animate-in slide-in-from-bottom-5">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shrink-0 shadow-md">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              Install Smart MDM App
              {isIos ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-0.5">
                  <Apple className="w-3 h-3" /> iOS
                </span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/50 text-emerald-300 border border-emerald-700/50">
                  Android APK
                </span>
              )}
            </h4>
            <p className="text-[11px] text-muted-foreground truncate">
              Pasang di HP untuk akses realtime tanpa browser
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md hover:shadow-emerald-500/25 flex items-center space-x-1.5 active:scale-95 touch-target"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={dismissBanner}
            className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Installation Instruction Modal */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Apple className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">Cara Install di iPhone (iOS)</h3>
              </div>
              <button onClick={() => setShowIosModal(false)} className="p-1 rounded-lg hover:bg-accent">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Ikuti langkah mudah ini di browser **Safari** iPhone Anda untuk memasang Smart MDM sebagai aplikasi native:
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-3 p-3 rounded-2xl bg-accent/40 border border-border/50">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-foreground">Tekan Tombol Bagikan (Share)</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    Ketuk ikon <Share className="w-3.5 h-3.5 text-blue-400 inline" /> di bilah bawah browser Safari.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-2xl bg-accent/40 border border-border/50">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-foreground">Pilih "Tambahkan ke Layar Utama"</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Gulir ke bawah pada menu opsi lalu pilih **Add to Home Screen**.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-2xl bg-accent/40 border border-border/50">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-foreground">Tekan "Tambah" (Add)</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Ikon Smart MDM akan langsung muncul di layar utama iPhone Anda!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-lg"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}
