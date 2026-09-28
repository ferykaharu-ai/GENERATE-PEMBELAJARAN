import React from 'react';
import { UserCheck, School, BookOpen, Clock, ShieldCheck } from 'lucide-react';
import { TeacherIdentity, FASE_OPTIONS, MATA_PELAJARAN_LIST } from '../types/rppm';

interface IdentitasFormProps {
  identity: TeacherIdentity;
  onChange: (updated: TeacherIdentity) => void;
}

export const IdentitasForm: React.FC<IdentitasFormProps> = ({ identity, onChange }) => {
  const handleChange = (field: keyof TeacherIdentity, value: string) => {
    onChange({
      ...identity,
      [field]: value,
    });
  };

  const handleFaseSelect = (faseStr: string) => {
    const selected = FASE_OPTIONS.find(f => f.fase === faseStr);
    if (selected) {
      onChange({
        ...identity,
        fase: selected.fase,
        kelas: selected.kelas,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
          <UserCheck className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Identitas Guru & Satuan Pendidikan
          </h2>
          <p className="text-xs text-slate-500">
            Data ini akan dicantumkan secara otomatis pada kop dan tabel Identitas RPPM serta lembar pengesahan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Guru */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Nama Guru Penulis <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={identity.namaGuru}
            onChange={e => handleChange('namaGuru', e.target.value)}
            placeholder="Contoh: FERY GUSTOMI KAHARU, S.Pd"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-800 transition-all font-medium"
          />
        </div>

        {/* NIP Guru */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            NIP Guru <span className="text-slate-400 font-normal">(Boleh dikosongkan)</span>
          </label>
          <input
            type="text"
            value={identity.nipGuru}
            onChange={e => handleChange('nipGuru', e.target.value)}
            placeholder="Contoh: 19820917 201001 1 008"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-800 transition-all"
          />
        </div>

        {/* Kepala Sekolah */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Nama Kepala Sekolah <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={identity.kepalaSekolah}
            onChange={e => handleChange('kepalaSekolah', e.target.value)}
            placeholder="Contoh: MERLINA DOKE, M.Pd"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-800 transition-all font-medium"
          />
        </div>

        {/* NIP Kepala Sekolah */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            NIP Kepala Sekolah <span className="text-slate-400 font-normal">(Boleh dikosongkan)</span>
          </label>
          <input
            type="text"
            value={identity.nipKepalaSekolah}
            onChange={e => handleChange('nipKepalaSekolah', e.target.value)}
            placeholder="Contoh: 19820917 200801 2 004"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-800 transition-all"
          />
        </div>

        {/* Satuan Pendidikan */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-slate-700">
            Satuan Pendidikan (Nama Sekolah) <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={identity.satuanPendidikan}
            onChange={e => handleChange('satuanPendidikan', e.target.value)}
            placeholder="Contoh: SD NEGERI 11 ANGGREK"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-800 transition-all font-medium"
          />
        </div>

        {/* Fase / Kelas */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Fase / Kelas & Rentang Usia Murid <span className="text-rose-500">*</span>
          </label>
          <select
            value={identity.fase}
            onChange={e => handleFaseSelect(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-800 transition-all bg-white font-medium cursor-pointer"
          >
            {FASE_OPTIONS.map(opt => (
              <option key={opt.fase} value={opt.fase}>
                {opt.fase} — {opt.kelas} ({opt.jenjang}, {opt.usia})
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500">
            Tingkat kesulitan asesmen dan LKM otomatis disesuaikan dengan rentang usia murid.
          </p>
        </div>

        {/* Detail Kelas (Editable custom label) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Teks Rincian Kelas <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={identity.kelas}
            onChange={e => handleChange('kelas', e.target.value)}
            placeholder="Contoh: Kelas III (Tiga) atau Kelas III-A"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-800 transition-all font-medium"
          />
        </div>

        {/* Semester */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Semester <span className="text-rose-500">*</span>
          </label>
          <select
            value={identity.semester}
            onChange={e => handleChange('semester', e.target.value as any)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-800 transition-all bg-white font-medium cursor-pointer"
          >
            <option value="1 (GANJIL)">1 (GANJIL)</option>
            <option value="2 (GENAP)">2 (GENAP)</option>
          </select>
        </div>

        {/* Mata Pelajaran Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Mata Pelajaran <span className="text-rose-500">*</span>
          </label>
          <select
            value={identity.mataPelajaran}
            onChange={e => handleChange('mataPelajaran', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-800 transition-all bg-white font-medium cursor-pointer"
          >
            {MATA_PELAJARAN_LIST.map((mapel, idx) => (
              <option key={mapel} value={mapel}>
                {idx + 1}. {mapel}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
