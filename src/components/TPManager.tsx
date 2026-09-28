import React, { useState } from 'react';
import { Target, Plus, Trash2, ArrowUp, ArrowDown, Edit3, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { TPItem } from '../types/rppm';

interface TPManagerProps {
  tps: TPItem[];
  onAddTP: (code: string, text: string) => void;
  onUpdateTP: (id: string, code: string, text: string) => void;
  onDeleteTP: (id: string) => void;
  onReorderTP: (fromIndex: number, toIndex: number) => void;
}

export const TPManager: React.FC<TPManagerProps> = ({
  tps,
  onAddTP,
  onUpdateTP,
  onDeleteTP,
  onReorderTP,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCode, setEditCode] = useState('');
  const [editText, setEditText] = useState('');

  const [newCode, setNewCode] = useState('');
  const [newText, setNewText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleStartEdit = (tp: TPItem) => {
    setEditingId(tp.id);
    setEditCode(tp.code);
    setEditText(tp.text);
  };

  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) return;
    onUpdateTP(id, editCode.trim() || 'TP', editText.trim());
    setEditingId(null);
  };

  const handleSaveNew = () => {
    if (!newText.trim()) return;
    const code = newCode.trim() || `TP ${tps.length + 1}`;
    onAddTP(code, newText.trim());
    setNewCode('');
    setNewText('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Target className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Tujuan Pembelajaran (TP)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Kelola daftar Tujuan Pembelajaran yang menjadi acuan utama penyusunan RPPM.
            </p>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah TP</span>
          </button>
        </div>

        {/* Mandatory Rule Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="font-bold text-amber-950">ATURAN WAJIB SISTEM:</strong> Teks TP yang Anda
            masukkan <span className="underline font-semibold">WAJIB dipertahankan persis 100%</span> oleh AI
            dan generator. Sistem dilarang keras mengubah, meringkas, menambah, mengurangi, atau memparafrasekan teks TP.
          </div>
        </div>
      </div>

      {/* Form Input Tambah TP */}
      {isAdding && (
        <div className="bg-blue-50/60 rounded-2xl p-5 border-2 border-blue-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
            Tambah Tujuan Pembelajaran Baru
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-1">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Kode TP
              </label>
              <input
                type="text"
                value={newCode}
                onChange={e => setNewCode(e.target.value)}
                placeholder="Contoh: TP 3.5"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Rumusan Teks TP (Persis Sesuai Dokumen Kurikulum) <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={newText}
                onChange={e => setNewText(e.target.value)}
                rows={2}
                placeholder="Tuliskan rumusan Tujuan Pembelajaran lengkap..."
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
              disabled={!newText.trim()}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 cursor-pointer"
            >
              Simpan TP
            </button>
          </div>
        </div>
      )}

      {/* List of TPs */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Daftar TP Tersimpan ({tps.length})
        </h3>

        {tps.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 border border-dashed rounded-xl">
            Belum ada TP. Silakan tambahkan minimal 1 Tujuan Pembelajaran.
          </div>
        ) : (
          <div className="space-y-3">
            {tps.map((tp, idx) => {
              const isEditing = editingId === tp.id;

              return (
                <div
                  key={tp.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all space-y-2"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input
                          type="text"
                          value={editCode}
                          onChange={e => setEditCode(e.target.value)}
                          className="px-3 py-1.5 text-xs rounded-lg border bg-white font-semibold"
                        />
                        <textarea
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          rows={2}
                          className="sm:col-span-3 px-3 py-1.5 text-xs rounded-lg border bg-white"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => handleSaveEdit(tp.id)}
                          className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Simpan Perubahan</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold">
                            {tp.code}
                          </span>
                          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verbatim Terjamin
                          </span>
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed font-medium">
                          {tp.text}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onReorderTP(idx, idx - 1)}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100 cursor-pointer"
                          title="Naikkan Urutan"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onReorderTP(idx, idx + 1)}
                          disabled={idx === tps.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100 cursor-pointer"
                          title="Turunkan Urutan"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleStartEdit(tp)}
                          className="p-1 text-slate-500 hover:text-blue-600 rounded hover:bg-blue-50 cursor-pointer"
                          title="Edit TP"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTP(tp.id)}
                          className="p-1 text-slate-500 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer"
                          title="Hapus TP"
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
