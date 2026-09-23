import React, { useState, useRef } from 'react';
import { Student } from '../types/attendance';
import { Upload, Check, Trash2, AlertTriangle, X } from 'lucide-react';

interface SingleStudentModalProps {
  student: Student | null;
  onClose: () => void;
  onSave: (updated: Student) => void;
  onDelete?: (studentId: string) => void;
}

export const SingleStudentModal: React.FC<SingleStudentModalProps> = ({
  student,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!student) return null;

  const [nameGu, setNameGu] = useState(student.nameGu);
  const [nameEn, setNameEn] = useState(student.nameEn);
  const [grNo, setGrNo] = useState(student.grNo);
  const [fatherNameGu, setFatherNameGu] = useState(student.fatherNameGu || '');
  const [phone, setPhone] = useState(student.phone || '');
  const [avatar, setAvatar] = useState(student.avatar);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...student,
      nameGu: nameGu.trim(),
      nameEn: nameEn.trim(),
      grNo: grNo.trim(),
      fatherNameGu: fatherNameGu.trim(),
      phone: phone.trim(),
      avatar: avatar,
    });
    onClose();
  };

  // In-App Deletion confirmation view
  if (showDeleteConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
        <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
            <Trash2 className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold text-slate-900">
            વિદ્યાર્થી ડિલીટ કરવાની પુષ્ટિ
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            શું તમે ખરેખર નીચેના વિદ્યાર્થીને યાદીમાંથી કાઢી નાખવા માંગો છો?
          </p>

          <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
              <img
                src={student.avatar}
                alt={student.nameGu}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-2xs font-bold bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                  #{student.rollNo}
                </span>
                <span className={`text-2xs font-semibold ${student.gender === 'boy' ? 'text-sky-700' : 'text-rose-700'}`}>
                  {student.gender === 'boy' ? 'કુમાર' : 'કન્યા'}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                {student.nameGu}
              </h4>
              <p className="text-3xs text-slate-500 truncate font-mono">
                GR: {student.grNo}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-amber-900 text-2xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              આ વિદ્યાર્થીની તમામ તારીખોની હાજરીનો રેકોર્ડ પણ હટાવી દેવામાં આવશે.
            </span>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer text-center"
            >
              ના, રદ કરો
            </button>
            <button
              type="button"
              onClick={() => {
                if (onDelete) {
                  onDelete(student.id);
                }
                onClose();
              }}
              className="flex-1 py-2 px-3 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>હા, કાઢી નાખો</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              વિદ્યાર્થી વિગત & ફોટો બદલો
            </h3>
            <p className="text-2xs text-slate-500">
              રોલ નંબર #{student.rollNo} · {student.gender === 'boy' ? 'કુમાર' : 'કન્યા'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Photo upload */}
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-300 shrink-0">
              <img
                src={avatar}
                alt="preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-100 hover:bg-sky-200 rounded-lg transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>નવો ફોટો અપલોડ</span>
              </button>
              <p className="text-3xs text-slate-500 mt-1">
                ગેલેરીમાંથી વિદ્યાર્થીનો સાચો ફોટો પસંદ કરો
              </p>
            </div>
          </div>

          <div>
            <label className="block text-2xs font-semibold text-slate-700 mb-0.5">
              વિદ્યાર્થીનું નામ (ગુજરાતી)
            </label>
            <input
              type="text"
              value={nameGu}
              onChange={(e) => setNameGu(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-2xs font-semibold text-slate-700 mb-0.5">
              પિતાનું નામ
            </label>
            <input
              type="text"
              value={fatherNameGu}
              onChange={(e) => setFatherNameGu(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="પિતાનું નામ"
            />
          </div>

          <div>
            <label className="block text-2xs font-semibold text-slate-700 mb-0.5">
              વિદ્યાર્થીનું નામ (English)
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-2xs font-semibold text-slate-700 mb-0.5">
                GR નંબર
              </label>
              <input
                type="text"
                value={grNo}
                onChange={(e) => setGrNo(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-2xs font-semibold text-slate-700 mb-0.5">
                મોબાઇલ
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            {onDelete ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors text-xs font-semibold flex items-center gap-1"
                title="વિદ્યાર્થી ડિલીટ કરો"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>કાઢી નાખો</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg cursor-pointer"
              >
                રદ કરો
              </button>
              <button
                type="submit"
                className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>સાચવો</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
