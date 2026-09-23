import React from 'react';
import { Monitor, X, CheckCircle, ExternalLink, Download, Smartphone, Chrome } from 'lucide-react';

interface DesktopInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerInstall?: () => Promise<boolean>;
  hasPrompt: boolean;
}

export const DesktopInstallModal: React.FC<DesktopInstallModalProps> = ({
  isOpen,
  onClose,
  onTriggerInstall,
  hasPrompt,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 shadow-xs">
              <Monitor className="w-6 h-6 text-sky-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                ડેસ્કટોપ / લેપટોપ પર સેવ કરો
              </h3>
              <p className="text-xs text-slate-500">
                નાની ઉમરવાણ પ્રાથમિક શાળા - ધોરણ ૭ હાજરી સોફ્ટવેર
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Install Button if supported by current browser context */}
        {hasPrompt && onTriggerInstall && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>૧-ક્લિક ઇન્સ્ટોલ ઉપલબ્ધ છે</span>
                </h4>
                <p className="text-2xs text-emerald-800 mt-0.5">
                  નીચેના બટન પર ક્લિક કરીને સીધું ડેસ્કટોપ પર આઇકન બનાવી લો.
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const res = await onTriggerInstall();
                  if (res) onClose();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>ઇન્સ્ટોલ કરો</span>
              </button>
            </div>
          </div>
        )}

        {/* Detailed Desktop Guide */}
        <div className="mt-4 space-y-3.5">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Chrome className="w-4 h-4 text-sky-600" />
            <span>કોમ્પ્યુટર / લેપટોપ (Chrome / Edge) માં ડેસ્કટોપ આઇકન બનાવવાની સરળ રીતો:</span>
          </div>

          {/* Step 1 */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              ૧
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">
                એડ્રેસ બાર (URL Bar) માંથી ઇન્સ્ટોલ
              </h5>
              <p className="text-2xs text-slate-600 mt-1 leading-relaxed">
                ક્રોમ બ્રાઉઝરમાં સૌથી ઉપર જ્યા વેબસાઇટનું સરનામું (URL) લખેલું હોય છે, તેની જમણી બાજુ 💻 <strong>"Install app"</strong> અથવા ⊕ આઇકન દેખાશે. તેના પર ક્લિક કરીને <strong>"Install"</strong> આપો.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              ૨
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">
                ક્રોમ મેનુ (⋮) માંથી શોર્ટકટ બનાવો
              </h5>
              <p className="text-2xs text-slate-600 mt-1 leading-relaxed">
                ક્રોમ બ્રાઉઝરના ઉપર જમણા ખૂણે <strong>૩ ટપકાં (⋮ Menu)</strong> પર ક્લિક કરો ➜ <strong>"Save and share" (અથવા "Cast, save, and share")</strong> ➜ <strong>"Install as app..."</strong> અથવા <strong>"Create shortcut..."</strong> પસંદ કરો. તેમાં <strong>"Open as window"</strong> પર ખરું કરો.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              ૩
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">
                ડેસ્કટોપ પર સોફ્ટવેરની જેમ ખૂલશે!
              </h5>
              <p className="text-2xs text-slate-600 mt-1 leading-relaxed">
                ડેસ્કટોપ પર <strong>"હાજરી પત્રક"</strong> નો આઇકન આવી જશે. તેના પર ડબલ ક્લિક કરતાં જ કોઈપણ બ્રાઉઝર બાર વગર સીધું ફૂલ-સ્ક્રીન સોફ્ટવેરની જેમ ખૂલશે.
              </p>
            </div>
          </div>

          {/* Mobile Info */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-2xs text-amber-900">
            <Smartphone className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>મોબાઇલમાં પણ સેવ થશે:</strong> ક્રોમમાં ૩ ટપકાં (⋮) દબાવીને <strong>"Add to Home screen" (હોમ સ્ક્રીન પર ઉમેરો)</strong> કરો, જેથી મોબાઇલ એપ બની જશે.
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => window.open(window.location.href, '_blank')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="નવા ટેબમાં ખોલો જેથી ક્રોમનું ઇન્સ્ટોલ આઇકન સીધું દેખાય"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>નવા ટેબમાં ખોલો</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            સમજાઈ ગયું (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
