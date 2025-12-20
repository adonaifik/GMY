import React, { useState } from 'react';
import { codeSnippets } from '../services/bloodLogic';
import { Code2, Terminal, Copy, Check, FileJson, Layout } from 'lucide-react';

const CodeShowcase: React.FC = () => {
  const [activeLang, setActiveLang] = useState<'python' | 'java' | 'css' | 'SQL'>('python');
  const [copied, setCopied] = useState(false);

  const activeSnippet = codeSnippets.find(s => s.language === activeLang) || codeSnippets[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = (lang: string) => {
    switch(lang) {
      case 'css': return <Layout className="w-4 h-4" />;
      case 'SQL': return <FileJson className="w-4 h-4" />;
      default: return <Terminal className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
        <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Sidebar / Menu */}
            <div className="lg:col-span-3 space-y-2">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 mb-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Tech Stack Showcase</h3>
                    {codeSnippets.map(snippet => (
                        <button
                            key={snippet.language}
                            onClick={() => setActiveLang(snippet.language as any)}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all mb-2 flex items-center justify-between ${
                                activeLang === snippet.language 
                                ? 'bg-indigo-600 text-white shadow-md' 
                                : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                        >
                           <span className="uppercase tracking-tighter">{snippet.language}</span>
                           {getIcon(snippet.language)}
                        </button>
                    ))}
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30 text-blue-900 dark:text-blue-400">
                    <h4 className="font-bold mb-2 text-sm flex items-center gap-2">
                        <Code2 className="w-4 h-4" /> Fullstack Logic
                    </h4>
                    <p className="text-xs leading-relaxed opacity-80">
                        This suite demonstrates cross-language interoperability, from CSS layout for diagnostics to Python data algorithms.
                    </p>
                </div>
            </div>

            {/* Code View */}
            <div className="lg:col-span-9">
                <div className="bg-[#1e1e1e] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10 border border-slate-800">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 bg-[#252526] border-b border-[#333]">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        </div>
                        <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.2em]">{activeSnippet.title}</span>
                        <button onClick={handleCopy} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Editor Area */}
                    <div className="p-8 overflow-x-auto custom-scrollbar min-h-[300px]">
                         <pre className="font-mono text-sm leading-relaxed text-indigo-100">
                            <code>{activeSnippet.code}</code>
                        </pre>
                    </div>

                    {/* Footer Description */}
                    <div className="bg-[#2d2d2d] px-6 py-4 border-t border-[#333]">
                        <p className="text-slate-400 text-xs font-medium italic">{activeSnippet.description}</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};

export default CodeShowcase;