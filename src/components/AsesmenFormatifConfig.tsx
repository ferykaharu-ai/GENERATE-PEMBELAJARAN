import React from 'react';
import { ClipboardList, CheckSquare, Square, FileSpreadsheet, KeyRound, Sparkles, Hash } from 'lucide-react';
import { FormativeConfig, BentukSoal } from '../types/rppm';

interface AsesmenFormatifConfigProps {
  config: FormativeConfig;
  onChange: (updated: FormativeConfig) => void;
}

const ALL_BENTUK: BentukSoal[] = [
  'Pilihan Ganda',
  'Pilihan Ganda Kompleks',
  'Benar-Salah',
  'Menjodohkan',
  'Isian Singkat',
  'Uraian',
];

export const AsesmenFormatifConfig: React.FC<AsesmenFormatifConfigProps> = ({
  config,
  onChange,
}) => {
  const toggleBentuk = (bentuk: BentukSoal) => {
    let updatedSelected = [...config.selectedBentuk];
    if (updatedSelected.includes(bentuk)) {
      updatedSelected = updatedSelected.filter(b => b !== bentuk);
    } else {
      updatedSelected.push(bentuk);
    }
    onChange({
      ...config,
      selectedBentuk: updatedSelected,
    });
  };

  const handleJumlahChange = (bentuk: BentukSoal, count: number) => {
    onChange({
      ...config,
      jumlahSoal: {
        ...config.jumlahSoal,
        [bentuk]: Math.max(1, count),
      },
    });
  };

  const totalSoal = config.selectedBentuk.reduce(
    (sum, bentuk) => sum + (config.jumlahSoal[bentuk] || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <ClipboardList className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Pengaturan Asesmen Formatif (Fleksibel)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Guru bebas menentukan bentuk soal, jumlah butir, dan opsi tampilan kisi-kisi serta kunci jawaban.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-200 text-xs font-bold text-blue-800 self-start sm:self-auto">
            <Hash className="w-4 h-4 text-blue-600" />
            <span>Total Soal Terhitung: {totalSoal} Nomor</span>
          </div>
        </div>
      </div>

      {/* Bentuk & Jumlah Soal */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Pilih Bentuk Soal & Tentukan Jumlah Nomor
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {ALL_BENTUK.map(bentuk => {
            const isSelected = config.selectedBentuk.includes(bentuk);
            const count = config.jumlahSoal[bentuk] || 1;

            return (
              <div
                key={bentuk}
                className={`p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                    : 'border-slate-200 bg-slate-50/40 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    onClick={() => toggleBentuk(bentuk)}
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300" />
                    )}
                    <span className="text-xs font-bold text-slate-800">
                      {bentuk}
                    </span>
                  </div>
                </div>

                {isSelected ? (
                  <div className="flex items-center justify-between pt-2 border-t border-blue-100">
                    <span className="text-[11px] text-slate-600 font-medium">
                      Jumlah Butir Soal:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={count}
                        onChange={e =>
                          handleJumlahChange(bentuk, parseInt(e.target.value) || 1)
                        }
                        className="w-16 px-2.5 py-1 text-xs text-center font-bold bg-white rounded-lg border border-slate-200 focus:border-blue-500"
                      />
                      <span className="text-[11px] text-slate-500">nomor</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-100">
                    Tidak disertakan dalam asesmen
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Kisi-kisi & Kunci Jawaban Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kisi-kisi Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Tabel Kisi-Kisi Asesmen
            </h3>
          </div>

          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={config.tampilkanKisiKisi}
              onChange={e =>
                onChange({ ...config, tampilkanKisiKisi: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800">
                Tampilkan Tabel Kisi-Kisi Formatif
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Memuat: No, Bentuk Soal, KKTP yang Diukur, Indikator Soal, dan Tingkat Kesulitan (Mudah/Sedang/HOTS).
              </div>
            </div>
          </label>
        </div>

        {/* Kunci Jawaban Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Pengaturan Kunci Jawaban
            </h3>
          </div>

          <div className="space-y-2">
            {[
              { id: 'pisahkan', label: 'Pisahkan Kunci Jawaban', desc: 'Diletakkan pada lembar/halaman tersendiri terpisah dari lembar soal' },
              { id: 'sertakan', label: 'Sertakan Kunci Jawaban', desc: 'Ditampilkan langsung di bawah butir soal untuk kemudahan guru' },
              { id: 'jangan_sertakan', label: 'Jangan Sertakan Kunci Jawaban', desc: 'Hanya mencetak soal evaluasi murni tanpa kunci' },
            ].map(opt => (
              <label
                key={opt.id}
                className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                  config.kunciJawabanMode === opt.id
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950'
                    : 'border-slate-200 bg-slate-50/30 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="kunciMode"
                  value={opt.id}
                  checked={config.kunciJawabanMode === opt.id}
                  onChange={() => onChange({ ...config, kunciJawabanMode: opt.id as any })}
                  className="w-4 h-4 text-emerald-600 mt-0.5"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
