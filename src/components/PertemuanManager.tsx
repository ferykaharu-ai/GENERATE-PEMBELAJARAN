import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  Edit3,
  Check,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { MeetingItem, TPItem, PengalamanBelajar } from '../types/rppm';

interface PertemuanManagerProps {
  meetings: MeetingItem[];
  tps: TPItem[];
  activeMeetingId: string;
  onSelectActiveMeeting: (id: string) => void;
  onAddMeeting: (meeting: Omit<MeetingItem, 'id'>) => void;
  onUpdateMeeting: (id: string, meeting: Partial<MeetingItem>) => void;
  onDeleteMeeting: (id: string) => void;
}

const PENGALAMAN_OPTIONS: PengalamanBelajar[] = [
  'Memahami',
  'Mengaplikasi',
  'Merefleksi',
  'Memahami dan Mengaplikasi',
  'Mengaplikasi dan Merefleksi',
  'Memahami, Mengaplikasi, dan Merefleksi',
];

export const PertemuanManager: React.FC<PertemuanManagerProps> = ({
  meetings,
  tps,
  activeMeetingId,
  onSelectActiveMeeting,
  onAddMeeting,
  onUpdateMeeting,
  onDeleteMeeting,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New meeting form state
  const [newNomorPertemuan, setNewNomorPertemuan] = useState<number>(
    meetings.length > 0 ? Math.max(...meetings.map(m => m.nomorPertemuan)) + 1 : 13
  );
  const [newJp, setNewJp] = useState<number>(2);
  const [newMenitPerJp, setNewMenitPerJp] = useState<number>(35);
  const [newTpId, setNewTpId] = useState<string>(tps[0]?.id || '');
  const [newFokus, setNewFokus] = useState<PengalamanBelajar>('Memahami');
  const [newTopik, setNewTopik] = useState<string>('');

  // Edit meeting form state
  const [editNomor, setEditNomor] = useState<number>(13);
  const [editJp, setEditJp] = useState<number>(2);
  const [editMenitPerJp, setEditMenitPerJp] = useState<number>(35);
  const [editFokus, setEditFokus] = useState<PengalamanBelajar>('Memahami');
  const [editTopik, setEditTopik] = useState<string>('');

  const handleStartEdit = (m: MeetingItem) => {
    setEditingId(m.id);
    setEditNomor(m.nomorPertemuan);
    // Parse JP e.g. "2 × 35 menit"
    const match = m.alokasiWaktuText.match(/(\d+)\s*[x×]\s*(\d+)/i);
    if (match) {
      setEditJp(parseInt(match[1]));
      setEditMenitPerJp(parseInt(match[2]));
    } else {
      setEditJp(2);
      setEditMenitPerJp(35);
    }
    setEditFokus(m.fokusPengalaman);
    setEditTopik(m.topikSpesifik || '');
  };

  const handleSaveEdit = (id: string) => {
    const totalMenit = editJp * editMenitPerJp;
    onUpdateMeeting(id, {
      nomorPertemuan: editNomor,
      alokasiWaktuText: `${editJp} × ${editMenitPerJp} menit`,
      alokasiMenit: totalMenit,
      fokusPengalaman: editFokus,
      topikSpesifik: editTopik.trim() || undefined,
    });
    setEditingId(null);
  };

  const handleSaveNew = () => {
    const totalMenit = newJp * newMenitPerJp;
    const nextUrutan = meetings.filter(m => m.tpId === newTpId).length + 1;

    onAddMeeting({
      tpId: newTpId || tps[0]?.id || 'tp-1',
      pertemuanKe: nextUrutan,
      nomorPertemuan: newNomorPertemuan,
      alokasiWaktuText: `${newJp} × ${newMenitPerJp} menit`,
      alokasiMenit: totalMenit,
      fokusPengalaman: newFokus,
      topikSpesifik: newTopik.trim() || `Pertemuan ${newNomorPertemuan}`,
    });

    setIsAdding(false);
    setNewNomorPertemuan(newNomorPertemuan + 1);
    setNewTopik('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Calendar className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Pengaturan Rangkaian Pertemuan
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Atur distribusi pertemuan untuk setiap Tujuan Pembelajaran. Sistem akan membuat RPPM untuk{' '}
              <strong className="text-blue-700">satu pertemuan tertentu</strong> yang dipilih guru.
            </p>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pertemuan</span>
          </button>
        </div>

        {/* Notice on Single Meeting Generation */}
        <div className="mt-4 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Aturan Kurikulum:</strong> RPPM dibuat{' '}
            <span className="underline font-bold">satu pertemuan setiap kali generate</span>. Klik tombol{' '}
            <strong>"Pilih untuk Digenerate"</strong> pada kartu pertemuan yang ingin Anda susun hari ini.
            Setelah selesai, Anda dapat langsung beralih ke pertemuan berikutnya melalui tombol lanjutan.
          </div>
        </div>
      </div>

      {/* Form Tambah Pertemuan Baru */}
      {isAdding && (
        <div className="bg-blue-50/70 rounded-2xl p-5 border-2 border-blue-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
            Tambah Pertemuan Baru
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Tujuan Pembelajaran (TP)
              </label>
              <select
                value={newTpId}
                onChange={e => setNewTpId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              >
                {tps.map(tp => (
                  <option key={tp.id} value={tp.id}>
                    {tp.code} - {tp.text.slice(0, 30)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nomor Pertemuan (Umum)
              </label>
              <input
                type="number"
                min={1}
                value={newNomorPertemuan}
                onChange={e => setNewNomorPertemuan(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Jumlah JP × Durasi Menit
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={newJp}
                  onChange={e => setNewJp(parseInt(e.target.value) || 1)}
                  className="w-16 px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-center font-bold"
                />
                <span className="text-xs font-bold text-slate-400">×</span>
                <input
                  type="number"
                  step={5}
                  min={20}
                  max={60}
                  value={newMenitPerJp}
                  onChange={e => setNewMenitPerJp(parseInt(e.target.value) || 35)}
                  className="w-20 px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-center font-bold"
                />
                <span className="text-xs text-slate-500 font-semibold">= {newJp * newMenitPerJp}m</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Fokus Pengalaman Belajar
              </label>
              <select
                value={newFokus}
                onChange={e => setNewFokus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              >
                {PENGALAMAN_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 md:col-span-4">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Topik / Fokus Bahasan Pertemuan Ini
              </label>
              <input
                type="text"
                value={newTopik}
                onChange={e => setNewTopik(e.target.value)}
                placeholder="Contoh: Eksplorasi Faktor Kerusakan Lingkungan dan Dampak pada Satwa"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleSaveNew}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
            >
              Simpan Pertemuan
            </button>
          </div>
        </div>
      )}

      {/* Meetings List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Daftar Rangkaian Pertemuan ({meetings.length})
        </h3>

        {meetings.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 border border-dashed rounded-xl">
            Belum ada pertemuan yang diatur.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meetings.map(meet => {
              const isActive = meet.id === activeMeetingId;
              const isEditing = editingId === meet.id;
              const relatedTP = tps.find(t => t.id === meet.tpId) || tps[0];

              return (
                <div
                  key={meet.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isActive
                      ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block">
                          Nomor Pertemuan
                        </label>
                        <input
                          type="number"
                          value={editNomor}
                          onChange={e => setEditNomor(parseInt(e.target.value) || 1)}
                          className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white font-bold"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={editJp}
                          onChange={e => setEditJp(parseInt(e.target.value) || 1)}
                          className="w-14 px-2 py-1 text-xs border rounded-lg bg-white text-center font-bold"
                        />
                        <span className="text-xs font-bold text-slate-400">×</span>
                        <input
                          type="number"
                          value={editMenitPerJp}
                          onChange={e => setEditMenitPerJp(parseInt(e.target.value) || 35)}
                          className="w-16 px-2 py-1 text-xs border rounded-lg bg-white text-center font-bold"
                        />
                        <span className="text-xs text-slate-500 font-semibold">= {editJp * editMenitPerJp}m</span>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block">
                          Pengalaman Belajar
                        </label>
                        <select
                          value={editFokus}
                          onChange={e => setEditFokus(e.target.value as any)}
                          className="w-full px-2.5 py-1 text-xs border rounded-lg bg-white"
                        >
                          {PENGALAMAN_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block">
                          Topik Pertemuan
                        </label>
                        <input
                          type="text"
                          value={editTopik}
                          onChange={e => setEditTopik(e.target.value)}
                          className="w-full px-2.5 py-1 text-xs border rounded-lg bg-white"
                        />
                      </div>
                      <div className="flex justify-end gap-1.5 pt-1">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => handleSaveEdit(meet.id)}
                          className="px-3 py-1 text-xs font-semibold bg-emerald-600 text-white rounded flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Simpan</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">
                            Pertemuan Ke-{meet.pertemuanKe} (Nomor {meet.nomorPertemuan})
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStartEdit(meet)}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded"
                              title="Edit Pertemuan"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {meetings.length > 1 && (
                              <button
                                onClick={() => onDeleteMeeting(meet.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded"
                                title="Hapus Pertemuan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs font-bold text-slate-900 line-clamp-2">
                            {meet.topikSpesifik || `Pembelajaran Pertemuan ${meet.nomorPertemuan}`}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {relatedTP?.code || 'TP'}
                          </div>
                        </div>

                        <div className="space-y-1 pt-1 border-t border-slate-100 text-[11px]">
                          <div className="flex items-center justify-between text-slate-600">
                            <span>Alokasi Waktu:</span>
                            <span className="font-semibold text-slate-800">
                              {meet.alokasiWaktuText} ({meet.alokasiMenit} menit)
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span>Pengalaman Belajar:</span>
                            <span className="font-semibold text-blue-700">
                              {meet.fokusPengalaman}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        {isActive ? (
                          <div className="w-full py-1.5 px-3 rounded-xl bg-blue-600 text-white text-xs font-bold text-center shadow-xs flex items-center justify-center gap-1.5">
                            <span>✓ Pertemuan Aktif (Terpilih)</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => onSelectActiveMeeting(meet.id)}
                            className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold text-center border border-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                          >
                            <span>Pilih untuk Digenerate</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
