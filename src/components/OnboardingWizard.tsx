import React, { useState } from 'react';
import { Award, Code, CheckCircle, ChevronRight, Activity, Cpu } from 'lucide-react';
import { ExperienceLevel, Language, Goal } from '../types';

interface OnboardingWizardProps {
  onComplete: (level: ExperienceLevel, languages: Language[], goals: Goal[]) => void;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [level, setLevel] = useState<ExperienceLevel>('Beginner');
  const [languages, setLanguages] = useState<Language[]>(['JavaScript']);
  const [goals, setGoals] = useState<Goal[]>(['Learn Programming']);

  const toggleLanguage = (lang: Language) => {
    if (languages.includes(lang)) {
      if (languages.length > 1) {
        setLanguages(languages.filter(l => l !== lang));
      }
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const toggleGoal = (goal: Goal) => {
    if (goals.includes(goal)) {
      if (goals.length > 1) {
        setGoals(goals.filter(g => g !== goal));
      }
    } else {
      setGoals([...goals, goal]);
    }
  };

  const levelOptions: { id: ExperienceLevel; label: string; desc: string }[] = [
    { id: 'Beginner', label: 'Beginner', desc: 'New to programming or variables, looking for fundamental steps.' },
    { id: 'Intermediate', label: 'Intermediate', desc: 'Know loops, functions, basic lists/arrays and want to master algorithms.' },
    { id: 'Advanced', label: 'Advanced', desc: 'Proficient in code. Looking for dynamic programming, graphs, and system design.' }
  ];

  const languageOptions: Language[] = ['C', 'C++', 'Java', 'Python', 'JavaScript', 'C#', 'Go', 'Rust'];

  const goalOptions: Goal[] = [
    'Learn Programming',
    'Crack Coding Interviews',
    'Competitive Programming',
    'College Preparation',
    'Placement Preparation'
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(level, languages, goals);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 font-sans relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="w-full max-w-2xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 relative z-10 transition-all duration-300">
        
        {/* Step Indicator Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-indigo-400" />
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Onboarding Core Matrix</span>
          </div>
          <div className="flex items-center space-x-1">
            {[1, 2, 3].map(num => (
              <div
                key={num}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === num ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Experience Level */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">What is your programming experience?</h2>
              <p className="text-slate-400 text-sm mt-1">We will tailor the complexity of coding problems to match your comfort line.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {levelOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setLevel(opt.id)}
                  className={`w-full flex items-start text-left p-5 rounded-2xl border transition-all duration-300 pointer-events-auto ${
                    level === opt.id
                      ? 'bg-indigo-500/10 border-indigo-500/50 ring-1 ring-indigo-500/30'
                      : 'bg-slate-950/45 border-slate-800/80 hover:border-slate-700/80'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl mr-4 ${level === opt.id ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-900 text-slate-500'}`}>
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200">{opt.label}</h3>
                    <p className="text-xs text-slate-400 mt-1">{opt.desc}</p>
                  </div>
                  {level === opt.id && (
                    <span className="ml-auto text-indigo-400">
                      <CheckCircle className="h-5 w-5 fill-indigo-400/15" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Programming Language */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Which programming language do you want to learn?</h2>
              <p className="text-slate-400 text-sm mt-1">Select one or multiple. We support sandboxed code execution across all systems.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {languageOptions.map(lang => {
                const isSelected = languages.includes(lang);
                return (
                  <button
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`p-4 rounded-xl border font-medium text-sm flex flex-col items-center justify-center space-y-2 transition-all duration-300 ${
                      isSelected
                        ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300'
                        : 'bg-slate-950/45 border-slate-800/80 text-slate-450 hover:border-slate-700/80 hover:text-slate-200'
                    }`}
                  >
                    <Code className="h-5 w-5" />
                    <span>{lang}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Career Goals */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">What is your core career goal?</h2>
              <p className="text-slate-400 text-sm mt-1">This tunes the AI recommendation models to index interviews, contests, or concepts.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {goalOptions.map(goal => {
                const isSelected = goals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-sm font-medium transition-all duration-300 ${
                      isSelected
                        ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300'
                        : 'bg-slate-950/45 border-slate-800/80 text-slate-400 hover:border-slate-700/80 hover:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center space-x-3">
                      <Activity className="h-4 w-4 text-indigo-400" />
                      <span>{goal}</span>
                    </span>
                    {isSelected && (
                      <CheckCircle className="h-5 w-5 text-indigo-400 fill-indigo-400/15" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Actions */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-800/80">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-slate-200 rounded-xl text-sm font-medium transition"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl flex items-center space-x-1 transition shadow-lg shadow-indigo-500/15"
          >
            <span>{step === 3 ? 'Finalize Program' : 'Progress'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
