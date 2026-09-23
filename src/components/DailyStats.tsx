import React from 'react';
import { Student, DayAttendanceRecord } from '../types/attendance';
import { formatDateGujarati, getDayOfWeekGujarati } from '../utils/storage';
import { Users, UserCheck, UserX, Clock, Utensils, Award } from 'lucide-react';

interface DailyStatsProps {
  selectedDate: string;
  students: Student[];
  currentAttendance: DayAttendanceRecord;
  onQuickMarkAllPresent: () => void;
  onQuickMarkAllAbsent: () => void;
  onResetToday: () => void;
  isToday: boolean;
}

export const DailyStats: React.FC<DailyStatsProps> = ({
  selectedDate,
  students,
  currentAttendance,
  onQuickMarkAllPresent,
  onQuickMarkAllAbsent,
  onResetToday,
  isToday,
}) => {
  const totalStudents = students.length; // 21
  const boys = students.filter((s) => s.gender === 'boy'); // 9
  const girls = students.filter((s) => s.gender === 'girl'); // 12

  let presentCount = 0;
  let absentCount = 0;
  let leaveCount = 0;
  let boysPresent = 0;
  let girlsPresent = 0;

  students.forEach((student) => {
    const item = currentAttendance[student.id];
    const status = item?.status;
    if (status === 'P') {
      presentCount++;
      if (student.gender === 'boy') boysPresent++;
      else girlsPresent++;
    } else if (status === 'A') {
      absentCount++;
    } else if (status === 'L') {
      leaveCount++;
    }
  });

  const percentage = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : '0';
  const boysPct = boys.length > 0 ? ((boysPresent / boys.length) * 100).toFixed(0) : '0';
  const girlsPct = girls.length > 0 ? ((girlsPresent / girls.length) * 100).toFixed(0) : '0';

  const dayOfWeek = getDayOfWeekGujarati(selectedDate);
  const formattedDate = formatDateGujarati(selectedDate);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-6">
      {/* Top Banner Row: Date info and action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>તારીખ</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-800 font-semibold">{dayOfWeek}</span>
            {isToday && (
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-2xs font-bold border border-emerald-200">
                આજની હાજરી
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
            {formattedDate}
          </h2>
        </div>

        {/* Quick Batch Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onQuickMarkAllPresent}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>બધા હાજર ({totalStudents})</span>
          </button>

          <button
            onClick={onQuickMarkAllAbsent}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
          >
            <UserX className="w-3.5 h-3.5" />
            <span>બધા ગેરહાજર</span>
          </button>

          <button
            onClick={onResetToday}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            રીસેટ
          </button>
        </div>
      </div>

      {/* Metrics Row: Clean typographic cards with tabular figures */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
        
        {/* Total Students */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">કુલ વિદ્યાર્થી</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {totalStudents}
          </div>
          <div className="text-2xs text-slate-600 mt-0.5 font-medium">
            {boys.length} કુમાર · {girls.length} કન્યા
          </div>
        </div>

        {/* Present Students */}
        <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-xs font-bold">હાજર (Present)</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            {presentCount}
          </div>
          <div className="text-2xs text-emerald-800 mt-0.5 font-semibold">
            {percentage}% હાજરી
          </div>
        </div>

        {/* Absent Students */}
        <div className="bg-rose-50/60 rounded-xl p-3 border border-rose-100">
          <div className="flex items-center justify-between text-rose-700 mb-1">
            <span className="text-xs font-bold">ગેરહાજર (Absent)</span>
            <UserX className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-rose-700 tabular-nums">
            {absentCount}
          </div>
          <div className="text-2xs text-rose-800 mt-0.5 font-semibold">
            {absentCount > 0 ? `${absentCount} વિદ્યાર્થી ગેરહાજર` : 'કોઈ ગેરહાજર નથી'}
          </div>
        </div>

        {/* Leave */}
        <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-100">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-xs font-bold">રજા (Leave)</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-700 tabular-nums">
            {leaveCount}
          </div>
          <div className="text-2xs text-amber-800 mt-0.5 font-semibold">
            માંદગી / રજા અરજી
          </div>
        </div>

        {/* Boys / Girls Breakdown */}
        <div className="bg-sky-50/60 rounded-xl p-3 border border-sky-100">
          <div className="flex items-center justify-between text-sky-800 mb-1">
            <span className="text-xs font-bold">કુમાર / કન્યા</span>
            <Award className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-sm font-bold text-slate-800">
            <span>કુ: <b className="font-mono text-sky-800">{boysPresent}/{boys.length}</b> ({boysPct}%)</span>
          </div>
          <div className="text-sm font-bold text-slate-800 mt-0.5">
            <span>કન્યા: <b className="font-mono text-rose-700">{girlsPresent}/{girls.length}</b> ({girlsPct}%)</span>
          </div>
        </div>

        {/* MDM Meal count */}
        <div className="bg-orange-50/70 rounded-xl p-3 border border-orange-100">
          <div className="flex items-center justify-between text-orange-800 mb-1">
            <span className="text-xs font-bold">MDM ભોજન</span>
            <Utensils className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-orange-700 tabular-nums">
            {presentCount}
          </div>
          <div className="text-2xs text-orange-800 mt-0.5 font-semibold">
            પી.એમ. પોષણ બાળકો
          </div>
        </div>

      </div>
    </div>
  );
};
