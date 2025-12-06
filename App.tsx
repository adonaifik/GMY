import React, { useState } from 'react';
import { TabView, BloodType } from './types';
import GeneticsCalculator from './components/GeneticsCalculator';
import PersonalityQuiz from './components/PersonalityQuiz';
import GeminiConsultant from './components/GeminiConsultant';
import Registration from './components/Registration';
import ResultsLookup from './components/ResultsLookup';
import { Droplets, Dna, BrainCircuit, MessageSquarePlus, UserPlus, Search } from 'lucide-react';

const App: React.FC = () => {
  // Default set to 'quiz' so Personality appears first
  const [activeTab, setActiveTab] = useState<TabView>('quiz');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Lifted state: Store the quiz result here so it can be passed to Registration
  const [quizBloodType, setQuizBloodType] = useState<BloodType | null>(null);

  const handleTabChange = (tab: TabView) => {
    if (tab === activeTab) return;
    
    // Start fade out
    setIsTransitioning(true);
    
    // Wait for fade out to complete before switching content
    setTimeout(() => {
      setActiveTab(tab);
      // Start fade in
      setIsTransitioning(false);
    }, 300);
  };

  const handleQuizComplete = (type: BloodType) => {
    setQuizBloodType(type);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'quiz': 
        return <PersonalityQuiz 
                  onComplete={handleQuizComplete} 
                  onRegisterRedirect={() => handleTabChange('register')} 
               />;
      case 'genetics': return <GeneticsCalculator />;
      case 'register': 
        return <Registration 
                  quizResult={quizBloodType} 
                  onRedirectToQuiz={() => handleTabChange('quiz')} 
               />;
      case 'results': return <ResultsLookup />;
      case 'ai-consult': return <GeminiConsultant />;
      default: return <PersonalityQuiz />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header - Dark Mode */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-900/20 overflow-hidden">
                <Droplets className="w-6 h-6 text-white animate-gentle-wiggle" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">BloodTesting</h1>
                <p className="text-xs text-slate-400 font-medium">Interactive Blood Labs</p>
              </div>
            </div>

            <nav className="hidden md:flex gap-1">
              <button 
                onClick={() => handleTabChange('quiz')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'quiz' 
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BrainCircuit className="w-4 h-4" /> Personality
              </button>
              <button 
                onClick={() => handleTabChange('genetics')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'genetics' 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Dna className="w-4 h-4" /> Genetics
              </button>
              <button 
                onClick={() => handleTabChange('register')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'register' 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <UserPlus className="w-4 h-4" /> Register
              </button>
              <button 
                onClick={() => handleTabChange('results')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'results' 
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Search className="w-4 h-4" /> Results
              </button>
               <button 
                onClick={() => handleTabChange('ai-consult')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'ai-consult' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <MessageSquarePlus className="w-4 h-4" /> Ask Dr. AI
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Nav Bar - Dark Mode */}
       <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-2 flex justify-between overflow-x-auto gap-2">
             <button onClick={() => handleTabChange('quiz')} className={`p-2 rounded-lg transition-colors flex-shrink-0 ${activeTab === 'quiz' ? 'bg-indigo-900/30 text-indigo-400' : 'text-slate-400'}`}><BrainCircuit className="w-6 h-6" /></button>
             <button onClick={() => handleTabChange('genetics')} className={`p-2 rounded-lg transition-colors flex-shrink-0 ${activeTab === 'genetics' ? 'bg-rose-900/30 text-rose-400' : 'text-slate-400'}`}><Dna className="w-6 h-6" /></button>
             <button onClick={() => handleTabChange('register')} className={`p-2 rounded-lg transition-colors flex-shrink-0 ${activeTab === 'register' ? 'bg-amber-900/30 text-amber-400' : 'text-slate-400'}`}><UserPlus className="w-6 h-6" /></button>
             <button onClick={() => handleTabChange('results')} className={`p-2 rounded-lg transition-colors flex-shrink-0 ${activeTab === 'results' ? 'bg-blue-900/30 text-blue-400' : 'text-slate-400'}`}><Search className="w-6 h-6" /></button>
             <button onClick={() => handleTabChange('ai-consult')} className={`p-2 rounded-lg transition-colors flex-shrink-0 ${activeTab === 'ai-consult' ? 'bg-emerald-900/30 text-emerald-400' : 'text-slate-400'}`}><MessageSquarePlus className="w-6 h-6" /></button>
       </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className={`transition-all duration-300 ease-in-out transform ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-400 text-sm">
                © {new Date().getFullYear()} BloodTesting. Educational purposes only. Not for clinical diagnosis.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;