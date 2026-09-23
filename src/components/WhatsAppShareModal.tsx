import React, { useState } from 'react';
import { Student, DayAttendanceRecord, SchoolInfo } from '../types/attendance';
import { formatDateGujarati, getDayOfWeekGujarati } from '../utils/storage';
import { Copy, Check, Share2, MessageCircle } from 'lucide-react';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  currentAttendance: DayAttendanceRecord;
  selectedDate: string;
  schoolInfo: SchoolInfo;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  students,
  currentAttendance,
  selectedDate,
  schoolInfo,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const total = students.length; // 21
  const boys = students.filter((s) => s.gender === 'boy'); // 9
  const girls = students.filter((s) => s.gender === 'girl'); // 12

  let present = 0;
  let absent = 0;
  let boysPresent = 0;
  let girlsPresent = 0;
  const absentRolls: number[] = [];

  students.forEach((s) => {
    const status = currentAttendance[s.id]?.status;
    if (status === 'P') {
      present++;
      if (s.gender === 'boy') boysPresent++;
      else girlsPresent++;
    } else {
      absent++;
      absentRolls.push(s.rollNo);
    }
  });

  const pct = total > 0 ? ((present / total) * 100).toFixed(1) : '0';
  const dayName = getDayOfWeekGujarati(selectedDate);
  const dateFormatted = formatDateGujarati(selectedDate);

  const messageText = `*🏫 ${schoolInfo.schoolNameGu}*
🔢 *યુ-ડાયસ (UDISE) કોડ:* ${schoolInfo.udiseCode}
📍 *તાલુકો:* ${schoolInfo.taluka} | *જિલ્લો:* ${schoolInfo.district}
*📚 ધોરણ: ૭ (${schoolInfo.division}) - દૈનિક હાજરી અહેવાલ*
📅 તારીખ: ${dateFormatted} (${dayName})
-----------------------------------------
👥 *કુલ વિદ્યાર્થી:* ${total}
   👦 કુમાર: ${boys.length}  |  👧 કન્યા: ${girls.length}

✅ *હાજર સંખ્યા:* ${present} (${pct}%)
   👦 કુમાર હાજર: ${boysPresent} / ${boys.length}
   👧 કન્યા હાજર: ${girlsPresent} / ${girls.length}

❌ *ગેરહાજર સંખ્યા:* ${absent}
   રોલ નંબર: ${absentRolls.length > 0 ? absentRolls.join(', ') : 'કોઈ નહીં (૧૦૦% હાજરી)'}

🍲 *MDM (પી.એમ. પોષણ) સંખ્યા:* ${present}
-----------------------------------------
✍️ વર્ગ શિક્ષક: ${schoolInfo.classTeacher}
📍 સી.આર.સી.: ${schoolInfo.clusterCRC} | તા: ${schoolInfo.taluka} | જિ: ${schoolInfo.district}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const encoded = encodeURIComponent(messageText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              વોટ્સએપ હાજરી મેસેજ (CRC ગ્રૂપ માટે)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-2xs text-slate-500 mb-3">
          આ મેસેજ તમારા સી.આર.સી. અથવા શાળાના WhatsApp ગ્રૂપમાં સહેલાઈથી મોકલી શકાય છે:
        </p>

        {/* Message preview */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed shadow-inner">
          {messageText}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg cursor-pointer"
          >
            બંધ કરો
          </button>

          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'કૉપી થઈ ગયું!' : 'કૉપી કરો'}</span>
          </button>

          <button
            onClick={shareViaWhatsApp}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp પર મોકલો</span>
          </button>
        </div>
      </div>
    </div>
  );
};
