import React from 'react';
import { Student } from '../types/attendance';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  student,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
        
        {/* Header icon & close button */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Trash2 className="w-6 h-6 text-rose-600" />
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-3">
          <h3 className="text-base font-bold text-slate-900">
            વિદ્યાર્થી ડિલીટ કરવાની પુષ્ટિ
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            શું તમે ખરેખર નીચે દર્શાવેલ વિદ્યાર્થીને યાદીમાંથી કાઢી નાખવા માંગો છો?
          </p>

          {/* Student mini card */}
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
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer text-center"
          >
            ના, રદ કરો
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
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
};
