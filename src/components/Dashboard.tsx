import React from 'react';
import {
  Sparkles,
  FolderOpen,
  Upload,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  BookOpen,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { RPPMProject } from '../types/rppm';

interface DashboardProps {
  project: RPPMProject;
  onNavigateTab: (tab: string) => void;
  onOpenGenerateModal: () => void;
  onOpenProjectModal: () => void;
  onOpenExportModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  project,
  onNavigateTab,
  onOpenGenerateModal,
  onOpenProjectModal,
  onOpenExportModal,
}) => {
  const activeMeeting = project.meetings.find(m => m.id === project.activeMeetingId) || project.meetings[0];
  const hasRPPM = !!project.currentRPPM;

  // Checklist of required data
  const hasIdentity = !!(project.identity.namaGuru && project.identity.satuanPendidikan && project.identity.mataPelajaran);
  const hasTP = project.tps.length > 0 && !!project.tps[0].text.trim();
  const hasKKTP = project.kktps.length > 0;
  const hasDimensi = project.selectedDimensi.length > 0;
  const hasMeetings = project.meetings.length > 0;
  const hasMaterial = project.materials.length > 0;

  const isReadyToGenerate = hasIdentity && hasTP && hasKKTP && hasDimensi && hasMeetings;

  const steps = [
    { num: 1, title: 'Upload Materi Ajar', desc: 'Opsional (PDF/DOCX/TXT maks 50MB)', tab: 'materi', status: hasMaterial ? 'completed' : 'optional' },
    { num: 2, title: 'Isi Identitas Guru', desc: `${project.identity.namaGuru} • ${project.identity.satuanPendidikan}`, tab: 'identitas', status: hasIdentity ? 'completed' : 'pending' },
    { num: 3, title: 'Input TP (Tujuan)', desc: `${project.tps.length} TP Tersedia (Teks Verbatim)`, tab: 'tp', status: hasTP ? 'completed' : 'pending' },
    { num: 4, title: 'Input KKTP', desc: `${project.kktps.length} Indikator KKTP (Teks Verbatim)`, tab: 'kktp', status: hasKKTP ? 'completed' : 'pending' },
    { num: 5, title: 'Profil Lulusan', desc: `${project.selectedDimensi.length} Dimensi Dipilih`, tab: 'profil', status: hasDimensi ? 'completed' : 'pending' },
    { num: 6, title: 'Atur Pertemuan', desc: `${project.meetings.length} Pertemuan (${activeMeeting ? activeMeeting.alokasiWaktuText : '-'})`, tab: 'pertemuan', status: hasMeetings ? 'completed' : 'pending' },
    { num: 7, title: 'Atur Asesmen', desc: `${project.formatifConfig.selectedBentuk.length} Bentuk Soal Formatif`, tab: 'asesmen', status: 'completed' },
    { num: 8, title: 'Pilih Pertemuan', desc: `Pertemuan Aktif: Ke-${activeMeeting?.pertemuanKe || 1} (No. ${activeMeeting?.nomorPertemuan || 13})`, tab: 'pertemuan', status: 'completed' },
    { num: 9, title: 'Generate RPPM', desc: 'Gemini AI atau Generator Aplikasi', tab: 'generate_action', status: hasRPPM ? 'completed' : 'ready' },
    { num: 10, title: 'Validasi Otomatis', desc: 'Pemeriksaan 10+ Kaidah Kurikulum Merdeka', tab: 'preview', status: hasRPPM ? 'completed' : 'idle' },
    { num: 11, title: 'Preview RPPM', desc: 'Tampilan dokumen siap cetak', tab: 'preview', status: hasRPPM ? 'completed' : 'idle' },
    { num: 12, title: 'Edit & Regenerate', desc: 'Kustomisasi kegiatan / buat versi baru', tab: 'preview', status: hasRPPM ? 'completed' : 'idle' },
    { num: 13, title: 'Export Word (.docx)', desc: 'Ukuran A4 rapi, tabel terstruktur, siap pakai', tab: 'export_action', status: hasRPPM ? 'completed' : 'idle' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-blue-900/40">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-16 w-60 h-60 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Kurikulum Merdeka – Sekolah Dasar</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight font-serif mb-2">
            GENERATOR RPPM PEMBELAJARAN MENDALAM
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
            Buat Rencana Pelaksanaan Pembelajaran Mendalam (RPPM) SD secara cepat, sistematis, fleksibel,
            dan sesuai Kurikulum Merdeka. Dilengkapi analisis materi ajar, pengalaman belajar{' '}
            <strong className="text-amber-300 font-semibold">Memahami, Mengaplikasi, Merefleksi</strong>,
            prinsip <strong className="text-amber-300 font-semibold">Mindful, Meaningful, Joyful</strong>, LKM,
            dan instrumen asesmen formatif lengkap.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenGenerateModal}
              disabled={!isReadyToGenerate}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer ${
                isReadyToGenerate
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-blue-500/25 hover:scale-[1.02]'
                  : 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>🚀 Mulai Membuat RPPM (Pertemuan {activeMeeting?.nomorPertemuan || 13})</span>
            </button>

            <button
              onClick={onOpenProjectModal}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              <FolderOpen className="w-4 h-4 text-slate-400" />
              <span>📂 Buka Proyek</span>
            </button>

            <button
              onClick={() => onNavigateTab('materi')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-slate-400" />
              <span>📄 Upload Materi Ajar (TIDAK WAJIB)</span>
            </button>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
            <span>Dikembangkan oleh:</span>
            <span className="font-semibold text-amber-300 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/60">
              FERY GUSTOMI KAHARU
            </span>
          </div>
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-slate-500 font-medium">Mata Pelajaran & Fase</div>
            <div className="text-sm font-bold text-slate-800 truncate">
              {project.identity.mataPelajaran}
            </div>
            <div className="text-[11px] text-slate-400">
              {project.identity.fase} • {project.identity.kelas}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-slate-500 font-medium">Pertemuan yang Dipilih</div>
            <div className="text-sm font-bold text-slate-800">
              Pertemuan Ke-{activeMeeting?.pertemuanKe} (No. {activeMeeting?.nomorPertemuan})
            </div>
            <div className="text-[11px] text-slate-400">
              Alokasi: {activeMeeting?.alokasiWaktuText} ({activeMeeting?.alokasiMenit} menit)
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-slate-500 font-medium">TP & KKTP Terpasang</div>
            <div className="text-sm font-bold text-slate-800">
              {project.tps.length} TP • {project.kktps.length} Indikator
            </div>
            <div className="text-[11px] text-emerald-600 font-medium">
              ✓ Garansi verbatim 100%
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-slate-500 font-medium">Status RPPM</div>
            <div className="text-sm font-bold text-slate-800">
              {hasRPPM ? '✓ Tersusun & Siap Cetak' : 'Belum di-generate'}
            </div>
            <div className="text-[11px] text-slate-400">
              {hasRPPM ? (
                <button
                  onClick={() => onNavigateTab('preview')}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Buka Preview Dokumen →
                </button>
              ) : (
                'Klik tombol generate di atas'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alur Aplikasi 13 Langkah (Interactive Step Workflow) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Alur Kerja Penyusunan RPPM Pembelajaran Mendalam</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              13 langkah terstruktur untuk memastikan perangkat ajar memenuhi kaidah pedagogis Kurikulum Merdeka.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" /> Lengkap
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-blue-600">
              <AlertCircle className="w-4 h-4" /> Perlu Diisi
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {steps.map(step => {
            const isCompleted = step.status === 'completed';
            const isOptional = step.status === 'optional';

            return (
              <div
                key={step.num}
                onClick={() => {
                  if (step.tab === 'generate_action') {
                    onOpenGenerateModal();
                  } else if (step.tab === 'export_action') {
                    if (hasRPPM) onOpenExportModal();
                    else onOpenGenerateModal();
                  } else {
                    onNavigateTab(step.tab);
                  }
                }}
                className="group relative p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md bg-slate-50/50 hover:bg-white transition-all cursor-pointer flex items-start gap-3"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : isOptional
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {isCompleted ? '✓' : step.num}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {step.title}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Pillars of Deep Learning Info Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 rounded-xl border border-blue-100">
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <span>🧠</span>
            <span>Berkesadaran (Mindful)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Murid memahami makna dan tujuan pembelajaran, mengamati proses belajar secara sadar, serta
            mampu merefleksikan apa yang dipelajari untuk perkembangan dirinya.
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4 rounded-xl border border-emerald-100">
          <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <span>🌍</span>
            <span>Bermakna (Meaningful)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Materi dan pengalaman belajar dihubungkan langsung dengan dunia nyata murid, fenomena
            lingkungan sekitar sekolah dan rumah, sehingga pengetahuan fungsional dan relevan.
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 rounded-xl border border-amber-100">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <span>🎉</span>
            <span>Menggembirakan (Joyful)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Suasana belajar yang aktif, interaktif, inklusif, ramah anak, dan diakhiri dengan ice breaking
            apresiatif sebagai perayaan usaha serta kerja sama murid.
          </p>
        </div>
      </div>
    </div>
  );
};
