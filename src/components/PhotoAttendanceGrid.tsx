import React, { useState } from 'react';
import { Student, DayAttendanceRecord, AttendanceStatus } from '../types/attendance';
import { soundManager } from '../utils/audio';
import { CheckCircle2, XCircle, Clock, Search, Edit3, MessageSquare, Volume2, Trash2 } from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface PhotoAttendanceGridProps {
  students: Student[];
  currentAttendance: DayAttendanceRecord;
  onUpdateAttendance: (studentId: string, status: AttendanceStatus, note?: string) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent?: (studentId: string) => void;
  onQuickFilterGender?: (gender: 'all' | 'boy' | 'girl') => void;
}

export const PhotoAttendanceGrid: React.FC<PhotoAttendanceGridProps> = ({
  students,
  currentAttendance,
  onUpdateAttendance,
  onEditStudent,
  onDeleteStudent,
}) => {
  const [filter, setFilter] = useState<'all' | 'boy' | 'girl' | 'present' | 'absent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [justClickedId, setJustClickedId] = useState<string | null>(null);
  const [noteModalStudent, setNoteModalStudent] = useState<Student | null>(null);
  const [tempNote, setTempNote] = useState('');
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Handle single click on photo -> Automatic attendance marking!
  const handlePhotoClick = (student: Student) => {
    const currentStatus = currentAttendance[student.id]?.status;
    let nextStatus: AttendanceStatus;

    if (!currentStatus || currentStatus === 'A') {
      nextStatus = 'P'; // Auto-mark Present!
      soundManager.playPresentChime();
      soundManager.speakAttendance(student.nameGu.split(' ')[0], 'P');
    } else if (currentStatus === 'P') {
      nextStatus = 'A'; // Toggle to Absent
      soundManager.playAbsentTone();
      soundManager.speakAttendance(student.nameGu.split(' ')[0], 'A');
    } else {
      nextStatus = 'P';
      soundManager.playPresentChime();
    }

    setJustClickedId(student.id);
    setTimeout(() => setJustClickedId(null), 400);

    onUpdateAttendance(student.id, nextStatus, currentAttendance[student.id]?.note);
  };

  // Direct status select buttons
  const handleStatusSelect = (student: Student, status: AttendanceStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    if (status === 'P') {
      soundManager.playPresentChime();
    } else if (status === 'A') {
      soundManager.playAbsentTone();
    } else if (status === 'L') {
      soundManager.playLeaveTone();
    }
    setJustClickedId(student.id);
    setTimeout(() => setJustClickedId(null), 400);
    onUpdateAttendance(student.id, status, currentAttendance[student.id]?.note);
  };

  const openNoteDialog = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    setNoteModalStudent(student);
    setTempNote(currentAttendance[student.id]?.note || '');
  };

  const saveNote = () => {
    if (noteModalStudent) {
      const curStatus = currentAttendance[noteModalStudent.id]?.status || 'P';
      onUpdateAttendance(noteModalStudent.id, curStatus, tempNote);
      setNoteModalStudent(null);
    }
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    // Search
    const matchesSearch =
      s.nameGu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.rollNo) === searchQuery.trim() ||
      s.grNo.includes(searchQuery.trim());

    if (!matchesSearch) return false;

    // Filter status / gender
    const status = currentAttendance[s.id]?.status;
    if (filter === 'boy') return s.gender === 'boy';
    if (filter === 'girl') return s.gender === 'girl';
    if (filter === 'present') return status === 'P';
    if (filter === 'absent') return status === 'A' || status === 'L';
    return true;
  });

  return (
    <div>
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
        
        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            બધા ({students.length})
          </button>
          <button
            onClick={() => setFilter('boy')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              filter === 'boy'
                ? 'bg-white text-sky-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👦 કુમાર ({students.filter((s) => s.gender === 'boy').length})
          </button>
          <button
            onClick={() => setFilter('girl')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              filter === 'girl'
                ? 'bg-white text-rose-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👧 કન્યા ({students.filter((s) => s.gender === 'girl').length})
          </button>
          <button
            onClick={() => setFilter('present')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              filter === 'present'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✓ હાજર
          </button>
          <button
            onClick={() => setFilter('absent')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              filter === 'absent'
                ? 'bg-white text-rose-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✗ ગેરહાજર
          </button>
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="નામ અથવા રોલ નં. થી શોધો..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-xs"
          />
        </div>

      </div>

      {/* Interactive Helper Banner */}
      <div className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-2.5 mb-6 flex items-center justify-between text-xs text-sky-900">
        <div className="flex items-center gap-2">
          <span className="text-base">💡</span>
          <span className="font-semibold">
            કોઈપણ વિદ્યાર્થીના <strong className="underline">ફોટા પર ક્લિક કરો</strong> — ઓટોમેટિક હાજરી (હાજર / ગેરહાજર) પુરાઈ જશે!
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-sky-700 text-2xs">
          <span>લીલો: હાજર (P)</span>
          <span>·</span>
          <span>લાલ: ગેરહાજર (A)</span>
          <span>·</span>
          <span>પીળો: રજા (L)</span>
        </div>
      </div>

      {/* Grid of 21 Student Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-4">
        {filteredStudents.map((student) => {
          const attendance = currentAttendance[student.id];
          const status = attendance?.status;
          const isJustClicked = justClickedId === student.id;

          // Determine card border & background depending on status
          let borderStyle = 'border-slate-200 hover:border-sky-300';
          let statusBadgeBg = 'bg-slate-100 text-slate-700';
          let statusText = 'બાકી';

          if (status === 'P') {
            borderStyle = 'border-emerald-400 ring-2 ring-emerald-300/40 bg-emerald-50/20';
            statusBadgeBg = 'bg-emerald-600 text-white font-bold';
            statusText = '✓ હાજર';
          } else if (status === 'A') {
            borderStyle = 'border-rose-400 ring-2 ring-rose-300/40 bg-rose-50/20';
            statusBadgeBg = 'bg-rose-600 text-white font-bold';
            statusText = '✗ ગેરહાજર';
          } else if (status === 'L') {
            borderStyle = 'border-amber-400 ring-2 ring-amber-300/40 bg-amber-50/20';
            statusBadgeBg = 'bg-amber-500 text-white font-bold';
            statusText = '◷ રજા';
          }

          return (
            <div
              key={student.id}
              className={`group relative bg-white rounded-2xl border transition-all duration-150 p-3 flex flex-col justify-between shadow-xs select-none ${borderStyle} ${
                isJustClicked ? 'scale-95 duration-75' : 'hover:shadow-md'
              }`}
            >
              {/* Top row: Roll Number & Gender indicator */}
              <div className="flex items-center justify-between text-2xs mb-2">
                <span className="font-mono font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-800 tabular-nums">
                  #{student.rollNo}
                </span>
                <span className={`font-semibold ${student.gender === 'boy' ? 'text-sky-700' : 'text-rose-700'}`}>
                  {student.gender === 'boy' ? 'કુમાર' : 'કન્યા'}
                </span>
              </div>

              {/* Photo Container - The main clickable area */}
              <div
                onClick={() => handlePhotoClick(student)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePhotoClick(student);
                  }
                }}
                className="relative cursor-pointer group-hover:scale-[1.02] transition-transform duration-150 active:scale-95"
                title={`${student.nameGu} - ફોટો પર ક્લિક કરો હાજરી પૂરવા માટે`}
              >
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center">
                  <img
                    src={student.avatar}
                    alt={student.nameGu}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    loading="lazy"
                  />

                  {/* Stamp status badge directly on top of photo */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-11/12">
                    <div className={`text-center py-0.5 px-1.5 rounded-md text-2xs tracking-wide shadow-sm truncate ${statusBadgeBg}`}>
                      {statusText}
                    </div>
                  </div>

                  {/* Click Ripple / Highlight effect */}
                  {isJustClicked && (
                    <div className="absolute inset-0 bg-emerald-400/20 rounded-2xl animate-ping pointer-events-none" />
                  )}
                </div>

                {/* Tap Hint Overlay for Unmarked */}
                {!status && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                    <span className="bg-white/90 text-slate-800 text-2xs font-bold px-2 py-1 rounded-md shadow-xs">
                      ક્લિક કરો
                    </span>
                  </div>
                )}
              </div>

              {/* Student Name */}
              <div className="mt-2.5 text-center min-w-0">
                <h3 className="text-xs font-bold text-slate-900 leading-tight truncate" title={student.nameGu}>
                  {student.nameGu}
                </h3>
                <p className="text-2xs text-slate-600 truncate mt-0.5 font-medium">
                  {student.nameEn}
                </p>
                <div className="text-2xs text-slate-500 font-mono mt-0.5">
                  GR: {student.grNo}
                </div>
              </div>

              {/* Note / reason if any */}
              {attendance?.note && (
                <div className="mt-1.5 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded text-2xs text-amber-800 font-medium truncate text-center" title={attendance.note}>
                  📝 {attendance.note}
                </div>
              )}

              {/* Quick Status Buttons Row */}
              <div className="grid grid-cols-3 gap-1 mt-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(e) => handleStatusSelect(student, 'P', e)}
                  title="હાજર માર્ક કરો (P)"
                  className={`py-1 rounded text-2xs font-bold transition-colors cursor-pointer flex items-center justify-center ${
                    status === 'P'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  હાજર
                </button>
                <button
                  type="button"
                  onClick={(e) => handleStatusSelect(student, 'A', e)}
                  title="ગેરહાજર માર્ક કરો (A)"
                  className={`py-1 rounded text-2xs font-bold transition-colors cursor-pointer flex items-center justify-center ${
                    status === 'A'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                  }`}
                >
                  ગેરહાજર
                </button>
                <button
                  type="button"
                  onClick={(e) => handleStatusSelect(student, 'L', e)}
                  title="રજા માર્ક કરો (L)"
                  className={`py-1 rounded text-2xs font-bold transition-colors cursor-pointer flex items-center justify-center ${
                    status === 'L'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  રજા
                </button>
              </div>

              {/* Card Footer: Edit Photo/Profile, Add Note & Delete */}
              <div className="flex items-center justify-between text-2xs text-slate-400 mt-2 pt-1 border-t border-slate-50">
                <button
                  type="button"
                  onClick={(e) => openNoteDialog(student, e)}
                  className="hover:text-amber-700 p-1 rounded hover:bg-amber-50 transition-colors cursor-pointer"
                  title="કારણ / નોંધ ઉમેરો"
                >
                  <MessageSquare className="w-3 h-3" />
                </button>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditStudent(student);
                    }}
                    className="hover:text-sky-700 p-1 rounded hover:bg-sky-50 transition-colors cursor-pointer"
                    title="વિદ્યાર્થી પ્રોફાઇલ / ફોટો બદલો"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  {onDeleteStudent && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setStudentToDelete(student);
                      }}
                      className="hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer text-slate-400"
                      title="વિદ્યાર્થી ડિલીટ કરો"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center my-6">
          <p className="text-sm font-semibold text-slate-700">કોઈ વિદ્યાર્થી મળ્યા નથી.</p>
          <button
            onClick={() => {
              setFilter('all');
              setSearchQuery('');
            }}
            className="mt-2 text-xs text-sky-700 hover:underline font-semibold cursor-pointer"
          >
            બધા વિદ્યાર્થીઓ બતાવો
          </button>
        </div>
      )}

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={Boolean(studentToDelete)}
        student={studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={() => {
          if (studentToDelete && onDeleteStudent) {
            onDeleteStudent(studentToDelete.id);
          }
          setStudentToDelete(null);
        }}
      />

      {/* Note Modal */}
      {noteModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              નોંધ / ગેરહાજરીનું કારણ
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              વિદ્યાર્થી: {noteModalStudent.nameGu} (રોલ નં: {noteModalStudent.rollNo})
            </p>
            <textarea
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder="દા.ત. તાવ આવ્યો છે, લગ્ન પ્રસંગ, બહારગામ ગયા છે..."
              rows={3}
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setNoteModalStudent(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg cursor-pointer"
              >
                રદ કરો
              </button>
              <button
                onClick={saveNote}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg cursor-pointer shadow-xs"
              >
                સાચવો
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
