import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Wrench,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ValidationResult } from '../types/rppm';

interface ValidationCardProps {
  validation: ValidationResult;
  onAutoFix: () => void;
}

export const ValidationCard: React.FC<ValidationCardProps> = ({
  validation,
  onAutoFix,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const passedCount = validation.items.filter(i => i.passed).length;
  const totalCount = validation.items.length;

  return (
    <div
      className={`rounded-2xl border transition-all ${
        validation.isValid
          ? 'bg-emerald-50/60 border-emerald-200'
          : 'bg-amber-50/80 border-amber-300 shadow-md'
      }`}
    >
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              validation.isValid
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {validation.isValid ? (
              <ShieldCheck className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Hasil Validasi Standar Kurikulum Merdeka
              </h3>
              {!validation.isValid && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                  ⚠️ PERLU DIPERBAIKI
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {validation.isValid
                ? `Seluruh kriteria validasi (${passedCount}/${totalCount}) terpenuhi secara sempurna.`
                : `${totalCount - passedCount} kriteria memerlukan penyesuaian otomatis.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!validation.isValid && (
            <button
              onClick={onAutoFix}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>🔧 Perbaiki Otomatis</span>
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <span>{isOpen ? 'Tutup Rincian' : 'Lihat 10+ Kriteria'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 border-t border-slate-200/60 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {validation.items.map(item => (
            <div
              key={item.id}
              className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${
                item.passed
                  ? 'bg-white/80 border-emerald-200'
                  : 'bg-white border-amber-300'
              }`}
            >
              <div className="pt-0.5 shrink-0">
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-800">{item.label}</div>
                {item.message && (
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {item.message}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
