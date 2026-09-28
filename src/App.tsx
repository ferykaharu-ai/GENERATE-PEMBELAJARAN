/**
 * MENYUSUN RENCANA PELAKSANAAN PEMBELAJARAN MENDALAM KURIKULUM MERDEKA
 * CREATED BY FERY GUSTOMI KAHARU
 */

import React, { useState, useEffect } from 'react';
import {
  RPPMProject,
  TeacherIdentity,
  TPItem,
  KKTPItem,
  MeetingItem,
  UploadedMaterial,
  FormativeConfig,
  RPPMDocument,
  ValidationResult,
  DimensiProfil,
} from './types/rppm';
import { INITIAL_PROJECT, DEFAULT_FORMATIF_CONFIG } from './data/initialData';
import { generateLocalRPPM } from './utils/localGenerator';
import { requestGeminiRPPM } from './services/geminiService';
import { validateRPPM, autoFixRPPM } from './utils/validator';

// Components
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { MateriAjarUpload } from './components/MateriAjarUpload';
import { IdentitasForm } from './components/IdentitasForm';
import { TPManager } from './components/TPManager';
import { KKTPManager } from './components/KKTPManager';
import { ProfilLulusanSelector } from './components/ProfilLulusanSelector';
import { PertemuanManager } from './components/PertemuanManager';
import { AsesmenFormatifConfig } from './components/AsesmenFormatifConfig';
import { GenerateModal } from './components/GenerateModal';
import { RPPMPreview } from './components/RPPMPreview';
import { ExportModal } from './components/ExportModal';
import { ProjectManagerModal } from './components/ProjectManagerModal';

const LOCAL_STORAGE_KEY_CURRENT = 'rppm_current_project_v1';
const LOCAL_STORAGE_KEY_ALL = 'rppm_all_projects_v1';

