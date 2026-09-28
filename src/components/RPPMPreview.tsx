import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Printer,
  FileDown,
  RotateCcw,
  Edit3,
  Check,
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  FileSpreadsheet,
  Award,
} from 'lucide-react';
import { RPPMDocument, MeetingItem } from '../types/rppm';
import { ValidationCard } from './ValidationCard';
import { ValidationResult } from '../types/rppm';

interface RPPMPreviewProps {
  document: RPPMDocument;
  validation: ValidationResult;
  onAutoFix: () => void;
  onOpenExportModal: () => void;
  onRegenerate: () => void;
  onNextMeeting?: () => void;
  nextMeetingInfo?: MeetingItem;
  onUpdateDocument: (updated: RPPMDocument) => void;
}

export const RPPMPreview: React.FC<RPPMPreviewProps> = ({
  document,
  validation,
  onAutoFix,
  onOpenExportModal,
  onRegenerate,
  onNextMeeting,
  nextMeetingInfo,
  onUpdateDocument,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<'all' | 'rppm' | 'lkm' | 'asesmen'>('all');

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 70));
  const handleResetZoom = () => setZoom(100);

  const handleCopyText = () => {
    const textContent = `${document.identitas.satuanPendidikan}
RENCANA PELAKSANAAN PEMBELAJARAN MENDALAM (RPPM)
KURIKULUM MERDEKA - SEKOLAH DASAR

Mata Pelajaran: ${document.identitas.mataPelajaran}
Kelas / Fase: ${document.identitas.kelas} / ${document.identitas.fase}
Pertemuan: Ke-${document.pertemuanDipilih.pertemuanKe} (No. ${document.pertemuanDipilih.nomorPertemuan})
Alokasi Waktu: ${document.pertemuanDipilih.alokasiWaktuText}

TUJUAN PEMBELAJARAN:
${document.desain.tujuanPembelajaran}

KEGIATAN AWAL (${document.pengalamanBelajar.kegiatanAwal.waktu}):
${document.pengalamanBelajar.kegiatanAwal.langkah.map((l, i) => `${i + 1}. ${l}`).join('\n')}

KEGIATAN INTI (${document.pengalamanBelajar.kegiatanInti.waktu}):
${document.pengalamanBelajar.kegiatanInti.sintaksList
  .map(s => `${s.tahap}\n${s.kegiatan.map((k, i) => `  ${i + 1}. ${k}`).join('\n')}`)
  .join('\n\n')}

ICE BREAKING:
${document.pengalamanBelajar.kegiatanInti.iceBreaking.map((k, i) => `${i + 1}. ${k}`).join('\n')}

KEGIATAN PENUTUP (${document.pengalamanBelajar.kegiatanPenutup.waktu}):
${document.pengalamanBelajar.kegiatanPenutup.langkah.map((l, i) => `${i + 1}. ${l}`).join('\n')}

LEMBAR KERJA MURID (LKM):
${document.lkm.judul}
Tugas Murid:
${document.lkm.tugasMurid.map((t, i) => `${i + 1}. ${t}`).join('\n')}
`;

    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Validation Card */}
      <ValidationCard validation={validation} onAutoFix={onAutoFix} />

      {/* Floating Toolbar */}
      <div className="sticky top-24 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200/80 shadow-md flex flex-wrap items-center justify-between gap-3">
        {/* Navigation Sections */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'all', label: 'Seluruh Dokumen' },
            { id: 'rppm', label: 'RPPM Inti' },
            { id: 'lkm', label: 'LKM & Rubrik' },
            { id: 'asesmen', label: 'Asesmen Formatif' },
          ].map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeSection === sec.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded cursor-pointer"
              title="Perkecil Tampilan"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span
              onClick={handleResetZoom}
              className="px-2 font-mono font-medium text-slate-700 cursor-pointer text-[11px]"
              title="Reset Zoom 100%"
            >
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded cursor-pointer"
              title="Perbesar Tampilan"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleCopyText}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Salin Teks RPPM"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Salin</span>
              </>
            )}
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Cetak Langsung"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Cetak</span>
          </button>

          <button
            onClick={onRegenerate}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
            title="Generate Ulang Variasi Kegiatan Baru"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
            <span>Generate Ulang</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>📥 Export Word</span>
          </button>
        </div>
      </div>

      {/* Next Meeting Banner (Prompt Rule #9) */}
      {nextMeetingInfo && onNextMeeting && (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-4 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
              Rangkaian Pembelajaran Selanjutnya
            </span>
            <div className="text-sm font-bold">
              Pertemuan Berikut: Ke-{nextMeetingInfo.pertemuanKe} (Nomor {nextMeetingInfo.nomorPertemuan}) • {nextMeetingInfo.alokasiWaktuText}
            </div>
            <div className="text-xs text-slate-300">
              Fokus Pengalaman: <strong>{nextMeetingInfo.fokusPengalaman}</strong> — {nextMeetingInfo.topikSpesifik || 'Lanjutan materi'}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={onNextMeeting}
              className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer hover:scale-[1.02]"
            >
              <span>Lanjutkan ke Pertemuan {nextMeetingInfo.nomorPertemuan}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenExportModal}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-colors cursor-pointer"
            >
              Export Word Dulu
            </button>
          </div>
        </div>
      )}

      {/* Document Sheet Display (Simulated A4 Paper) */}
      <div className="flex justify-center overflow-x-auto pb-12">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="w-[820px] min-h-[1160px] bg-white rounded-xl shadow-2xl border border-slate-300 p-12 text-slate-800 font-sans print:shadow-none print:border-none print:p-0 print:w-full space-y-6"
        >
          {/* Document Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
            <h1 className="text-base font-extrabold tracking-wider text-slate-900 uppercase">
              RENCANA PELAKSANAAN PEMBELAJARAN MENDALAM (RPPM)
            </h1>
            <h2 className="text-sm font-bold text-blue-700 tracking-wide uppercase">
              KURIKULUM MERDEKA – SEKOLAH DASAR
            </h2>
            <p className="text-xs text-slate-600 font-medium italic">
              Satuan Pendidikan: {document.identitas.satuanPendidikan} | Tahun Pelajaran 2026/2027
            </p>
          </div>

          {(activeSection === 'all' || activeSection === 'rppm') && (
            <>
              {/* Identitas RPPM Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
                  IDENTITAS RPPM
                </h3>
                <table className="w-full text-xs border-collapse border border-slate-300">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="w-1/3 p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Identitas Penulis / Guru
                      </td>
                      <td className="p-2 font-medium">
                        {document.identitas.namaGuru} {document.identitas.nipGuru ? `(NIP. ${document.identitas.nipGuru})` : ''}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Kepala Sekolah
                      </td>
                      <td className="p-2 font-medium">
                        {document.identitas.kepalaSekolah} {document.identitas.nipKepalaSekolah ? `(NIP. ${document.identitas.nipKepalaSekolah})` : ''}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Satuan Pendidikan
                      </td>
                      <td className="p-2 font-medium">
                        {document.identitas.satuanPendidikan}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Fase / Kelas
                      </td>
                      <td className="p-2 font-medium">
                        {document.identitas.fase} / {document.identitas.kelas}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Semester
                      </td>
                      <td className="p-2 font-medium">{document.identitas.semester}</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Mata Pelajaran
                      </td>
                      <td className="p-2 font-bold text-blue-900">
                        {document.identitas.mataPelajaran}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Pertemuan Ke
                      </td>
                      <td className="p-2 font-bold">
                        Pertemuan Ke-{document.pertemuanDipilih.pertemuanKe} (Nomor Pertemuan {document.pertemuanDipilih.nomorPertemuan})
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Alokasi Waktu
                      </td>
                      <td className="p-2 font-bold text-emerald-800">
                        {document.pertemuanDipilih.alokasiWaktuText} ({document.pertemuanDipilih.alokasiMenit} Menit)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* I. Identifikasi Perencanaan */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
                  I. IDENTIFIKASI PERENCANAAN
                </h3>
                <table className="w-full text-xs border-collapse border border-slate-300">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="w-1/3 p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Kesiapan Murid
                      </td>
                      <td className="p-2 leading-relaxed">
                        {document.perencanaan.kesiapanMurid}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Karakteristik Materi
                      </td>
                      <td className="p-2 leading-relaxed">
                        {document.perencanaan.karakteristikMateri}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300 align-top">
                        Dimensi Profil Lulusan & Keterkaitan Aktivitas
                      </td>
                      <td className="p-2 space-y-1.5">
                        {document.perencanaan.dimensiProfil.map(dim => (
                          <div key={dim.dimensi} className="text-xs">
                            <strong className="text-blue-900">• {dim.dimensi}:</strong>{' '}
                            <span className="text-slate-700">{dim.keterkaitan}</span>
                          </div>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* II. Desain Pembelajaran */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
                  II. DESAIN PEMBELAJARAN
                </h3>
                <table className="w-full text-xs border-collapse border border-slate-300">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="w-1/3 p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Topik Pembelajaran
                      </td>
                      <td className="p-2 font-bold text-slate-900">
                        {document.desain.topikPembelajaran}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Tujuan Pembelajaran (TP)
                      </td>
                      <td className="p-2 font-semibold text-slate-900 bg-blue-50/30">
                        {document.desain.tujuanPembelajaran}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300 align-top">
                        KKTP Sesuai Pertemuan
                      </td>
                      <td className="p-2 space-y-1">
                        {document.desain.kktpTerpilih.map((k, i) => (
                          <div key={i} className="text-slate-800 font-medium">
                            {i + 1}. {k}
                          </div>
                        ))}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300 align-top">
                        Model Pembelajaran
                      </td>
                      <td className="p-2 leading-relaxed">
                        <strong className="text-blue-900">{document.desain.modelPembelajaran}</strong>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Alasan Pemilihan: {document.desain.alasanModel}
                        </p>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Metode Pembelajaran
                      </td>
                      <td className="p-2 font-medium">
                        {document.desain.metodePembelajaran.join(', ')}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Kemitraan Pembelajaran
                      </td>
                      <td className="p-2">{document.desain.kemitraanPembelajaran}</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Lingkungan Pembelajaran
                      </td>
                      <td className="p-2">{document.desain.lingkunganPembelajaran}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Pemanfaatan Digital
                      </td>
                      <td className="p-2">{document.desain.pemanfaatanDigital}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* III. Pengalaman Belajar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    III. PENGALAMAN BELAJAR
                  </h3>
                  <span className="text-xs font-bold text-blue-700">
                    Fokus: {document.pengalamanBelajar.fokus} | Alokasi: {document.pengalamanBelajar.waktuTotal}
                  </span>
                </div>

                <table className="w-full text-xs border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300">
                      <th className="w-1/4 p-2 text-left font-bold border-r border-slate-300">
                        Tahap / Sintaks
                      </th>
                      <th className="p-2 text-left font-bold border-r border-slate-300">
                        Kegiatan Pembelajaran (Vertikal Bernomor, Mindful, Meaningful, Joyful)
                      </th>
                      <th className="w-20 p-2 text-center font-bold">Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Kegiatan Awal */}
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-bold bg-slate-50 border-r border-slate-300 align-top">
                        A. KEGIATAN AWAL
                        <p className="text-[10px] font-normal text-slate-500 mt-1">
                          Salam, doa, presensi, apersepsi, motivasi, asesmen awal, pertanyaan pemantik, penyampaian TP.
                        </p>
                      </td>
                      <td className="p-2 border-r border-slate-300 align-top space-y-1">
                        {document.pengalamanBelajar.kegiatanAwal.langkah.map((l, i) => (
                          <div key={i} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="font-semibold text-slate-700 min-w-4">{i + 1}.</span>
                            <span>{l}</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-2 text-center font-bold text-slate-700 align-top">
                        {document.pengalamanBelajar.kegiatanAwal.waktu}
                      </td>
                    </tr>

                    {/* Kegiatan Inti (Sintaks) */}
                    {document.pengalamanBelajar.kegiatanInti.sintaksList.map((sintaks, sIdx) => (
                      <tr key={sIdx} className="border-b border-slate-300">
                        <td className="p-2 font-bold bg-slate-50 border-r border-slate-300 align-top">
                          B.{sIdx + 1} {sintaks.tahap}
                        </td>
                        <td className="p-2 border-r border-slate-300 align-top space-y-1">
                          {sintaks.kegiatan.map((k, i) => (
                            <div key={i} className="flex items-start gap-1.5 leading-relaxed">
                              <span className="font-semibold text-slate-700 min-w-4">{i + 1}.</span>
                              <span>{k}</span>
                            </div>
                          ))}
                        </td>
                        <td className="p-2 text-center font-bold text-slate-700 align-top">
                          {sintaks.waktu}
                        </td>
                      </tr>
                    ))}

                    {/* Ice Breaking */}
                    <tr className="border-b border-slate-300 bg-amber-50/20">
                      <td className="p-2 font-bold bg-amber-50/60 border-r border-slate-300 align-top text-amber-950">
                        B.AKHIR: ICE BREAKING & APRESIASI
                        <span className="block text-[10px] font-normal text-amber-800">
                          (Joyful Learning)
                        </span>
                      </td>
                      <td className="p-2 border-r border-slate-300 align-top space-y-1">
                        {document.pengalamanBelajar.kegiatanInti.iceBreaking.map((l, i) => (
                          <div key={i} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="font-semibold text-amber-800 min-w-4">{i + 1}.</span>
                            <span>{l}</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-2 text-center font-bold text-slate-700 align-top">
                        5 menit
                      </td>
                    </tr>

                    {/* Kegiatan Penutup */}
                    <tr>
                      <td className="p-2 font-bold bg-slate-50 border-r border-slate-300 align-top">
                        C. KEGIATAN PENUTUP
                        <p className="text-[10px] font-normal text-slate-500 mt-1">
                          Refleksi, umpan balik, tindak lanjut, penguatan karakter, doa, dan salam.
                        </p>
                      </td>
                      <td className="p-2 border-r border-slate-300 align-top space-y-1">
                        {document.pengalamanBelajar.kegiatanPenutup.langkah.map((l, i) => (
                          <div key={i} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="font-semibold text-slate-700 min-w-4">{i + 1}.</span>
                            <span>{l}</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-2 text-center font-bold text-slate-700 align-top">
                        {document.pengalamanBelajar.kegiatanPenutup.waktu}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* IV. Asesmen Pembelajaran */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
                  IV. ASESMEN PEMBELAJARAN
                </h3>
                <table className="w-full text-xs border-collapse border border-slate-300">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="w-1/3 p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        A. Asesmen Awal (Diagnostik)
                      </td>
                      <td className="p-2 space-y-1">
                        {document.asesmen.asesmenAwal.map((a, i) => (
                          <div key={i}>• {a}</div>
                        ))}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        B. Asesmen Formatif (Proses)
                      </td>
                      <td className="p-2 space-y-1">
                        {document.asesmen.asesmenProses.map((a, i) => (
                          <div key={i}>• {a}</div>
                        ))}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        C. Asesmen Akhir
                      </td>
                      <td className="p-2 space-y-1">
                        {document.asesmen.asesmenAkhir.map((a, i) => (
                          <div key={i}>• {a}</div>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Materi Ajar Ringkasan */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
                  V. RINGKASAN MATERI AJAR
                </h3>
                <table className="w-full text-xs border-collapse border border-slate-300">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="w-1/3 p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Konsep Inti
                      </td>
                      <td className="p-2 font-bold text-slate-800">{document.materiAjar.konsepInti}</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300 align-top">
                        Subkonsep
                      </td>
                      <td className="p-2 space-y-1">
                        {document.materiAjar.subKonsep.map((s, i) => (
                          <div key={i}>{i + 1}. {s}</div>
                        ))}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300 align-top">
                        Contoh Kontekstual
                      </td>
                      <td className="p-2 space-y-1">
                        {document.materiAjar.contohKontekstual.map((c, i) => (
                          <div key={i}>{c}</div>
                        ))}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Sumber Belajar Utama
                      </td>
                      <td className="p-2 font-medium text-blue-900">{document.materiAjar.sumberBelajar}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* LEMBAR KERJA MURID (LKM) SECTION */}
          {(activeSection === 'all' || activeSection === 'lkm') && (
            <div className="pt-6 border-t-2 border-dashed border-slate-300 space-y-4">
              <div className="text-center space-y-1 bg-blue-50/70 p-3 rounded-xl border border-blue-200">
                <h3 className="text-sm font-extrabold uppercase text-blue-900 tracking-wider">
                  {document.lkm.judul}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {document.identitas.satuanPendidikan} • Mata Pelajaran: {document.identitas.mataPelajaran} • Kelas: {document.identitas.kelas}
                </p>
              </div>

              <table className="w-full text-xs border-collapse border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-300">
                    <td className="w-1/4 p-2 font-semibold bg-slate-50 border-r border-slate-300 align-top">
                      Tujuan Kegiatan
                    </td>
                    <td className="p-2 space-y-1">
                      {document.lkm.tujuan.map((t, i) => (
                        <div key={i}>{i + 1}. {t}</div>
                      ))}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300 align-top">
                      Alat dan Bahan
                    </td>
                    <td className="p-2 space-y-1">
                      {document.lkm.alatDanBahan.map((a, i) => (
                        <div key={i}>• {a}</div>
                      ))}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300 align-top">
                      Langkah Kerja Kelompok
                    </td>
                    <td className="p-2 space-y-1.5">
                      {document.lkm.langkahKerja.map((l, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="font-bold min-w-4">{i + 1}.</span>
                          <span>{l}</span>
                        </div>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300 align-top">
                      Tugas Murid (Penyelidikan)
                    </td>
                    <td className="p-2 space-y-2 bg-slate-50/20">
                      {document.lkm.tugasMurid.map((t, i) => (
                        <div key={i} className="p-2 bg-white rounded border border-slate-200">
                          <strong className="text-blue-900 block mb-1">{t}</strong>
                          <div className="h-8 border-b border-dashed border-slate-300 text-[10px] text-slate-400 italic flex items-end">
                            (Ruang jawaban murid)
                          </div>
                        </div>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Rubrik Penilaian LKM */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase">
                  Rubrik Penilaian LKM
                </h4>
                <table className="w-full text-xs border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300">
                      <th className="p-2 text-left font-bold border-r border-slate-300">Aspek yang Dinilai</th>
                      <th className="p-2 text-left font-bold border-r border-slate-300">Sangat Baik (4)</th>
                      <th className="p-2 text-left font-bold border-r border-slate-300">Baik (3)</th>
                      <th className="p-2 text-left font-bold border-r border-slate-300">Cukup (2)</th>
                      <th className="p-2 text-left font-bold">Perlu Bimbingan (1)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {document.lkm.rubrikPenilaian.map((r, i) => (
                      <tr key={i} className="border-b border-slate-300">
                        <td className="p-2 font-bold bg-slate-50 border-r border-slate-300">{r.aspek}</td>
                        <td className="p-2 border-r border-slate-300 text-[11px]">{r.skor4}</td>
                        <td className="p-2 border-r border-slate-300 text-[11px]">{r.skor3}</td>
                        <td className="p-2 border-r border-slate-300 text-[11px]">{r.skor2}</td>
                        <td className="p-2 text-[11px]">{r.skor1}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ASESMEN FORMATIF SECTION */}
          {document.asesmenFormatif && (activeSection === 'all' || activeSection === 'asesmen') && (
            <div className="pt-6 border-t-2 border-dashed border-slate-300 space-y-5">
              <div className="text-center space-y-1 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                <h3 className="text-sm font-extrabold uppercase text-emerald-950 tracking-wider">
                  INSTRUMEN ASESMEN FORMATIF
                </h3>
                <p className="text-xs text-emerald-800 font-medium">
                  {document.identitas.mataPelajaran} • Pertemuan {document.pertemuanDipilih.nomorPertemuan}
                </p>
              </div>

              {/* Kisi-Kisi */}
              {document.formatifConfig.tampilkanKisiKisi && document.asesmenFormatif.kisiKisi.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Tabel Kisi-Kisi Soal Formatif
                  </h4>
                  <table className="w-full text-xs border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300">
                        <th className="w-8 p-1.5 text-center font-bold border-r border-slate-300">No</th>
                        <th className="w-28 p-1.5 text-left font-bold border-r border-slate-300">Bentuk Soal</th>
                        <th className="p-1.5 text-left font-bold border-r border-slate-300">KKTP yang Diukur</th>
                        <th className="p-1.5 text-left font-bold border-r border-slate-300">Indikator Soal</th>
                        <th className="w-20 p-1.5 text-center font-bold">Kesulitan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {document.asesmenFormatif.kisiKisi.map(k => (
                        <tr key={k.nomor} className="border-b border-slate-300">
                          <td className="p-1.5 text-center font-bold border-r border-slate-300">{k.nomor}</td>
                          <td className="p-1.5 border-r border-slate-300 font-medium">{k.bentukSoal}</td>
                          <td className="p-1.5 border-r border-slate-300 text-[11px]">{k.kktp}</td>
                          <td className="p-1.5 border-r border-slate-300 text-[11px]">{k.indikatorSoal}</td>
                          <td className="p-1.5 text-center text-[11px] font-semibold">{k.tingkatKesulitan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Soal Items */}
              {/* 1. PG */}
              {document.asesmenFormatif.soalPG.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-50 px-2 py-1 border-l-4 border-blue-600">
                    A. Soal Pilihan Ganda
                  </h4>
                  {document.asesmenFormatif.soalPG.map(soal => (
                    <div key={soal.nomor} className="space-y-1.5 text-xs pl-2">
                      {soal.stimulus && (
                        <div className="p-2 rounded bg-slate-50 text-[11px] text-slate-600 italic border border-slate-200">
                          [Stimulus] {soal.stimulus}
                        </div>
                      )}
                      <div className="font-bold text-slate-900">
                        {soal.nomor}. {soal.pertanyaan}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pl-4">
                        {soal.opsi.map(opt => (
                          <div key={opt.key} className="text-slate-800">
                            <strong>{opt.key}.</strong> {opt.text}
                          </div>
                        ))}
                      </div>
                      {document.formatifConfig.kunciJawabanMode === 'sertakan' && (
                        <div className="text-[11px] text-emerald-700 font-medium pl-4 pt-1">
                          ✓ Kunci: <strong>{soal.kunci}</strong> ({soal.pembahasan || ''})
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 2. PG Kompleks */}
              {document.asesmenFormatif.soalPGKompleks.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-50 px-2 py-1 border-l-4 border-indigo-600">
                    B. Soal Pilihan Ganda Kompleks
                  </h4>
                  {document.asesmenFormatif.soalPGKompleks.map(soal => (
                    <div key={soal.nomor} className="space-y-1.5 text-xs pl-2">
                      {soal.stimulus && (
                        <div className="p-2 rounded bg-slate-50 text-[11px] text-slate-600 italic border border-slate-200">
                          [Stimulus] {soal.stimulus}
                        </div>
                      )}
                      <div className="font-bold text-slate-900">
                        {soal.nomor}. {soal.pertanyaan} <span className="font-normal italic">({soal.petunjuk})</span>
                      </div>
                      <div className="space-y-1 pl-4">
                        {soal.opsi.map(opt => (
                          <div key={opt.key} className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border border-slate-400 rounded-sm inline-block" />
                            <span><strong>{opt.key}.</strong> {opt.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. Benar-Salah */}
              {document.asesmenFormatif.soalBenarSalah.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-50 px-2 py-1 border-l-4 border-emerald-600">
                    C. Soal Benar – Salah
                  </h4>
                  {document.asesmenFormatif.soalBenarSalah.map(soal => (
                    <div key={soal.nomor} className="space-y-1.5 text-xs pl-2">
                      {soal.stimulus && (
                        <div className="p-2 rounded bg-slate-50 text-[11px] text-slate-600 italic border border-slate-200">
                          [Stimulus] {soal.stimulus}
                        </div>
                      )}
                      <table className="w-full text-xs border-collapse border border-slate-300">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-300">
                            <th className="p-1.5 text-center w-8">No</th>
                            <th className="p-1.5 text-left">Pernyataan</th>
                            <th className="p-1.5 text-center w-14">Benar</th>
                            <th className="p-1.5 text-center w-14">Salah</th>
                          </tr>
                        </thead>
                        <tbody>
                          {soal.pernyataanList.map((p, idx) => (
                            <tr key={idx} className="border-b border-slate-300">
                              <td className="p-1.5 text-center font-bold">{soal.nomor}.{idx + 1}</td>
                              <td className="p-1.5">{p.teks}</td>
                              <td className="p-1.5 text-center">
                                {document.formatifConfig.kunciJawabanMode === 'sertakan' && p.kunci === 'Benar' ? '✓' : '[  ]'}
                              </td>
                              <td className="p-1.5 text-center">
                                {document.formatifConfig.kunciJawabanMode === 'sertakan' && p.kunci === 'Salah' ? '✓' : '[  ]'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. Menjodohkan */}
              {document.asesmenFormatif.soalMenjodohkan.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-50 px-2 py-1 border-l-4 border-amber-600">
                    D. Soal Menjodohkan
                  </h4>
                  {document.asesmenFormatif.soalMenjodohkan.map(soal => (
                    <div key={soal.nomor} className="space-y-1.5 text-xs pl-2">
                      <div className="font-bold text-slate-900">
                        {soal.nomor}. Petunjuk: {soal.petunjuk}
                      </div>
                      <table className="w-full text-xs border-collapse border border-slate-300">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-300">
                            <th className="p-1.5 text-left w-1/2">Kolom Kiri</th>
                            <th className="p-1.5 text-left w-1/2">Kolom Kanan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {soal.pasangan.map((p, idx) => (
                            <tr key={idx} className="border-b border-slate-300">
                              <td className="p-1.5">{p.kiri}</td>
                              <td className="p-1.5">{p.kanan}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}

              {/* 5. Isian Singkat */}
              {document.asesmenFormatif.soalIsian.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-50 px-2 py-1 border-l-4 border-purple-600">
                    E. Soal Isian Singkat
                  </h4>
                  {document.asesmenFormatif.soalIsian.map(soal => (
                    <div key={soal.nomor} className="space-y-1 text-xs pl-2">
                      <div>
                        {soal.nomor}. {soal.pertanyaan}
                      </div>
                      {document.formatifConfig.kunciJawabanMode === 'sertakan' && (
                        <div className="text-[11px] text-emerald-700 font-semibold pl-4">
                          ✓ Kunci: {soal.kunci}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 6. Uraian */}
              {document.asesmenFormatif.soalUraian.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-50 px-2 py-1 border-l-4 border-rose-600">
                    F. Soal Uraian (Penalaran Kritis)
                  </h4>
                  {document.asesmenFormatif.soalUraian.map(soal => (
                    <div key={soal.nomor} className="space-y-1.5 text-xs pl-2">
                      {soal.stimulus && (
                        <div className="p-2 rounded bg-slate-50 text-[11px] text-slate-600 italic border border-slate-200">
                          [Kasus] {soal.stimulus}
                        </div>
                      )}
                      <div className="font-bold text-slate-900">
                        {soal.nomor}. {soal.pertanyaan}
                      </div>
                      {document.formatifConfig.kunciJawabanMode === 'sertakan' && (
                        <div className="p-2 bg-emerald-50/50 rounded text-[11px] text-emerald-900 border border-emerald-200">
                          <strong>Kunci & Pembahasan:</strong> {soal.kunci}
                          <br />
                          <strong>Pedoman Penskoran:</strong> {soal.pedomanPenskoran}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* KUNCI JAWABAN TERPISAH (Halaman Khusus jika dipilih 'pisahkan') */}
              {document.formatifConfig.kunciJawabanMode === 'pisahkan' && (
                <div className="pt-6 border-t-2 border-slate-400 space-y-3">
                  <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-900 bg-slate-100 p-2 rounded">
                    LEMBAR KUNCI JAWABAN ASESMEN FORMATIF (HALAMAN TERPISAH)
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    {document.asesmenFormatif.soalPG.length > 0 && (
                      <div>
                        <strong>Kunci Pilihan Ganda:</strong>{' '}
                        {document.asesmenFormatif.soalPG.map(p => `No.${p.nomor}: ${p.kunci}`).join(' | ')}
                      </div>
                    )}
                    {document.asesmenFormatif.soalPGKompleks.length > 0 && (
                      <div>
                        <strong>Kunci PG Kompleks:</strong>{' '}
                        {document.asesmenFormatif.soalPGKompleks.map(p => `No.${p.nomor}: [${p.kunci.join(', ')}]`).join(' | ')}
                      </div>
                    )}
                    {document.asesmenFormatif.soalBenarSalah.length > 0 && (
                      <div>
                        <strong>Kunci Benar-Salah:</strong>{' '}
                        {document.asesmenFormatif.soalBenarSalah.map(b => `No.${b.nomor}: (${b.pernyataanList.map(p => p.kunci).join(', ')})`).join(' | ')}
                      </div>
                    )}
                    {document.asesmenFormatif.soalMenjodohkan.length > 0 && (
                      <div>
                        <strong>Kunci Menjodohkan:</strong>{' '}
                        {document.asesmenFormatif.soalMenjodohkan.map(m => `No.${m.nomor}: ${m.pasangan.map(p => p.kunciPasangan).join(', ')}`).join(' | ')}
                      </div>
                    )}
                    {document.asesmenFormatif.soalIsian.length > 0 && (
                      <div>
                        <strong>Kunci Isian Singkat:</strong>{' '}
                        {document.asesmenFormatif.soalIsian.map(i => `No.${i.nomor}: ${i.kunci}`).join(' | ')}
                      </div>
                    )}
                    {document.asesmenFormatif.soalUraian.length > 0 && (
                      <div className="space-y-1">
                        <strong>Kunci & Rubrik Uraian:</strong>
                        {document.asesmenFormatif.soalUraian.map(u => (
                          <div key={u.nomor} className="pl-2">
                            • No.{u.nomor}: {u.kunci} (Pedoman: {u.pedomanPenskoran})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Signature Block (Lembar Pengesahan) */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-xs border-t border-slate-300">
            <div className="space-y-1 text-center">
              <div>Mengetahui,</div>
              <div>Kepala {document.identitas.satuanPendidikan}</div>
              <div className="h-16" />
              <div className="font-bold underline text-slate-900">
                {document.identitas.kepalaSekolah}
              </div>
              <div className="text-[11px] text-slate-600">
                {document.identitas.nipKepalaSekolah ? `NIP. ${document.identitas.nipKepalaSekolah}` : 'NIP. -'}
              </div>
            </div>

            <div className="space-y-1 text-center">
              <div>
                {document.identitas.satuanPendidikan.split(' ')[0] || 'Anggrek'},{' '}
                {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div>Guru Mata Pelajaran / Kelas,</div>
              <div className="h-16" />
              <div className="font-bold underline text-slate-900">
                {document.identitas.namaGuru}
              </div>
              <div className="text-[11px] text-slate-600">
                {document.identitas.nipGuru ? `NIP. ${document.identitas.nipGuru}` : 'NIP. -'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
