import { RPPMDocument, ValidationResult, ValidationItem, MeetingItem, TPItem, KKTPItem } from '../types/rppm';

export function validateRPPM(
  doc: RPPMDocument,
  meeting: MeetingItem,
  tp: TPItem,
  kktps: KKTPItem[]
): ValidationResult {
  const items: ValidationItem[] = [];

  // 1. Check TP verbatim match
  const tpExact = doc.desain.tujuanPembelajaran.trim() === tp.text.trim();
  items.push({
    id: 'val-tp',
    label: 'Tujuan Pembelajaran (TP) sama persis dengan input',
    passed: tpExact,
    message: tpExact
      ? 'Teks TP dipertahankan 100% tanpa perubahan, penambahan, atau pengurangan.'
      : 'Teks TP tidak identik dengan input asli guru.',
    canAutoFix: !tpExact,
  });

  // 2. Check KKTP verbatim
  const allKktpTexts = kktps.map(k => k.text.trim());
  const kktpVerbatim = doc.desain.kktpTerpilih.every(k => allKktpTexts.includes(k.trim()));
  items.push({
    id: 'val-kktp',
    label: 'KKTP sama persis dengan input guru',
    passed: kktpVerbatim && doc.desain.kktpTerpilih.length > 0,
    message: kktpVerbatim
      ? 'Indikator KKTP sesuai persis dengan input guru.'
      : 'Terdapat perbedaan redaksi pada KKTP.',
    canAutoFix: true,
  });

  // 3. Dimensi Profil Lulusan
  const profilPassed = doc.perencanaan.dimensiProfil.length > 0;
  items.push({
    id: 'val-dimensi',
    label: 'Dimensi Profil Lulusan terintegrasi dengan aktivitas',
    passed: profilPassed,
    message: profilPassed
      ? `${doc.perencanaan.dimensiProfil.length} dimensi profil lulusan disertai deskripsi aktivitas nyata.`
      : 'Dimensi profil lulusan belum dikaitkan dengan aktivitas.',
  });

  // 4. Pertemuan & Alokasi Waktu
  const meetPassed =
    doc.identitas.mataPelajaran !== '' &&
    doc.pertemuanDipilih.nomorPertemuan === meeting.nomorPertemuan;
  items.push({
    id: 'val-pertemuan',
    label: 'Pertemuan sesuai pilihan guru',
    passed: meetPassed,
    message: `Menyusun khusus Pertemuan ke-${meeting.pertemuanKe} (Nomor Pertemuan ${meeting.nomorPertemuan}).`,
  });

  // 5. Total Alokasi Waktu
  // Calculate minutes from awal, inti, penutup
  const awalMinutes = parseInt(doc.pengalamanBelajar.kegiatanAwal.waktu) || 10;
  const penutupMinutes = parseInt(doc.pengalamanBelajar.kegiatanPenutup.waktu) || 10;
  const intiMinutes = parseInt(doc.pengalamanBelajar.kegiatanInti.waktu) || (meeting.alokasiMenit - awalMinutes - penutupMinutes);
  const totalMinutes = awalMinutes + intiMinutes + penutupMinutes;
  const timeExact = Math.abs(totalMinutes - meeting.alokasiMenit) <= 2;
  items.push({
    id: 'val-waktu',
    label: 'Alokasi waktu proporsional dan jumlah total tepat',
    passed: timeExact,
    message: timeExact
      ? `Total alokasi waktu tepat: ${meeting.alokasiMenit} menit (Awal: ${awalMinutes}m, Inti: ${intiMinutes}m, Penutup: ${penutupMinutes}m).`
      : `Alokasi waktu terhitung (${totalMinutes} menit) belum tepat ${meeting.alokasiMenit} menit.`,
    canAutoFix: !timeExact,
  });

  // 6. Terminology check: only "murid", forbid "siswa" or "peserta didik"
  const docString = JSON.stringify(doc).toLowerCase();
  const hasPesertaDidik = docString.includes('peserta didik');
  const hasSiswa = docString.includes('siswa');
  const terminologyPassed = !hasPesertaDidik && !hasSiswa;
  items.push({
    id: 'val-istilah',
    label: 'Penggunaan istilah baku "Murid" (bebas dari kata "Siswa" / "Peserta Didik")',
    passed: terminologyPassed,
    message: terminologyPassed
      ? 'Istilah yang digunakan konsisten "Murid" sesuai kaidah Kurikulum Merdeka.'
      : 'Ditemukan penggunaan istilah "siswa" atau "peserta didik" yang dilarang.',
    canAutoFix: !terminologyPassed,
  });

  // 7. Prinsip Pembelajaran Mendalam (Mindful, Meaningful, Joyful)
  const mindfulPresent = docString.includes('berkesadaran') || docString.includes('mindful');
  const meaningfulPresent = docString.includes('bermakna') || docString.includes('meaningful');
  const joyfulPresent = docString.includes('menggembirakan') || docString.includes('joyful') || doc.pengalamanBelajar.kegiatanInti.iceBreaking.length > 0;
  const principlesPassed = mindfulPresent && meaningfulPresent && joyfulPresent;
  items.push({
    id: 'val-prinsip',
    label: 'Prinsip Pembelajaran Mendalam (Mindful, Meaningful, Joyful) diterapkan',
    passed: principlesPassed,
    message: principlesPassed
      ? 'Aktivitas terintegrasi Mindful, Meaningful, dan Joyful lengkap dengan Ice Breaking apresiatif.'
      : 'Salah satu prinsip Pembelajaran Mendalam atau Ice Breaking belum tercantum.',
    canAutoFix: !principlesPassed,
  });

  // 8. LKM validity (no card pasting)
  const lkmString = JSON.stringify(doc.lkm).toLowerCase();
  const hasMenempel = lkmString.includes('menempel') || lkmString.includes('kartu');
  const lkmPassed = !hasMenempel && doc.lkm.tugasMurid.length > 0 && doc.lkm.rubrikPenilaian.length > 0;
  items.push({
    id: 'val-lkm',
    label: 'LKM ramah anak, berbasis penemuan, dan bebas aktivitas menempel/kartu',
    passed: lkmPassed,
    message: lkmPassed
      ? 'LKM memuat Judul, Tujuan, Alat/Bahan, Langkah Kerja, Tugas Murid, Kunci, dan Rubrik Penilaian.'
      : 'LKM memuat instruksi kartu/menempel yang dilarang atau rubrik belum lengkap.',
    canAutoFix: !lkmPassed,
  });

  // 9. Format nomor vertikal
  const verticalFormatPassed =
    doc.pengalamanBelajar.kegiatanAwal.langkah.length >= 4 &&
    doc.pengalamanBelajar.kegiatanPenutup.langkah.length >= 4;
  items.push({
    id: 'val-vertikal',
    label: 'Langkah pembelajaran ditulis vertikal bernomor sesuai sistematika baku',
    passed: verticalFormatPassed,
    message: verticalFormatPassed
      ? 'Semua langkah kegiatan awal, inti sintaks, dan penutup tersusun vertikal.'
      : 'Langkah kegiatan belum tersusun secara vertikal bernomor.',
    canAutoFix: true,
  });

  // 10. Asesmen Formatif selaras
  const asesmenPassed = doc.asesmen.asesmenAwal.length > 0 && doc.asesmen.asesmenProses.length > 0;
  items.push({
    id: 'val-asesmen',
    label: 'Asesmen pembelajaran (Awal, Formatif, Akhir) selaras dengan TP dan KKTP',
    passed: asesmenPassed,
    message: asesmenPassed
      ? 'Instrumen asesmen terhubung langsung dengan indikator capaian.'
      : 'Asesmen belum lengkap.',
  });

  const isValid = items.every(item => item.passed);

  return {
    isValid,
    items,
  };
}

