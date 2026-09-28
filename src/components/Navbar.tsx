import React from 'react';
import {
  BookOpen,
  FolderOpen,
  PlusCircle,
  RotateCcw,
  Sparkles,
  FileDown,
  Printer,
} from 'lucide-react';
import { RPPMProject } from '../types/rppm';

interface NavbarProps {
  currentProject: RPPMProject;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenProjectModal: () => void;
  onNewProject: () => void;
  onResetSample: () => void;
  onOpenGenerateModal: () => void;
  onOpenExportModal: () => void;
  hasRPPM: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProject,
  activeTab,
  onSelectTab,
  onOpenProjectModal,
  onNewProject,
  onResetSample,
  onOpenGenerateModal,
  onOpenExportModal,
  hasRPPM,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'materi', label: 'Materi Ajar', icon: '📄' },
    { id: 'identitas', label: 'Identitas', icon: '👤' },
    { id: 'tp', label: 'Tujuan Pembelajaran', icon: '🎯' },
    { id: 'kktp', label: 'KKTP', icon: '📚' },
    { id: 'profil', label: 'Profil Lulusan', icon: '🌱' },
    { id: 'pertemuan', label: 'Pertemuan', icon: '🗓️' },
    { id: 'asesmen', label: 'Asesmen Formatif', icon: '📝' },
    { id: 'preview', label: 'Preview RPPM', icon: '👁️', badge: hasRPPM ? 'Siap' : undefined },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner with App Title and Creator Credit */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-4 py-2 text-xs md:text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-blue-600/60 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-semibold border border-blue-400/40">
              Kurikulum Merdeka SD
            </span>
            <span className="font-semibold tracking-wide text-white">
              MENYUSUN RENCANA PELAKSANAAN PEMBELAJARAN MENDALAM
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span className="text-[11px] bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
              Created by <strong className="text-amber-400 font-semibold">FERY GUSTOMI KAHARU</strong>
            </span>
            <span className="hidden lg:inline text-slate-400">•</span>
            <span className="hidden lg:inline text-slate-300 font-medium">
              {currentProject.identity.satuanPendidikan}
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Project Name and Quick Actions */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 truncate">
                {currentProject.name}
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 shrink-0 font-medium">
                {currentProject.identity.fase} / {currentProject.identity.kelas}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate">
              {currentProject.identity.mataPelajaran} • Guru: {currentProject.identity.namaGuru}
            </p>
          </div>
        </div>

        {/* Project Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenProjectModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Buka atau Kelola Proyek"
          >
            <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Proyek</span>
          </button>

          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Buat Proyek Baru"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Baru</span>
          </button>

          <button
            onClick={onResetSample}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Kembalikan ke Contoh Data Awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Contoh Awal</span>
          </button>

          {/* Action Generate & Export Buttons */}
          <button
            onClick={onOpenGenerateModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate RPPM</span>
          </button>

          {hasRPPM && (
            <>
              <button
                onClick={onOpenExportModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer"
                title="Export Dokumen ke Word (.docx)"
              >
                <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Export Word</span>
              </button>
              <button
                onClick={() => window.print()}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Cetak Dokumen"
              >
                <Printer className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Navigation Tabs Horizontal Scrollable */}
      <div className="border-t border-slate-200/80 bg-slate-50/70 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
