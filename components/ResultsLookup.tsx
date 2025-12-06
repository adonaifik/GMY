import React, { useState } from 'react';
import { Search, FileText, User, Calendar, Mail, AlertCircle, Droplets } from 'lucide-react';
import { getUserByCode } from '../services/userService';
import { UserProfile } from '../types';

const ResultsLookup: React.FC = () => {
  const [code, setCode] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setProfile(null);
    setSearched(false);

    if (code.length < 5) {
        setError("Code must be at least 5 characters.");
        return;
    }

    const foundUser = getUserByCode(code);
    setSearched(true);
    
    if (foundUser) {
        setProfile(foundUser);
    } else {
        setError("No profile found with that code.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
        <div className="grid md:grid-cols-12 gap-8">
            {/* Search Section */}
            <div className="md:col-span-5 flex flex-col gap-6">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Search className="w-6 h-6 text-indigo-600" />
                        Retrieve Results
                    </h2>
                    
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Enter Access Code</label>
                            <input 
                                type="text"
                                maxLength={5}
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="e.g. X7K9P"
                                className="w-full px-4 py-4 text-center text-2xl font-mono tracking-[0.2em] rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 uppercase transition-all"
                            />
                        </div>
                        <button 
                            type="submit"
                            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
                        >
                            View Profile
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-medium animate-slide-up">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Result Display Section */}
            <div className="md:col-span-7">
                {profile ? (
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in h-full flex flex-col">
                         <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white relative overflow-hidden shrink-0">
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold opacity-90">Patient Profile</h3>
                                <div className="text-3xl font-bold mt-1">{profile.name}</div>
                            </div>
                            {/* Decorative huge blood type in background */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white opacity-10 font-black text-9xl pr-4 pointer-events-none select-none">
                                {profile.bloodType}
                            </div>
                         </div>
                         
                         <div className="p-8 space-y-6 flex-1 overflow-y-auto">
                            {/* NEW: Blood Type Result Card */}
                            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex items-center justify-between shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
                                <div className="relative z-10">
                                    <h4 className="text-rose-800 font-bold uppercase tracking-wider text-xs mb-1 flex items-center gap-2">
                                        <Droplets className="w-4 h-4" /> Laboratory Result
                                    </h4>
                                    <p className="text-slate-600 text-sm font-medium">Blood Group Configuration</p>
                                </div>
                                <div className="flex items-start z-10">
                                    <span className="text-6xl font-black text-rose-600 drop-shadow-sm">{profile.bloodType}</span>
                                    <span className="text-3xl font-bold text-rose-400 mt-2 ml-1">{profile.rhFactor}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-1">
                                        <User className="w-4 h-4" /> Gender
                                    </div>
                                    <div className="text-lg font-semibold text-slate-800">{profile.gender}</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-1">
                                        <Calendar className="w-4 h-4" /> Registered
                                    </div>
                                    <div className="text-lg font-semibold text-slate-800">{profile.registeredAt}</div>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-1">
                                    <Mail className="w-4 h-4" /> Contact Email
                                </div>
                                <div className="text-lg font-semibold text-slate-800 break-all">{profile.email}</div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-500" />
                                    Status
                                </h4>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Profile is active. Your blood type has been determined. You can use this information in the Genetics Calculator.
                                </p>
                            </div>
                         </div>
                    </div>
                ) : (
                    <div className="h-full bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center min-h-[300px]">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <User className="w-8 h-8 opacity-50" />
                        </div>
                        <p className="font-medium">
                            {searched ? "No result found" : "Enter a code to see patient details"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ResultsLookup;