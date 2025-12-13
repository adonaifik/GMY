import React, { useState } from 'react';
import { quizQuestions } from '../services/bloodLogic';
import { BloodType } from '../types';
import { generatePersonalityAnalysis } from '../services/geminiService';
import { Sparkles, RefreshCw, Loader2, BrainCircuit, Check, ChevronRight, ArrowRight } from 'lucide-react';

interface PersonalityQuizProps {
  onComplete?: (type: BloodType) => void;
  onRegisterRedirect?: () => void;
}

const PersonalityQuiz: React.FC<PersonalityQuizProps> = ({ onComplete, onRegisterRedirect }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<BloodType, number>>({ A: 0, B: 0, AB: 0, O: 0 });
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<BloodType | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  
  // New state for animation control
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);

  const handleOptionSelect = (points: Record<BloodType, number>, text: string, index: number) => {
    if (isTransitioning) return; // Prevent multiple clicks

    setSelectedOptionIndex(index);
    setIsTransitioning(true);

    const newScores = { ...scores };
    (Object.keys(points) as BloodType[]).forEach(type => {
      newScores[type] += points[type];
    });
    setScores(newScores);
    setSelectedTraits(prev => [...prev, text]);

    // Delay to show selection state before moving to next question
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setIsTransitioning(false);
        setSelectedOptionIndex(null);
      } else {
        finishQuiz(newScores);
      }
    }, 450);
  };

  const finishQuiz = async (finalScores: Record<BloodType, number>) => {
    setCompleted(true);
    setLoading(true);
    
    const maxScore = Math.max(...Object.values(finalScores));
    const predictedType = (Object.keys(finalScores) as BloodType[]).find(key => finalScores[key] === maxScore) || BloodType.O;
    
    setResult(predictedType);
    if (onComplete) {
      onComplete(predictedType);
    }

    // Call Gemini for dynamic analysis
    const aiResponse = await generatePersonalityAnalysis(predictedType, selectedTraits);
    setAnalysis(aiResponse);
    setLoading(false);
  };

  const reset = () => {
    setCurrentQuestion(0);
    setScores({ A: 0, B: 0, AB: 0, O: 0 });
    setCompleted(false);
    setResult(null);
    setAnalysis("");
    setSelectedTraits([]);
    setIsTransitioning(false);
    setSelectedOptionIndex(null);
  };

  const progressPercentage = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (completed) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center animate-scale-in">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-lg mb-6 text-white animate-bounce-slow">
                <Sparkles className="w-12 h-12" />
            </div>
            
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Your Personality Match</h2>
            <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500 mb-6 py-2">
                Type {result}
            </div>

            <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left border border-slate-200 shadow-inner">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                   <BrainCircuit className="w-4 h-4 text-indigo-500" /> AI Analysis
                </h3>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-500 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        <span className="text-sm font-medium animate-pulse">Consulting the hematology oracle...</span>
                    </div>
                ) : (
                    <p className="text-slate-700 leading-relaxed text-lg animate-fade-in">
                        {analysis}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-3">
                {onRegisterRedirect && (
                  <button 
                    onClick={onRegisterRedirect}
                    className="flex items-center justify-center w-full py-4 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-xl font-bold hover:shadow-lg hover:from-rose-500 hover:to-rose-600 active:scale-[0.98] transition-all gap-2"
                  >
                      Save & Register Result <ArrowRight className="w-5 h-5" />
                  </button>
                )}
                <button 
                    onClick={reset}
                    className="flex items-center justify-center w-full py-4 bg-white text-slate-600 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 active:scale-95 transition-all gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Retake Quiz
                </button>
            </div>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col min-h-[500px]">
        {/* Header with Progress Bar */}
        <div className="bg-indigo-600 px-8 py-6 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-800 opacity-20"></div>
            
            <div className="flex justify-between items-end mb-3 relative z-10">
                <span className="font-mono text-xs font-bold tracking-widest text-indigo-200 uppercase flex items-center gap-2">
                   <span className="bg-indigo-500/30 px-2 py-1 rounded">Question {currentQuestion + 1} / {quizQuestions.length}</span>
                </span>
                <span 
                    key={progressPercentage} 
                    className="text-3xl font-black tracking-tight animate-scale-in inline-block text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-200 drop-shadow-sm"
                >
                    {Math.round(progressPercentage)}%
                </span>
            </div>
            
            {/* Dynamic Progress Bar */}
            <div className="w-full bg-black/20 h-4 rounded-full overflow-hidden backdrop-blur-md border border-white/10 relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                <div 
                    className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-300 shadow-[0_0_20px_rgba(45,212,191,0.4)] rounded-full relative"
                    style={{ 
                        width: `${progressPercentage === 0 ? 5 : progressPercentage}%`,
                        transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" 
                    }}
                >
                    {/* Glossy Top Highlight */}
                    <div className="absolute top-0 left-0 right-0 h-[40%] bg-white/40 rounded-full"></div>
                    
                    {/* Leading Particle */}
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,1)]"></div>
                </div>
            </div>
        </div>

        {/* Question Area */}
        <div className="p-8 flex-1 flex flex-col justify-center" key={currentQuestion}>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 leading-snug animate-slide-up">
                {question.question}
            </h2>
            
            <div className="grid gap-4">
                {question.options.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleOptionSelect(opt.typePoints, opt.text, idx)}
                        style={{ 
                            animationDelay: `${idx * 75}ms`,
                            opacity: 0 // Start invisible, handled by fill-mode forwards in animation
                        }}
                        className={`group relative p-5 text-left rounded-xl border-2 transition-all duration-300 animate-slide-up
                            ${selectedOptionIndex === idx 
                                ? 'border-indigo-600 bg-indigo-50 shadow-md scale-[1.02] z-10' 
                                : 'border-slate-100 hover:border-indigo-400 hover:bg-indigo-50 active:scale-[0.98]'
                            }
                            ${isTransitioning && selectedOptionIndex !== idx ? 'opacity-50 scale-95' : ''}
                        `}
                    >
                        <div className="flex items-center justify-between">
                            <span className={`font-medium text-lg transition-colors ${selectedOptionIndex === idx ? 'text-indigo-900 font-bold' : 'text-slate-700 group-hover:text-indigo-900'}`}>
                                {opt.text}
                            </span>
                            <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center
                                ${selectedOptionIndex === idx 
                                    ? 'border-indigo-600 bg-indigo-600 scale-110' 
                                    : 'border-slate-300 group-hover:border-indigo-500'
                                }`}>
                                {(selectedOptionIndex === idx) ? (
                                    <Check className="w-4 h-4 text-white animate-scale-in" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 group-hover:bg-indigo-500 rounded-full transition-all" />
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityQuiz;