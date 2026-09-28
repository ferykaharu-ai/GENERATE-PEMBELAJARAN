import React from 'react';
import { Sparkles, CheckSquare, Square, HeartHandshake, Lightbulb, Users, User, Compass, Shield, MessageCircle } from 'lucide-react';
import { DimensiProfil, ALL_DIMENSI } from '../types/rppm';

interface ProfilLulusanSelectorProps {
  selectedDimensi: DimensiProfil[];
  onChange: (selected: DimensiProfil[]) => void;
}

const DIMENSI_INFO: Record<
  DimensiProfil,
  { label: string; icon: string; desc: string; exampleActivity: string }
> = {
  'Keimanan & Ketakwaan': {
    label: 'Keimanan & Ketakwaan',
    icon: '🙏',
    desc: 'Menghayati keberadaan Tuhan YME, mempraktikkan ajaran agama, dan mensyukuri kelestarian alam ciptaan-Nya.',
    exampleActivity: 'Berdoa khusyuk sebelum belajar, mensyukuri keanekaragaman flora fauna, dan merawat lingkungan hidup sebagai wujud ibadah.',
  },
  'Kewargaan': {
    label: 'Kewargaan',
    icon: '🇮🇩',
    desc: 'Memahami hak dan kewajiban sebagai warga negara Indonesia serta bertanggung jawab menjaga keharmonisan masyarakat.',
    exampleActivity: 'Mematuhi tata tertib sekolah, menghormati hak sesama murid, dan aktif dalam gerakan peduli lingkungan bersama.',
  },
  'Penalaran Kritis': {
    label: 'Penalaran Kritis',
    icon: '🔍',
    desc: 'Menganalisis informasi secara objektif, menelaah sebab-akibat fenomena lingkungan, dan memecahkan masalah kontekstual.',
    exampleActivity: 'Mengidentifikasi akar masalah rusaknya ekosistem sungai dan mengevaluasi dampak buruk penebangan pohon liar.',
  },
  'Kreativitas': {
    label: 'Kreativitas',
    icon: '💡',
    desc: 'Menghasilkan gagasan orisinal, karya aplikatif, dan solusi inovatif yang bermanfaat bagi lingkungan sekitar.',
    exampleActivity: 'Membuat produk poster kampanye ajakan pelestarian makhluk hidup dengan visual dan slogan yang memikat.',
  },
  'Kolaborasi': {
    label: 'Kolaborasi',
    icon: '🤝',
    desc: 'Bekerja bersama secara kooperatif, menghargai keberagaman pendapat tim, dan mencapai tujuan belajar bersama.',
    exampleActivity: 'Berbagi peran dalam penyelidikan kelompok kecil, saling membantu dalam pengamatan, dan menyajikan laporan bersama.',
  },
  'Kemandirian': {
    label: 'Kemandirian',
    icon: '🌱',
    desc: 'Bertanggung jawab atas proses dan hasil belajar sendiri, disiplin, serta memiliki inisiatif tinggi.',
    exampleActivity: 'Menyelesaikan lembar kerja murid secara mandiri dan mengelola waktu tugas tanpa bergantung penuh pada guru.',
  },
  'Kesehatan': {
    label: 'Kesehatan',
    icon: '🍎',
    desc: 'Menjaga kesehatan fisik, emosional, serta kesadaran pentingnya lingkungan yang bersih dan higienis.',
    exampleActivity: 'Mempraktikkan cuci tangan setelah observasi alam, menjaga postur duduk ergonomis, dan mengonsumsi makanan bergizi.',
  },
  'Komunikasi': {
    label: 'Komunikasi',
    icon: '💬',
    desc: 'Menyampaikan gagasan, menyimak aktif, dan mengekspresikan pikiran secara santun serta runtut.',
    exampleActivity: 'Mempresentasikan kesimpulan kelompok di depan kelas serta memberikan tanggapan apresiatif kepada teman sebaya.',
  },
};

export const ProfilLulusanSelector: React.FC<ProfilLulusanSelectorProps> = ({
  selectedDimensi,
  onChange,
}) => {
  const toggleDimensi = (dimensi: DimensiProfil) => {
    if (selectedDimensi.includes(dimensi)) {
      if (selectedDimensi.length === 1) {
        return; // maintain at least one
      }
      onChange(selectedDimensi.filter(d => d !== dimensi));
    } else {
      onChange([...selectedDimensi, dimensi]);
    }
  };

  const selectAll = () => {
    onChange([...ALL_DIMENSI]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Dimensi Profil Lulusan
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Pilih satu atau beberapa dimensi. AI akan mendeskripsikan secara konkret keterkaitan setiap dimensi dengan aktivitas pembelajaran.
            </p>
          </div>

          <button
            onClick={selectAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors self-start sm:self-auto cursor-pointer"
          >
            Pilih Semua Dimensi
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
          <span className="font-semibold text-blue-700">Terpilih: {selectedDimensi.length} dari {ALL_DIMENSI.length} dimensi</span>
        </div>
      </div>

      {/* Grid of 8 Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {ALL_DIMENSI.map(dim => {
          const isSelected = selectedDimensi.includes(dim);
          const info = DIMENSI_INFO[dim];

          return (
            <div
              key={dim}
              onClick={() => toggleDimensi(dim)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                  : 'border-slate-200 bg-white hover:bg-slate-50/80'
              }`}
            >
              <div className="pt-0.5 shrink-0">
                {isSelected ? (
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300" />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">{info.icon}</span>
                  <h3
                    className={`text-xs font-bold ${
                      isSelected ? 'text-blue-900' : 'text-slate-800'
                    }`}
                  >
                    {dim}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {info.desc}
                </p>
                <div className="pt-1 text-[11px] text-slate-500 bg-white/70 p-2 rounded-lg border border-slate-100">
                  <strong className="text-slate-700">Contoh Penerapan:</strong> {info.exampleActivity}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
