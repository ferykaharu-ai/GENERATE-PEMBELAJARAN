import { RPPMProject, FormativeConfig } from '../types/rppm';

export const DEFAULT_FORMATIF_CONFIG: FormativeConfig = {
  tampilkanKisiKisi: true,
  kunciJawabanMode: 'pisahkan',
  selectedBentuk: [
    'Pilihan Ganda',
    'Pilihan Ganda Kompleks',
    'Benar-Salah',
    'Menjodohkan',
    'Isian Singkat',
    'Uraian',
  ],
  jumlahSoal: {
    'Pilihan Ganda': 5,
    'Pilihan Ganda Kompleks': 2,
    'Benar-Salah': 3,
    'Menjodohkan': 2,
    'Isian Singkat': 3,
    'Uraian': 2,
  },
  stimulusTypes: ['Teks Kontekstual', 'Cerita Pendek (2-4 kalimat)', 'Tabel Sederhana'],
};

export const INITIAL_PROJECT: RPPMProject = {
  id: 'proj-sd11-anggrek-default',
  name: 'RPPM IPAS Kelas III - Pelestarian Makhluk Hidup (SDN 11 Anggrek)',
  lastModified: new Date().toISOString(),
  identity: {
    namaGuru: 'FERY GUSTOMI KAHARU, S.Pd',
    nipGuru: '19820917 201001 1 008',
    kepalaSekolah: 'MERLINA DOKE, M.Pd',
    nipKepalaSekolah: '19820917 200801 2 004',
    satuanPendidikan: 'SD NEGERI 11 ANGGREK',
    fase: 'Fase B',
    kelas: 'Kelas III (Tiga)',
    semester: '1 (GANJIL)',
    mataPelajaran: 'IPAS',
  },
  materials: [
    {
      id: 'mat-sample-1',
      name: 'Materi_Ajar_Pelestarian_Makhluk_Hidup_Kelas3.txt',
      size: 14500,
      type: 'text/plain',
      uploadedAt: new Date().toISOString(),
      content: `MATERI AJAR IPAS KELAS III SD
BAB: PELESTARIAN MAKHLUK HIDUP DAN KESEIMBANGAN EKOSISTEM

1. Konsep Inti:
Makhluk hidup (hewan, tumbuhan, dan manusia) saling bergantung dalam satu kesatuan ekosistem. Kelestarian makhluk hidup sangat berpengaruh terhadap keberlangsungan rantai makanan, ketersediaan air bersih, udara segar, serta sumber makanan bagi manusia.

2. Faktor Penyebab Kerusakan Lingkungan:
a. Penebangan liar dan pembakaran hutan yang merusak habitat alami hewan.
b. Perburuan liar terhadap hewan langka untuk diperjualbelikan.
c. Pembuangan sampah dan limbah rumah tangga ke sungai yang mencemari ekosistem air.
d. Penggunaan pestisida berlebihan yang mematikan serangga penyerbuk seperti lebah dan kupu-kupu.

3. Manfaat Pelestarian Hewan dan Tumbuhan:
a. Menjaga keseimbangan rantai makanan agar tidak terjadi ledakan hama.
b. Menyediakan sumber oksigen (dari tumbuhan melalui fotosintesis).
c. Mencegah bencana alam seperti tanah longsor dan banjir (akar pohon menyerap air).
d. Sebagai sumber obat-obatan herbal dan bahan pangan berkelanjutan bagi manusia.

4. Upaya Nyata Pelestarian:
a. Melakukan reboisasi atau menanam pohon di lingkungan sekolah dan rumah.
b. Tidak membuang sampah sembarangan dan memilah sampah organik serta anorganik.
c. Melindungi suaka margasatwa dan cagar alam.
d. Menyebarkan pesan peduli lingkungan melalui kampanye poster dan aksi nyata hemat energi.`,
    },
  ],
  tps: [
    {
      id: 'tp-3-5',
      code: 'TP 3.5',
      text: 'Menyimpulkan pentingnya pelestarian makhluk hidup berdasarkan hasil pengamatan dan informasi yang diperoleh.',
    },
  ],
  kktps: [
    {
      id: 'kktp-1',
      tpId: 'tp-3-5',
      number: 1,
      text: 'Menyebutkan faktor-faktor yang menyebabkan kerusakan lingkungan bagi kelangsungan makhluk hidup.',
    },
    {
      id: 'kktp-2',
      tpId: 'tp-3-5',
      number: 2,
      text: 'Menjelaskan manfaat pelestarian hewan dan tumbuhan bagi keseimbangan ekosistem sekitar.',
    },
    {
      id: 'kktp-3',
      tpId: 'tp-3-5',
      number: 3,
      text: 'Membuat produk poster ajakan yang menyimpulkan pentingnya menjaga kelestarian makhluk hidup.',
    },
  ],
  selectedDimensi: ['Keimanan & Ketakwaan', 'Penalaran Kritis', 'Kreativitas'],
  meetings: [
    {
      id: 'meet-13',
      tpId: 'tp-3-5',
      pertemuanKe: 1,
      nomorPertemuan: 13,
      alokasiWaktuText: '2 × 35 menit',
      alokasiMenit: 70,
      fokusPengalaman: 'Memahami',
      topikSpesifik: 'Faktor Kerusakan Lingkungan dan Dampaknya bagi Makhluk Hidup',
    },
    {
      id: 'meet-14',
      tpId: 'tp-3-5',
      pertemuanKe: 2,
      nomorPertemuan: 14,
      alokasiWaktuText: '3 × 35 menit',
      alokasiMenit: 105,
      fokusPengalaman: 'Mengaplikasi',
      topikSpesifik: 'Manfaat Pelestarian Makhluk Hidup dan Desain Aksi Peduli Ekosistem',
    },
    {
      id: 'meet-15',
      tpId: 'tp-3-5',
      pertemuanKe: 3,
      nomorPertemuan: 15,
      alokasiWaktuText: '2 × 35 menit',
      alokasiMenit: 70,
      fokusPengalaman: 'Merefleksi',
      topikSpesifik: 'Kampanye Poster dan Refleksi Penjagaan Alam Sekitar',
    },
  ],
  activeMeetingId: 'meet-13',
  formatifConfig: DEFAULT_FORMATIF_CONFIG,
  historyRPPMs: {},
};
