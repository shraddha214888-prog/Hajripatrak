import { Student, SchoolInfo } from '../types/attendance';

export const DEFAULT_SCHOOL_INFO: SchoolInfo = {
  schoolNameGu: 'નાની ઉમરવાણ પ્રાથમિક શાળા',
  schoolNameEn: 'Nani Umarvan Primary School',
  standard: '૭ (સાત)',
  division: 'અ',
  academicYear: '૨૦૨૫-૨૬',
  clusterCRC: 'ઉમરવાણ સી.આર.સી.',
  taluka: 'હાલોલ',
  district: 'પંચમહાલ',
  classTeacher: 'વર્ગ શિક્ષક શ્રી',
  principal: 'મુખ્ય શિક્ષક શ્રી',
  udiseCode: '24170307402',
};

// SVG Avatar generator with authentic school uniforms and diverse student features
export function createStudentAvatarSvg(gender: 'boy' | 'girl', seed: number = Math.floor(Math.random() * 50)): string {
  const boyHairStyles = [
    '<path d="M22 36 C22 18, 38 10, 64 10 C90 10, 106 18, 106 36 C106 25, 95 18, 64 18 C33 18, 22 25, 22 36 Z" fill="#1e293b"/>',
    '<path d="M24 38 C24 15, 42 12, 64 12 C86 12, 104 15, 104 38 C104 22, 90 16, 64 16 C38 16, 24 22, 24 38 Z" fill="#0f172a"/><path d="M22 38 Q35 22 64 26 Q95 24 106 38" fill="#1e293b"/>',
    '<path d="M25 35 C25 14, 45 8, 64 8 C83 8, 103 14, 103 35 C103 20, 85 14, 64 14 C43 14, 25 20, 25 35 Z" fill="#334155"/>',
    '<path d="M23 40 C20 20, 40 10, 64 10 C88 10, 108 20, 105 40 C100 24, 88 18, 64 18 C40 18, 28 24, 23 40 Z" fill="#18181b"/>',
  ];

  const girlHairStyles = [
    // Two braided ribbons style
    '<path d="M24 40 C24 16, 40 10, 64 10 C88 10, 104 16, 104 40 C104 22, 90 16, 64 16 C38 16, 24 22, 24 40 Z" fill="#1e293b"/><path d="M22 38 C16 48, 14 75, 18 92 C20 85, 24 60, 26 44 Z" fill="#1e293b"/><path d="M106 38 C112 48, 114 75, 110 92 C108 85, 104 60, 102 44 Z" fill="#1e293b"/><circle cx="18" cy="85" r="5" fill="#ef4444"/><circle cx="110" cy="85" r="5" fill="#ef4444"/>',
    // Neat hair with red ribbon hairband
    '<path d="M22 42 C20 18, 40 10, 64 10 C88 10, 108 18, 106 42 C106 24, 88 16, 64 16 C40 16, 22 24, 22 42 Z" fill="#0f172a"/><path d="M26 30 C35 18, 93 18, 102 30" stroke="#dc2626" stroke-width="4" fill="none"/><path d="M22 42 C18 56, 18 78, 24 88 C26 76, 26 56, 28 42 Z" fill="#0f172a"/><path d="M106 42 C110 56, 110 78, 104 88 C102 76, 102 56, 100 42 Z" fill="#0f172a"/>',
    // Long braids
    '<path d="M20 40 C20 15, 42 8, 64 8 C86 8, 108 15, 108 40 C108 22, 90 15, 64 15 C38 15, 20 22, 20 40 Z" fill="#1e293b"/><path d="M16 45 C12 65, 12 95, 17 110 C19 100, 22 75, 25 50 Z" fill="#1e293b"/><path d="M112 45 C116 65, 116 95, 111 110 C109 100, 106 75, 103 50 Z" fill="#1e293b"/>',
    // Ponytail with flower pin
    '<path d="M24 38 C24 16, 42 12, 64 12 C86 12, 104 16, 104 38 C104 22, 90 16, 64 16 C38 16, 24 22, 24 38 Z" fill="#111827"/><circle cx="100" cy="28" r="6" fill="#f59e0b"/><circle cx="100" cy="28" r="3" fill="#ffffff"/><path d="M100 32 C108 45, 112 70, 110 85 C106 72, 104 55, 100 38 Z" fill="#111827"/>',
  ];

  const skinTones = ['#f5d0b5', '#e8b997', '#d99e74', '#c98a5e', '#efc29f'];
  const skin = skinTones[seed % skinTones.length];
  const bgColors = [
    '#e0f2fe', '#f0fdf4', '#fef3c7', '#fae8ff', '#f1f5f9', '#ffe4e6', '#ecfdf5', '#fef9c3', '#e0e7ff'
  ];
  const bg = bgColors[seed % bgColors.length];

  const hair = gender === 'boy' 
    ? boyHairStyles[seed % boyHairStyles.length] 
    : girlHairStyles[seed % girlHairStyles.length];

  // School uniform shirt (Gujarat primary school white/sky-blue or navy uniform with tie/collar)
  const uniformColors = ['#0284c7', '#1d4ed8', '#0f766e', '#334155'];
  const uniform = uniformColors[seed % uniformColors.length];
  const tie = seed % 3 === 0 ? '<path d="M62 88 L66 88 L67 114 L64 120 L61 114 Z" fill="#dc2626"/>' : '';

  // Bindi for girls occasionally
  const bindi = gender === 'girl' && seed % 2 === 0 ? '<circle cx="64" cy="44" r="2" fill="#dc2626"/>' : '';

  // Specs for a couple of students
  const glasses = (seed === 3 || seed === 14) ? `
    <circle cx="50" cy="53" r="8" fill="none" stroke="#334155" stroke-width="2"/>
    <circle cx="78" cy="53" r="8" fill="none" stroke="#334155" stroke-width="2"/>
    <line x1="58" y1="53" x2="70" y2="53" stroke="#334155" stroke-width="2"/>
    <line x1="42" y1="53" x2="35" y2="51" stroke="#334155" stroke-width="2"/>
    <line x1="86" y1="53" x2="93" y2="51" stroke="#334155" stroke-width="2"/>
  ` : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%">
    <rect width="128" height="128" rx="64" fill="${bg}"/>
    <!-- Shoulders and Uniform -->
    <path d="M24 128 C24 100, 42 90, 64 90 C86 90, 104 100, 104 128 Z" fill="${uniform}"/>
    <!-- Shirt Collar -->
    <path d="M46 90 L64 105 L52 90 Z" fill="#ffffff"/>
    <path d="M82 90 L64 105 L76 90 Z" fill="#ffffff"/>
    <path d="M52 90 L64 102 L76 90 L64 95 Z" fill="#f8fafc"/>
    ${tie}
    <!-- Neck -->
    <rect x="55" y="74" width="18" height="18" rx="4" fill="${skin}"/>
    <!-- Head Base -->
    <ellipse cx="64" cy="56" rx="28" ry="32" fill="${skin}"/>
    <!-- Ears -->
    <circle cx="34" cy="57" r="7" fill="${skin}"/>
    <circle cx="94" cy="57" r="7" fill="${skin}"/>
    <!-- Hair -->
    ${hair}
    <!-- Eyes -->
    <circle cx="51" cy="54" r="3.5" fill="#1e293b"/>
    <circle cx="77" cy="54" r="3.5" fill="#1e293b"/>
    <circle cx="52.5" cy="52.5" r="1.2" fill="#ffffff"/>
    <circle cx="78.5" cy="52.5" r="1.2" fill="#ffffff"/>
    <!-- Eyebrows -->
    <path d="M44 48 Q51 45 58 48" stroke="#1e293b" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M70 48 Q77 45 84 48" stroke="#1e293b" stroke-width="2" stroke-linecap="round" fill="none"/>
    <!-- Nose -->
    <path d="M63 56 Q64 63 66 63" stroke="#b45309" stroke-width="1.8" stroke-linecap="round" fill="none"/>
    <!-- Cheerful Smile -->
    <path d="M54 69 Q64 77 74 69" stroke="#b91c1c" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    ${bindi}
    ${glasses}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Exactly 21 students: 9 Boys (કુમાર: Roll 1-9) & 12 Girls (કન્યા: Roll 10-21)
// Authentic Gujarati primary school roster for Std 7
export const INITIAL_STUDENTS: Student[] = [
  // 9 Boys (કુમાર - Roll 1 to 9)
  {
    id: 'std7-01',
    rollNo: 1,
    grNo: '1421',
    nameGu: 'પટેલ આર્યનકુમાર મુકેશભાઈ',
    nameEn: 'Patel Aryan Mukeshbhai',
    gender: 'boy',
    avatar: createStudentAvatarSvg('boy', 1),
    fatherNameGu: 'મુકેશભાઈ પટેલ',
    dob: '2013-04-12',
    phone: '9879012341',
  },
  {
    id: 'std7-02',
    rollNo: 2,
    grNo: '1422',
    nameGu: 'વસાવા રોહિતભાઈ રમેશભાઈ',
    nameEn: 'Vasava Rohit Rameshbhai',
    gender: 'boy',
    avatar: createStudentAvatarSvg('boy', 2),
    fatherNameGu: 'રમેશભાઈ વસાવા',
    dob: '2013-06-25',
    phone: '9879012342',
  },
  {
    id: 'std7-03',
    rollNo: 3,
    grNo: '1423',
    nameGu: 'રાઠવા મિતેશભાઈ સુરેશભાઈ',
    nameEn: 'Rathwa Mitesh Sureshbhai',
    gender: 'boy',
    avatar: createStudentAvatarSvg('boy', 3),
    fatherNameGu: 'સુરેશભાઈ રાઠવા',
    dob: '2013-02-18',
    phone: '9879012343',
  },
  {
    id: 'std7-04',
    rollNo: 4,
    grNo: '1424',
    nameGu: 'ચૌહાણ પ્રિન્સકુમાર હરેશભાઈ',
    nameEn: 'Chauhan Prince Hareshbhai',
    gender: 'boy',
    avatar: createStudentAvatarSvg('boy', 4),
    fatherNameGu: 'હરેશભાઈ ચૌહાણ',
    dob: '2013-09-08',
    phone: '9879012344',
  },
  {
    id: 'std7-05',
    rollNo: 5,
    grNo: '1425',
    nameGu: 'પરમાર આયુષકુમાર વિનોદભાઈ',
    nameEn: 'Parmar Ayush Vinodbhai',
    gender: 'boy',
    avatar: createStudentAvatarSvg('boy', 5),
    fatherNameGu: 'વિનોદભાઈ પરમાર',
    dob: '2013-11-14',
    phone: '9879012345',
  },
  {
    id: 'std7-06',
    rollNo: 6,
    grNo: '1426',
    nameGu: 'ઠાકોર ધ્રુવકુમાર અશ્વિનભાઈ',
    nameEn: 'Thakor Dhruv Ashwinbhai',
    gender: 'boy',
    avatar: createStudentAvatarSvg('boy', 6),
    fatherNameGu: 'અશ્વિનભાઈ ઠાકોર',
    dob: '2013-01-30',
    phone: '9879012346',
  },
  {
    id: 'std7-07',
    rollNo: 7,
    grNo: '1427',
    nameGu: 'બારિયા કાર્તિકભાઈ દિનેશભાઈ',
    nameEn: 'Bariya Kartik Dineshbhai',
    gender: 'boy',
    avatar: createStudentAvatarSvg('boy', 7),
    fatherNameGu: 'દિનેશભાઈ બારિયા',
    dob: '2013-07-19',
    phone: '9879012347',
  },
  {
    id: 'std7-08',
    rollNo: 8,
    grNo: '1428',
    nameGu: 'સોલંકી પાર્થકુમાર મનોજભાઈ',
    nameEn: 'Solanki Parth Manojbhai',
    gender: 'boy',
    avatar: createStudentAvatarSvg('boy', 8),
    fatherNameGu: 'મનોજભાઈ સોલંકી',
    dob: '2013-08-22',
    phone: '9879012348',
  },
  {
    id: 'std7-09',
    rollNo: 9,
    grNo: '1429',
    nameGu: 'નાયક હર્ષભાઈ કમલેશભાઈ',
    nameEn: 'Nayak Harsh Kamleshbhai',
    gender: 'boy',
    avatar: createStudentAvatarSvg('boy', 9),
    fatherNameGu: 'કમલેશભાઈ નાયક',
    dob: '2013-03-05',
    phone: '9879012349',
  },

  // 12 Girls (કન્યા - Roll 10 to 21)
  {
    id: 'std7-10',
    rollNo: 10,
    grNo: '1430',
    nameGu: 'પટેલ દિયાબેન રાજેશભાઈ',
    nameEn: 'Patel Diya Rajeshbhai',
    gender: 'girl',
    avatar: createStudentAvatarSvg('girl', 10),
    fatherNameGu: 'રાજેશભાઈ પટેલ',
    dob: '2013-05-15',
    phone: '9879012350',
  },
  {
    id: 'std7-11',
    rollNo: 11,
    grNo: '1431',
    nameGu: 'વસાવા પાયલબેન વિપુલભાઈ',
    nameEn: 'Vasava Payal Vipulbhai',
    gender: 'girl',
    avatar: createStudentAvatarSvg('girl', 11),
    fatherNameGu: 'વિપુલભાઈ વસાવા',
    dob: '2013-10-10',
    phone: '9879012351',
  },
  {
    id: 'std7-12',
    rollNo: 12,
    grNo: '1432',
    nameGu: 'રાઠવા ભૂમિકાબેન જગદીશભાઈ',
    nameEn: 'Rathwa Bhumika Jagdishbhai',
    gender: 'girl',
    avatar: createStudentAvatarSvg('girl', 12),
    fatherNameGu: 'જગદીશભાઈ રાઠવા',
    dob: '2013-04-03',
    phone: '9879012352',
  },
  {
    id: 'std7-13',
    rollNo: 13,
    grNo: '1433',
    nameGu: 'ચૌધરી રિયાબેન હિતેશભાઈ',
    nameEn: 'Chaudhari Riya Hiteshbhai',
    gender: 'girl',
    avatar: createStudentAvatarSvg('girl', 13),
    fatherNameGu: 'હિતેશભાઈ ચૌધરી',
    dob: '2013-07-28',
    phone: '9879012353',
  },
  {
    id: 'std7-14',
    rollNo: 14,
    grNo: '1434',
    nameGu: 'સોલંકી અંજલિબેન ભરતભાઈ',
    nameEn: 'Solanki Anjali Bharatbhai',
    gender: 'girl',
    avatar: createStudentAvatarSvg('girl', 14),
    fatherNameGu: 'ભરતભાઈ સોલંકી',
    dob: '2013-12-01',
    phone: '9879012354',
  },
  {
    id: 'std7-15',
    rollNo: 15,
    grNo: '1435',
    nameGu: 'પરમાર ખુશીબેન કિરણભાઈ',
    nameEn: 'Parmar Khushi Kiranbhai',
    gender: 'girl',
    avatar: createStudentAvatarSvg('girl', 15),
    fatherNameGu: 'કિરણભાઈ પરમાર',
    dob: '2013-08-16',
    phone: '9879012355',
  },
  {
    id: 'std7-16',
    rollNo: 16,
    grNo: '1436',
    nameGu: 'ઠાકોર હેત્વીબેન સંજયભાઈ',
    nameEn: 'Thakor Hetvi Sanjaybhai',
    gender: 'girl',
    avatar: createStudentAvatarSvg('girl', 16),
    fatherNameGu: 'સંજયભાઈ ઠાકોર',
    dob: '2013-03-21',
    phone: '9879012356',
  },
  {
    id: 'std7-17',
    rollNo: 17,
    grNo: '1437',
    nameGu: 'વણકર પ્રીતિબેન પંકજભાઈ',
    nameEn: 'Vankar Priti Pankajbhai',
    gender: 'girl',
    avatar: createStudentAvatarSvg('girl', 17),
    fatherNameGu: 'પંકજભાઈ વણકર',
    dob: '2013-09-29',
    phone: '9879012357',
  },
  {
    id: 'std7-18',
    rollNo: 18,
    grNo: '1438',
    nameGu: 'બારિયા સલોનીબેન અરવિંદભાઈ',
    nameEn: 'Bariya Saloni Arvindbhai',
    gender: 'girl',
    avatar: createStudentAvatarSvg('girl', 18),
    fatherNameGu: 'અરવિંદભાઈ બારિયા',
    dob: '2013-06-11',
    phone: '9879012358',
  },
  {
    id: 'std7-19',
    rollNo: 19,
    grNo: '1439',
    nameGu: 'નાયક તન્વીબેન મહેશભાઈ',
    nameEn: 'Nayak Tanvi Maheshbhai',
    gender: 'girl',
    avatar: createStudentAvatarSvg('girl', 19),
    fatherNameGu: 'મહેશભાઈ નાયક',
    dob: '2013-02-14',
    phone: '9879012359',
  },
  {
    id: 'std7-20',
    rollNo: 20,
    grNo: '1440',
    nameGu: 'વસાવા નેહાબેન કનુભાઈ',
    nameEn: 'Vasava Neha Kanubhai',
    gender: 'girl',
    avatar: createStudentAvatarSvg('girl', 20),
    fatherNameGu: 'કનુભાઈ વસાવા',
    dob: '2013-11-09',
    phone: '9879012360',
  },
  {
    id: 'std7-21',
    rollNo: 21,
    grNo: '1441',
    nameGu: 'મિસ્ત્રી ખુશબુબેન પ્રવીણભાઈ',
    nameEn: 'Mistry Khushbu Pravinbhai',
    gender: 'girl',
    avatar: createStudentAvatarSvg('girl', 21),
    fatherNameGu: 'પ્રવીણભાઈ મિસ્ત્રી',
    dob: '2013-01-17',
    phone: '9879012361',
  },
];
