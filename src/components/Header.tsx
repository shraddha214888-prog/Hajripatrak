import React from 'react';
import { SchoolInfo } from '../types/attendance';
import { Volume2, VolumeX, Settings, Calendar, Share2, Printer } from 'lucide-react';
import emblemImg from '../assets/images/school_emblem_primary_1790144151550.jpg';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentView: 'photo' | 'register' | 'students' | 'analytics';
  onViewChange: (view: 'photo' | 'register' | 'students' | 'analytics') => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenShare: () => void;
  onPrint: () => void;
  schoolInfo: SchoolInfo;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  selectedDate,
  onDateChange,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onOpenShare,
  onPrint,
  schoolInfo,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Zone 1: Single text element wordmark with School Crest */}
          <div className="flex items-center gap-2.5 min-w-0">
            <img 
              src={emblemImg} 
              alt="શાળા લોગો" 
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0 shadow-xs"
            />
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                {schoolInfo.schoolNameGu}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate flex-wrap">
                <span className="font-semibold text-sky-700">ધોરણ: {schoolInfo.standard}</span>
                <span aria-hidden="true">·</span>
                <span>વર્ગ: {schoolInfo.division}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-2xs bg-sky-50 text-sky-800 px-1.5 py-0.2 rounded border border-sky-200 font-semibold" title="યુ-ડાયસ કોડ">
                  UDISE: {schoolInfo.udiseCode}
                </span>
                <span aria-hidden="true" className="hidden sm:inline">·</span>
                <span className="text-2xs text-slate-500 hidden sm:inline">
                  તા. {schoolInfo.taluka}, જિ. {schoolInfo.district}
                </span>
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => onViewChange('photo')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                currentView === 'photo'
                  ? 'bg-white text-sky-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📷 ફોટો હાજરી (Auto Tap)
            </button>
            <button
              onClick={() => onViewChange('register')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                currentView === 'register'
                  ? 'bg-white text-sky-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📋 માસિક હાજરી પત્રક
            </button>
            <button
              onClick={() => onViewChange('students')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                currentView === 'students'
                  ? 'bg-white text-sky-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👥 વિદ્યાર્થીઓ (૨૧)
            </button>
            <button
              onClick={() => onViewChange('analytics')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                currentView === 'analytics'
                  ? 'bg-white text-sky-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 રિપોર્ટ & MDM
            </button>
          </nav>

          {/* Zone 3: Actions & Date Quick Selector */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop / PWA Install Button */}
            <PWAInstallButton />

            {/* Date Input with icon */}
            <div className="relative flex items-center bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs hover:border-slate-400 focus-within:ring-2 focus-within:ring-sky-500">
              <Calendar className="w-3.5 h-3.5 text-slate-500 mr-1.5 shrink-0" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer text-xs"
                title="હાજરી તારીખ પસંદ કરો"
              />
            </div>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'અવાજ ચાલુ છે (ક્લિક કરો બંધ કરવા)' : 'અવાજ બંધ છે (ક્લિક કરો ચાલુ કરવા)'}
              className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                soundEnabled 
                  ? 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100' 
                  : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Share WhatsApp report */}
            <button
              onClick={onOpenShare}
              title="વોટ્સએપ હાજરી મેસેજ"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Print Register */}
            <button
              onClick={onPrint}
              title="હાજરી પત્રક પ્રિન્ટ કરો"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              title="શાળા વિગત સેટિંગ્સ"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar for small screens */}
        <div className="flex md:hidden items-center justify-between gap-1 pt-2 border-t border-slate-100 mt-2">
          <button
            onClick={() => onViewChange('photo')}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg ${
              currentView === 'photo' ? 'bg-sky-700 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            📷 ફોટો હાજરી
          </button>
          <button
            onClick={() => onViewChange('register')}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg ${
              currentView === 'register' ? 'bg-sky-700 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            📋 પત્રક
          </button>
          <button
            onClick={() => onViewChange('students')}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg ${
              currentView === 'students' ? 'bg-sky-700 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            👥 ૨૧ વિદ્યાર્થી
          </button>
          <button
            onClick={() => onViewChange('analytics')}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg ${
              currentView === 'analytics' ? 'bg-sky-700 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            📊 રિપોર્ટ
          </button>
        </div>
      </div>
    </header>
  );
};
