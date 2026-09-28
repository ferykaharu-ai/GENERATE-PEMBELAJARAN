import React, { useState } from 'react';
import {
  ListChecks,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit3,
  Check,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import { KKTPItem, TPItem } from '../types/rppm';

interface KKTPManagerProps {
  tps: TPItem[];
  kktps: KKTPItem[];
  onAddKKTP: (tpId: string, text: string) => void;
  onUpdateKKTP: (id: string, text: string) => void;
  onDeleteKKTP: (id: string) => void;
  onReorderKKTP: (fromIndex: number, toIndex: number) => void;
}

export const KKTPManager: React.FC<KKTPManagerProps> = ({
  tps,
  kktps,
  onAddKKTP,
  onUpdateKKTP,
  onDeleteKKTP,
  onReorderKKTP,
}) => {
  const [selectedTpId, setSelectedTpId] = useState<string>(tps[0]?.id || '');
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const currentTP = tps.find(t => t.id === selectedTpId) || tps[0];
  const filteredKKTPs = kktps.filter(k => k.tpId === currentTP?.id);

  const handleSaveNew = () => {
    if (!newText.trim() || !currentTP) return;
    onAddKKTP(currentTP.id, newText.trim());
    setNewText('');
  };

  const handleStartEdit = (k: KKTPItem) => {
    setEditingId(k.id);
    setEditText(k.text);
  };

  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) return;
    onUpdateKKTP(id, editText.trim());
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <ListChecks className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tentukan indikator keberhasilan spesifik untuk setiap Tujuan Pembelajaran.
            </p>
          </div>
        </div>

        {/* Mandatory Rule Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="font-bold text-amber-950">ATURAN WAJIB SISTEM:</strong> Teks KKTP{' '}
            <span className="underline font-semibold">HARUS DIGUNAKAN PERSIS</span> seperti input guru.
            AI dan sistem dilarang mengubah, meringkas, menggabungkan, mengurangi, atau menambah indikator tanpa izin.
          </div>
        </div>

        {/* TP Selector Tab */}
        {tps.length > 1 && (
          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-500">Pilih TP:</span>
            {tps.map(tp => (
              <button
                key={tp.id}
                onClick={() => setSelectedTpId(tp.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  (currentTP?.id === tp.id)
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tp.code}
              </button>
            ))}
          </div>
        )}

        {currentTP && (
          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-blue-700 uppercase">
              Tujuan Pembelajaran Terpilih ({currentTP.code}):
            </span>
            <p className="text-xs text-slate-800 font-medium mt-0.5">
              {currentTP.text}
            </p>
          </div>
        )}
      </div>

      {/* Input Tambah KKTP */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Tambah Indikator KKTP Baru
        </h3>

        <div className="flex gap-2">
          <input
            type="text"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSaveNew();
            }}
            placeholder="Ketikkan rumusan indikator KKTP secara lengkap..."
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium"
          />
          <button
            onClick={handleSaveNew}
            disabled={!newText.trim() || !currentTP}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* List KKTP */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Indikator KKTP untuk {currentTP?.code || 'TP'} ({filteredKKTPs.length})
          </h3>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verbatim Terkunci
          </span>
        </div>

        {filteredKKTPs.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 border border-dashed rounded-xl">
            Belum ada KKTP untuk TP ini. Silakan tambahkan minimal 1 indikator.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredKKTPs.map((kktp, idx) => {
              const isEditing = editingId === kktp.id;

              return (
                <div
                  key={kktp.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all"
                >
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border bg-white font-medium"
                      />
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => handleSaveEdit(kktp.id)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>Simpan</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-slate-800 leading-relaxed font-medium">
                          {kktp.text}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onReorderKKTP(idx, idx - 1)}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100 cursor-pointer"
                          title="Naikkan Urutan"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onReorderKKTP(idx, idx + 1)}
                          disabled={idx === filteredKKTPs.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100 cursor-pointer"
                          title="Turunkan Urutan"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleStartEdit(kktp)}
                          className="p-1 text-slate-500 hover:text-blue-600 rounded hover:bg-blue-50 cursor-pointer"
                          title="Edit KKTP"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteKKTP(kktp.id)}
                          className="p-1 text-slate-500 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer"
                          title="Hapus KKTP"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
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
