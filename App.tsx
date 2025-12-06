import React, { useState } from 'react';
import { TabView } from './types';
import GeneticsCalculator from './components/GeneticsCalculator';
import PersonalityQuiz from './components/PersonalityQuiz';
import GeminiConsultant from './components/GeminiConsultant';
import { Droplets, Dna, BrainCircuit, MessageSquarePlus } from 'lucide-react';

const App: React.FC = () => {
  // Default set to 'quiz' so Personality appears first
  const [activeTab, setActiveTab] = useState<TabView>('quiz');

  const renderContent = () => {
    switch (activeTab) {
      case 'quiz': return <PersonalityQuiz />;
      case 'genetics': return <GeneticsCalculator />;
      case 'ai-consult': return <GeminiConsultant />;
      default: return <PersonalityQuiz />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-rose-200 shadow-lg">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">BloodTesting</h1>
                <p className="text-xs text-slate-500 font-medium">Interactive Blood Labs</p>
              </div>
            </div>

            <nav className="hidden md:flex gap-1">
              <button 
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'quiz' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
              >
                <BrainCircuit className="w-4 h-4" /> Personality
              </button>
              <button 
                onClick={() => setActiveTab('genetics')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'genetics' ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:text-rose-600'}`}
              >
                <Dna className="w-4 h-4" /> Genetics
              </button>
               <button 
                onClick={() => setActiveTab('ai-consult')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'ai-consult' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}
              >
                <MessageSquarePlus className="w-4 h-4" /> Ask Dr. AI
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Nav Bar */}
       <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex justify-between overflow-x-auto">
             <button onClick={() => setActiveTab('quiz')} className={`p-2 rounded-lg ${activeTab === 'quiz' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}><BrainCircuit className="w-6 h-6" /></button>
             <button onClick={() => setActiveTab('genetics')} className={`p-2 rounded-lg ${activeTab === 'genetics' ? 'bg-rose-50 text-rose-600' : 'text-slate-500'}`}><Dna className="w-6 h-6" /></button>
             <button onClick={() => setActiveTab('ai-consult')} className={`p-2 rounded-lg ${activeTab === 'ai-consult' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500'}`}><MessageSquarePlus className="w-6 h-6" /></button>
       </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-400 text-sm">
                © {new Date().getFullYear()} BloodTesting. Educational purposes only. Not for clinical diagnosis.
            </p>
             <p className="text-slate-300 text-xs mt-2">
                Built with React, Tailwind, and Gemini AI.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;