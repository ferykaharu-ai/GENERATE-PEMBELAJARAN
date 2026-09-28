export type FaseType = 'Fase A' | 'Fase B' | 'Fase C' | 'Fase D' | 'Fase E' | 'Fase F';

export interface FaseOption {
  fase: FaseType;
  kelas: string;
  jenjang: string;
  usia: string;
}

export const FASE_OPTIONS: FaseOption[] = [
  { fase: 'Fase A', kelas: 'Kelas I–II', jenjang: 'SD/MI', usia: '6–7 tahun' },
  { fase: 'Fase B', kelas: 'Kelas III–IV', jenjang: 'SD/MI', usia: '8–9 tahun' },
  { fase: 'Fase C', kelas: 'Kelas V–VI', jenjang: 'SD/MI', usia: '9–10 tahun' },
  { fase: 'Fase D', kelas: 'Kelas VII–IX', jenjang: 'SMP/MTs', usia: '11–12 tahun' },
  { fase: 'Fase E', kelas: 'Kelas X', jenjang: 'SMA/MA/SMK/MAK', usia: '13–14 tahun' },
  { fase: 'Fase F', kelas: 'Kelas XI–XII', jenjang: 'SMA/MA/SMK/MAK', usia: '15–16 tahun' },
];

export const MATA_PELAJARAN_LIST = [
  'Pendidikan Agama dan Budi Pekerti',
  'Pendidikan Pancasila',
  'Bahasa Indonesia',
  'Matematika',
  'IPAS',
  'IPA',
  'IPS',
  'Bahasa Inggris',
  'PJOK',
  'KKA',
  'Informatika',
  'Sejarah',
  'Seni Musik',
  'Seni Rupa',
  'Seni Tari',
  'Seni Teater',
  'Fisika',
  'Kimia',
  'Biologi',
  'Ekonomi',
  'Sosiologi',
  'Geografi',
  'Antropologi',
  'Bahasa dan Sastra',
  'Muatan Lokal',
] as const;

export type MataPelajaran = (typeof MATA_PELAJARAN_LIST)[number];

export type DimensiProfil =
  | 'Keimanan & Ketakwaan'
  | 'Kewargaan'
  | 'Penalaran Kritis'
  | 'Kreativitas'
  | 'Kolaborasi'
  | 'Kemandirian'
  | 'Kesehatan'
  | 'Komunikasi';

export const ALL_DIMENSI: DimensiProfil[] = [
  'Keimanan & Ketakwaan',
  'Kewargaan',
  'Penalaran Kritis',
  'Kreativitas',
  'Kolaborasi',
  'Kemandirian',
  'Kesehatan',
  'Komunikasi',
];

export type PengalamanBelajar =
  | 'Memahami'
  | 'Mengaplikasi'
  | 'Merefleksi'
  | 'Memahami dan Mengaplikasi'
  | 'Mengaplikasi dan Merefleksi'
  | 'Memahami, Mengaplikasi, dan Merefleksi';

export type ModelPembelajaran =
  | 'Discovery Learning'
  | 'Inquiry Learning'
  | 'Problem Based Learning (PBL)'
  | 'Project Based Learning (PjBL)'
  | 'Cooperative Learning';

export interface TeacherIdentity {
  namaGuru: string;
  nipGuru: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  satuanPendidikan: string;
  fase: FaseType;
  kelas: string;
  semester: '1 (GANJIL)' | '2 (GENAP)';
  mataPelajaran: string;
}

export interface TPItem {
  id: string;
  code: string; // e.g. "TP 3.5"
  text: string;
}

export interface KKTPItem {
  id: string;
  tpId: string;
  number: number;
  text: string;
}

export interface MeetingItem {
  id: string;
  tpId: string;
  pertemuanKe: number; // e.g. 1 (urutan dalam TP)
  nomorPertemuan: number; // e.g. 13 (nomor pertemuan umum)
  alokasiWaktuText: string; // e.g. "2 × 35 menit"
  alokasiMenit: number; // e.g. 70
  fokusPengalaman: PengalamanBelajar;
  topikSpesifik?: string;
}

export interface UploadedMaterial {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string;
  uploadedAt: string;
}

export type BentukSoal =
  | 'Pilihan Ganda'
  | 'Pilihan Ganda Kompleks'
  | 'Benar-Salah'
  | 'Menjodohkan'
  | 'Isian Singkat'
  | 'Uraian';

export interface FormativeConfig {
  tampilkanKisiKisi: boolean;
  kunciJawabanMode: 'sertakan' | 'pisahkan' | 'jangan_sertakan';
  selectedBentuk: BentukSoal[];
  jumlahSoal: Record<BentukSoal, number>;
  stimulusTypes: string[];
}

export interface QuestionPG {
  nomor: number;
  stimulus?: string;
  pertanyaan: string;
  kktpIndikator?: string;
  opsi: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
  kunci: 'A' | 'B' | 'C' | 'D';
  pembahasan?: string;
  tingkatKesulitan: 'Mudah' | 'Sedang' | 'HOTS';
}

