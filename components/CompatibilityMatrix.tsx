
import React, { useState } from 'react';
import { BloodType, RhFactor } from '../types';
import { Droplets, Heart, Info, Check, X } from 'lucide-react';

const CompatibilityMatrix: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const bloodGroups = [
    'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'
  ];

  const canDonateTo = (donor: string, recipient: string): boolean => {
    const dType = donor.replace(/[+-]/, '') as BloodType;
    const dRh = donor.includes('+') ? RhFactor.Positive : RhFactor.Negative;
    const rType = recipient.replace(/[+-]/, '') as BloodType;
    const rRh = recipient.includes('+') ? RhFactor.Positive : RhFactor.Negative;

    // O- is universal donor
    if (donor === 'O-') return true;
    // AB+ is universal recipient
    if (recipient === 'AB+') return true;

    // Type Logic
    let typeCompat = false;
    if (dType === BloodType.O) typeCompat = true;
    else if (dType === rType) typeCompat = true;
    else if (rType === BloodType.AB) typeCompat = true;

    // Rh Logic (+ can only give to +, - can give to both)
    let rhCompat = false;
    if (dRh === RhFactor.Negative) rhCompat = true;
    else if (rRh === RhFactor.Positive) rhCompat = true;

    return typeCompat && rhCompat;
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Heart className="text-rose-500 w-8 h-8" />
              Transfusion Compatibility
            </h2>
            <p className="text-slate-400 mt-2">Interactive donor-recipient mapping system.</p>
          </div>
          <div className="hidden md:block bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4">
            <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">Universal Donor</p>
            <p className="text-2xl font-black text-white">O Negative</p>
          </div>
        </div>

        <div className="p-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left text-slate-400 text-xs font-bold uppercase border-b border-slate-100">Recipient →</th>
                {bloodGroups.map(bg => (
                  <th key={bg} className="p-4 text-center font-bold text-slate-600 border-b border-slate-100">{bg}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bloodGroups.map(donor => (
                <tr key={donor} className="group hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-rose-500" />
                      {donor} <span className="text-[10px] text-slate-400 font-normal ml-1">(Donor)</span>
                    </div>
                  </td>
                  {bloodGroups.map(recipient => {
                    const active = canDonateTo(donor, recipient);
                    return (
                      <td 
                        key={`${donor}-${recipient}`}
                        className={`p-4 text-center border-b border-slate-50 transition-all ${
                          active ? 'text-emerald-500' : 'text-slate-200'
                        }`}
                      >
                        {active ? (
                          <div className="flex justify-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shadow-sm">
                              <Check className="w-4 h-4" />
                            </div>
                          </div>
                        ) : (
                          <X className="w-4 h-4 mx-auto opacity-20" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong>Medical Note:</strong> While this chart shows general ABO and Rh compatibility, actual medical transfusions require cross-matching for minor antigens. Universal donor is <strong>O-</strong>, and universal recipient is <strong>AB+</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityMatrix;
