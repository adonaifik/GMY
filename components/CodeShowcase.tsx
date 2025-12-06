import React, { useState } from 'react';
import { codeSnippets } from '../services/bloodLogic';
import { Code2, Terminal, Copy, Check } from 'lucide-react';

const CodeShowcase: React.FC = () => {
  const [activeLang, setActiveLang] = useState<'python' | 'java' | 'css'>('python');
  const [copied, setCopied] = useState(false);

  const activeSnippet = codeSnippets.find(s => s.language === activeLang) || codeSnippets[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Sidebar / Menu */}
            <div className="lg:col-span-3 space-y-2">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Select Language</h3>
                    {codeSnippets.map(snippet => (
                        <button
                            key={snippet.language}
                            onClick={() => setActiveLang(snippet.language as 'python' | 'java' | 'css')}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all mb-2 flex items-center justify-between ${
                                activeLang === snippet.language 
                                ? 'bg-slate-900 text-white shadow-md' 
                                : 'bg-transparent text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                           <span className="capitalize">{snippet.language}</span>
                           {activeLang === snippet.language && <Terminal className="w-4 h-4 text-emerald-400" />}
                        </button>
                    ))}
                </div>
                
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 text-blue-900">
                    <h4 className="font-bold mb-2 text-sm flex items-center gap-2">
                        <Code2 className="w-4 h-4" /> Did you know?
                    </h4>
                    <p className="text-xs leading-relaxed opacity-80">
                        Medical software often uses Python for data analysis (pandas/numpy) and Java for robust enterprise backend systems handling patient records.
                    </p>
                </div>
            </div>

            {/* Code View */}
            <div className="lg:col-span-9">
                <div className="bg-[#1e1e1e] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 bg-[#252526] border-b border-[#333]">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-xs font-mono text-slate-400">{activeSnippet.title}</span>
                        <button onClick={handleCopy} className="text-slate-400 hover:text-white transition-colors">
                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Editor Area */}
                    <div className="p-6 overflow-x-auto custom-scrollbar">
                         <pre className="font-mono text-sm leading-relaxed text-blue-100">
                            <code>{activeSnippet.code}</code>
                        </pre>
                    </div>

                    {/* Footer Description */}
                    <div className="bg-[#2d2d2d] px-6 py-4 border-t border-[#333]">
                        <p className="text-slate-400 text-sm">{activeSnippet.description}</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};

export default CodeShowcase;