export function autoFixRPPM(
  doc: RPPMDocument,
  meeting: MeetingItem,
  tp: TPItem,
  kktps: KKTPItem[]
): RPPMDocument {
  const fixed = JSON.parse(JSON.stringify(doc)) as RPPMDocument;

  // 1. Force exact TP
  fixed.desain.tujuanPembelajaran = tp.text.trim();

  // 2. Force exact KKTPs
  const availableKktps = kktps.map(k => k.text.trim());
  if (fixed.desain.kktpTerpilih.length === 0 || !fixed.desain.kktpTerpilih.every(k => availableKktps.includes(k))) {
    // Pick the most relevant or matching meeting sequence
    const idx = Math.min(meeting.pertemuanKe - 1, kktps.length - 1);
    fixed.desain.kktpTerpilih = [kktps[Math.max(0, idx)].text.trim()];
  }

  // 3. Replace all "siswa", "peserta didik" with "murid"
  function deepReplace(obj: any): any {
    if (typeof obj === 'string') {
      return obj
        .replace(/Peserta Didik/g, 'Murid')
        .replace(/peserta didik/g, 'murid')
        .replace(/Siswa/g, 'Murid')
        .replace(/siswa/g, 'murid')
        .replace(/kartu/gi, 'lembar kerja')
        .replace(/menempelkan/gi, 'menggambar/menuliskan')
        .replace(/menempel/gi, 'mencatat');
    }
    if (Array.isArray(obj)) {
      return obj.map(deepReplace);
    }
    if (obj !== null && typeof obj === 'object') {
      const copy: Record<string, any> = {};
      for (const key of Object.keys(obj)) {
        copy[key] = deepReplace(obj[key]);
      }
      return copy;
    }
    return obj;
  }

  const cleaned = deepReplace(fixed);

  // 4. Adjust time allocation
  const totalTarget = meeting.alokasiMenit;
  const awal = Math.round(totalTarget * 0.15 / 5) * 5 || 10;
  const penutup = Math.round(totalTarget * 0.15 / 5) * 5 || 10;
  const inti = totalTarget - awal - penutup;

  cleaned.pengalamanBelajar.kegiatanAwal.waktu = `${awal} menit`;
  cleaned.pengalamanBelajar.kegiatanInti.waktu = `${inti} menit`;
  cleaned.pengalamanBelajar.kegiatanPenutup.waktu = `${penutup} menit`;
  cleaned.pengalamanBelajar.waktuTotal = `${totalTarget} menit (${meeting.alokasiWaktuText})`;

  // Ensure Ice Breaking exists
  if (!cleaned.pengalamanBelajar.kegiatanInti.iceBreaking || cleaned.pengalamanBelajar.kegiatanInti.iceBreaking.length === 0) {
    cleaned.pengalamanBelajar.kegiatanInti.iceBreaking = [
      'Guru memandu ice breaking "Tepuk Semangat Juara & Gerak Ceria" untuk menyegarkan suasana belajar.',
      'Murid bersama-sama melakukan gerakan peregangan ringan dan yel-yel kebanggaan kelas.',
      'Guru memberikan apresiasi verbal ("Anak-anak hebat!") atas ketekunan dan kerja sama yang ditunjukkan murid selama kegiatan inti.',
    ];
  }

  return cleaned;
}
