import React, { useState } from 'react';
import { Search, FileText, User, Calendar, Mail, AlertCircle, Droplets, Loader2, Database, Pencil, Save, X, Check, Copy } from 'lucide-react';
import { getUserByCode, updateUser } from '../services/userService';
import { UserProfile } from '../types';

const ResultsLookup: React.FC = () => {
  const [code, setCode] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', gender: '', email: '' });
  const [saving, setSaving] = useState(false);

  // Copy State
  const [copied, setCopied] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setProfile(null);
    setSearched(false);
    setIsEditing(false);

    if (code.length < 5) {
        setError("Code must be at least 5 characters.");
        return;
    }

    setLoading(true);

    try {
        const foundUser = await getUserByCode(code);
        setSearched(true);
        
        if (foundUser) {
            setProfile(foundUser);
            setEditForm({ name: foundUser.name, gender: foundUser.gender, email: foundUser.email });
        } else {
            setError("No profile found in database with that code.");
        }
    } catch (err) {
        setError("Connection error. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!profile) return;
    setSaving(true);
    try {
        const updated = await updateUser(profile.code, editForm);
        setProfile(updated);
        setIsEditing(false);
        setError("");
    } catch (err) {
        setError("Failed to update profile changes.");
    } finally {
        setSaving(false);
    }
  };

  const cancelEdit = () => {
      if (profile) {
          setEditForm({ name: profile.name, gender: profile.gender, email: profile.email });
      }
      setIsEditing(false);
  };

  const handleCopyCode = async () => {
    if (!profile) return;
    
    try {
        // Primary method for Secure Contexts (HTTPS / Localhost)
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(profile.code);
        } else {
            // Fallback method for HTTP Local Network IPs
            const textArea = document.createElement("textarea");
            textArea.value = profile.code;
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

  return (
    <div className="w-full max-w-4xl mx-auto">
        <div className="grid md:grid-cols-12 gap-8">
            {/* Search Section */}
            <div className="md:col-span-5 flex flex-col gap-6">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Database className="w-6 h-6 text-indigo-600" />
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
                                className="w-full px-4 py-4 text-center text-2xl font-mono tracking-[0.2em] rounded-xl border-2 border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-0 uppercase transition-all"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search Database"}
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
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold opacity-90">Patient Profile</h3>
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                            className="text-2xl font-bold mt-1 bg-white/20 border border-white/30 rounded px-2 py-1 text-white w-full placeholder-white/50 focus:outline-none focus:bg-white/30"
                                        />
                                    ) : (
                                        <div className="text-3xl font-bold mt-1">{profile.name}</div>
                                    )}

                                    {/* Code Display with Copy Button */}
                                    {!isEditing && (
                                        <div className="flex items-center gap-2 mt-2 animate-fade-in">
                                            <div className="bg-black/20 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-lg flex items-center gap-2 shadow-sm">
                                                <span className="text-[10px] font-bold opacity-70 uppercase tracking-wider">Code</span>
                                                <span className="font-mono font-bold tracking-widest text-sm">{profile.code}</span>
                                            </div>
                                            <button 
                                                onClick={handleCopyCode}
                                                className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-all active:scale-95 flex items-center justify-center group"
                                                title="Copy Access Code"
                                            >
                                                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />}
                                            </button>
                                        </div>
                                    )}

                                </div>
                                <div className="flex gap-2">
                                    {isEditing ? (
                                        <>
                                            <button 
                                                onClick={handleSaveEdit}
                                                disabled={saving}
                                                className="p-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg shadow-sm transition-colors"
                                                title="Save"
                                            >
                                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                            </button>
                                            <button 
                                                onClick={cancelEdit}
                                                disabled={saving}
                                                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-sm transition-colors"
                                                title="Cancel"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => setIsEditing(true)}
                                            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm"
                                            title="Edit Profile"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {/* Decorative huge blood type in background */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white opacity-10 font-black text-9xl pr-4 pointer-events-none select-none">
                                {profile.bloodType}
                            </div>
                         </div>
                         
                         <div className="p-8 space-y-6 flex-1 overflow-y-auto">
                            {/* Blood Type Result Card */}
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
                                <div className={`p-4 rounded-2xl border transition-colors ${isEditing ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-1">
                                        <User className="w-4 h-4" /> Gender
                                    </div>
                                    {isEditing ? (
                                        <select 
                                            value={editForm.gender}
                                            onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                                            className="w-full bg-white border border-indigo-200 rounded p-1 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    ) : (
                                        <div className="text-lg font-semibold text-slate-800">{profile.gender}</div>
                                    )}
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-1">
                                        <Calendar className="w-4 h-4" /> Registered
                                    </div>
                                    <div className="text-lg font-semibold text-slate-800">{profile.registeredAt}</div>
                                </div>
                            </div>

                            <div className={`p-4 rounded-2xl border transition-colors ${isEditing ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-1">
                                    <Mail className="w-4 h-4" /> Contact Email
                                </div>
                                {isEditing ? (
                                    <input 
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                        className="w-full bg-white border border-indigo-200 rounded p-1 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                ) : (
                                    <div className="text-lg font-semibold text-slate-800 break-all">{profile.email}</div>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-500" />
                                    Status
                                </h4>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {isEditing 
                                     ? "Editing profile details. Click the checkmark to save changes permanently." 
                                     : "Profile retrieved from database. Your blood type has been determined. You can use this information in the Genetics Calculator."}
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