import {
  RPPMProject,
  MeetingItem,
  TPItem,
  KKTPItem,
  RPPMDocument,
  ModelPembelajaran,
  LangkahKegiatan,
  FormativeAssessmentData,
  QuestionPG,
  QuestionPGKompleks,
  QuestionBenarSalah,
  QuestionMenjodohkan,
  QuestionIsian,
  QuestionUraian,
  KisiKisiItem,
} from '../types/rppm';

export function generateLocalRPPM(
  project: RPPMProject,
  meeting: MeetingItem,
  tp: TPItem,
  relevantKktps: KKTPItem[]
): RPPMDocument {
  const { identity, materials, selectedDimensi, formatifConfig } = project;

  // Exact verbatim TP
  const tujuanPembelajaran = tp.text.trim();

  // Select matching KKTP for this meeting
  // If there are multiple KKTPs, distribute them intelligently across meetings
  let chosenKktps = relevantKktps;
  if (relevantKktps.length > 1) {
    const kktpIndex = (meeting.pertemuanKe - 1) % relevantKktps.length;
    chosenKktps = [relevantKktps[kktpIndex]];
  }
  const kktpStrings = chosenKktps.map(k => k.text.trim());

  // Determine model based on subject and experience focus
  let model: ModelPembelajaran = 'Problem Based Learning (PBL)';
  let alasanModel = 'Model Problem Based Learning dipilih karena merangsang murid mengamati masalah kontekstual nyata di sekitar sekolah/rumah, berpikir kritis, serta berkolaborasi merumuskan solusi pelestarian lingkungan.';

  if (meeting.fokusPengalaman.includes('Mengaplikasi')) {
    model = 'Project Based Learning (PjBL)';
    alasanModel = 'Model Project Based Learning dipilih karena memberikan ruang kreasi bagi murid untuk menerapkan konsep melalui pembuatan karya nyata dan kampanye terpadu.';
  } else if (meeting.fokusPengalaman === 'Memahami') {
    model = 'Discovery Learning';
    alasanModel = 'Model Discovery Learning dipilih untuk membangun pemahaman konsep dasar murid secara berkesadaran melalui pengamatan, tanya jawab terbimbing, dan pembuktian langsung.';
  }

  // Calculate proportional time allocation
  const totalMenit = meeting.alokasiMenit;
  const waktuAwalMenit = Math.round(totalMenit * 0.15 / 5) * 5 || 10;
  const waktuPenutupMenit = Math.round(totalMenit * 0.15 / 5) * 5 || 10;
  const waktuIntiMenit = totalMenit - waktuAwalMenit - waktuPenutupMenit;

  // Material extraction / context
  const matText = materials.map(m => m.content).join('\n');
  const hasUploadedMaterial = materials.length > 0 && matText.trim().length > 30;
  const sumberBelajarNama = hasUploadedMaterial
    ? materials.map(m => m.name).join(', ')
    : `Buku Guru & Buku Murid ${identity.mataPelajaran} ${identity.fase} - Kemendikbudristek`;

  // Profil Lulusan relations
  const dimensiKeterkaitan = selectedDimensi.map(dim => {
    switch (dim) {
      case 'Keimanan & Ketakwaan':
        return {
          dimensi: dim,
          keterkaitan: 'Murid mensyukuri anugerah keberagaman makhluk hidup ciptaan Tuhan Yang Maha Esa dan membiasakan diri menjaga kelestarian lingkungan sebagai bentuk ibadah.',
        };
      case 'Penalaran Kritis':
        return {
          dimensi: dim,
          keterkaitan: 'Murid menganalisis keterkaitan sebab-akibat antara kerusakan habitat dengan kelangsungan hidup hewan dan tumbuhan serta mengevaluasi tindakan manusia.',
        };
      case 'Kreativitas':
        return {
          dimensi: dim,
          keterkaitan: 'Murid menghasilkan gagasan orisinal, slogan persuasif, atau rancangan aksi peduli lingkungan yang inovatif dan menarik.',
        };
      case 'Kolaborasi':
        return {
          dimensi: dim,
          keterkaitan: 'Murid bekerja sama secara kooperatif dalam kelompok kecil, berbagi peran tugas pengamatan, dan saling menghargai pendapat anggota tim.',
        };
      case 'Kemandirian':
        return {
          dimensi: dim,
          keterkaitan: 'Murid menunjukkan prakarsa belajar, bertanggung jawab menyelesaikan tugas individu maupun kelompok tanpa bergantung penuh pada guru.',
        };
      case 'Komunikasi':
        return {
          dimensi: dim,
          keterkaitan: 'Murid menyampaikan hasil diskusi dan kesimpulan kelompok dengan bahasa lisan yang santun, runtut, dan percaya diri.',
        };
      case 'Kewargaan':
        return {
          dimensi: dim,
          keterkaitan: 'Murid menyadari perannya sebagai warga sekolah dan warga masyarakat yang bertanggung jawab menjaga kebersihan dan keberlanjutan bumi.',
        };
      case 'Kesehatan':
        return {
          dimensi: dim,
          keterkaitan: 'Murid memahami bahwa lingkungan yang asri dan lestari berdampak langsung pada kesehatan fisik dan mental seluruh warga sekolah.',
        };
      default:
        return {
          dimensi: dim,
          keterkaitan: `Murid mengaktualisasikan dimensi ${dim} dalam rangkaian pengalaman belajar yang terstruktur.`,
        };
    }
  });

  // Sintaks kegiatan inti according to model
  let sintaksList: LangkahKegiatan[] = [];

  if (model === 'Problem Based Learning (PBL)') {
    sintaksList = [
      {
        tahap: 'Sintaks 1: Orientasi Murid pada Masalah',
        sintaks: 'Orientasi Masalah',
        waktu: `${Math.round(waktuIntiMenit * 0.2)} menit`,
        kegiatan: [
          'Guru menayangkan cuplikan gambar/video situasi hutan yang gundul dan aliran sungai yang tercemar sampah plastik.',
          'Guru memantik rasa ingin tahu murid dengan pertanyaan pemantik: "Apa yang akan terjadi pada hewan jika rumah alaminya rusak?" (Meaningful).',
          'Murid mengamati gambar dengan saksama dan mengungkapkan pandangan awal mereka secara berani dan santun.',
          'Guru memfasilitasi murid menyadari bahwa masalah lingkungan ini nyata dan mengancam makhluk hidup di bumi (Mindful).',
        ],
      },
      {
        tahap: 'Sintaks 2: Mengorganisasi Murid untuk Belajar',
        sintaks: 'Organisasi Belajar',
        waktu: `${Math.round(waktuIntiMenit * 0.2)} menit`,
        kegiatan: [
          'Guru membagi murid ke dalam kelompok heterogen yang beranggotakan 4–5 orang dengan penuh kegembiraan (Joyful).',
          'Guru membagikan Lembar Kerja Murid (LKM) dan menjelaskan tujuan serta alur penyelidikan secara ramah.',
          'Setiap kelompok menyepakati pembagian peran: ketua kelompok, pencatat temuan, dan juru bicara.',
          'Murid membaca petunjuk LKM dan memastikan setiap anggota memahami target investigasi kelompok.',
        ],
      },
      {
        tahap: 'Sintaks 3: Membimbing Penyelidikan Kelompok',
        sintaks: 'Penyelidikan Terbimbing',
        waktu: `${Math.round(waktuIntiMenit * 0.3)} menit`,
        kegiatan: [
          'Murid melakukan eksplorasi data berdasarkan teks bacaan materi ajar dan fakta lingkungan sekitar yang disediakan guru.',
          'Murid berdiskusi mengidentifikasi faktor utama penyebab kerusakan alam serta dampaknya bagi makhluk hidup.',
          'Guru berkeliling memberikan bimbingan scaffolding, memvalidasi pemahaman murid, dan memotivasi kelompok yang membutuhkan pendampingan.',
          'Murid mencatat hasil telaah dan merumuskan ide solusi pada lembar kerja murid secara terstruktur.',
        ],
      },
      {
        tahap: 'Sintaks 4: Mengembangkan dan Menyajikan Hasil Karya',
        sintaks: 'Penyajian Karya',
        waktu: `${Math.round(waktuIntiMenit * 0.15)} menit`,
        kegiatan: [
          'Murid menyusun simpulan hasil penyelidikan kelompok ke dalam format laporan sederhana atau bagan alur penemuan.',
          'Perwakilan kelompok maju ke depan kelas mempresentasikan hasil diskusi dengan percaya diri.',
          'Kelompok lain menyimak dengan saksama dan memberikan tanggapan apresiatif maupun pertanyaan lanjutan.',
          'Guru memberikan penguatan terhadap keakuratan konsep yang dipaparkan murid.',
        ],
      },
      {
        tahap: 'Sintaks 5: Menganalisis dan Mengevaluasi Proses Pemecahan Masalah',
        sintaks: 'Evaluasi Proses',
        waktu: `${Math.round(waktuIntiMenit * 0.15)} menit`,
        kegiatan: [
          'Guru bersama murid merefleksikan seluruh alur penemuan konsep pelestarian makhluk hidup yang telah dipelajari.',
          'Murid menyampaikan apa yang dirasakan selama berdiskusi dan manfaat yang mereka peroleh bagi kehidupan sehari-hari (Mindful & Meaningful).',
          'Guru mengonfirmasi capaian KKTP dan memberikan apresiasi atas keterlibatan aktif semua murid.',
        ],
      },
    ];
  } else if (model === 'Project Based Learning (PjBL)') {
    sintaksList = [
      {
        tahap: 'Sintaks 1: Penentuan Pertanyaan Mendasar',
        sintaks: 'Pertanyaan Mendasar',
        waktu: `${Math.round(waktuIntiMenit * 0.2)} menit`,
        kegiatan: [
          'Guru menghadirkan situasi nyata tentang penurunan populasi lebah dan burung di lingkungan sekitar.',
          'Guru mengajukan tantangan proyek: "Bagaimana cara kita mengajak warga sekolah agar ikut melestarikan satwa dan tumbuhan sekitar?"',
          'Murid mengidentifikasi kebutuhan proyek dan menyepakati produk kampanye edukatif yang akan dibuat.',
        ],
      },
      {
        tahap: 'Sintaks 2: Mendesain Perencanaan Proyek',
        sintaks: 'Desain Proyek',
        waktu: `${Math.round(waktuIntiMenit * 0.25)} menit`,
        kegiatan: [
          'Murid dalam kelompok merancang konsep karya poster/kampanye ajakan pelestarian makhluk hidup.',
          'Murid menentukan pesan inti, slogan peduli alam, dan teknik visual yang mudah dipahami teman sebaya.',
          'Guru membimbing pemilihan kata ajakan yang santun, jelas, dan berbobot makna (Meaningful).',
        ],
      },
      {
        tahap: 'Sintaks 3: Menyusun Jadwal dan Pelaksanaan Proyek',
        sintaks: 'Eksekusi Proyek',
        waktu: `${Math.round(waktuIntiMenit * 0.3)} menit`,
        kegiatan: [
          'Murid bekerja sama membagi tugas pengerjaan produk dengan ceria dan tertib (Joyful & Kolaboratif).',
          'Guru mendampingi proses pembuatan karya, memastikan setiap murid terlibat aktif sesuai minat dan bakatnya.',
          'Murid melakukan pengecekan mandiri apakah karyanya telah memuat alasan pentingnya pelestarian makhluk hidup.',
        ],
      },
      {
        tahap: 'Sintaks 4: Uji Coba dan Penilaian Hasil',
        sintaks: 'Gelar Karya',
        waktu: `${Math.round(waktuIntiMenit * 0.25)} menit`,
        kegiatan: [
          'Murid memamerkan produk kelompoknya dalam format galeri berjalan (gallery walk).',
          'Murid saling memberikan catatan positif dan umpan balik bintang apresiasi antar kelompok.',
          'Guru menilai produk akhir menggunakan rubrik capaian KKTP yang transparan.',
        ],
      },
    ];
  } else {
    // Discovery Learning
    sintaksList = [
      {
        tahap: 'Sintaks 1: Pemberian Rangsangan (Stimulation)',
        sintaks: 'Stimulasi',
        waktu: `${Math.round(waktuIntiMenit * 0.2)} menit`,
        kegiatan: [
          'Guru memperlihatkan spesimen daun segar vs daun layu serta foto ekosistem taman sekolah.',
          'Murid mengamati dengan rasa ingin tahu mendalam mengenai apa yang dibutuhkan makhluk hidup untuk bertahan hidup.',
        ],
      },
      {
        tahap: 'Sintaks 2: Identifikasi Masalah (Problem Statement)',
        sintaks: 'Identifikasi Masalah',
        waktu: `${Math.round(waktuIntiMenit * 0.2)} menit`,
        kegiatan: [
          'Murid merumuskan daftar pertanyaan penyelidikan tentang faktor kerusakan lingkungan.',
          'Guru membimbing murid memfokuskan pertanyaan pada indikator capaian KKTP yang ditargetkan.',
        ],
      },
      {
        tahap: 'Sintaks 3: Pengumpulan dan Pengolahan Data',
        sintaks: 'Eksplorasi Data',
        waktu: `${Math.round(waktuIntiMenit * 0.35)} menit`,
        kegiatan: [
          'Murid membaca teks materi ajar dan mengisi lembar kerja murid secara cermat.',
          'Murid mendiskusikan fakta-fakta yang ditemukan bersama teman sekelompok.',
          'Guru mendampingi proses verifikasi data agar konsep yang dibangun akurat.',
        ],
      },
      {
        tahap: 'Sintaks 4: Pembuktian dan Penarikan Simpulan (Generalization)',
        sintaks: 'Generalisasi',
        waktu: `${Math.round(waktuIntiMenit * 0.25)} menit`,
        kegiatan: [
          'Murid membuktikan temuan mereka di depan kelas dengan contoh konkret kehidupan sehari-hari.',
          'Murid bersama guru merumuskan simpulan utuh materi pertemuan hari ini secara bermakna.',
        ],
      },
    ];
  }

  // Ice breaking for joyful learning
  const iceBreakingActivities = [
    'Guru memandu ice breaking "Tepuk Pohon Rindang & Kicau Burung" untuk menyegarkan konsentrasi dan merayakan partisipasi aktif murid.',
    'Murid berdiri melakukan peregangan tubuh sambil menyanyikan yel-yel "Peduli Bumi Ceria" dengan penuh antusias.',
    'Guru memberikan apresiasi hangat ("Kalian anak-anak hebat penjaga bumi!") atas kerja sama dan rasa ingin tahu murid selama proses belajar.',
  ];

  // Kegiatan Awal (Vertical numbering)
  const kegiatanAwalLangkah = [
    'Guru mengawali pembelajaran dengan salam hangat, menanyakan kabar murid, dan mengajak salah satu murid memimpin doa bersama (Beriman & Bertakwa).',
    'Guru memeriksa kehadiran, kesiapan fisik, serta kerapian ruang belajar murid dengan senyuman ramah.',
    'Guru melakukan apersepsi dengan mengaitkan materi sebelumnya: "Siapa yang kemarin melihat burung berkicau di pohon depan kelas?"',
    'Guru memberikan motivasi tentang indahnya hidup berdampingan dengan alam yang asri dan seimbang (Meaningful).',
    'Guru melakukan asesmen awal singkat melalui kuis acung jari/tanya jawab lisan untuk mendeteksi kesiapan belajar murid.',
    'Guru melontarkan pertanyaan pemantik: "Mengapa kita harus peduli jika ada pohon yang ditebang sembarangan?"',
    'Guru menyampaikan tujuan pembelajaran (TP), indikator KKTP pertemuan ke-' + meeting.pertemuanKe + ', serta manfaat belajar hari ini secara gamblang.',
  ];

  // Kegiatan Penutup (Vertical numbering)
  const kegiatanPenutupLangkah = [
    'Guru bersama murid menyimpulkan intisari pembelajaran yang telah dilakukan hari ini.',
    'Murid melakukan refleksi terbimbing: "Apa pengalaman paling berharga yang kamu pelajari hari ini? Sikap peduli apa yang akan kamu lakukan di rumah?" (Mindful).',
    'Guru memberikan umpan balik konstruktif dan penghargaan atas keaktifan serta kerja sama setiap kelompok.',
    'Guru menyampaikan rencana tindak lanjut dan garis besar materi pada Pertemuan ke-' + (meeting.pertemuanKe + 1) + ' mendatang.',
    'Guru memberikan penguatan karakter profil lulusan agar murid senantiasa menjaga kebersihan dan merawat makhluk hidup di sekitar.',
    'Pembelajaran ditutup dengan doa syukur bersama yang dipimpin oleh murid dan salam penutup santun.',
  ];

  // LKM Data
  const lkmData = {
    judul: `LEMBAR KERJA MURID (LKM): EKSPLORASI ${meeting.topikSpesifik?.toUpperCase() || 'PELESTARIAN MAKHLUK HIDUP'}`,
    tujuan: [
      `Murid mampu mengidentifikasi fakta penting terkait: ${kktpStrings[0] || tujuanPembelajaran}`,
      'Murid mampu bekerja sama memecahkan masalah kontekstual penyelidikan alam.',
      'Murid mampu merumuskan simpulan tertulis dengan bahasa sendiri secara mandiri.',
    ],
    alatDanBahan: [
      'Lembar Kerja Murid (LKM cetak)',
      'Teks materi ajar kontekstual',
      'Alat tulis (pensil, bolpoin, penghapus, dan penggaris)',
      'Buku catatan murid',
    ],
    langkahKerja: [
      'Bentuklah kelompok yang terdiri atas 4–5 orang murid secara kompak.',
      'Bacalah teks bacaan dan cermati tabel data lingkungan yang tersedia pada LKM.',
      'Diskusikan pertanyaan penyelidikan bersama seluruh anggota kelompokmu dengan saling menghargai gagasan.',
      'Tuliskan hasil diskusi pada kolom Tugas Murid secara rapi dan jelas.',
      'Periksalah kembali jawaban kelompok sebelum dipresentasikan di depan kelas.',
    ],
    tugasMurid: [
      'Tugas 1: Tuliskan 3 contoh kegiatan manusia di sekitar kita yang dapat mengancam kelangsungan hidup hewan dan tumbuhan!',
      'Tugas 2: Jelaskan apa akibat buruk yang terjadi bagi kehidupan manusia jika populasi serangga penyerbuk seperti kupu-kupu dan lebah habis!',
      'Tugas 3: Rumuskan 2 langkah nyata yang dapat dilakukan oleh anak usia sekolah dasar untuk membantu menjaga kelestarian lingkungan!',
    ],
    kunciJawaban: [
      'Kunci Tugas 1: Penebangan pohon liar/sembarangan, membuang sampah/limbah plastik ke sungai, dan perburuan hewan liar.',
      'Kunci Tugas 2: Tanaman pangan tidak dapat berkembang biak/menghasilkan buah karena tidak terjadi penyerbukan, persediaan makanan manusia berkurang, dan rantai makanan terputus.',
      'Kunci Tugas 3: Menyiram tanaman di pekarangan/sekolah secara teratur, membuang sampah pada tempatnya, dan merawat hewan peliharaan dengan penuh kasih sayang.',
    ],
    rubrikPenilaian: [
      {
        aspek: 'Ketepatan Analisis Konsep',
        skor4: 'Mampu menjelaskan 3 faktor dan dampak kerusakan secara tepat, logis, dan mendalam.',
        skor3: 'Mampu menjelaskan 2 faktor dan dampak kerusakan dengan tepat.',
        skor2: 'Mampu menjelaskan 1 faktor namun penjelasan dampak masih terbatas.',
        skor1: 'Belum mampu menjelaskan faktor kerusakan dengan benar.',
      },
      {
        aspek: 'Kemandirian & Kerja Sama',
        skor4: 'Seluruh anggota kelompok aktif berdiskusi, berbagi tugas secara adil, dan rukun.',
        skor3: 'Sebagian besar anggota kelompok aktif dan saling membantu menyelesaikan LKM.',
        skor2: 'Hanya 1–2 murid yang dominan mengerjakan tugas kelompok.',
        skor1: 'Tidak tampak kerja sama antar anggota kelompok.',
      },
      {
        aspek: 'Kualitas Komunikasi Lisan',
        skor4: 'Menyajikan simpulan dengan percaya diri, artikulasi jelas, runtut, dan santun.',
        skor3: 'Menyajikan simpulan dengan cukup percaya diri dan bahasa yang dapat dipahami.',
        skor2: 'Menyajikan simpulan dengan terbata-bata atau membaca catatan terus-menerus.',
        skor1: 'Kurang percaya diri dan sulit menyampaikan gagasan kelompok.',
      },
    ],
  };

  // Materi Ajar Data
  const materiAjarData = {
    konsepInti: 'Keseimbangan Ekosistem dan Tanggung Jawab Pelestarian Makhluk Hidup',
    subKonsep: [
      'Ketergantungan Makhluk Hidup dalam Lingkungan (Rantai Makanan & Habitat)',
      'Faktor Penyebab Kerusakan Lingkungan (Aktivitas Manusia dan Fenomena Alam)',
      'Manfaat Ekologis dan Ekonomis Keberadaan Hewan serta Tumbuhan bagi Manusia',
      'Aksi Nyata dan Etika Peduli Lingkungan Sejak Usia Dini',
    ],
    penjelasanBertahap: [
      'Tahap 1: Memahami bahwa makhluk hidup membutuhkan tempat tinggal (habitat) yang bersih, air minum yang tidak tercemar, dan makanan yang cukup untuk tumbuh kembang.',
      'Tahap 2: Menelaah bahwa tindakan manusia seperti membuang limbah sembarangan atau menebang pohon tanpa menanam kembali dapat merusak keseimbangan rantai makanan.',
      'Tahap 3: Menghubungkan manfaat tumbuhan sebagai penghasil gas oksigen segar yang dihirup manusia setiap detik untuk bernapas.',
      'Tahap 4: Mengambil tindakan nyata dengan membiasakan gaya hidup hijau, hemat air, dan merawat tanaman di sekitar rumah.',
    ],
    contohKontekstual: [
      'Contoh 1: Di lingkungan pedesaan atau pinggir sungai, ikan-ikan kecil mati ketika air tercemar detergen atau sampah plastik.',
      'Contoh 2: Pohon beringin dan trembesi di halaman sekolah menjadi tempat bersarang burung gereja dan memberi keteduhan alami saat istirahat.',
      'Contoh 3: Jika burung pemakan ulat diburu, maka jumlah ulat di kebun akan membludak dan merusak dedaunan tanaman sayur petani.',
    ],
    hubunganKehidupanNyata: 'Ketika kita merawat tanaman di pot depan kelas dan membuang sampah pada tempatnya, kita sedang menjaga udara bersih yang kita hirup dan menyelamatkan bumi untuk masa depan kita sendiri.',
    sumberBelajar: sumberBelajarNama,
  };

  // Formative Assessment Questions & Kisi-Kisi
  const formativeData: FormativeAssessmentData = generateFormativeQuestions(
    tujuanPembelajaran,
    kktpStrings,
    formatifConfig
  );

  return {
    id: `rppm-${meeting.id}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    generatorSource: 'aplikasi',
    identitas: identity,
    pertemuanDipilih: meeting,
    perencanaan: {
      kesiapanMurid: 'Berdasarkan asesmen awal, mayoritas murid (sekitar 75%) telah mengenal nama-nama hewan dan tumbuhan di sekitar, namun memerlukan bimbingan dalam menghubungkan keterkaitan sebab-akibat kerusakan lingkungan terhadap rantai makanan.',
      karakteristikMateri: 'Materi bersifat kontekstual, konkret, aplikatif, dan memerlukan pengamatan langsung pada fenomena lingkungan nyata agar pemahaman konsep murid mendalam dan bermakna.',
      dimensiProfil: dimensiKeterkaitan,
    },
    desain: {
      topikPembelajaran: meeting.topikSpesifik || `Pembelajaran Mendalam ${identity.mataPelajaran} - Pertemuan ${meeting.nomorPertemuan}`,
      tujuanPembelajaran: tujuanPembelajaran,
      kktpTerpilih: kktpStrings,
      modelPembelajaran: model,
      alasanModel: alasanModel,
      metodePembelajaran: [
        'Ceramah interaktif',
        'Tanya jawab pemantik',
        'Diskusi kelompok terarah',
        'Observasi data/lingkungan',
        'Penugasan terbimbing',
        'Presentasi hasil belajar',
      ],
      kemitraanPembelajaran: 'Kerja sama antar murid dalam kelompok kooperatif, kolaborasi guru dengan orang tua untuk pembiasaan merawat tanaman di rumah, serta pemanfaatan komunitas sekolah (pengelola kebun sekolah).',
      lingkunganPembelajaran: 'Ruang kelas yang ditata secara berkelompok (fleksibel), sudut baca sains, dan area taman sekolah sebagai laboratorium alami pengamatan.',
      pemanfaatanDigital: 'Media proyektor/gambar digital untuk visualisasi ekosistem, aplikasi presentasi interaktif, dan penayangan cuplikan edukatif ramah anak.',
    },
    pengalamanBelajar: {
      fokus: meeting.fokusPengalaman,
      waktuTotal: `${totalMenit} menit (${meeting.alokasiWaktuText})`,
      kegiatanAwal: {
        langkah: kegiatanAwalLangkah,
        waktu: `${waktuAwalMenit} menit`,
      },
      kegiatanInti: {
        sintaksList: sintaksList,
        iceBreaking: iceBreakingActivities,
        waktu: `${waktuIntiMenit} menit`,
      },
      kegiatanPenutup: {
        langkah: kegiatanPenutupLangkah,
        waktu: `${waktuPenutupMenit} menit`,
      },
    },
    asesmen: {
      asesmenAwal: [
        'Pertanyaan lisan pemantik tentang pengalaman murid melihat satwa liar dan pohon di lingkungan rumah.',
        'Observasi respon dan keaktifan murid saat menjawab pertanyaan awal guru (diagnostik non-kognitif dan kognitif awal).',
      ],
      asesmenProses: [
        'Lembar observasi profil lulusan (penalaran kritis, kolaborasi, dan kemandirian selama penyelidikan).',
        'Rubrik performa diskusi kelompok dan pengisian Lembar Kerja Murid (LKM).',
        'Penilaian formatif melalui instrumen tes pilihan ganda, benar-salah, isian, dan uraian terukur.',
      ],
      asesmenAkhir: [
        'Evaluasi pemahaman konsep akhir pertemuan melalui lembar asesmen formatif terstruktur.',
        'Refleksi diri (self-assessment) murid terhadap pemahaman konsep yang telah dikuasai.',
      ],
    },
    lkm: lkmData,
    materiAjar: materiAjarData,
    asesmenFormatif: formativeData,
    formatifConfig: formatifConfig,
  };
}

function generateFormativeQuestions(
  tpText: string,
  kktps: string[],
  config: RPPMProject['formatifConfig']
): FormativeAssessmentData {
  const primaryKktp = kktps[0] || tpText;
  const secondaryKktp = kktps[1] || primaryKktp;

  const kisiKisi: KisiKisiItem[] = [];
  const soalPG: QuestionPG[] = [];
  const soalPGKompleks: QuestionPGKompleks[] = [];
  const soalBenarSalah: QuestionBenarSalah[] = [];
  const soalMenjodohkan: QuestionMenjodohkan[] = [];
  const soalIsian: QuestionIsian[] = [];
  const soalUraian: QuestionUraian[] = [];

  let globalNomor = 1;

  // 1. Pilihan Ganda
  const countPG = config.selectedBentuk.includes('Pilihan Ganda') ? config.jumlahSoal['Pilihan Ganda'] || 5 : 0;
  const pgBank: Omit<QuestionPG, 'nomor'>[] = [
    {
      stimulus: 'Di sebuah desa di tepi hutan, banyak pohon besar ditebang untuk dijadikan lahan perumahan baru.',
      pertanyaan: 'Dampak langsung penebangan pohon terhadap hewan-hewan yang tinggal di hutan tersebut adalah ....',
      kktpIndikator: primaryKktp,
      opsi: [
        { key: 'A', text: 'Hewan semakin mudah mencari makan di perumahan' },
        { key: 'B', text: 'Hewan kehilangan tempat tinggal dan sumber makanan alaminya' },
        { key: 'C', text: 'Jumlah hewan langka akan berkembang biak semakin banyak' },
        { key: 'D', text: 'Hewan tidak terpengaruh karena bisa berenang di sungai' },
      ],
      kunci: 'B',
      pembahasan: 'Pohon adalah habitat dan produsen makanan bagi satwa. Jika pohon ditebang, satwa kehilangan habitat dan sumber makanan.',
      tingkatKesulitan: 'Sedang',
    },
    {
      stimulus: 'Tumbuhan hijau memanfaatkan cahaya matahari untuk melakukan fotosintesis.',
      pertanyaan: 'Manfaat penting proses fotosintesis tumbuhan bagi manusia dan hewan adalah ....',
      kktpIndikator: secondaryKktp,
      opsi: [
        { key: 'A', text: 'Menghasilkan gas oksigen untuk bernapas' },
        { key: 'B', text: 'Membuat tanah menjadi lebih cepat kering' },
        { key: 'C', text: 'Menghalangi air hujan meresap ke tanah' },
        { key: 'D', text: 'Menurunkan jumlah udara bersih di bumi' },
      ],
      kunci: 'A',
      pembahasan: 'Fotosintesis menghasilkan oksigen segar yang sangat dibutuhkan manusia dan hewan untuk bernapas.',
      tingkatKesulitan: 'Mudah',
    },
    {
      stimulus: 'Pak Danu melihat sungai di dekat sawahnya dipenuhi tumpukan sampah plastik dan limbah rumah tangga.',
      pertanyaan: 'Tindakan yang paling tepat untuk menyelamatkan kelangsungan ekosistem sungai tersebut adalah ....',
      kktpIndikator: primaryKktp,
      opsi: [
        { key: 'A', text: 'Membiarkan sampah hanyut sampai ke laut lepas' },
        { key: 'B', text: 'Membakar sampah plastik di pinggir aliran air' },
        { key: 'C', text: 'Bergotong royong membersihkan sungai dan tidak membuang sampah ke air' },
        { key: 'D', text: 'Menimbun sampah dengan tanah di dasar sungai' },
      ],
      kunci: 'C',
      pembahasan: 'Membersihkan sampah dan menghentikan kebiasaan membuang sampah ke sungai menjaga ekosistem perairan tetap lestari.',
      tingkatKesulitan: 'Mudah',
    },
    {
      stimulus: 'Lebah dan kupu-kupu sering terlihat beterbangan dan hinggap di kelopak bunga tanaman tomat.',
      pertanyaan: 'Peran penting serangga lebah dan kupu-kupu bagi kelangsungan hidup tumbuhan adalah ....',
      kktpIndikator: secondaryKktp,
      opsi: [
        { key: 'A', text: 'Memakan seluruh daun tanaman sampai habis' },
        { key: 'B', text: 'Membantu proses penyerbukan sehingga tanaman berbuah' },
        { key: 'C', text: 'Membuat akar tanaman cepat membusuk di tanah' },
        { key: 'D', text: 'Mencegah air hujan mengenai bunga' },
      ],
      kunci: 'B',
      pembahasan: 'Lebah dan kupu-kupu bertindak sebagai penyerbuk alami yang membantu bertemunya serbuk sari dengan kepala putik.',
      tingkatKesulitan: 'Sedang',
    },
    {
      stimulus: 'Sebuah poster di dinding sekolah bertuliskan: "Satu Pohon Kita Tanam, Sejuta Nafas Kita Selamatkan".',
      pertanyaan: 'Pesan utama yang ingin disampaikan oleh poster ajakan tersebut adalah ....',
      kktpIndikator: tpText,
      opsi: [
        { key: 'A', text: 'Menanam pohon menghasilkan udara bersih dan menjaga kehidupan' },
        { key: 'B', text: 'Pohon hanya berguna jika kayunya dipotong dan dijual' },
        { key: 'C', text: 'Menanam pohon membuat halaman sekolah menjadi sempit' },
        { key: 'D', text: 'Udara bersih bisa dibeli tanpa perlu menanam pohon' },
      ],
      kunci: 'A',
      pembahasan: 'Poster mengajak murid menanam pohon karena pohon menghasilkan oksigen bagi keberlangsungan makhluk hidup.',
      tingkatKesulitan: 'HOTS',
    },
  ];

  for (let i = 0; i < countPG; i++) {
    const item = pgBank[i % pgBank.length];
    soalPG.push({
      nomor: globalNomor,
      stimulus: item.stimulus,
      pertanyaan: item.pertanyaan,
      kktpIndikator: item.kktpIndikator,
      opsi: item.opsi,
      kunci: item.kunci,
      pembahasan: item.pembahasan,
      tingkatKesulitan: item.tingkatKesulitan,
    });
    kisiKisi.push({
      nomor: globalNomor,
      bentukSoal: 'Pilihan Ganda',
      kktp: item.kktpIndikator || primaryKktp,
      indikatorSoal: `Disajikan stimulus kontekstual, murid dapat memilih jawaban yang tepat mengenai ${item.pertanyaan.slice(0, 45)}...`,
      tingkatKesulitan: item.tingkatKesulitan,
    });
    globalNomor++;
  }

  // 2. Pilihan Ganda Kompleks
  const countPGK = config.selectedBentuk.includes('Pilihan Ganda Kompleks') ? config.jumlahSoal['Pilihan Ganda Kompleks'] || 2 : 0;
  const pgkBank: Omit<QuestionPGKompleks, 'nomor'>[] = [
    {
      stimulus: 'Murid kelas III sedang berdiskusi tentang cara merawat dan melestarikan lingkungan sekolah.',
      petunjuk: 'Pilihlah DUA jawaban yang benar dengan memberikan tanda centang (✓)!',
      pertanyaan: 'Manakah tindakan di bawah ini yang benar-benar mencerminkan sikap melestarikan lingkungan sekitar? (Pilih 2 jawaban)',
      kktpIndikator: primaryKktp,
      opsi: [
        { key: 'A', text: 'Menyiram tanaman pot di depan kelas secara teratur setiap pagi', isCorrect: true },
        { key: 'B', text: 'Membuang bungkus jajanan plastik ke dalam selokan air', isCorrect: false },
        { key: 'C', text: 'Memilah sampah sisa makanan dan sampah plastik pada tempat terpisah', isCorrect: true },
        { key: 'D', text: 'Memetik daun dan ranting pohon yang masih muda untuk bermain', isCorrect: false },
      ],
      kunci: ['A', 'C'],
      pembahasan: 'Menyiram tanaman dan memilah sampah merupakan tindakan nyata pelestarian lingkungan hidup.',
      tingkatKesulitan: 'Sedang',
    },
    {
      stimulus: 'Hutan lindung menyimpan kekayaan flora dan fauna yang sangat melimpah.',
      petunjuk: 'Pilihlah DUA jawaban yang paling tepat!',
      pertanyaan: 'Apa manfaat yang diperoleh manusia dari kelestarian hutan yang terjaga dengan baik? (Pilih 2 jawaban)',
      kktpIndikator: secondaryKktp,
      opsi: [
        { key: 'A', text: 'Akar pohon mencegah terjadinya bencana tanah longsor saat hujan deras', isCorrect: true },
        { key: 'B', text: 'Memicu kepunahan satwa langka yang hidup di pedalaman', isCorrect: false },
        { key: 'C', text: 'Menjaga pasokan air bersih alami di dalam tanah bagi masyarakat', isCorrect: true },
        { key: 'D', text: 'Menyebabkan suhu bumi menjadi semakin panas dan kering', isCorrect: false },
      ],
      kunci: ['A', 'C'],
      pembahasan: 'Hutan berfungsi mencegah erosi/longsor serta menjadi daerah resapan penyimpan cadangan air bersih.',
      tingkatKesulitan: 'HOTS',
    },
  ];

  for (let i = 0; i < countPGK; i++) {
    const item = pgkBank[i % pgkBank.length];
    soalPGKompleks.push({
      nomor: globalNomor,
      stimulus: item.stimulus,
      petunjuk: item.petunjuk,
      pertanyaan: item.pertanyaan,
      kktpIndikator: item.kktpIndikator,
      opsi: item.opsi,
      kunci: item.kunci,
      pembahasan: item.pembahasan,
      tingkatKesulitan: item.tingkatKesulitan,
    });
    kisiKisi.push({
      nomor: globalNomor,
      bentukSoal: 'Pilihan Ganda Kompleks',
      kktp: item.kktpIndikator || primaryKktp,
      indikatorSoal: 'Disajikan stimulus, murid mampu menganalisis dan menentukan dua pilihan jawaban benar terkait pelestarian makhluk hidup.',
      tingkatKesulitan: item.tingkatKesulitan,
    });
    globalNomor++;
  }

  // 3. Benar-Salah
  const countBS = config.selectedBentuk.includes('Benar-Salah') ? config.jumlahSoal['Benar-Salah'] || 3 : 0;
  const bsBank: Omit<QuestionBenarSalah, 'nomor'>[] = [
    {
      stimulus: 'Cermati beberapa pernyataan tentang hubungan makhluk hidup berikut ini!',
      kktpIndikator: primaryKktp,
      pernyataanList: [
        { teks: 'Menangkap ikan menggunakan racun atau bahan peledak tidak merusak terumbu karang.', kunci: 'Salah' },
        { teks: 'Reboisasi atau penanaman kembali pohon dapat membantu mengembalikan habitat hewan hutan.', kunci: 'Benar' },
        { teks: 'Hewan dan tumbuhan dapat terus bertahan hidup tanpa membutuhkan udara dan air bersih.', kunci: 'Salah' },
      ],
      tingkatKesulitan: 'Mudah',
    },
    {
      stimulus: 'Bacalah informasi mengenai rantai makanan di sawah!',
      kktpIndikator: secondaryKktp,
      pernyataanList: [
        { teks: 'Ular sawah membantu petani karena memangsa tikus yang merusak padi.', kunci: 'Benar' },
        { teks: 'Jika semua katak di sawah dibasmi, jumlah serangga hama akan semakin berkurang.', kunci: 'Salah' },
        { teks: 'Keseimbangan alam terjadi jika tidak ada salah satu makhluk hidup yang punah.', kunci: 'Benar' },
      ],
      tingkatKesulitan: 'Sedang',
    },
    {
      stimulus: 'Perhatikan kebiasaan manusia sehari-hari terhadap alam!',
      kktpIndikator: tpText,
      pernyataanList: [
        { teks: 'Membuang baterai bekas ke tanah tidak mencemari sumber air bawah tanah.', kunci: 'Salah' },
        { teks: 'Menghemat penggunaan kertas dapat membantu mengurangi penebangan pohon di hutan.', kunci: 'Benar' },
        { teks: 'Melindungi hewan langka adalah kewajiban bersama seluruh masyarakat.', kunci: 'Benar' },
      ],
      tingkatKesulitan: 'Sedang',
    },
  ];

  for (let i = 0; i < countBS; i++) {
    const item = bsBank[i % bsBank.length];
    soalBenarSalah.push({
      nomor: globalNomor,
      stimulus: item.stimulus,
      kktpIndikator: item.kktpIndikator,
      pernyataanList: item.pernyataanList,
      tingkatKesulitan: item.tingkatKesulitan,
    });
    kisiKisi.push({
      nomor: globalNomor,
      bentukSoal: 'Benar-Salah',
      kktp: item.kktpIndikator || primaryKktp,
      indikatorSoal: 'Disajikan 3 butir pernyataan, murid dapat mengevaluasi kebenaran fakta ilmiah tentang pelestarian ekosistem.',
      tingkatKesulitan: item.tingkatKesulitan,
    });
    globalNomor++;
  }

  // 4. Menjodohkan
  const countMJ = config.selectedBentuk.includes('Menjodohkan') ? config.jumlahSoal['Menjodohkan'] || 2 : 0;
  const mjBank: Omit<QuestionMenjodohkan, 'nomor'>[] = [
    {
      stimulus: 'Tariklah garis hubung atau jodohkan penyebab kerusakan lingkungan di kolom kiri dengan dampak yang sesuai di kolom kanan!',
      petunjuk: 'Hubungkan pasangan yang sesuai antara Kolom Kiri dan Kolom Kanan!',
      kktpIndikator: primaryKktp,
      pasangan: [
        { kiri: '1. Penebangan hutan liar', kanan: 'A. Ikan mati dan air berbau busuk', kunciPasangan: '1 -> C' },
        { kiri: '2. Pembuangan limbah ke sungai', kanan: 'B. Burung kehilangan tempat bersarang', kunciPasangan: '2 -> A' },
        { kiri: '3. Perburuan hewan langka', kanan: 'C. Hewan terancam punah dan populasi habis', kunciPasangan: '3 -> C' },
      ],
      tingkatKesulitan: 'Sedang',
    },
    {
      stimulus: 'Jodohkan tindakan pelestarian dengan manfaat ekologisnya!',
      petunjuk: 'Hubungkan pasangan yang sesuai antara Kolom Kiri dan Kolom Kanan!',
      kktpIndikator: secondaryKktp,
      pasangan: [
        { kiri: '1. Reboisasi bukit gundul', kanan: 'A. Mengurangi tumpukan sampah plastik di tanah', kunciPasangan: '1 -> B' },
        { kiri: '2. Mendaur ulang sampah', kanan: 'B. Mencegah longsor dan menyuburkan tanah', kunciPasangan: '2 -> A' },
        { kiri: '3. Menjaga cagar alam', kanan: 'C. Melindungi satwa dan tumbuhan asli daerah', kunciPasangan: '3 -> C' },
      ],
      tingkatKesulitan: 'Sedang',
    },
  ];

  for (let i = 0; i < countMJ; i++) {
    const item = mjBank[i % mjBank.length];
    soalMenjodohkan.push({
      nomor: globalNomor,
      stimulus: item.stimulus,
      petunjuk: item.petunjuk,
      kktpIndikator: item.kktpIndikator,
      pasangan: item.pasangan,
      tingkatKesulitan: item.tingkatKesulitan,
    });
    kisiKisi.push({
      nomor: globalNomor,
      bentukSoal: 'Menjodohkan',
      kktp: item.kktpIndikator || primaryKktp,
      indikatorSoal: 'Disajikan konsep di kolom kiri dan akibat/manfaat di kolom kanan, murid dapat memasangkan secara tepat.',
      tingkatKesulitan: item.tingkatKesulitan,
    });
    globalNomor++;
  }

  // 5. Isian Singkat
  const countIS = config.selectedBentuk.includes('Isian Singkat') ? config.jumlahSoal['Isian Singkat'] || 3 : 0;
  const isBank: Omit<QuestionIsian, 'nomor'>[] = [
    {
      stimulus: 'Tumbuhan hijau menghasilkan gas yang kita hirup setiap hari saat bernapas.',
      pertanyaan: 'Gas yang dihasilkan oleh tumbuhan hijau dan sangat dibutuhkan manusia serta hewan untuk bernapas adalah gas ....',
      kktpIndikator: secondaryKktp,
      kunci: 'Oksigen (O2)',
      tingkatKesulitan: 'Mudah',
    },
    {
      stimulus: 'Hutan yang pohon-pohonnya ditebangi secara liar dapat memicu bencana alam saat musim hujan tiba.',
      pertanyaan: 'Bencana longsor di lereng gunung dapat dicegah jika tanah memiliki banyak akar pohon yang berfungsi untuk .... air hujan.',
      kktpIndikator: primaryKktp,
      kunci: 'Menyerap / menahan',
      tingkatKesulitan: 'Sedang',
    },
    {
      stimulus: 'Kawasan khusus yang dilindungi pemerintah untuk melestarikan hewan-hewan langka agar tidak punah.',
      pertanyaan: 'Kawasan perlindungan khusus bagi satwa liar yang terancam punah dinamakan suaka ....',
      kktpIndikator: tpText,
      kunci: 'Margasatwa',
      tingkatKesulitan: 'Sedang',
    },
  ];

  for (let i = 0; i < countIS; i++) {
    const item = isBank[i % isBank.length];
    soalIsian.push({
      nomor: globalNomor,
      stimulus: item.stimulus,
      pertanyaan: item.pertanyaan,
      kktpIndikator: item.kktpIndikator,
      kunci: item.kunci,
      tingkatKesulitan: item.tingkatKesulitan,
    });
    kisiKisi.push({
      nomor: globalNomor,
      bentukSoal: 'Isian Singkat',
      kktp: item.kktpIndikator || primaryKktp,
      indikatorSoal: 'Disajikan kalimat rumpang berbasis stimulus, murid dapat melengkapi konsep ilmiah yang tepat dengan kata kunci singkat.',
      tingkatKesulitan: item.tingkatKesulitan,
    });
    globalNomor++;
  }

  // 6. Uraian
  const countUR = config.selectedBentuk.includes('Uraian') ? config.jumlahSoal['Uraian'] || 2 : 0;
  const urBank: Omit<QuestionUraian, 'nomor'>[] = [
    {
      stimulus: 'Di sebuah kebun sekolah, terdapat pohon mangga, tanaman bunga, kupu-kupu, dan burung gereja. Suatu hari, ada orang yang menyemprotkan obat pembasmi serangga kimia dalam jumlah yang sangat banyak.',
      pertanyaan: 'Jelaskan apa yang kemungkinan besar akan terjadi pada populasi kupu-kupu dan burung gereja di kebun sekolah tersebut, serta mengapa kita harus berhati-hati menggunakan bahan kimia!',
      kktpIndikator: primaryKktp,
      pedomanPenskoran: 'Skor 4: Menyebutkan kupu-kupu mati, burung kehilangan makanan, dan alasan bahaya bahan kimia. Skor 2: Hanya menyebutkan salah satu dampak. Skor 1: Jawaban tidak relevan.',
      kunci: 'Kupu-kupu akan mati teracuni bahan kimia. Akibatnya, burung gereja yang memakan serangga akan kekurangan sumber makanan dan bunga tanaman sulit berbuah karena tidak ada penyerbuk. Kita harus berhati-hati karena bahan kimia berlebihan dapat memutus rantai makanan ekosistem.',
      tingkatKesulitan: 'HOTS',
    },
    {
      stimulus: 'Sebagai murid sekolah dasar, kamu memiliki peran penting dalam menjaga kelestarian lingkungan hidup di sekolah dan di rumah.',
      pertanyaan: 'Tuliskan tiga (3) contoh tindakan nyata dan sederhana yang dapat kamu lakukan setiap hari untuk menunjukkan rasa syukur dan kepedulian terhadap kelestarian hewan serta tumbuhan!',
      kktpIndikator: tpText,
      pedomanPenskoran: 'Skor 4: Menuliskan 3 contoh tindakan nyata yang konkret dan realistis bagi murid SD. Skor 2: Menuliskan 1-2 contoh. Skor 1: Tindakan abstrak atau tidak realistis.',
      kunci: 'Contoh tindakan nyata: 1) Menyiram tanaman di pekarangan secara berkala, 2) Membuang sampah pada tempatnya agar tidak mencemari tanah dan air, 3) Tidak mengganggu sarang burung atau menyakiti hewan kecil di sekitar kita.',
      tingkatKesulitan: 'Sedang',
    },
  ];

  for (let i = 0; i < countUR; i++) {
    const item = urBank[i % urBank.length];
    soalUraian.push({
      nomor: globalNomor,
      stimulus: item.stimulus,
      pertanyaan: item.pertanyaan,
      kktpIndikator: item.kktpIndikator,
      pedomanPenskoran: item.pedomanPenskoran,
      kunci: item.kunci,
      tingkatKesulitan: item.tingkatKesulitan,
    });
    kisiKisi.push({
      nomor: globalNomor,
      bentukSoal: 'Uraian',
      kktp: item.kktpIndikator || primaryKktp,
      indikatorSoal: 'Disajikan studi kasus fenomena alam, murid mampu menguraikan alasan ilmiah serta merumuskan pemecahan masalah penalaran kritis.',
      tingkatKesulitan: item.tingkatKesulitan,
    });
    globalNomor++;
  }

  return {
    kisiKisi,
    soalPG,
    soalPGKompleks,
    soalBenarSalah,
    soalMenjodohkan,
    soalIsian,
    soalUraian,
  };
}