export interface QuestionPGKompleks {
  nomor: number;
  stimulus?: string;
  petunjuk: string;
  pertanyaan: string;
  kktpIndikator?: string;
  opsi: { key: string; text: string; isCorrect: boolean }[];
  kunci: string[];
  pembahasan?: string;
  tingkatKesulitan: 'Sedang' | 'HOTS';
}

export interface QuestionBenarSalah {
  nomor: number;
  stimulus?: string;
  kktpIndikator?: string;
  pernyataanList: {
    teks: string;
    kunci: 'Benar' | 'Salah';
  }[];
  tingkatKesulitan: 'Mudah' | 'Sedang';
}

export interface QuestionMenjodohkan {
  nomor: number;
  stimulus?: string;
  petunjuk: string;
  kktpIndikator?: string;
  pasangan: {
    kiri: string;
    kanan: string;
    kunciPasangan: string;
  }[];
  tingkatKesulitan: 'Sedang';
}

export interface QuestionIsian {
  nomor: number;
  stimulus?: string;
  pertanyaan: string;
  kktpIndikator?: string;
  kunci: string;
  tingkatKesulitan: 'Mudah' | 'Sedang';
}

export interface QuestionUraian {
  nomor: number;
  stimulus?: string;
  pertanyaan: string;
  kktpIndikator?: string;
  pedomanPenskoran: string;
  kunci: string;
  tingkatKesulitan: 'Sedang' | 'HOTS';
}

export interface KisiKisiItem {
  nomor: number;
  bentukSoal: string;
  kktp: string;
  indikatorSoal: string;
  tingkatKesulitan: string;
}

export interface FormativeAssessmentData {
  kisiKisi: KisiKisiItem[];
  soalPG: QuestionPG[];
  soalPGKompleks: QuestionPGKompleks[];
  soalBenarSalah: QuestionBenarSalah[];
  soalMenjodohkan: QuestionMenjodohkan[];
  soalIsian: QuestionIsian[];
  soalUraian: QuestionUraian[];
}

export interface LKMData {
  judul: string;
  tujuan: string[];
  alatDanBahan: string[];
  langkahKerja: string[];
  tugasMurid: string[];
  kunciJawaban: string[];
  rubrikPenilaian: {
    aspek: string;
    skor4: string;
    skor3: string;
    skor2: string;
    skor1: string;
  }[];
}

export interface MateriAjarData {
  konsepInti: string;
  subKonsep: string[];
  penjelasanBertahap: string[];
  contohKontekstual: string[];
  hubunganKehidupanNyata: string;
  sumberBelajar: string;
}

export interface LangkahKegiatan {
  tahap: string; // e.g. "Kegiatan Awal", "Sintaks 1: Orientasi Murid pada Masalah", "Ice Breaking", "Kegiatan Penutup"
  sintaks?: string;
  kegiatan: string[]; // Vertical list of numbered activities
  waktu: string;
}

export interface RPPMDocument {
  id: string;
  createdAt: string;
  generatorSource: 'gemini' | 'aplikasi';
  
  // Header Identity
  identitas: TeacherIdentity;
  pertemuanDipilih: MeetingItem;
  
  // I. Identifikasi Perencanaan
  perencanaan: {
    kesiapanMurid: string;
    karakteristikMateri: string;
    dimensiProfil: {
      dimensi: DimensiProfil;
      keterkaitan: string;
    }[];
  };

  // II. Desain Pembelajaran
  desain: {
    topikPembelajaran: string;
    tujuanPembelajaran: string; // exact verbatim
    kktpTerpilih: string[]; // exact verbatim
    modelPembelajaran: ModelPembelajaran;
    alasanModel: string;
    metodePembelajaran: string[];
    kemitraanPembelajaran: string;
    lingkunganPembelajaran: string;
    pemanfaatanDigital: string;
  };

  // III. Pengalaman Belajar
  pengalamanBelajar: {
    fokus: PengalamanBelajar;
    waktuTotal: string;
    kegiatanAwal: {
      langkah: string[];
      waktu: string;
    };
    kegiatanInti: {
      sintaksList: LangkahKegiatan[];
      iceBreaking: string[];
      waktu: string;
    };
    kegiatanPenutup: {
      langkah: string[];
      waktu: string;
    };
  };

  // IV. Asesmen
  asesmen: {
    asesmenAwal: string[];
    asesmenProses: string[];
    asesmenAkhir: string[];
  };

  // V. LKM
  lkm: LKMData;

  // VI. Materi Ajar
  materiAjar: MateriAjarData;

  // VII. Asesmen Formatif (Optional / Configured)
  asesmenFormatif?: FormativeAssessmentData;
  formatifConfig: FormativeConfig;
}

export interface ValidationItem {
  id: string;
  label: string;
  passed: boolean;
  message?: string;
  canAutoFix?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  items: ValidationItem[];
}

export interface RPPMProject {
  id: string;
  name: string;
  lastModified: string;
  identity: TeacherIdentity;
  materials: UploadedMaterial[];
  tps: TPItem[];
  kktps: KKTPItem[];
  selectedDimensi: DimensiProfil[];
  meetings: MeetingItem[];
  activeMeetingId: string;
  formatifConfig: FormativeConfig;
  currentRPPM?: RPPMDocument;
  historyRPPMs: Record<string, RPPMDocument>; // meetingId -> RPPM
}
