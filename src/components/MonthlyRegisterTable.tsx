import React, { useState } from 'react';
import { Student, AttendanceStore, AttendanceStatus, SchoolInfo } from '../types/attendance';
import { soundManager } from '../utils/audio';
import { Printer, ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';

interface MonthlyRegisterTableProps {
  students: Student[];
  attendanceStore: AttendanceStore;
  schoolInfo: SchoolInfo;
  onUpdateCell: (dateStr: string, studentId: string, status: AttendanceStatus) => void;
  onPrint: () => void;
}

export const MonthlyRegisterTable: React.FC<MonthlyRegisterTableProps> = ({
  students,
  attendanceStore,
  schoolInfo,
  onUpdateCell,
  onPrint,
}) => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth()); // 0-indexed
  const [genderFilter, setGenderFilter] = useState<'all' | 'boy' | 'girl'>('all');

  const monthsGu = [
    'જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન',
    'જુલાઇ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર'
  ];

  // Number of days in the selected month
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Month navigation
  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // Filter students if needed
  const displayStudents = students.filter((s) => {
    if (genderFilter === 'boy') return s.gender === 'boy';
    if (genderFilter === 'girl') return s.gender === 'girl';
    return true;
  });

  // Calculate day stats (how many boys/girls present on day X)
  const getDaySummary = (day: number) => {
    const dayStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayRecord = attendanceStore[dayStr] || {};
    const dateObj = new Date(selectedYear, selectedMonth, day);
    const isSunday = dateObj.getDay() === 0;

    let boysPresent = 0;
    let girlsPresent = 0;
    let totalPresent = 0;

    students.forEach((s) => {
      const status = dayRecord[s.id]?.status;
      if (status === 'P') {
        totalPresent++;
        if (s.gender === 'boy') boysPresent++;
        else girlsPresent++;
      }
    });

    return {
      isSunday,
      boysPresent,
      girlsPresent,
      totalPresent,
      pct: students.length > 0 ? ((totalPresent / students.length) * 100).toFixed(0) : '0',
    };
  };

  // Toggle cell status on click
  const handleCellClick = (studentId: string, day: number) => {
    const dayStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const currentStatus = attendanceStore[dayStr]?.[studentId]?.status;

    let nextStatus: AttendanceStatus = 'P';
    if (currentStatus === 'P') nextStatus = 'A';
    else if (currentStatus === 'A') nextStatus = 'L';
    else if (currentStatus === 'L') nextStatus = 'P';

    soundManager.playPresentChime();
    onUpdateCell(dayStr, studentId, nextStatus);
  };

  // Export current month table to CSV
  const exportToCSV = () => {
    let csv = `"${schoolInfo.schoolNameGu} - ધોરણ ૭ માસિક હાજરી પત્રક - ${monthsGu[selectedMonth]} ${selectedYear}"\n`;
    csv += `"યુ-ડાયસ કોડ: ${schoolInfo.udiseCode}","તાલુકો: ${schoolInfo.taluka}","જિલ્લો: ${schoolInfo.district}","વર્ગ: ${schoolInfo.standard} (${schoolInfo.division})"\n`;
    csv += `રોલ નં,જી.આર.નં,વિદ્યાર્થીનું નામ,જાતિ,`;
    daysArray.forEach((d) => {
      csv += `${d},`;
    });
    csv += `કુલ હાજર,કુલ ગેરહાજર,ટકાવારી\n`;

    students.forEach((st) => {
      let present = 0;
      let absent = 0;
      let row = `${st.rollNo},${st.grNo},"${st.nameGu}",${st.gender === 'boy' ? 'કુમાર' : 'કન્યા'},`;

      daysArray.forEach((d) => {
        const dayStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const status = attendanceStore[dayStr]?.[st.id]?.status || '-';
        if (status === 'P') present++;
        if (status === 'A') absent++;
        row += `${status},`;
      });

      const totalSchoolDays = present + absent;
      const pct = totalSchoolDays > 0 ? ((present / totalSchoolDays) * 100).toFixed(1) : '0';
      row += `${present},${absent},${pct}%\n`;
      csv += row;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Hajari_Patrak_Std7_${monthsGu[selectedMonth]}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs">
      
      {/* Control Bar: Month Switcher & Actions */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 mb-5">
        
        {/* Month & Year Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="અગાઉનો મહિનો"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="text-base sm:text-lg font-bold text-slate-900 min-w-40 text-center">
            {monthsGu[selectedMonth]} {selectedYear}
          </div>

          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="આગામી મહિનો"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Gender Filter & Export Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setGenderFilter('all')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                genderFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              બધા ({students.length})
            </button>
            <button
              onClick={() => setGenderFilter('boy')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                genderFilter === 'boy' ? 'bg-white text-sky-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              કુમાર ({students.filter((s) => s.gender === 'boy').length})
            </button>
            <button
              onClick={() => setGenderFilter('girl')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                genderFilter === 'girl' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              કન્યા ({students.filter((s) => s.gender === 'girl').length})
            </button>
          </div>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="એક્સેલ / સીએસવી ફાઇલમાં ડાઉનલોડ કરો"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel / CSV</span>
          </button>

          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>પ્રિન્ટ રજિસ્ટર</span>
          </button>
        </div>

      </div>

      {/* Official Register Print Header (shown in print & on screen) */}
      <div className="text-center mb-4 pb-3 border-b-2 border-slate-800">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {schoolInfo.schoolNameGu}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-700 mt-1 font-medium">
          <span className="font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
            યુ-ડાયસ કોડ: {schoolInfo.udiseCode}
          </span>
          <span>·</span>
          <span>તાલુકો: <strong>{schoolInfo.taluka}</strong></span>
          <span>·</span>
          <span>જિલ્લો: <strong>{schoolInfo.district}</strong></span>
          <span>·</span>
          <span>ધોરણ: <strong>{schoolInfo.standard}</strong> ({schoolInfo.division})</span>
          <span>·</span>
          <span>શૈક્ષણિક વર્ષ: <strong>{schoolInfo.academicYear}</strong></span>
          <span>·</span>
          <span>માસ: <strong>{monthsGu[selectedMonth]} {selectedYear}</strong></span>
        </div>
      </div>

      {/* Legend */}
      <div className="no-print flex items-center justify-between text-2xs text-slate-500 mb-3 px-1">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center rounded-xs text-2xs">P</span>
            <span>હાજર</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-rose-100 text-rose-800 font-bold flex items-center justify-center rounded-xs text-2xs">A</span>
            <span>ગેરહાજર</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-amber-100 text-amber-800 font-bold flex items-center justify-center rounded-xs text-2xs">L</span>
            <span>રજા</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-slate-200 text-slate-700 font-bold flex items-center justify-center rounded-xs text-2xs">ર</span>
            <span>રવિવાર</span>
          </span>
        </div>
        <span className="italic text-sky-800">કોઈપણ ખાના પર ક્લિક કરી હાજરી બદલી શકાય છે</span>
      </div>

      {/* Register Table Container */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-2xs text-left border-collapse">
          <thead>
            {/* Row 1: Day numbers */}
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-800 font-bold">
              <th className="p-1.5 text-center border-r border-slate-200 sticky left-0 bg-slate-100 z-10 w-8">
                રોલ
              </th>
              <th className="p-1.5 border-r border-slate-200 sticky left-8 bg-slate-100 z-10 min-w-36">
                વિદ્યાર્થીનું નામ
              </th>
              <th className="p-1.5 text-center border-r border-slate-200 min-w-10">
                જાતિ
              </th>

              {daysArray.map((day) => {
                const dateObj = new Date(selectedYear, selectedMonth, day);
                const isSun = dateObj.getDay() === 0;
                return (
                  <th
                    key={day}
                    className={`p-1 text-center border-r border-slate-200 min-w-6 font-mono tabular-nums ${
                      isSun ? 'bg-rose-100 text-rose-900' : 'bg-slate-50'
                    }`}
                  >
                    {day}
                  </th>
                );
              })}

              <th className="p-1.5 text-center border-r border-slate-200 bg-emerald-50 text-emerald-900 font-bold min-w-10">
                હાજર
              </th>
              <th className="p-1.5 text-center border-r border-slate-200 bg-rose-50 text-rose-900 font-bold min-w-10">
                ગેર
              </th>
              <th className="p-1.5 text-center bg-slate-100 font-bold min-w-12">
                ટકા %
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {displayStudents.map((st) => {
              let totalPresent = 0;
              let totalAbsent = 0;

              return (
                <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Roll No */}
                  <td className="p-1.5 text-center font-mono font-bold text-slate-700 border-r border-slate-200 sticky left-0 bg-white z-10 tabular-nums">
                    {st.rollNo}
                  </td>

                  {/* Student Name */}
                  <td className="p-1.5 font-medium text-slate-900 border-r border-slate-200 sticky left-8 bg-white z-10 whitespace-nowrap">
                    <div className="font-semibold text-slate-800">{st.nameGu}</div>
                    <div className="text-3xs text-slate-600 font-mono">GR: {st.grNo}</div>
                  </td>

                  {/* Gender */}
                  <td className="p-1 text-center font-medium border-r border-slate-200">
                    <span className={st.gender === 'boy' ? 'text-sky-700' : 'text-rose-700'}>
                      {st.gender === 'boy' ? 'કુ' : 'ક'}
                    </span>
                  </td>

                  {/* Daily cells */}
                  {daysArray.map((day) => {
                    const dayStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dateObj = new Date(selectedYear, selectedMonth, day);
                    const isSunday = dateObj.getDay() === 0;
                    const rec = attendanceStore[dayStr]?.[st.id];
                    const status = isSunday ? 'H' : rec?.status;

                    if (status === 'P') totalPresent++;
                    if (status === 'A') totalAbsent++;

                    let cellDisplay = '-';
                    let cellClass = 'text-slate-300';

                    if (isSunday) {
                      cellDisplay = 'ર';
                      cellClass = 'bg-rose-50/60 text-rose-400 font-bold';
                    } else if (status === 'P') {
                      cellDisplay = 'P';
                      cellClass = 'bg-emerald-50 text-emerald-800 font-bold';
                    } else if (status === 'A') {
                      cellDisplay = 'A';
                      cellClass = 'bg-rose-50 text-rose-800 font-bold';
                    } else if (status === 'L') {
                      cellDisplay = 'L';
                      cellClass = 'bg-amber-50 text-amber-800 font-bold';
                    }

                    return (
                      <td
                        key={day}
                        onClick={() => !isSunday && handleCellClick(st.id, day)}
                        className={`p-1 text-center border-r border-slate-200 font-mono text-2xs cursor-pointer select-none transition-colors hover:ring-1 hover:ring-sky-400 ${cellClass}`}
                        title={isSunday ? 'રવિવાર' : `${st.nameGu} - ${day}/${selectedMonth + 1}`}
                      >
                        {cellDisplay}
                      </td>
                    );
                  })}

                  {/* Total Present */}
                  <td className="p-1.5 text-center font-mono font-bold text-emerald-800 bg-emerald-50/40 border-r border-slate-200 tabular-nums">
                    {totalPresent}
                  </td>

                  {/* Total Absent */}
                  <td className="p-1.5 text-center font-mono font-bold text-rose-800 bg-rose-50/40 border-r border-slate-200 tabular-nums">
                    {totalAbsent}
                  </td>

                  {/* Percentage */}
                  <td className="p-1.5 text-center font-mono font-bold text-slate-800 tabular-nums">
                    {totalPresent + totalAbsent > 0
                      ? `${((totalPresent / (totalPresent + totalAbsent)) * 100).toFixed(0)}%`
                      : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Footer Summary Rows (Standard Gujarat Hajari Patrak footer) */}
          <tfoot className="border-t-2 border-slate-300 bg-slate-50 font-bold">
            {/* Row 1: Boys Present */}
            <tr className="border-b border-slate-200 text-sky-800">
              <td colSpan={3} className="p-1.5 text-right border-r border-slate-200 sticky left-0 bg-slate-50">
                કુમાર હાજર (Boys):
              </td>
              {daysArray.map((day) => {
                const s = getDaySummary(day);
                return (
                  <td key={day} className="p-1 text-center font-mono border-r border-slate-200 tabular-nums text-2xs">
                    {s.isSunday ? 'ર' : s.boysPresent}
                  </td>
                );
              })}
              <td colSpan={3} className="p-1 text-center text-2xs">{students.filter((s) => s.gender === 'boy').length} માંથી</td>
            </tr>

            {/* Row 2: Girls Present */}
            <tr className="border-b border-slate-200 text-rose-800">
              <td colSpan={3} className="p-1.5 text-right border-r border-slate-200 sticky left-0 bg-slate-50">
                કન્યા હાજર (Girls):
              </td>
              {daysArray.map((day) => {
                const s = getDaySummary(day);
                return (
                  <td key={day} className="p-1 text-center font-mono border-r border-slate-200 tabular-nums text-2xs">
                    {s.isSunday ? 'ર' : s.girlsPresent}
                  </td>
                );
              })}
              <td colSpan={3} className="p-1 text-center text-2xs">{students.filter((s) => s.gender === 'girl').length} માંથી</td>
            </tr>

            {/* Row 3: Total Present */}
            <tr className="bg-slate-100 text-slate-900 font-extrabold">
              <td colSpan={3} className="p-1.5 text-right border-r border-slate-200 sticky left-0 bg-slate-100">
                કુલ હાજર વિદ્યાર્થી:
              </td>
              {daysArray.map((day) => {
                const s = getDaySummary(day);
                return (
                  <td key={day} className="p-1 text-center font-mono border-r border-slate-200 tabular-nums text-2xs text-emerald-800">
                    {s.isSunday ? 'રવિ' : s.totalPresent}
                  </td>
                );
              })}
              <td colSpan={3} className="p-1 text-center text-2xs">કુલ {students.length}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Official Signatures for Hajari Patrak printout */}
      <div className="mt-8 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs font-semibold text-slate-800">
        <div>
          <div className="h-10"></div>
          <div className="border-t border-slate-400 pt-1 w-48 mx-auto">
            વર્ગ શિક્ષકની સહી
          </div>
          <div className="text-2xs text-slate-500 font-normal mt-0.5">
            {schoolInfo.classTeacher}
          </div>
        </div>

        <div>
          <div className="h-10"></div>
          <div className="border-t border-slate-400 pt-1 w-48 mx-auto">
            આચાર્ય / મુખ્ય શિક્ષકની સહી
          </div>
          <div className="text-2xs text-slate-500 font-normal mt-0.5">
            {schoolInfo.principal}
          </div>
        </div>
      </div>

    </div>
  );
};
