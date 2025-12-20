
import React, { useState, useEffect } from 'react';
import { TabView, BloodType } from './types';
import GeneticsCalculator from './components/GeneticsCalculator';
import PersonalityQuiz from './components/PersonalityQuiz';
import GeminiConsultant from './components/GeminiConsultant';
import Registration from './components/Registration';
import ResultsLookup from './components/ResultsLookup';
import CodeShowcase from './components/CodeShowcase';
import CompatibilityMatrix from './components/CompatibilityMatrix';
import { Droplets, Dna, BrainCircuit, MessageSquarePlus, UserPlus, Search, Code2, HeartPulse, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('quiz');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [quizBloodType, setQuizBloodType] = useState<BloodType | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleTabChange = (tab: TabView) => {
    if (tab === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 300);
  };

  const handleQuizComplete = (type: BloodType) => {
    setQuizBloodType(type);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'quiz': 
        return <PersonalityQuiz 
                  onComplete={handleQuizComplete} 
                  onRegisterRedirect={() => handleTabChange('register')} 
               />;
      case 'genetics': return <GeneticsCalculator />;
      case 'compatibility': return <CompatibilityMatrix />;
      case 'register': 
        return <Registration 
                  quizResult={quizBloodType} 
                  onRedirectToQuiz={() => handleTabChange('quiz')} 
               />;
      case 'results': return <ResultsLookup />;
      case 'ai-consult': return <GeminiConsultant />;
      case 'code': return <CodeShowcase />;
      default: return <PersonalityQuiz />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center gap-5 group cursor-pointer select-none" onClick={() => handleTabChange('quiz')}>
              <div className="relative z-10">
                 <div className="absolute inset-0 bg-rose-600 blur-[30px] rounded-full opacity-20 group-hover:opacity-50 transition-opacity duration-700 animate-pulse"></div>
                 <Droplets className="relative w-14 h-14 text-rose-500 animate-gentle-wiggle transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-rose-200 tracking-tighter">
                  BloodTesting
                </h1>
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="h-[2px] w-4 bg-rose-500 rounded-full group-hover:w-full transition-all duration-700"></div>
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.3em] opacity-80">
                      Supabase Cloud Labs
                    </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <nav className="hidden xl:flex gap-1">
                <button 
                  onClick={() => handleTabChange('quiz')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'quiz' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <BrainCircuit className="w-4 h-4" /> Quiz
                </button>
                <button 
                  onClick={() => handleTabChange('compatibility')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'compatibility' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <HeartPulse className="w-4 h-4" /> Compatibility
                </button>
                <button 
                  onClick={() => handleTabChange('genetics')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'genetics' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Dna className="w-4 h-4" /> Genetics
                </button>
                <button 
                  onClick={() => handleTabChange('register')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'register' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <UserPlus className="w-4 h-4" /> Register
                </button>
                <button 
                  onClick={() => handleTabChange('results')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'results' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Search className="w-4 h-4" /> Results
                </button>
                <button 
                  onClick={() => handleTabChange('ai-consult')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'ai-consult' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <MessageSquarePlus className="w-4 h-4" /> Dr. AI
                </button>
                <button 
                  onClick={() => handleTabChange('code')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'code' ? 'bg-slate-500/10 text-slate-300 border border-slate-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Code2 className="w-4 h-4" /> Code
                </button>
              </nav>

              <button 
                onClick={toggleDarkMode}
                className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-slate-700/50 shadow-inner"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className={`transition-all duration-300 ease-in-out transform ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          {renderContent()}
        </div>
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected to Supabase Project bupcimlkxezqujprxfks
            </p>
            <p className="text-slate-400 text-xs mt-1">© {new Date().getFullYear()} BloodTesting. Educational purposes only.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
