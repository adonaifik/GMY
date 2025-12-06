import React, { useState } from 'react';
import { quizQuestions } from '../services/bloodLogic';
import { BloodType } from '../types';
import { generatePersonalityAnalysis } from '../services/geminiService';
import { Sparkles, RefreshCw, Loader2, BrainCircuit, Check, ChevronRight } from 'lucide-react';

const PersonalityQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<BloodType, number>>({ A: 0, B: 0, AB: 0, O: 0 });
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<BloodType | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  const handleOptionSelect = (points: Record<BloodType, number>, text: string) => {
    const newScores = { ...scores };
    (Object.keys(points) as BloodType[]).forEach(type => {
      newScores[type] += points[type];
    });
    setScores(newScores);
    setSelectedTraits(prev => [...prev, text]);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finishQuiz(newScores);
    }
  };

  const finishQuiz = async (finalScores: Record<BloodType, number>) => {
    setCompleted(true);
    setLoading(true);
    
    const maxScore = Math.max(...Object.values(finalScores));
    const predictedType = (Object.keys(finalScores) as BloodType[]).find(key => finalScores[key] === maxScore) || BloodType.O;
    
    setResult(predictedType);

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

            <button 
                onClick={reset}
                className="flex items-center justify-center w-full py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 active:scale-95 transition-all gap-2 shadow-lg hover:shadow-xl"
            >
                <RefreshCw className="w-5 h-5" />
                Retake Quiz
            </button>
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
            <div className="flex justify-between items-end mb-2 relative z-10">
                <span className="font-mono text-sm opacity-80 font-bold tracking-widest">QUESTION {currentQuestion + 1} OF {quizQuestions.length}</span>
                <span className="text-2xl font-bold opacity-100">{Math.round(progressPercentage)}%</span>
            </div>
            
            {/* Continuous Progress Bar */}
            <div className="w-full bg-indigo-900/30 h-2 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                    className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
        </div>

        {/* Question Area */}
        <div className="p-8 flex-1 flex flex-col justify-center animate-slide-up" key={currentQuestion}>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 leading-snug">
                {question.question}
            </h2>
            
            <div className="grid gap-4">
                {question.options.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleOptionSelect(opt.typePoints, opt.text)}
                        className="group relative p-5 text-left rounded-xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 active:scale-[0.98] transition-all duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-700 group-hover:text-indigo-900 text-lg transition-colors">
                                {opt.text}
                            </span>
                            <div className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-indigo-500 group-hover:bg-indigo-500 transition-all flex items-center justify-center">
                                <ChevronRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity -ml-0.5" />
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