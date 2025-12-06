import React, { useState } from 'react';
import { BloodType } from '../types';
import { calculateChildBloodTypes } from '../services/bloodLogic';
import { Dna, ArrowRight, XCircle, CheckCircle2 } from 'lucide-react';

const GeneticsCalculator: React.FC = () => {
  const [parent1, setParent1] = useState<BloodType>(BloodType.A);
  const [parent2, setParent2] = useState<BloodType>(BloodType.B);

  const result = calculateChildBloodTypes(parent1, parent2);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
      <div className="p-8 bg-gradient-to-r from-rose-500 to-rose-600 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Dna className="w-8 h-8 opacity-80" />
          <h2 className="text-3xl font-bold">Heredity Calculator</h2>
        </div>
        <p className="text-rose-100">
          Determine possible child blood types based on Mendelian genetics.
        </p>
      </div>

      <div className="p-8 grid md:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="md:col-span-5 flex flex-col justify-center space-y-8">
          
          <div className="relative group">
            <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Parent 1</label>
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border-2 border-slate-200 focus-within:border-rose-500 transition-colors">
              <span className="text-lg font-medium text-slate-700">Type</span>
              <div className="flex gap-2">
                {(Object.keys(BloodType) as Array<keyof typeof BloodType>).map((type) => (
                  <button
                    key={`p1-${type}`}
                    onClick={() => setParent1(BloodType[type])}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      parent1 === BloodType[type]
                        ? 'bg-rose-500 text-white shadow-lg scale-110'
                        : 'bg-white text-slate-400 border border-slate-200 hover:border-rose-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center text-rose-300">
            <span className="text-4xl font-light">+</span>
          </div>

          <div className="relative group">
            <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Parent 2</label>
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border-2 border-slate-200 focus-within:border-rose-500 transition-colors">
              <span className="text-lg font-medium text-slate-700">Type</span>
              <div className="flex gap-2">
                {(Object.keys(BloodType) as Array<keyof typeof BloodType>).map((type) => (
                  <button
                    key={`p2-${type}`}
                    onClick={() => setParent2(BloodType[type])}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      parent2 === BloodType[type]
                        ? 'bg-rose-500 text-white shadow-lg scale-110'
                        : 'bg-white text-slate-400 border border-slate-200 hover:border-rose-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Arrow/Divider */}
        <div className="md:col-span-2 flex items-center justify-center">
            <ArrowRight className="w-12 h-12 text-slate-300 hidden md:block" />
            <div className="w-full h-px bg-slate-200 md:hidden my-4"></div>
        </div>

        {/* Result Section */}
        <div className="md:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Child Possibilities</h3>
            
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-green-700 font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Possible</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {result.possible.map(t => (
                            <span key={t} className="px-4 py-2 bg-green-50 text-green-800 rounded-lg font-bold text-xl border border-green-200">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm opacity-75">
                    <div className="flex items-center gap-2 mb-2 text-rose-700 font-semibold">
                        <XCircle className="w-5 h-5" />
                        <span>Impossible</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {result.impossible.length > 0 ? result.impossible.map(t => (
                            <span key={t} className="px-3 py-1 bg-slate-100 text-slate-400 rounded-lg font-medium text-sm line-through">
                                {t}
                            </span>
                        )) : <span className="text-sm text-slate-400">None</span>}
                    </div>
                </div>
            </div>

            <p className="mt-6 text-xs text-slate-500 text-center leading-relaxed">
                * Based on simplified Mendelian inheritance models excluding rare Bombay phenotype and cis-AB.
            </p>
        </div>
      </div>
    </div>
  );
};

export default GeneticsCalculator;