import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { DesktopInstallModal } from './DesktopInstallModal';
import { Monitor, Download, CheckCircle2 } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, install, deferredPrompt } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If already running as installed standalone app on Desktop or mobile
  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-2xs font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>ડેસ્કટોપ એપ સક્રિય</span>
      </div>
    );
  }

  const handleClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-950 bg-gradient-to-r from-amber-200 to-amber-300 hover:from-amber-300 hover:to-amber-400 border border-amber-300/80 rounded-xl shadow-xs transition-all transform active:scale-95 cursor-pointer"
        title="ડેસ્કટોપ અથવા કમ્પ્યુટર પર શોર્ટકટ સેવ કરો"
      >
        <Monitor className="w-3.5 h-3.5 text-sky-900" />
        <span>🖥️ ડેસ્કટોપ પર સેવ કરો</span>
        <Download className="w-3 h-3 text-sky-900 opacity-70" />
      </button>

      <DesktopInstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTriggerInstall={install}
        hasPrompt={isInstallable}
      />
    </>
  );
};
