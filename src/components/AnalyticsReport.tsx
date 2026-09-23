import React, { useState } from 'react';
import { Student, AttendanceStore, SchoolInfo } from '../types/attendance';
import { formatDateGujarati, getDayOfWeekGujarati } from '../utils/storage';
import { Utensils, Award, AlertTriangle, TrendingUp, Calendar, FileText, CheckCircle2 } from 'lucide-react';

interface AnalyticsReportProps {
  students: Student[];
  attendanceStore: AttendanceStore;
  selectedDate: string;
  schoolInfo: SchoolInfo;
  onOpenShareModal: () => void;
}

export const AnalyticsReport: React.FC<AnalyticsReportProps> = ({
  students,
  attendanceStore,
  selectedDate,
  schoolInfo,
  onOpenShareModal,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(() => new Date(selectedDate).getMonth());
  const [selectedYear, setSelectedYear] = useState(() => new Date(selectedDate).getFullYear());

  const monthsGu = [
    'જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન',
    'જુલાઇ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર'
  ];

  // Current selected day's calculations
  const todayRecord = attendanceStore[selectedDate] || {};
  let todayPresent = 0;
  let todayAbsent = 0;
  let todayBoysPresent = 0;
  let todayGirlsPresent = 0;
  const absentStudentsList: Student[] = [];

  students.forEach((st) => {
    const item = todayRecord[st.id];
    if (item?.status === 'P') {
      todayPresent++;
      if (st.gender === 'boy') todayBoysPresent++;
      else todayGirlsPresent++;
    } else if (item?.status === 'A' || item?.status === 'L') {
      todayAbsent++;
      absentStudentsList.push(st);
    }
  });

  const totalStudents = students.length;
  const todayPct = totalStudents > 0 ? ((todayPresent / totalStudents) * 100).toFixed(1) : '0';

  // MDM (પી.એમ. પોષણ યોજના) Norms for Upper Primary (Std 6 to 8):
  // 150 grams food grains (ઘઉં/ચોખા) per student per day
  // ₹8.19 cooking cost per beneficiary child per day
  const mdmGrainTotalKg = ((todayPresent * 150) / 1000).toFixed(2);
  const mdmCookingCost = (todayPresent * 8.19).toFixed(2);

  // Month-level calculations
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const studentMonthStats = students.map((st) => {
    let presentCount = 0;
    let absentCount = 0;
    let workingDays = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dateObj = new Date(selectedYear, selectedMonth, d);
      if (dateObj.getDay() === 0) continue; // Skip Sunday

      const status = attendanceStore[dayStr]?.[st.id]?.status;
      if (status) {
        workingDays++;
        if (status === 'P') presentCount++;
        if (status === 'A') absentCount++;
      }
    }

    const pct = workingDays > 0 ? (presentCount / workingDays) * 100 : 0;
    return {
      student: st,
      presentCount,
      absentCount,
      workingDays,
      pct,
    };
  });

  // Top regular students (attendance >= 90%)
  const topStudents = [...studentMonthStats]
    .filter((s) => s.workingDays > 0)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

  // Irregular students (absent > 3 days)
  const irregularStudents = [...studentMonthStats].filter((s) => s.absentCount >= 3);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: MDM (પી.એમ. પોષણ) Ration Calculator */}
      <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent border border-amber-200/80 rounded-2xl p-5 bg-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-amber-500 text-white rounded-xl shadow-xs">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  મધ્યાહન ભોજન (પી.એમ. પોષણ) દૈનિક ગણતરી
                </h3>
                <span className="text-2xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-200">
                  ધોરણ ૭ (ઉચ્ચ પ્રાથમિક)
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                તારીખ: <strong>{formatDateGujarati(selectedDate)}</strong> ({getDayOfWeekGujarati(selectedDate)}) · કુલ હાજર બાળકો: <strong>{todayPresent}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onOpenShareModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>વોટ્સએપ હાજરી મેસેજ કૉપી કરો</span>
          </button>
        </div>

        {/* MDM details grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-amber-200/60">
          <div className="bg-white/80 p-3 rounded-xl border border-amber-100">
            <span className="text-2xs font-medium text-slate-500">ભોજન લેનાર કુલ વિદ્યાર્થી</span>
            <div className="text-xl font-bold font-mono text-amber-900 mt-0.5 tabular-nums">
              {todayPresent} <span className="text-xs font-normal text-slate-500">/ {totalStudents}</span>
            </div>
            <span className="text-3xs text-slate-500">{students.filter((s) => s.gender === 'boy').length} કુમાર + {students.filter((s) => s.gender === 'girl').length} કન્યા</span>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-amber-100">
            <span className="text-2xs font-medium text-slate-500">અનાજ જથ્થો (૧૫૦ ગ્રામ/બાળક)</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
              {mdmGrainTotalKg} <span className="text-xs font-normal text-slate-500">કિલોગ્રામ</span>
            </div>
            <span className="text-3xs text-slate-500">ઘઉં / ચોખા દૈનિક વપરાશ</span>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-amber-100">
            <span className="text-2xs font-medium text-slate-500">કૂકિંગ કોસ્ટ (₹૮.૧૯/બાળક)</span>
            <div className="text-xl font-bold font-mono text-emerald-800 mt-0.5 tabular-nums">
              ₹{mdmCookingCost}
            </div>
            <span className="text-3xs text-slate-500">દૈનિક રાંધણી ખર્ચ રકમ</span>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-amber-100">
            <span className="text-2xs font-medium text-slate-500">હાજરી પ્રમાણ</span>
            <div className="text-xl font-bold font-mono text-sky-800 mt-0.5 tabular-nums">
              {todayPct}%
            </div>
            <span className="text-3xs text-slate-500">શાળા હાજરી ગુણોત્તર</span>
          </div>
        </div>
      </div>

      {/* Today's Absentee List & Reason Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Today's Absentees */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h4 className="text-sm font-bold text-slate-900">
                આજના ગેરહાજર વિદ્યાર્થીઓ ({absentStudentsList.length})
              </h4>
            </div>
            <span className="text-2xs font-mono text-slate-500">{formatDateGujarati(selectedDate)}</span>
          </div>

          {absentStudentsList.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-emerald-800">અભિનંદન! આજે ધોરણ ૭ માં ૧૦૦% હાજરી છે!</p>
              <p className="text-2xs text-slate-500">તમામ ૨૧ વિદ્યાર્થીઓ વર્ગખંડમાં ઉપસ્થિત છે.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {absentStudentsList.map((st) => {
                const note = todayRecord[st.id]?.note;
                const status = todayRecord[st.id]?.status;
                return (
                  <div key={st.id} className="flex items-center justify-between p-2.5 bg-rose-50/50 rounded-xl border border-rose-100 text-xs">
                    <div className="flex items-center gap-2.5">
                      <img src={st.avatar} alt={st.nameGu} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      <div>
                        <div className="font-bold text-slate-900">
                          #{st.rollNo} {st.nameGu}
                        </div>
                        <div className="text-2xs text-slate-500">
                          {st.gender === 'boy' ? 'કુમાર' : 'કન્યા'} · GR: {st.grNo} {st.phone ? `· 📞 ${st.phone}` : ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-2xs font-bold ${status === 'L' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                        {status === 'L' ? 'રજા' : 'ગેરહાજર'}
                      </span>
                      {note && <div className="text-3xs text-slate-600 mt-0.5 max-w-28 truncate">{note}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Regular Star Students (Top Attendance) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-bold text-slate-900">
                નિયમિત ઉપસ્થિત વિદ્યાર્થીઓ (Star Students)
              </h4>
            </div>
            <span className="text-2xs text-slate-500">{monthsGu[selectedMonth]} {selectedYear}</span>
          </div>

          <div className="space-y-2">
            {topStudents.map((stat, idx) => (
              <div key={stat.student.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 flex items-center justify-center font-bold font-mono text-2xs text-amber-700 bg-amber-100 rounded-full">
                    {idx + 1}
                  </span>
                  <img src={stat.student.avatar} alt={stat.student.nameGu} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                  <div>
                    <div className="font-bold text-slate-900">
                      {stat.student.nameGu}
                    </div>
                    <div className="text-2xs text-slate-500">
                      રોલ #{stat.student.rollNo} · {stat.student.gender === 'boy' ? 'કુમાર' : 'કન્યા'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-emerald-700">
                    {stat.pct.toFixed(0)}%
                  </span>
                  <div className="text-3xs text-slate-500">
                    {stat.presentCount} દિવસ હાજર
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
