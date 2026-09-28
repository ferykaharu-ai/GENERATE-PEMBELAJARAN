import React, { useState } from 'react';
import {
  FolderOpen,
  PlusCircle,
  Copy,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Check,
  Calendar,
  Layers,
} from 'lucide-react';
import { RPPMProject } from '../types/rppm';

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: RPPMProject[];
  currentProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateNewProject: () => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onResetSample: () => void;
  onImportProject: (imported: RPPMProject) => void;
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  projects,
  currentProjectId,
  onSelectProject,
  onCreateNewProject,
  onDuplicateProject,
  onDeleteProject,
  onResetSample,
  onImportProject,
}) => {
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportJSON = (project: RPPMProject) => {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_backup.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as RPPMProject;
        if (!parsed.identity || !parsed.tps) {
          throw new Error('Format berkas proyek RPPM tidak valid.');
        }
        parsed.id = `proj-${Date.now()}`;
        parsed.name = `${parsed.name} (Impor)`;
        onImportProject(parsed);
      } catch (err: any) {
        setImportError(err.message || 'Gagal membaca berkas JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-600/60 text-white">
              <FolderOpen className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold">Penyimpanan & Manajemen Proyek</h3>
              <p className="text-xs text-slate-400">
                Kelola berkas rancangan RPPM Anda, simpan secara lokal, atau ekspor ke berkas cadangan.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onCreateNewProject();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Proyek Baru</span>
            </button>

            <button
              onClick={() => {
                onResetSample();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Contoh Data Awal</span>
            </button>
          </div>

          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium rounded-lg cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Impor Cadangan JSON</span>
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleImportJSON}
            />
          </label>
        </div>

        {importError && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {importError}
          </div>
        )}

        {/* Projects List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Daftar Proyek Tersimpan ({projects.length})
          </div>

          {projects.map(proj => {
            const isCurrent = proj.id === currentProjectId;
            const hasRPPM = !!proj.currentRPPM;

            return (
              <div
                key={proj.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {proj.name}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Aktif
                      </span>
                    )}
                    {hasRPPM && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        RPPM Siap
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {proj.identity.mataPelajaran} • {proj.identity.fase} ({proj.identity.kelas}) • {proj.identity.satuanPendidikan}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {proj.tps.length} TP • {proj.kktps.length} KKTP • {proj.meetings.length} Pertemuan
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                  {!isCurrent && (
                    <button
                      onClick={() => {
                        onSelectProject(proj.id);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Buka
                    </button>
                  )}

                  <button
                    onClick={() => onDuplicateProject(proj.id)}
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Duplikasi Proyek"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleExportJSON(proj)}
                    className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Download Cadangan JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {projects.length > 1 && (
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Proyek"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
