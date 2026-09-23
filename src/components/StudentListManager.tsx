import React, { useState, useRef } from 'react';
import { Student } from '../types/attendance';
import { Upload, Edit2, RotateCcw, Check, Phone, UserPlus, Trash2, X, AlertCircle } from 'lucide-react';
import { createStudentAvatarSvg } from '../data/students';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface StudentListManagerProps {
  students: Student[];
  onUpdateStudent: (updated: Student) => void;
  onAddStudent: (newStudent: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onResetAllStudents: () => void;
}

export const StudentListManager: React.FC<StudentListManagerProps> = ({
  students,
  onUpdateStudent,
  onAddStudent,
  onDeleteStudent,
  onResetAllStudents,
}) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const [filterGender, setFilterGender] = useState<'all' | 'boy' | 'girl'>('all');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  // Edit form state
  const [editNameGu, setEditNameGu] = useState('');
  const [editNameEn, setEditNameEn] = useState('');
  const [editGrNo, setEditGrNo] = useState('');
  const [editFatherName, setEditFatherName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  // Add new student form state
  const [newNameGu, setNewNameGu] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newGender, setNewGender] = useState<'boy' | 'girl'>('boy');
  const [newRollNo, setNewRollNo] = useState<number>(() => {
    const maxRoll = students.reduce((max, s) => Math.max(max, s.rollNo), 0);
    return maxRoll + 1;
  });
  const [newGrNo, setNewGrNo] = useState('');
  const [newFatherName, setNewFatherName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAvatar, setNewAvatar] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const boysCount = students.filter((s) => s.gender === 'boy').length;
  const girlsCount = students.filter((s) => s.gender === 'girl').length;

  const openEditModal = (st: Student) => {
    setSelectedStudent(st);
    setEditNameGu(st.nameGu);
    setEditNameEn(st.nameEn);
    setEditGrNo(st.grNo);
    setEditFatherName(st.fatherNameGu || '');
    setEditPhone(st.phone || '');
    setEditAvatar(st.avatar);
    setSavedSuccess(false);
  };

  const openAddModal = () => {
    const maxRoll = students.reduce((max, s) => Math.max(max, s.rollNo), 0);
    setNewRollNo(maxRoll + 1);
    setNewNameGu('');
    setNewNameEn('');
    setNewGender('boy');
    setNewGrNo(String(1400 + maxRoll + 1));
    setNewFatherName('');
    setNewPhone('');
    setNewAvatar(createStudentAvatarSvg('boy'));
    setAddSuccess(false);
    setIsAddModalOpen(true);
  };

  const handleGenderChangeForNewStudent = (g: 'boy' | 'girl') => {
    setNewGender(g);
    if (!newAvatar || newAvatar.startsWith('data:image/svg+xml')) {
      setNewAvatar(createStudentAvatarSvg(g));
    }
  };

  const handlePhotoUploadForEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUploadForAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const updated: Student = {
      ...selectedStudent,
      nameGu: editNameGu.trim() || selectedStudent.nameGu,
      nameEn: editNameEn.trim() || selectedStudent.nameEn,
      grNo: editGrNo.trim() || selectedStudent.grNo,
      fatherNameGu: editFatherName.trim(),
      phone: editPhone.trim(),
      avatar: editAvatar || selectedStudent.avatar,
    };

    onUpdateStudent(updated);
    setSavedSuccess(true);
    showToast(`વિદ્યાર્થી #${updated.rollNo} ${updated.nameGu} ની વિગત સાચવી લીધી છે.`);
    setTimeout(() => {
      setSelectedStudent(null);
      setSavedSuccess(false);
    }, 500);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameGu.trim()) return;

    const studentId = `std7-${Date.now()}`;
    const avatar = newAvatar || createStudentAvatarSvg(newGender);

    const newStudent: Student = {
      id: studentId,
      rollNo: Number(newRollNo) || students.length + 1,
      grNo: newGrNo.trim() || String(1400 + Number(newRollNo)),
      nameGu: newNameGu.trim(),
      nameEn: newNameEn.trim() || newNameGu.trim(),
      gender: newGender,
      avatar: avatar,
      fatherNameGu: newFatherName.trim(),
      phone: newPhone.trim(),
    };

    onAddStudent(newStudent);
    setAddSuccess(true);
    showToast(`નવો વિદ્યાર્થી #${newStudent.rollNo} ${newStudent.nameGu} સફળતાપૂર્વક ઉમેરાઈ ગયો!`);
    setTimeout(() => {
      setIsAddModalOpen(false);
      setAddSuccess(false);
    }, 500);
  };

  const handleConfirmDelete = () => {
    if (!studentToDelete) return;
    const deletedName = studentToDelete.nameGu;
    const deletedRoll = studentToDelete.rollNo;
    onDeleteStudent(studentToDelete.id);
    if (selectedStudent?.id === studentToDelete.id) {
      setSelectedStudent(null);
    }
    setStudentToDelete(null);
    showToast(`વિદ્યાર્થી #${deletedRoll} ${deletedName} ને યાદીમાંથી કાઢી નાખવામાં આવ્યો છે.`);
  };

  const displayList = students.filter((s) => {
    if (filterGender === 'boy') return s.gender === 'boy';
    if (filterGender === 'girl') return s.gender === 'girl';
    return true;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs relative">
      
      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-2 duration-200 border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              ધોરણ ૭ વિદ્યાર્થી યાદી વ્યવસ્થાપન
            </h2>
            <span className="text-xs font-mono font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
              {students.length} વિદ્યાર્થીઓ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            કુલ {students.length} વિદ્યાર્થીઓ ({boysCount} કુમાર, {girlsCount} કન્યા) · નવો વિદ્યાર્થી ઉમેરો અથવા ડિલીટ / એડિટ કરો
          </p>
        </div>

        {/* Action Controls: Add Student, Gender Filter & Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Add New Student Button */}
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ નવો વિદ્યાર્થી ઉમેરો</span>
          </button>

          {/* Gender Filter */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setFilterGender('all')}
              className={`px-3 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                filterGender === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              બધા ({students.length})
            </button>
            <button
              onClick={() => setFilterGender('boy')}
              className={`px-3 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                filterGender === 'boy' ? 'bg-white text-sky-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              👦 {boysCount} કુમાર
            </button>
            <button
              onClick={() => setFilterGender('girl')}
              className={`px-3 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                filterGender === 'girl' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              👧 {girlsCount} કન્યા
            </button>
          </div>

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="મૂળ વિદ્યાર્થી યાદી રીસેટ કરો"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ડિફોલ્ટ યાદી</span>
          </button>
        </div>
      </div>

      {/* Grid of students with details, edit & delete */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayList.map((st) => (
          <div
            key={st.id}
            className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/50 hover:bg-white hover:border-sky-300 hover:shadow-xs transition-all flex flex-col justify-between relative group"
          >
            <div>
              <div className="flex items-start gap-3">
                {/* Photo Avatar */}
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img
                    src={st.avatar}
                    alt={st.nameGu}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Student info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xs font-bold text-slate-700 bg-slate-200/70 px-1.5 py-0.5 rounded">
                      #{st.rollNo}
                    </span>
                    <span className={`text-2xs font-semibold ${st.gender === 'boy' ? 'text-sky-700' : 'text-rose-700'}`}>
                      {st.gender === 'boy' ? 'કુમાર' : 'કન્યા'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 truncate" title={st.nameGu}>
                    {st.nameGu}
                  </h4>
                  <p className="text-2xs text-slate-600 truncate">
                    {st.nameEn}
                  </p>
                  <div className="text-2xs text-slate-500 font-mono mt-0.5">
                    GR: {st.grNo}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar: Edit & Delete buttons */}
            <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-2xs">
              <span className="text-slate-500 flex items-center gap-1 truncate max-w-28" title={st.phone || ''}>
                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{st.phone || 'મોબાઇલ નથી'}</span>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(st)}
                  className="flex items-center gap-1 text-sky-700 hover:text-sky-900 font-semibold cursor-pointer px-2 py-1 rounded-lg hover:bg-sky-50 transition-colors"
                  title="ફોટો અને વિગત બદલો"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>એડિટ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudentToDelete(st)}
                  className="flex items-center gap-1 text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  title="વિદ્યાર્થી ડિલીટ કરો"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>ડિલીટ</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State when filtered or no students */}
      {displayList.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <AlertCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-semibold">કોઈ વિદ્યાર્થી મળ્યા નથી.</p>
          <button
            onClick={openAddModal}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>નવો વિદ્યાર્થી ઉમેરો</span>
          </button>
        </div>
      )}

      {/* MODAL 1: ADD NEW STUDENT (નવો વિદ્યાર્થી ઉમેરો) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    નવો વિદ્યાર્થી ઉમેરો
                  </h3>
                  <p className="text-2xs text-slate-500">
                    ધોરણ ૭ વર્ગ યાદીમાં નવો વિદ્યાર્થી દાખલ કરો
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3.5 text-xs">
              
              {/* Photo Upload & Preview */}
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border-2 border-emerald-500 shrink-0 shadow-xs">
                  <img
                    src={newAvatar || createStudentAvatarSvg(newGender)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    ref={addFileInputRef}
                    onChange={handlePhotoUploadForAdd}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addFileInputRef.current?.click()}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>ફોટો પસંદ કરો</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewAvatar(createStudentAvatarSvg(newGender, Math.floor(Math.random() * 50)))}
                      className="px-2.5 py-1.5 text-2xs text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="રેન્ડમ શાળા ગણવેશ અવતાર"
                    >
                      અવતાર બદલો
                    </button>
                  </div>
                  <p className="text-3xs text-slate-500 mt-1">
                    પાસપોર્ટ સાઇઝ ફોટો અથવા શાળા ગણવેશ અવતાર
                  </p>
                </div>
              </div>

              {/* Gender and Roll No */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-semibold text-slate-700 mb-1">
                    જાતિ (Gender) *
                  </label>
                  <div className="flex items-center gap-2">
                    <label className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border cursor-pointer font-semibold text-xs ${
                      newGender === 'boy' ? 'border-sky-500 bg-sky-50 text-sky-800' : 'border-slate-200 text-slate-600'
                    }`}>
                      <input
                        type="radio"
                        name="addGender"
                        value="boy"
                        checked={newGender === 'boy'}
                        onChange={() => handleGenderChangeForNewStudent('boy')}
                        className="hidden"
                      />
                      <span>👦 કુમાર</span>
                    </label>

                    <label className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border cursor-pointer font-semibold text-xs ${
                      newGender === 'girl' ? 'border-rose-500 bg-rose-50 text-rose-800' : 'border-slate-200 text-slate-600'
                    }`}>
                      <input
                        type="radio"
                        name="addGender"
                        value="girl"
                        checked={newGender === 'girl'}
                        onChange={() => handleGenderChangeForNewStudent('girl')}
                        className="hidden"
                      />
                      <span>👧 કન્યા</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-semibold text-slate-700 mb-1">
                    રોલ નંબર *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newRollNo}
                    onChange={(e) => setNewRollNo(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 font-mono font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Gujarati Name */}
              <div>
                <label className="block text-2xs font-semibold text-slate-700 mb-1">
                  વિદ્યાર્થીનું નામ (ગુજરાતીમાં) *
                </label>
                <input
                  type="text"
                  placeholder="દા.ત. પટેલ આર્યનકુમાર મુકેશભાઈ"
                  value={newNameGu}
                  onChange={(e) => setNewNameGu(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* English Name */}
              <div>
                <label className="block text-2xs font-semibold text-slate-700 mb-1">
                  વિદ્યાર્થીનું નામ (English)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Patel Aryan Mukeshbhai"
                  value={newNameEn}
                  onChange={(e) => setNewNameEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* GR No & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-semibold text-slate-700 mb-1">
                    જનરલ રજિસ્ટર (GR) નં.
                  </label>
                  <input
                    type="text"
                    value={newGrNo}
                    onChange={(e) => setNewGrNo(e.target.value)}
                    placeholder="1425"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-semibold text-slate-700 mb-1">
                    વાલીનો મોબાઇલ નંબર
                  </label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="98790XXXXX"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Father / Guardian Name */}
              <div>
                <label className="block text-2xs font-semibold text-slate-700 mb-1">
                  પિતા / વાલીનું નામ
                </label>
                <input
                  type="text"
                  value={newFatherName}
                  onChange={(e) => setNewFatherName(e.target.value)}
                  placeholder="પિતાનું નામ"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg cursor-pointer"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  {addSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>વિદ્યાર્થી ઉમેરાઈ ગયો!</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>વિદ્યાર્થી ઉમેરો</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT STUDENT (વિગત અને ફોટો બદલો) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  વિદ્યાર્થી વિગત & ફોટો એડિટ
                </h3>
                <p className="text-2xs text-slate-500">
                  રોલ નંબર: #{selectedStudent.rollNo} · {selectedStudent.gender === 'boy' ? 'કુમાર' : 'કન્યા'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4">
              {/* Photo Upload Preview */}
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border-2 border-sky-500 shrink-0 shadow-xs">
                  <img
                    src={editAvatar}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUploadForEdit}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-100 hover:bg-sky-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>નવો ફોટો અપલોડ કરો</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditAvatar(createStudentAvatarSvg(selectedStudent.gender))}
                      className="px-2.5 py-1.5 text-2xs text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      અવતાર
                    </button>
                  </div>
                  <p className="text-3xs text-slate-500 mt-1">
                    મોબાઇલ ગેલેરી અથવા કમ્પ્યુટરમાંથી પાસપોર્ટ ફોટો પસંદ કરો
                  </p>
                </div>
              </div>

              {/* Gujarati Name */}
              <div>
                <label className="block text-2xs font-semibold text-slate-700 mb-1">
                  વિદ્યાર્થીનું નામ (ગુજરાતીમાં)
                </label>
                <input
                  type="text"
                  value={editNameGu}
                  onChange={(e) => setEditNameGu(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              {/* English Name */}
              <div>
                <label className="block text-2xs font-semibold text-slate-700 mb-1">
                  વિદ્યાર્થીનું નામ (English)
                </label>
                <input
                  type="text"
                  value={editNameEn}
                  onChange={(e) => setEditNameEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              {/* G.R. Number & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-semibold text-slate-700 mb-1">
                    જનરલ રજિસ્ટર (GR) નં.
                  </label>
                  <input
                    type="text"
                    value={editGrNo}
                    onChange={(e) => setEditGrNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-semibold text-slate-700 mb-1">
                    વાલીનો મોબાઇલ નંબર
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="98790XXXXX"
                  />
                </div>
              </div>

              {/* Father's Name */}
              <div>
                <label className="block text-2xs font-semibold text-slate-700 mb-1">
                  પિતા / વાલીનું નામ
                </label>
                <input
                  type="text"
                  value={editFatherName}
                  onChange={(e) => setEditFatherName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Buttons: Delete, Cancel, Save */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStudentToDelete(selectedStudent)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 rounded-lg cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>વિદ્યાર્થી કાઢી નાખો</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg cursor-pointer"
                  >
                    રદ કરો
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>સાચવી લીધું!</span>
                      </>
                    ) : (
                      <span>સાચવો</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: IN-APP DELETE CONFIRMATION MODAL */}
      <DeleteConfirmModal
        isOpen={Boolean(studentToDelete)}
        student={studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* MODAL 4: IN-APP RESET TO DEFAULT CONFIRMATION */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              મૂળ યાદી પુનઃસ્થાપિત કરવી છે?
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              શું તમે મૂળ ૨૧ વિદ્યાર્થીઓની ડિફોલ્ટ યાદી (૯ કુમાર, ૧૨ કન્યા) પુનઃસ્થાપિત કરવા માંગો છો?
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                રદ કરો
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetAllStudents();
                  setIsResetConfirmOpen(false);
                  showToast('મૂળ ૨૧ વિદ્યાર્થીઓની યાદી પુનઃસ્થાપિત થઈ ગઈ છે.');
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg cursor-pointer"
              >
                હા, પુનઃસ્થાપિત કરો
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
