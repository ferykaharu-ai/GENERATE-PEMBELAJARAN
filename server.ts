import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Gemini API client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API endpoint for Gemini RPPM generation
  app.post('/api/generate-gemini', async (req, res) => {
    try {
      const { identity, meeting, tp, kktps, materials, selectedDimensi, formatifConfig } = req.body;

      if (!identity || !meeting || !tp) {
        return res.status(400).json({ error: 'Data identitas, pertemuan, dan TP wajib diisi.' });
      }

      // Check if API key is present
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY belum dikonfigurasi. Anda dapat menggunakan tombol "⚡ Generate dengan Aplikasi Ini" untuk pembuatan instan dan lengkap tanpa kuota API.',
        });
      }

      const matContext = materials && materials.length > 0
        ? materials.map((m: any) => `DOKUMEN: ${m.name}\nISI:\n${m.content}`).join('\n\n')
        : 'Tidak ada dokumen materi terunggah khusus. Gunakan kurikulum resmi dan materi ajar SD relevan.';

      const prompt = `Anda adalah Ahli Kurikulum Merdeka, Pengembang Perangkat Ajar SD, Fasilitator Pembelajaran Mendalam, dan Ahli Asesmen Pembelajaran Sekolah Dasar Indonesia.
Tugas Anda adalah menyusun Rencana Pelaksanaan Pembelajaran Mendalam (RPPM) Sekolah Dasar satu pertemuan yang sangat sistematis, bermutu tinggi, siap cetak, dan memenuhi standar Kurikulum Merdeka.

IDENTITAS & KONTEKS GURU:
- Guru: ${identity.namaGuru} (NIP: ${identity.nipGuru || '-'})
- Kepala Sekolah: ${identity.kepalaSekolah} (NIP: ${identity.nipKepalaSekolah || '-'})
- Satuan Pendidikan: ${identity.satuanPendidikan}
- Fase & Kelas: ${identity.fase} / ${identity.kelas}
- Semester: ${identity.semester}
- Mata Pelajaran: ${identity.mataPelajaran}
- Pertemuan yang Disusun: Pertemuan Ke-${meeting.pertemuanKe} (Nomor Pertemuan: ${meeting.nomorPertemuan})
- Alokasi Waktu: ${meeting.alokasiWaktuText} (${meeting.alokasiMenit} Menit)
- Fokus Pengalaman Belajar: ${meeting.fokusPengalaman}
- Dimensi Profil Lulusan: ${selectedDimensi ? selectedDimensi.join(', ') : 'Keimanan & Ketakwaan, Penalaran Kritis'}

TUJUAN PEMBELAJARAN (TP) - WAJIB PERSIS:
"${tp.text}"

KKTP YANG TERSEDIA:
${(kktps || []).map((k: any, i: number) => `${i + 1}. ${k.text}`).join('\n')}

SUMBER DOKUMEN MATERI AJAR:
${matContext}

ATURAN HUKUM & PEDAGOGIS KETAT:
1. TP WAJIB DIPERTAHANKAN PERSIS 100% tanpa mengubah, meringkas, atau memparafrasekan.
2. KKTP WAJIB DIPERTAHANKAN PERSIS 100% dari daftar di atas (pilih 1 atau lebih yang paling relevan untuk pertemuan ini).
3. Hanya susun RPPM untuk Pertemuan ${meeting.nomorPertemuan} saja!
4. ISTILAH WAJIB: Gunakan istilah "Murid". DILARANG menggunakan kata "Siswa" atau "Peserta Didik".
5. PRINSIP PEMBELAJARAN MENDALAM: Terapkan Berkesadaran (Mindful), Bermakna (Meaningful), Menggembirakan (Joyful).
6. Di akhir kegiatan inti, WAJIB sertakan kegiatan Ice Breaking apresiatif sebagai penghargaan atas partisipasi murid.
7. FORMAT KEGIATAN: Semua langkah pada Kegiatan Awal, Kegiatan Inti, dan Kegiatan Penutup harus berupa daftar nomor vertikal (bukan paragraf).
8. ALOKASI WAKTU: Harus dibagi proporsional (Kegiatan Awal ~10-15%, Kegiatan Inti ~70-75%, Kegiatan Penutup ~10-15%) dan total menit tepat ${meeting.alokasiMenit} menit.
9. LEMBAR KERJA MURID (LKM): Berbasis eksplorasi/penemuan. DILARANG menggunakan aktivitas menempel atau kartu. Sertakan Kunci Jawaban LKM dan Rubrik Penilaian dalam tabel (skor 4, 3, 2, 1).
10. ASESMEN FORMATIF: Susun instrumen sesuai pilihan guru:
Bentuk soal yang dipilih: ${formatifConfig?.selectedBentuk?.join(', ') || 'Pilihan Ganda, Benar-Salah, Isian, Uraian'}
Jumlah soal per bentuk: ${JSON.stringify(formatifConfig?.jumlahSoal || {})}
Sertakan kisi-kisi asesmen formatif.

Kembalikan output murni dalam format JSON yang valid (tanpa markdown pembungkus selain \`\`\`json...\`\`\`) dengan skema objek berikut:
{
  "id": "string",
  "createdAt": "string",
  "identitas": ${JSON.stringify(identity)},
  "pertemuanDipilih": ${JSON.stringify(meeting)},
  "perencanaan": {
    "kesiapanMurid": "string",
    "karakteristikMateri": "string",
    "dimensiProfil": [
      { "dimensi": "string", "keterkaitan": "string" }
    ]
  },
  "desain": {
    "topikPembelajaran": "string",
    "tujuanPembelajaran": "${tp.text.replace(/"/g, '\\"')}",
    "kktpTerpilih": ["string"],
    "modelPembelajaran": "Problem Based Learning (PBL) / Discovery Learning / Project Based Learning (PjBL)",
    "alasanModel": "string",
    "metodePembelajaran": ["string"],
    "kemitraanPembelajaran": "string",
    "lingkunganPembelajaran": "string",
    "pemanfaatanDigital": "string"
  },
  "pengalamanBelajar": {
    "fokus": "${meeting.fokusPengalaman}",
    "waktuTotal": "${meeting.alokasiMenit} menit (${meeting.alokasiWaktuText})",
    "kegiatanAwal": {
      "langkah": ["string nomor vertikal"],
      "waktu": "10 menit"
    },
    "kegiatanInti": {
      "sintaksList": [
        {
          "tahap": "Sintaks 1: ...",
          "sintaks": "string",
          "waktu": "string",
          "kegiatan": ["string langkah aktivitas guru & murid vertikal"]
        }
      ],
      "iceBreaking": ["string aktivitas ice breaking ceria"],
      "waktu": "50 menit"
    },
    "kegiatanPenutup": {
      "langkah": ["string refleksi, umpan balik, karakter, doa vertikal"],
      "waktu": "10 menit"
    }
  },
  "asesmen": {
    "asesmenAwal": ["string"],
    "asesmenProses": ["string"],
    "asesmenAkhir": ["string"]
  },
  "lkm": {
    "judul": "string",
    "tujuan": ["string"],
    "alatDanBahan": ["string"],
    "langkahKerja": ["string"],
    "tugasMurid": ["string"],
    "kunciJawaban": ["string"],
    "rubrikPenilaian": [
      { "aspek": "string", "skor4": "string", "skor3": "string", "skor2": "string", "skor1": "string" }
    ]
  },
  "materiAjar": {
    "konsepInti": "string",
    "subKonsep": ["string"],
    "penjelasanBertahap": ["string"],
    "contohKontekstual": ["string"],
    "hubunganKehidupanNyata": "string",
    "sumberBelajar": "string"
  },
  "asesmenFormatif": {
    "kisiKisi": [
      { "nomor": 1, "bentukSoal": "Pilihan Ganda", "kktp": "string", "indikatorSoal": "string", "tingkatKesulitan": "Mudah/Sedang/HOTS" }
    ],
    "soalPG": [
      { "nomor": 1, "stimulus": "string", "pertanyaan": "string", "opsi": [{"key":"A","text":"string"}], "kunci": "A", "pembahasan": "string", "tingkatKesulitan": "Sedang" }
    ],
    "soalPGKompleks": [],
    "soalBenarSalah": [],
    "soalMenjodohkan": [],
    "soalIsian": [],
    "soalUraian": []
  },
  "formatifConfig": ${JSON.stringify(formatifConfig || {})}
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsedData = JSON.parse(cleanJson);

      // Force TP verbatim guarantee
      parsedData.desain.tujuanPembelajaran = tp.text.trim();

      res.json(parsedData);
    } catch (err: any) {
      console.error('Error in /api/generate-gemini:', err);
      res.status(500).json({
        error: err.message || 'Terjadi kesalahan saat memproses generasi dengan Gemini AI.',
      });
    }
  });

  // Setup Vite middlewares in development or serve static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: PORT,
        host: '0.0.0.0',
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server RPPM Kurikulum Merdeka aktif pada http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Gagal menjalankan server:', err);
  process.exit(1);
});
