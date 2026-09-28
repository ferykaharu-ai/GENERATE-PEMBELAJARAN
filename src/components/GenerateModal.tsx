import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { RPPMProject, MeetingItem, TPItem } from '../types/rppm';

interface GenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: RPPMProject;
  activeMeeting: MeetingItem;
  activeTP: TPItem;
  onGenerateGemini: () => Promise<void>;
  onGenerateLocal: () => void;
  isGenerating: boolean;
  generationStep: string;
}

export const GenerateModal: React.FC<GenerateModalProps> = ({
  isOpen,
  onClose,
  project,
  activeMeeting,
  activeTP,
  onGenerateGemini,
  onGenerateLocal,
  isGenerating,
  generationStep,
}) => {
  if (!isOpen) return null;

  // Validation before generate
  const missingFields: string[] = [];
  if (!project.identity.namaGuru) missingFields.push('Nama Guru');
  if (!project.identity.satuanPendidikan) missingFields.push('Satuan Pendidikan');
  if (!project.identity.mataPelajaran) missingFields.push('Mata Pelajaran');
  if (!activeTP || !activeTP.text.trim()) missingFields.push('Tujuan Pembelajaran (TP)');
  if (project.kktps.length === 0) missingFields.push('KKTP');
  if (project.selectedDimensi.length === 0) missingFields.push('Dimensi Profil Lulusan');

  const canGenerate = missingFields.length === 0 && !isGenerating;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 transition-all">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10"
          >
            ✕
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-600/60 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase border border-blue-400/30">
              Generator Per Pertemuan
            </span>
          </div>

          <h3 className="text-xl font-bold font-serif">
            Generate RPPM Pembelajaran Mendalam
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Pilih metode penyusunan untuk Pertemuan Ke-{activeMeeting.pertemuanKe} (Nomor {activeMeeting.nomorPertemuan}).
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Missing fields alert if any */}
          {missingFields.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-rose-900">
                  Data Wajib Belum Lengkap!
                </div>
                <div className="text-xs text-rose-700 mt-1">
                  Harap melengkapi data berikut sebelum menyusun RPPM:
                  <ul className="list-disc list-inside mt-1 font-medium">
                    {missingFields.map(f => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Meeting Context Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                Pertemuan yang Akan Disusun:
              </span>
              <span className="font-bold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-lg">
                Pertemuan {activeMeeting.nomorPertemuan} ({activeMeeting.alokasiWaktuText})
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-semibold">Tujuan Pembelajaran (TP):</span>
              <p className="text-slate-800 font-medium mt-0.5 line-clamp-2">
                "{activeTP.text}"
              </p>
            </div>

            <div className="flex items-center justify-between text-slate-600 pt-1">
              <span>Pengalaman Belajar: <strong>{activeMeeting.fokusPengalaman}</strong></span>
              <span>Dokumen Ajar: <strong>{project.materials.length} berkas</strong></span>
            </div>
          </div>

          {/* Generating Loading State */}
          {isGenerating && (
            <div className="p-6 rounded-2xl bg-blue-50/80 border border-blue-200 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-blue-900">
                  Sedang Menyusun Dokumen RPPM...
                </h4>
                <p className="text-xs text-blue-700 mt-1 font-mono">
                  {generationStep || 'Menganalisis TP, KKTP, dan Alokasi Waktu...'}
                </p>
              </div>
            </div>
          )}

          {/* Dual Action Option - Mandated by User */}
          {!isGenerating && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Pilih Mesin Generator:
              </div>

              {/* Option 1: Gemini AI */}
              <button
                onClick={onGenerateGemini}
                disabled={!canGenerate}
                className="w-full text-left p-4 rounded-2xl border-2 border-blue-200 hover:border-blue-600 bg-blue-50/30 hover:bg-blue-50/70 transition-all cursor-pointer group disabled:opacity-50 disabled:pointer-events-none"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        Generate menggunakan Gemini AI
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Menggunakan model Google Gemini 3.8 Flash untuk analisis mendalam materi ajar, sintaks model kontekstual, dan stimulus soal bervariasi.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all mt-1" />
                </div>
              </button>

              {/* Option 2: Aplikasi Ini */}
              <button
                onClick={onGenerateLocal}
                disabled={!canGenerate}
                className="w-full text-left p-4 rounded-2xl border-2 border-emerald-200 hover:border-emerald-600 bg-emerald-50/30 hover:bg-emerald-50/70 transition-all cursor-pointer group disabled:opacity-50 disabled:pointer-events-none"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                      <Cpu className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        Generate dengan Aplikasi Ini
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Generator cerdas lokal berstandar Kurikulum Merdeka. Bekerja instan 100% offline tanpa perlu koneksi API, garansi verbatim TP & KKTP.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all mt-1" />
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Kepatuhan Kurikulum Merdeka Terjamin
          </span>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
