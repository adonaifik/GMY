import React, { useState } from 'react';
import { UserPlus, Mail, User, Fingerprint, ArrowRight, CheckCircle, Server, WifiOff } from 'lucide-react';
import { registerUser } from '../services/userService';
import { UserProfile } from '../types';

const Registration: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Select Gender',
    email: ''
  });
  const [registeredUser, setRegisteredUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Call the async service
    // Minimum 800ms delay for UX if server is too fast
    const start = Date.now();
    const user = await registerUser(formData.name, formData.gender, formData.email);
    const end = Date.now();
    
    const remainingTime = Math.max(0, 800 - (end - start));

    setTimeout(() => {
        setRegisteredUser(user);
        setLoading(false);
    }, remainingTime);
  };

  if (registeredUser) {
    return (
      <div className="w-full max-w-lg mx-auto animate-scale-in">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Registration Complete!</h2>
            <p className="text-slate-500 mb-8">Your profile has been securely saved to the database.</p>
            
            <div className="bg-slate-900 rounded-2xl p-6 mb-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/20 rounded-full blur-2xl group-hover:bg-rose-500/30 transition-all"></div>
                <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">Your Unique Code</p>
                <div className="text-5xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-wider">
                    {registeredUser.code}
                </div>
                <p className="text-slate-500 text-xs mt-2">Use this code to retrieve your results later.</p>
            </div>

            <button 
                onClick={() => {
                    setRegisteredUser(null);
                    setFormData({ name: '', gender: 'Select Gender', email: '' });
                }}
                className="text-slate-500 font-semibold hover:text-slate-800 transition-colors"
            >
                Register Another Person
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
                
                {/* Visual Indicator for connection type (Simulated) */}
                <div className="absolute top-4 right-4 flex gap-2">
                     <div title="Server Connection Ready" className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            required
                            type="text" 
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
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
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all appearance-none bg-white"
                            value={formData.gender}
                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        >
                            <option disabled>Select Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Non-binary</option>
                            <option>Prefer not to say</option>
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
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
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
                    <p className="text-center text-xs text-slate-400 mt-4">
                        Data will be stored securely on the configured server (or locally if offline).
                    </p>
                </div>
            </form>
        </div>
    </div>
  );
};

export default Registration;