export default function App() {
  // Load initial project from storage or initial sample
  const [project, setProject] = useState<RPPMProject>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading current project from storage:', e);
    }
    return INITIAL_PROJECT;
  });

  // Projects list
  const [projects, setProjects] = useState<RPPMProject[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ALL);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading projects list:', e);
    }
    return [INITIAL_PROJECT];
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  // Persist project changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT, JSON.stringify(project));
      setProjects(prev => {
        const index = prev.findIndex(p => p.id === project.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = project;
          localStorage.setItem(LOCAL_STORAGE_KEY_ALL, JSON.stringify(updated));
          return updated;
        } else {
          const updated = [...prev, project];
          localStorage.setItem(LOCAL_STORAGE_KEY_ALL, JSON.stringify(updated));
          return updated;
        }
      });
    } catch (e) {
      console.error('Error saving project:', e);
    }
  }, [project]);

  // Derived active items
  const activeMeeting =
    project.meetings.find(m => m.id === project.activeMeetingId) ||
    project.meetings[0] || {
      id: 'default-meet',
      tpId: project.tps[0]?.id || 'tp-1',
      pertemuanKe: 1,
      nomorPertemuan: 13,
      alokasiWaktuText: '2 × 35 menit',
      alokasiMenit: 70,
      fokusPengalaman: 'Memahami' as const,
    };

  const activeTP =
    project.tps.find(t => t.id === activeMeeting.tpId) ||
    project.tps[0] || {
      id: 'tp-default',
      code: 'TP 3.5',
      text: 'Menyimpulkan pentingnya pelestarian makhluk hidup berdasarkan hasil pengamatan dan informasi yang diperoleh.',
    };

  const activeKKTPs = project.kktps.filter(k => k.tpId === activeTP.id);

  // Next meeting in sequence
  const currentMeetingIndex = project.meetings.findIndex(m => m.id === activeMeeting.id);
  const nextMeeting =
    currentMeetingIndex >= 0 && currentMeetingIndex < project.meetings.length - 1
      ? project.meetings[currentMeetingIndex + 1]
      : undefined;

  // Validation calculation
  const validation: ValidationResult = project.currentRPPM
    ? validateRPPM(project.currentRPPM, activeMeeting, activeTP, activeKKTPs)
    : { isValid: true, items: [] };

  // --- Handlers ---
  const handleUpdateIdentity = (identity: TeacherIdentity) => {
    setProject(prev => ({ ...prev, identity, lastModified: new Date().toISOString() }));
  };

  const handleAddTP = (code: string, text: string) => {
    const newTP: TPItem = {
      id: `tp-${Date.now()}`,
      code,
      text,
    };
    setProject(prev => ({
      ...prev,
      tps: [...prev.tps, newTP],
      lastModified: new Date().toISOString(),
    }));
  };

  const handleUpdateTP = (id: string, code: string, text: string) => {
    setProject(prev => ({
      ...prev,
      tps: prev.tps.map(t => (t.id === id ? { ...t, code, text } : t)),
      lastModified: new Date().toISOString(),
    }));
  };

  const handleDeleteTP = (id: string) => {
    setProject(prev => ({
      ...prev,
      tps: prev.tps.filter(t => t.id !== id),
      kktps: prev.kktps.filter(k => k.tpId !== id),
      lastModified: new Date().toISOString(),
    }));
  };

  const handleReorderTP = (fromIndex: number, toIndex: number) => {
    setProject(prev => {
      const items = [...prev.tps];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return { ...prev, tps: items, lastModified: new Date().toISOString() };
    });
  };

  const handleAddKKTP = (tpId: string, text: string) => {
    const existing = project.kktps.filter(k => k.tpId === tpId);
    const newKKTP: KKTPItem = {
      id: `kktp-${Date.now()}`,
      tpId,
      number: existing.length + 1,
      text,
    };
    setProject(prev => ({
      ...prev,
      kktps: [...prev.kktps, newKKTP],
      lastModified: new Date().toISOString(),
    }));
  };

  const handleUpdateKKTP = (id: string, text: string) => {
    setProject(prev => ({
      ...prev,
      kktps: prev.kktps.map(k => (k.id === id ? { ...k, text } : k)),
      lastModified: new Date().toISOString(),
    }));
  };

  const handleDeleteKKTP = (id: string) => {
    setProject(prev => ({
      ...prev,
      kktps: prev.kktps.filter(k => k.id !== id),
      lastModified: new Date().toISOString(),
    }));
  };

  const handleReorderKKTP = (fromIndex: number, toIndex: number) => {
    setProject(prev => {
      const items = [...prev.kktps];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return { ...prev, kktps: items, lastModified: new Date().toISOString() };
    });
  };

  const handleAddMaterial = (mat: UploadedMaterial) => {
    setProject(prev => ({
      ...prev,
      materials: [...prev.materials, mat],
      lastModified: new Date().toISOString(),
    }));
  };

  const handleRemoveMaterial = (id: string) => {
    setProject(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m.id !== id),
      lastModified: new Date().toISOString(),
    }));
  };

  const handleClearAllMaterials = () => {
    setProject(prev => ({
      ...prev,
      materials: [],
      lastModified: new Date().toISOString(),
    }));
  };

  const handleAddMeeting = (meetData: Omit<MeetingItem, 'id'>) => {
    const newMeeting: MeetingItem = {
      ...meetData,
      id: `meet-${Date.now()}`,
    };
    setProject(prev => ({
      ...prev,
      meetings: [...prev.meetings, newMeeting],
      activeMeetingId: newMeeting.id,
      lastModified: new Date().toISOString(),
    }));
  };

  const handleUpdateMeeting = (id: string, updated: Partial<MeetingItem>) => {
    setProject(prev => ({
      ...prev,
      meetings: prev.meetings.map(m => (m.id === id ? { ...m, ...updated } : m)),
      lastModified: new Date().toISOString(),
    }));
  };

  const handleDeleteMeeting = (id: string) => {
    setProject(prev => {
      const filtered = prev.meetings.filter(m => m.id !== id);
      return {
        ...prev,
        meetings: filtered,
        activeMeetingId: filtered[0]?.id || '',
        lastModified: new Date().toISOString(),
      };
    });
  };

  // --- GENERATE ACTION 1: GEMINI AI ---
  const handleGenerateGemini = async () => {
    try {
      setIsGenerating(true);
      setGenerationStep('Menganalisis Tujuan Pembelajaran (TP) & Indikator KKTP...');
      await new Promise(r => setTimeout(r, 600));

      setGenerationStep('Mengevaluasi Dokumen Materi Ajar dan Kesiapan Murid...');
      await new Promise(r => setTimeout(r, 600));

      setGenerationStep('Menghubungkan Sintaks Pembelajaran Mendalam (Mindful, Meaningful, Joyful)...');

      const generatedDoc = await requestGeminiRPPM(
        project,
        activeMeeting,
        activeTP,
        activeKKTPs
      );

      setGenerationStep('Menyusun Lembar Kerja Murid (LKM) & Instrumen Asesmen Formatif...');
      await new Promise(r => setTimeout(r, 400));

      // Save to project
      setProject(prev => ({
        ...prev,
        currentRPPM: generatedDoc,
        historyRPPMs: {
          ...prev.historyRPPMs,
          [activeMeeting.id]: generatedDoc,
        },
        lastModified: new Date().toISOString(),
      }));

      setIsGenerating(false);
      setIsGenerateModalOpen(false);
      setActiveTab('preview');
    } catch (err: any) {
      console.warn('Gemini Generation failed, falling back or showing alert:', err);
      // Fallback proposal or error alert
      const useLocal = window.confirm(
        `Gemini API Error: ${err.message || 'Gagal memanggil AI'}\n\nApakah Anda ingin menggunakan "Generator Aplikasi Ini" untuk menyusun RPPM sekarang secara instan?`
      );
      setIsGenerating(false);
      if (useLocal) {
        handleGenerateLocal();
      }
    }
  };

  // --- GENERATE ACTION 2: APLIKASI INI (LOCAL RULE-BASED ENGINE) ---
  const handleGenerateLocal = () => {
    setIsGenerating(true);
    setGenerationStep('Menyusun Kerangka RPPM Kurikulum Merdeka...');

    setTimeout(() => {
      const generatedDoc = generateLocalRPPM(
        project,
        activeMeeting,
        activeTP,
        activeKKTPs
      );

      setProject(prev => ({
        ...prev,
        currentRPPM: generatedDoc,
        historyRPPMs: {
          ...prev.historyRPPMs,
          [activeMeeting.id]: generatedDoc,
        },
        lastModified: new Date().toISOString(),
      }));

      setIsGenerating(false);
      setIsGenerateModalOpen(false);
      setActiveTab('preview');
    }, 450);
  };

  // Auto-Fix Handler
  const handleAutoFix = () => {
    if (!project.currentRPPM) return;
    const fixed = autoFixRPPM(project.currentRPPM, activeMeeting, activeTP, activeKKTPs);
    setProject(prev => ({
      ...prev,
      currentRPPM: fixed,
      historyRPPMs: {
        ...prev.historyRPPMs,
        [activeMeeting.id]: fixed,
      },
      lastModified: new Date().toISOString(),
    }));
  };

  // Next Meeting Transition
  const handleNextMeeting = () => {
    if (!nextMeeting) return;
    setProject(prev => {
      const savedDocForNext = prev.historyRPPMs[nextMeeting.id];
      return {
        ...prev,
        activeMeetingId: nextMeeting.id,
        currentRPPM: savedDocForNext || undefined,
        lastModified: new Date().toISOString(),
      };
    });
    // Open generate modal for the next meeting if not yet generated
    if (!project.historyRPPMs[nextMeeting.id]) {
      setIsGenerateModalOpen(true);
    }
  };

  // Project Management Handlers
  const handleCreateNewProject = () => {
    const newProj: RPPMProject = {
      id: `proj-${Date.now()}`,
      name: 'Rancangan RPPM Baru',
      lastModified: new Date().toISOString(),
      identity: {
        namaGuru: project.identity.namaGuru,
        nipGuru: project.identity.nipGuru,
        kepalaSekolah: project.identity.kepalaSekolah,
        nipKepalaSekolah: project.identity.nipKepalaSekolah,
        satuanPendidikan: project.identity.satuanPendidikan,
        fase: 'Fase B',
        kelas: 'Kelas III',
        semester: '1 (GANJIL)',
        mataPelajaran: 'Bahasa Indonesia',
      },
      materials: [],
      tps: [
        {
          id: `tp-${Date.now()}`,
          code: 'TP 1.1',
          text: 'Mengidentifikasi informasi penting dari teks narasi yang dibaca secara runtut.',
        },
      ],
      kktps: [
        {
          id: `kktp-${Date.now()}-1`,
          tpId: `tp-${Date.now()}`,
          number: 1,
          text: 'Menemukan gagasan pokok dan tokoh utama dalam cerita pendek.',
        },
        {
          id: `kktp-${Date.now()}-2`,
          tpId: `tp-${Date.now()}`,
          number: 2,
          text: 'Menceritakan kembali alur peristiwa secara lisan dengan bahasa santun.',
        },
      ],
      selectedDimensi: ['Penalaran Kritis', 'Kreativitas', 'Komunikasi'],
      meetings: [
        {
          id: `meet-${Date.now()}-1`,
          tpId: `tp-${Date.now()}`,
          pertemuanKe: 1,
          nomorPertemuan: 1,
          alokasiWaktuText: '2 × 35 menit',
          alokasiMenit: 70,
          fokusPengalaman: 'Memahami',
          topikSpesifik: 'Menemukan Tokoh dan Alur Cerita',
        },
      ],
      activeMeetingId: `meet-${Date.now()}-1`,
      formatifConfig: DEFAULT_FORMATIF_CONFIG,
      historyRPPMs: {},
    };

    setProjects(prev => [...prev, newProj]);
    setProject(newProj);
    setActiveTab('dashboard');
  };

  const handleDuplicateProject = (id: string) => {
    const target = projects.find(p => p.id === id);
    if (!target) return;
    const duplicated: RPPMProject = {
      ...JSON.parse(JSON.stringify(target)),
      id: `proj-${Date.now()}`,
      name: `${target.name} (Salinan)`,
      lastModified: new Date().toISOString(),
    };
    setProjects(prev => [...prev, duplicated]);
    setProject(duplicated);
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) return;
    const remaining = projects.filter(p => p.id !== id);
    setProjects(remaining);
    if (project.id === id) {
      setProject(remaining[0]);
    }
  };

  const handleResetSample = () => {
    setProject(INITIAL_PROJECT);
    setActiveTab('dashboard');
  };

  const handleImportProject = (imported: RPPMProject) => {
    setProjects(prev => [...prev, imported]);
    setProject(imported);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentProject={project}
        activeTab={activeTab}
        onSelectTab={tab => setActiveTab(tab)}
        onOpenProjectModal={() => setIsProjectModalOpen(true)}
        onNewProject={handleCreateNewProject}
        onResetSample={handleResetSample}
        onOpenGenerateModal={() => setIsGenerateModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        hasRPPM={!!project.currentRPPM}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            project={project}
            onNavigateTab={tab => setActiveTab(tab)}
            onOpenGenerateModal={() => setIsGenerateModalOpen(true)}
            onOpenProjectModal={() => setIsProjectModalOpen(true)}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        )}

        {activeTab === 'materi' && (
          <MateriAjarUpload
            materials={project.materials}
            onAddMaterial={handleAddMaterial}
            onRemoveMaterial={handleRemoveMaterial}
            onClearAll={handleClearAllMaterials}
          />
        )}

        {activeTab === 'identitas' && (
          <IdentitasForm
            identity={project.identity}
            onChange={handleUpdateIdentity}
          />
        )}

        {activeTab === 'tp' && (
          <TPManager
            tps={project.tps}
            onAddTP={handleAddTP}
            onUpdateTP={handleUpdateTP}
            onDeleteTP={handleDeleteTP}
            onReorderTP={handleReorderTP}
          />
        )}

        {activeTab === 'kktp' && (
          <KKTPManager
            tps={project.tps}
            kktps={project.kktps}
            onAddKKTP={handleAddKKTP}
            onUpdateKKTP={handleUpdateKKTP}
            onDeleteKKTP={handleDeleteKKTP}
            onReorderKKTP={handleReorderKKTP}
          />
        )}

        {activeTab === 'profil' && (
          <ProfilLulusanSelector
            selectedDimensi={project.selectedDimensi}
            onChange={dimensi =>
              setProject(prev => ({
                ...prev,
                selectedDimensi: dimensi,
                lastModified: new Date().toISOString(),
              }))
            }
          />
        )}

        {activeTab === 'pertemuan' && (
          <PertemuanManager
            meetings={project.meetings}
            tps={project.tps}
            activeMeetingId={project.activeMeetingId}
            onSelectActiveMeeting={id => {
              setProject(prev => ({
                ...prev,
                activeMeetingId: id,
                currentRPPM: prev.historyRPPMs[id] || prev.currentRPPM,
                lastModified: new Date().toISOString(),
              }));
            }}
            onAddMeeting={handleAddMeeting}
            onUpdateMeeting={handleUpdateMeeting}
            onDeleteMeeting={handleDeleteMeeting}
          />
        )}

        {activeTab === 'asesmen' && (
          <AsesmenFormatifConfig
            config={project.formatifConfig}
            onChange={cfg =>
              setProject(prev => ({
                ...prev,
                formatifConfig: cfg,
                lastModified: new Date().toISOString(),
              }))
            }
          />
        )}

        {activeTab === 'preview' && (
          project.currentRPPM ? (
            <RPPMPreview
              document={project.currentRPPM}
              validation={validation}
              onAutoFix={handleAutoFix}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onRegenerate={() => setIsGenerateModalOpen(true)}
              onNextMeeting={nextMeeting ? handleNextMeeting : undefined}
              nextMeetingInfo={nextMeeting}
              onUpdateDocument={doc =>
                setProject(prev => ({
                  ...prev,
                  currentRPPM: doc,
                  historyRPPMs: {
                    ...prev.historyRPPMs,
                    [activeMeeting.id]: doc,
                  },
                }))
              }
            />
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl font-bold">
                👁️
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Belum Ada RPPM yang Digenerate
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Silakan klik tombol di bawah untuk membuat dokumen Rencana Pelaksanaan Pembelajaran Mendalam
                untuk Pertemuan Ke-{activeMeeting.pertemuanKe} (Nomor {activeMeeting.nomorPertemuan}).
              </p>
              <button
                onClick={() => setIsGenerateModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                ✨ Buat RPPM Sekarang
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer Branding */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div>
            <div className="text-white font-bold text-sm tracking-wide">
              MENYUSUN RENCANA PELAKSANAAN PEMBELAJARAN MENDALAM KURIKULUM MERDEKA
            </div>
            <div className="text-slate-400 mt-0.5">
              Aplikasi Profesional Guru Sekolah Dasar Indonesia • Terintegrasi Kurikulum Merdeka & Pembelajaran Mendalam
            </div>
          </div>
          <div className="text-xs font-medium bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-amber-300">
            CREATED BY <strong className="font-bold text-amber-400">FERY GUSTOMI KAHARU</strong>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GenerateModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        project={project}
        activeMeeting={activeMeeting}
        activeTP={activeTP}
        onGenerateGemini={handleGenerateGemini}
        onGenerateLocal={handleGenerateLocal}
        isGenerating={isGenerating}
        generationStep={generationStep}
      />

      {project.currentRPPM && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          document={project.currentRPPM}
        />
      )}

      <ProjectManagerModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projects={projects}
        currentProjectId={project.id}
        onSelectProject={id => {
          const selected = projects.find(p => p.id === id);
          if (selected) setProject(selected);
        }}
        onCreateNewProject={handleCreateNewProject}
        onDuplicateProject={handleDuplicateProject}
        onDeleteProject={handleDeleteProject}
        onResetSample={handleResetSample}
        onImportProject={handleImportProject}
      />
    </div>
  );
}
