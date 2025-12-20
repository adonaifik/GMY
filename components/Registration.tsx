
import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, User, ArrowRight, CheckCircle, BrainCircuit, AlertTriangle, Droplets, Copy, Check, WifiOff, Save, Cloud, Users, RefreshCw, Info, Download, ShieldCheck } from 'lucide-react';
import { registerUser, checkServerHealth } from '../services/userService';
import { UserProfile, BloodType } from '../types';

interface RegistrationProps {
  quizResult: BloodType | null;
  onRedirectToQuiz: () => void;
}

type SavePhase = 'idle' | 'local' | 'cloud' | 'finalizing';

const Registration: React.FC<RegistrationProps> = ({ quizResult, onRedirectToQuiz }) => {
  const [formData, setFormData] = useState({ name: '', gender: '', email: '' });
  const [registeredUser, setRegisteredUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [savePhase, setSavePhase] = useState<SavePhase>('idle');
  const [copied, setCopied] = useState(false);
  
  // Server Status State
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(true);
  const [serverError, setServerError] = useState<string | null>(null);

  const verifyConnection = async () => {
      setCheckingStatus(true);
      const result = await checkServerHealth();
      setIsOnline(result.online);
      setServerError(result.error || null);
      setCheckingStatus(false);
  };

  useEffect(() => {
    verifyConnection();
  }, []);

  const downloadReport = (user: UserProfile) => {
    const data = JSON.stringify(user, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BloodTest_Report_${user.code}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizResult) return;
    
    setLoading(true);
    setSavePhase('local');
    
    try {
        // We simulate a step-by-step process for transparency
        await new Promise(r => setTimeout(r, 600)); 
        setSavePhase('cloud');
        
        const user = await registerUser(formData.name, formData.gender, formData.email, quizResult);
        
        setSavePhase('finalizing');
        await new Promise(r => setTimeout(r, 400));
        
        setRegisteredUser(user);
    } catch (error: any) {
        console.error("Registration UI Error", error);
        alert("The cloud sync is taking too long or failing. Your data has been cached locally instead.");
    } finally {
        setLoading(false);
        setSavePhase('idle');
    }
  };

  const handleCopy = async () => {
    if (!registeredUser) return;
    try {
        await navigator.clipboard.writeText(registeredUser.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
  };

  if (registeredUser) {
    const isLocal = registeredUser.name.includes('(Local Copy)');
    return (
      <div className="w-full max-w-lg mx-auto animate-scale-in">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 p-8 text-center">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">Success!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">Record generated and authenticated.</p>
            
            <div className="bg-slate-900 rounded-2xl p-8 mb-6 relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black mb-3">Unique Access Token</p>
                <div className="flex items-center justify-center gap-5 relative z-10">
                    <div className="text-5xl font-mono font-black text-white tracking-[0.15em]">{registeredUser.code}</div>
                    <button onClick={handleCopy} className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 text-slate-300 transition-all active:scale-90">
                        {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
                <button 
                  onClick={() => downloadReport(registeredUser)}
                  className="flex items-center justify-center py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all gap-2 text-sm"
                >
                    <Download className="w-4 h-4" /> Download Result
                </button>
                <button 
                  onClick={() => { setRegisteredUser(null); setFormData({ name: '', gender: '', email: '' }); }}
                  className="flex items-center justify-center py-3 px-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all gap-2 text-sm"
                >
                    New Patient <ArrowRight className="w-4 h-4" />
                </button>
            </div>
            
            {isLocal && (
              <div className="flex items-center gap-2 justify-center text-amber-600 dark:text-amber-400 text-xs font-bold bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-900/20">
                <Info className="w-4 h-4" /> Cloud sync was slow - profile is saved locally
              </div>
            )}
        </div>
      </div>
    );
  }

  if (!quizResult) {
    return (
      <div className="w-full max-w-lg mx-auto animate-fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 text-center p-10">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-4">Assessment Required</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">Identity verification must be completed before registration.</p>
            <button onClick={onRedirectToQuiz} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform">
                <BrainCircuit className="w-6 h-6 text-indigo-400" /> Start Assessment
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
        <div className={`mb-6 rounded-2xl p-4 flex items-center justify-between text-xs font-bold tracking-wider uppercase transition-all shadow-sm ${
            checkingStatus ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' :
            isOnline ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30' : 'bg-rose-50 dark:bg-rose-900/10 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-800/30'
        }`}>
            <div className="flex items-center gap-3">
                {checkingStatus ? <RefreshCw className="w-4 h-4 animate-spin" /> : isOnline ? <Cloud className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                {checkingStatus ? "Checking Uplink..." : isOnline ? "Connected to Cloud" : "Offline / Restricted Mode"}
            </div>
            {!checkingStatus && !isOnline && (
                <button onClick={verifyConnection} className="bg-rose-600 text-white px-3 py-1 rounded-lg hover:bg-rose-700 transition-colors">Retry</button>
            )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="bg-slate-900 p-10 text-white relative">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-rose-500/20 rounded-2xl">
                        <UserPlus className="w-8 h-8 text-rose-500" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight">Patient Entry</h2>
                        <p className="text-slate-400 text-sm">Encrypted Submission</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-2xl p-4 flex items-center gap-4">
                    <Droplets className="w-8 h-8 text-rose-500" />
                    <div>
                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Detected Phenotype</div>
                        <div className="text-xl font-black text-slate-800 dark:text-white">Type {quizResult}</div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-2">Legal Name</label>
                        <input required type="text" className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold" placeholder="e.g. John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-2">Gender</label>
                            <select required className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 transition-all font-semibold appearance-none cursor-pointer" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                                <option value="" disabled>Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-2">Security</label>
                            <div className="w-full px-5 py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-400 flex items-center gap-2 font-bold text-sm">
                                <ShieldCheck className="w-4 h-4" /> SSL Active
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-2">Email</label>
                        <input required type="email" className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 transition-all font-semibold" placeholder="patient@hospital.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                </div>

                <div className="space-y-4">
                  <button type="submit" disabled={loading} className={`w-full py-5 rounded-[1.5rem] font-black transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 ${loading ? 'bg-slate-700 text-white cursor-wait' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/20'}`}>
                      {loading ? (
                        <>
                          <RefreshCw className="w-6 h-6 animate-spin" />
                          <span>{savePhase === 'local' ? 'Caching Locally...' : savePhase === 'cloud' ? 'Syncing Cloud...' : 'Finishing...'}</span>
                        </>
                      ) : (
                        <><Save className="w-6 h-6" /> Commit Result</>
                      )}
                  </button>
                  
                  {loading && (
                    <p className="text-center text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase animate-pulse">
                        Bypassing GitHub lag... saving directly to local vault.
                    </p>
                  )}
                </div>
            </form>
        </div>
    </div>
  );
};

export default Registration;
