import React, { useState } from 'react';
import { SchoolInfo } from '../types/attendance';
import { Settings, Save, Check } from 'lucide-react';

interface SchoolSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolInfo: SchoolInfo;
  onSaveSchoolInfo: (info: SchoolInfo) => void;
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({
  isOpen,
  onClose,
  schoolInfo,
  onSaveSchoolInfo,
}) => {
  const [formData, setFormData] = useState<SchoolInfo>(schoolInfo);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleChange = (key: keyof SchoolInfo, val: string) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSchoolInfo(formData);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-700" />
            <h3 className="text-sm font-bold text-slate-900">
              શાળા અને વર્ગ વિગત સેટિંગ્સ
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-2xs font-semibold text-slate-700 mb-1">
              શાળાનું નામ (ગુજરાતી)
            </label>
            <input
              type="text"
              value={formData.schoolNameGu}
              onChange={(e) => handleChange('schoolNameGu', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-semibold text-slate-700 mb-1">
                યુ-ડાયસ (UDISE) કોડ
              </label>
              <input
                type="text"
                value={formData.udiseCode}
                onChange={(e) => handleChange('udiseCode', e.target.value)}
                placeholder="24170307402"
                className="w-full px-3 py-2 font-mono font-bold text-sky-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
            <div>
              <label className="block text-2xs font-semibold text-slate-700 mb-1">
                શૈક્ષણિક વર્ષ
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => handleChange('academicYear', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-semibold text-slate-700 mb-1">
                ધોરણ
              </label>
              <input
                type="text"
                value={formData.standard}
                onChange={(e) => handleChange('standard', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
            <div>
              <label className="block text-2xs font-semibold text-slate-700 mb-1">
                વર્ગ / તૂક
              </label>
              <input
                type="text"
                value={formData.division}
                onChange={(e) => handleChange('division', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-semibold text-slate-700 mb-1">
                તાલુકો (Ta)
              </label>
              <input
                type="text"
                value={formData.taluka}
                onChange={(e) => handleChange('taluka', e.target.value)}
                placeholder="હાલોલ"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-2xs font-semibold text-slate-700 mb-1">
                જિલ્લો (Di)
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => handleChange('district', e.target.value)}
                placeholder="પંચમહાલ"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-2xs font-semibold text-slate-700 mb-1">
              સી.આર.સી. કેન્દ્ર (CRC)
            </label>
            <input
              type="text"
              value={formData.clusterCRC}
              onChange={(e) => handleChange('clusterCRC', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-semibold text-slate-700 mb-1">
                વર્ગ શિક્ષકનું નામ
              </label>
              <input
                type="text"
                value={formData.classTeacher}
                onChange={(e) => handleChange('classTeacher', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-2xs font-semibold text-slate-700 mb-1">
                મુખ્ય શિક્ષક / આચાર્યનું નામ
              </label>
              <input
                type="text"
                value={formData.principal}
                onChange={(e) => handleChange('principal', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg cursor-pointer"
            >
              રદ કરો
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>સાચવ્યું!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>સાચવો</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
