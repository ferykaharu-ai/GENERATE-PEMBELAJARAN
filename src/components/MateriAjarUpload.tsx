import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Info,
  Sparkles,
} from 'lucide-react';
import { UploadedMaterial } from '../types/rppm';
import { parseUploadedFile } from '../utils/fileParser';

interface MateriAjarUploadProps {
  materials: UploadedMaterial[];
  onAddMaterial: (material: UploadedMaterial) => void;
  onRemoveMaterial: (id: string) => void;
  onClearAll: () => void;
}

export const MateriAjarUpload: React.FC<MateriAjarUploadProps> = ({
  materials,
  onAddMaterial,
  onRemoveMaterial,
  onClearAll,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewMaterial, setPreviewMaterial] = useState<UploadedMaterial | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMessage(null);

    if (materials.length + files.length > 3) {
      setErrorMessage('Maksimal unggahan adalah 3 file materi ajar.');
      return;
    }

    setIsLoading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const parsed = await parseUploadedFile(file);

      if (parsed.error) {
        setErrorMessage(parsed.error);
        continue;
      }

      const newMaterial: UploadedMaterial = {
        id: `mat-${Date.now()}-${i}`,
        name: parsed.name,
        size: parsed.size,
        type: parsed.type,
        content: parsed.text,
        uploadedAt: new Date().toISOString(),
      };

      onAddMaterial(newMaterial);
    }

    setIsLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Title & Info Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <FileText className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Dokumen Sumber Materi Ajar
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Unggah dokumen referensi (Buku Guru, Modul Ajar, Ringkasan Materi). Maksimal 3 file, batas kapasitas 50 MB per file.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {materials.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                Hapus Semua Dokumen
              </button>
            )}
          </div>
        </div>

        {/* Notice on Optional Upload */}
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-800 leading-relaxed">
            <strong className="font-semibold">Catatan Penting:</strong> Unggah materi ajar{' '}
            <span className="underline font-bold">TIDAK WAJIB</span>. Jika Anda tidak mengunggah berkas,
            sistem dan Gemini AI tetap dapat menyusun RPPM mendalam secara otomatis berdasarkan Tujuan Pembelajaran (TP)
            dan KKTP yang Anda tentukan.
          </div>
        </div>
      </div>

      {/* Upload Drag & Drop Zone */}
      <div
        onDragOver={e => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50/60'
            : 'border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50/50'
        } ${materials.length >= 3 ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />

        <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
          <Upload className="w-6 h-6" />
        </div>

        <h3 className="text-sm font-bold text-slate-800 mb-1">
          {isLoading ? 'Sedang Membaca dan Menganalisis Dokumen...' : 'Pilih atau Seret Dokumen ke Sini'}
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Mendukung format berkas <span className="font-semibold text-slate-700">PDF, DOCX, dan TXT</span>.
          Maksimal 3 file (batas total kapasitas hingga 50 MB).
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
            PDF
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
            DOCX (Word)
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
            TXT (Teks)
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded Documents List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center justify-between">
          <span>Daftar Dokumen yang Telah Berhasil Dibaca ({materials.length}/3)</span>
          {materials.length > 0 && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Siap Digunakan Sebagai Sumber Utama
            </span>
          )}
        </h3>

        {materials.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            Belum ada dokumen yang diunggah. Pembelajaran akan merujuk pada capaian TP dan KKTP yang Anda masukkan.
          </div>
        ) : (
          <div className="space-y-2.5">
            {materials.map(mat => (
              <div
                key={mat.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs">
                    {mat.name.endsWith('.pdf') ? 'PDF' : mat.name.endsWith('.docx') ? 'DOC' : 'TXT'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {mat.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {formatFileSize(mat.size)} • Diunggah:{' '}
                      {new Date(mat.uploadedAt).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setPreviewMaterial(mat)}
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Lihat Hasil Ekstraksi Teks"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveMaterial(mat.id)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus Dokumen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Preview Extracted Content */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-800 truncate">
                  Pratinjau Isi: {previewMaterial.name}
                </h4>
              </div>
              <button
                onClick={() => setPreviewMaterial(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-slate-700 whitespace-pre-wrap bg-slate-50/70 leading-relaxed">
              {previewMaterial.content || '(Dokumen kosong atau tidak memiliki teks yang terbaca)'}
            </div>
            <div className="p-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setPreviewMaterial(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
