
import React from 'react';
import { BrainCircuit, HeartPulse, Dna, UserPlus, Search, MessageSquarePlus, Code2, ArrowRight, Droplets } from 'lucide-react';
import { TabView } from '../types';

interface DashboardProps {
  onNavigate: (tab: TabView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const tools = [
    { 
      id: 'quiz', 
      title: 'Personality Quiz', 
      desc: 'Discover traits associated with your blood type.', 
      icon: BrainCircuit, 
      color: 'bg-indigo-500', 
      borderColor: 'border-indigo-100',
      textColor: 'text-indigo-600'
    },
    { 
      id: 'genetics', 
      title: 'Genetics Calculator', 
      desc: 'Predict child blood types using Mendelian logic.', 
      icon: Dna, 
      color: 'bg-rose-500', 
      borderColor: 'border-rose-100',
      textColor: 'text-rose-600'
    },
    { 
      id: 'ai-consult', 
      title: 'HemoBot AI', 
      desc: 'Consult our medical AI for hematology questions.', 
      icon: MessageSquarePlus, 
      color: 'bg-emerald-500', 
      borderColor: 'border-emerald-100',
      textColor: 'text-emerald-600'
    },
    { 
      id: 'compatibility', 
      title: 'Compatibility Matrix', 
      desc: 'Interactive donor and recipient mapping.', 
      icon: HeartPulse, 
      color: 'bg-pink-500', 
      borderColor: 'border-pink-100',
      textColor: 'text-pink-600'
    },
    { 
      id: 'register', 
      title: 'Patient Registration', 
      desc: 'Securely save your diagnostic results.', 
      icon: UserPlus, 
      color: 'bg-amber-500', 
      borderColor: 'border-amber-100',
      textColor: 'text-amber-600'
    },
    { 
      id: 'results', 
      title: 'Result Retrieval', 
      desc: 'Access your records using a unique code.', 
      icon: Search, 
      color: 'bg-blue-500', 
      borderColor: 'border-blue-100',
      textColor: 'text-blue-600'
    }
  ];

  return (
    <div className="animate-fade-in space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome to <span className="text-rose-500">BloodTesting</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
          A comprehensive suite for clinical genetics, blood determination, and personality analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onNavigate(tool.id as TabView)}
            className={`group text-left p-8 bg-white dark:bg-slate-900 rounded-[2rem] border-2 ${tool.borderColor} dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${tool.color} opacity-[0.03] rounded-bl-full group-hover:scale-150 transition-transform duration-700`}></div>
            
            <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-${tool.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
              <tool.icon className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{tool.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
              {tool.desc}
            </p>
            
            <div className={`flex items-center gap-2 text-sm font-bold ${tool.textColor} group-hover:gap-4 transition-all`}>
              Launch Module <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
