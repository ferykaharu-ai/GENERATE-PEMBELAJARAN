import React, { useState } from 'react';
import {
  FileDown,
  FileText,
  ClipboardList,
  KeyRound,
  BookOpen,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { RPPMDocument } from '../types/rppm';
import { exportRPPMToDocx, downloadBlob, ExportScope } from '../utils/docxExport';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: RPPMDocument;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  const [selectedScope, setSelectedScope] = useState<ExportScope>('lengkap');
  const [separateFiles, setSeparateFiles] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportSuccess(false);

      const files = await exportRPPMToDocx(document, selectedScope, separateFiles);

      for (const f of files) {
        downloadBlob(f.blob, f.fileName);
      }

      setExportSuccess(true);
      setTimeout(() => {
        setIsExporting(false);
      }, 800);
    } catch (err) {
      console.error('Export error:', err);
      alert('Gagal mengekspor dokumen Word. Silakan coba lagi.');
      setIsExporting(false);
    }
  };

  const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9_-]/g, '_');
  const previewFileName = `RPPM_${sanitize(document.identitas.mataPelajaran)}_${sanitize(document.identitas.kelas)}Pertemuan${document.pertemuanDipilih.nomorPertemuan}.docx`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10"
          >
            ✕
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase border border-emerald-400/30">
              Format Baku Microsoft Word
            </span>
          </div>
          <h3 className="text-xl font-bold font-serif flex items-center gap-2">
            <FileDown className="w-5 h-5 text-emerald-300" />
            <span>Export RPPM ke Word (.docx)</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Siap cetak, ukuran A4, font Arial 11pt, margin standar, penomoran halaman otomatis, dan tabel rapi.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
              Pilih Bagian yang Ingin Diekspor:
            </label>
            <div className="space-y-2">
              {[
                {
                  id: 'lengkap',
                  title: '📄 Export RPPM Lengkap',
                  desc: 'Menghasilkan seluruh perangkat RPPM terpadu (Identitas, Sintaks, LKM, Asesmen, dan Rubrik)',
                },
                {
                  id: 'semua',
                  title: '📦 Export Semua Bagian',
                  desc: 'Seluruh komponen termasuk kisi-kisi dan kunci jawaban lengkap',
                },
                {
                  id: 'formatif',
                  title: '📝 Export Asesmen Formatif Saja',
                  desc: 'Hanya butir soal asesmen formatif (Pilihan Ganda, Benar-Salah, Isian, Uraian)',
                },
                {
                  id: 'lkm',
                  title: '📚 Export LKM & Rubrik',
                  desc: 'Hanya Lembar Kerja Murid dan rubrik penskoran penilaian',
                },
                {
                  id: 'kunci',
                  title: '🔐 Export Kunci Jawaban',
                  desc: 'Hanya lembar kunci jawaban dan pedoman penskoran',
                },
              ].map(opt => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedScope === opt.id
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="exportScope"
                    value={opt.id}
                    checked={selectedScope === opt.id}
                    onChange={() => setSelectedScope(opt.id as any)}
                    className="mt-1 text-emerald-600"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800">
                      {opt.title}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {opt.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Separation Option */}
          {selectedScope === 'semua' && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={separateFiles}
                  onChange={e => setSeparateFiles(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Pisahkan menjadi 4 berkas Word terpisah (RPPM, Formatif, LKM, Kunci Jawaban)
                </span>
              </label>
            </div>
          )}

          {/* Filename Preview */}
          <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Nama Berkas yang Dibuat:</span>
            <div className="font-mono text-emerald-800 font-semibold mt-0.5 truncate">
              {previewFileName}
            </div>
          </div>

          {exportSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Dokumen Word berhasil dibuat dan diunduh ke komputer Anda!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
          >
            Tutup
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            <span>{isExporting ? 'Memproses Word...' : 'Unduh File Word (.docx)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
