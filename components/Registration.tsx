import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, User, Fingerprint, ArrowRight, CheckCircle, BrainCircuit, AlertTriangle, Droplets, Copy, Check, Wifi, WifiOff, RotateCw } from 'lucide-react';
import { registerUser, checkServerHealth } from '../services/userService';
import { UserProfile, BloodType } from '../types';

interface RegistrationProps {
  quizResult: BloodType | null;
  onRedirectToQuiz: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ quizResult, onRedirectToQuiz }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '', 
    email: ''
  });
  const [registeredUser, setRegisteredUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isServerOnline, setIsServerOnline] = useState(false);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const checkConnection = async () => {
    setCheckingHealth(true);
    const online = await checkServerHealth();
    setIsServerOnline(online);
    setCheckingHealth(false);
  };

  useEffect(() => {
    // Initial check
    checkConnection();

    // Listen for internet connection changes
    const handleOnline = () => {
        console.log("Internet connected, checking server...");
        checkConnection();
    };
    const handleOffline = () => setIsServerOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizResult) return;
    
    if (!formData.gender) {
        alert("Please select a valid gender.");
        return;
    }

    setLoading(true);
    
    // Attempt registration
    const start = Date.now();
    const user = await registerUser(formData.name, formData.gender, formData.email, quizResult);
    const end = Date.now();
    
    // Update connection status based on the success of the actual request
    // If we successfully registered but isServerOnline was false, this confirms we are actually online
    // If it fell back to local, this check will likely confirm offline
    checkConnection();

    const remainingTime = Math.max(0, 800 - (end - start));

    setTimeout(() => {
        setRegisteredUser(user);
        setLoading(false);
    }, remainingTime);
  };

  const handleCopy = async () => {
    if (!registeredUser) return;
    
    try {
        // Primary method for Secure Contexts (HTTPS / Localhost)
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(registeredUser.code);
        } else {
            // Fallback method for HTTP Local Network IPs
            const textArea = document.createElement("textarea");
            textArea.value = registeredUser.code;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
  };

  if (registeredUser) {
    return (
      <div className="w-full max-w-lg mx-auto animate-scale-in">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Registration Complete!</h2>
            <p className="text-slate-500 mb-8">Your profile has been securely saved.</p>
            
            <div className="bg-slate-900 rounded-2xl p-6 mb-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/20 rounded-full blur-2xl group-hover:bg-rose-500/30 transition-all"></div>
                <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">Your Unique Code</p>
                
                <div className="flex items-center justify-center gap-4">
                    <div className="text-5xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-wider">
                        {registeredUser.code}
                    </div>
                    <button 
                        type="button"
                        onClick={handleCopy}
                        className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 text-slate-400 hover:text-white transition-all shadow-lg active:scale-95 border border-slate-700 hover:border-slate-500"
                        title="Copy Code"
                    >
                        {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                </div>
                
                <p className="text-slate-500 text-xs mt-2">Use this code to retrieve your results later.</p>
            </div>

            {!isServerOnline && (
                <div className="mb-6 p-4 bg-amber-50 text-amber-700 text-sm rounded-xl flex items-start gap-3 text-left">
                    <WifiOff className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>
                        <strong>Saved Locally:</strong> Connection to backend server failed. Data saved to browser storage.
                    </p>
                </div>
            )}

            <button 
                onClick={() => {
                    setRegisteredUser(null);
                    setFormData({ name: '', gender: '', email: '' });
                    setCopied(false);
                }}
                className="text-slate-500 font-semibold hover:text-slate-800 transition-colors"
            >
                Register Another Person
            </button>
        </div>
      </div>
    );
  }

  // Pre-requisite check: User must have taken the quiz
  if (!quizResult) {
    return (
      <div className="w-full max-w-lg mx-auto animate-fade-in">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 text-center p-8">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Diagnostic Required</h2>
            <p className="text-slate-600 leading-relaxed mb-8">
                To ensure accurate profile creation, we first need to determine your blood type via our advanced Personality Assessment algorithm.
            </p>
            <button 
                onClick={onRedirectToQuiz}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                <BrainCircuit className="w-5 h-5" />
                Take Assessment First
                <ArrowRight className="w-5 h-5 opacity-70" />
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="bg-slate-900 p-8 text-white relative">
                <div className="flex items-center gap-3 mb-2">
                    <UserPlus className="w-8 h-8 text-rose-500" />
                    <h2 className="text-2xl font-bold">Patient Registration</h2>
                </div>
                <p className="text-slate-400">Join the server database to track your blood analytics.</p>
                
                {/* Visual Indicator for connection type */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                     {checkingHealth ? (
                         <RotateCw className="w-3 h-3 text-slate-400 animate-spin" />
                     ) : isServerOnline ? (
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     ) : (
                         <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                     )}
                     
                     <span className={`text-xs font-medium ${isServerOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
                         {isServerOnline ? "Synced" : "Local"}
                     </span>
                     
                     {!isServerOnline && !checkingHealth && (
                         <button onClick={checkConnection} className="ml-1 p-1 hover:bg-slate-700 rounded-full transition-colors" title="Retry Connection">
                             <RotateCw className="w-3 h-3 text-slate-400 hover:text-white" />
                         </button>
                     )}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Determined Blood Type Banner */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                        <Droplets className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Identified Blood Type</div>
                        <div className="text-xl font-bold text-slate-800">Type {quizResult}</div>
                    </div>
                    <div className="ml-auto">
                        <CheckCircle className="w-6 h-6 text-indigo-400" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            required
                            type="text" 
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Gender</label>
                    <div className="relative">
                        <select 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all appearance-none invalid:text-slate-400"
                            value={formData.gender}
                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        >
                            <option value="" disabled className="text-slate-400">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            required
                            type="email" 
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-rose-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-200 hover:bg-rose-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? 'Connecting to Server...' : (
                            <>
                                <Fingerprint className="w-5 h-5" />
                                Get Access Code
                                <ArrowRight className="w-5 h-5 opacity-70" />
                            </>
                        )}
                    </button>
                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
                         {isServerOnline ? <Wifi className="w-3 h-3 text-emerald-500" /> : <WifiOff className="w-3 h-3 text-amber-500" />}
                         <span>{isServerOnline ? "Cross-device access enabled" : "Server unreachable - Saving locally"}</span>
                    </div>
                </div>
            </form>
        </div>
    </div>
  );
};

export default Registration;