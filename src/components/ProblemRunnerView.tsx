import React, { useState, useEffect } from 'react';
import {
  Code,
  BookOpen,
  Sparkles,
  Play,
  CheckCircle,
  Coins,
  Cpu,
  Bookmark,
  ChevronRight,
  Terminal,
  HelpCircle,
  FileText,
  AlertCircle,
  Loader2,
  Trash2,
  Copy,
  ChevronLeft
} from 'lucide-react';
import { Problem, UserProfile, Language } from '../types';

interface ProblemRunnerViewProps {
  problem: Problem;
  user: UserProfile;
  onBack: () => void;
  onRefreshUser: () => void;
}

export default function ProblemRunnerView({ problem, user, onBack, onRefreshUser }: ProblemRunnerViewProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('JavaScript');
  const [editorCode, setEditorCode] = useState('');
  const [activePaneTab, setActivePaneTab] = useState<'desc' | 'solutions' | 'notes' | 'editorial'>('desc');
  const [activeConsoleTab, setActiveConsoleTab] = useState<'run' | 'submit'>('run');

  // Interactive Code executor states
  const [customInput, setCustomInput] = useState('');
  const [runOutputs, setRunOutputs] = useState<string[]>([]);
  const [runStats, setRunStats] = useState<{ passed: number; total: number; error?: string } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gemini AI tools states
  const [aiHint, setAiHint] = useState('');
  const [loadingHint, setLoadingHint] = useState(false);
  const [hintCount, setHintCount] = useState(0);

  const [aiReview, setAiReview] = useState('');
  const [loadingReview, setLoadingReview] = useState(false);

  // Discussion notes
  const [solutionDiscussions, setSolutionDiscussions] = useState<any[]>([
    { author: 'Pranav S', body: 'Implemented a recursive DFS with memoization. Reduced complexity from exponential to O(N).', votes: 14, time: '2 hours ago' },
    { author: 'Ada Lovelace', body: 'The Hash Map approach is O(1) time complexity search, but requires auxiliary memory. Be aware of space limit constraints!', votes: 42, time: 'Today' }
  ]);
  const [newDiscussionMsg, setNewDiscussionMsg] = useState('');

  const [userNotes, setUserNotes] = useState('');

  // Lock systems
  const [editorialLocked, setEditorialLocked] = useState(true);

  // Pre-load default template code
  useEffect(() => {
    if (problem && problem.boilerplate) {
      setEditorCode(problem.boilerplate[selectedLanguage] || problem.boilerplate['JavaScript'] || '');
    }
  }, [problem, selectedLanguage]);

  // Read notes from storage if they exist
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${problem.id}`);
    if (savedNotes) {
      setUserNotes(savedNotes);
    } else {
      setUserNotes('');
    }

    // Auto unlock editorial if already solved
    if (user.stats?.problemsSolved?.includes(problem.id)) {
      setEditorialLocked(false);
    } else {
      setEditorialLocked(true);
    }

    // Clear stats
    setRunOutputs([]);
    setRunStats(null);
    setSubmitResult(null);
    setAiHint('');
    setAiReview('');
    setHintCount(0);
  }, [problem]);

  const handleSaveNotes = () => {
    localStorage.setItem(`notes_${problem.id}`, userNotes);
    alert('Notes committed securely in Local DB!');
  };

  const clearSandboxOutputs = () => {
    setRunOutputs([]);
    setRunStats(null);
    setSubmitResult(null);
  };

  // Run code against test cases
  const handleRunCode = async (isCustom: boolean = false) => {
    setIsRunning(true);
    setActiveConsoleTab('run');
    clearSandboxOutputs();

    try {
      const response = await fetch(`/api/problems/${problem.id}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email
        },
        body: JSON.stringify({
          language: selectedLanguage,
          code: editorCode,
          customInput: isCustom ? customInput : undefined
        })
      });

      const data = await response.json();
      if (response.ok) {
        setRunOutputs(data.outputs || []);
        setRunStats({
          passed: data.passedCount,
          total: data.totalCount,
          error: data.error
        });
      } else {
        setRunStats({
          passed: 0,
          total: 1,
          error: data.error || 'Syntax execution error'
        });
      }
    } catch (e: any) {
      setRunStats({
        passed: 0,
        total: 1,
        error: e.message || 'Sandbox timeout'
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Run full submission
  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setActiveConsoleTab('submit');
    clearSandboxOutputs();

    try {
      const response = await fetch(`/api/problems/${problem.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email
        },
        body: JSON.stringify({
          language: selectedLanguage,
          code: editorCode
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSubmitResult(data.submission);
        onRefreshUser(); // pull coins, streak points etc
      } else {
        alert(data.error || 'Submission failed');
      }
    } catch (e: any) {
      alert(e.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ask Gemini AI for code hint
  const handleGetHint = async () => {
    setLoadingHint(true);
    const nextCount = hintCount + 1;
    setHintCount(nextCount);

    try {
      const response = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email
        },
        body: JSON.stringify({
          problemId: problem.id,
          code: editorCode,
          language: selectedLanguage,
          hintCount: nextCount
        })
      });

      const data = await response.json();
      setAiHint(data.hint || 'No hint output');
    } catch (e: any) {
      setAiHint('Error: ' + e.message);
    } finally {
      setLoadingHint(false);
    }
  };

  // Buy Hint unlock if hint count limit reached
  const handleUnlockHint = () => {
    if (user.stats.coins < 5) {
      alert('Insufficient coin reserves.');
      return;
    }
    // Simulate dynamic inline deduction
    handleGetHint();
  };

  // Ask Gemini to audit code quality
  const handleReviewCode = async () => {
    setLoadingReview(true);
    setAiReview('');

    try {
      const response = await fetch('/api/ai/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email
        },
        body: JSON.stringify({
          problemId: problem.id,
          code: editorCode,
          language: selectedLanguage
        })
      });

      const data = await response.json();
      setAiReview(data.review || 'No audit returned');
    } catch (e: any) {
      setAiReview('Audit compilation failed: ' + e.message);
    } finally {
      setLoadingReview(false);
    }
  };

  // Solutions discussion board post
  const handlePostDiscussion = () => {
    if (!newDiscussionMsg.trim()) return;
    setSolutionDiscussions([
      { author: user.name, body: newDiscussionMsg, votes: 1, time: 'Just now' },
      ...solutionDiscussions
    ]);
    setNewDiscussionMsg('');
  };

  // Buy custom Editorial unlock with coins
  const handleUnlockEditorial = async () => {
    if (user.stats.coins < 15) {
      alert('Required 15 Coins to unlock editorial. Solve problems to earn coins first!');
      return;
    }

    try {
      const response = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email
        },
        body: JSON.stringify({
          itemType: 'editorial',
          itemId: problem.id,
          cost: 15
        })
      });

      const data = await response.json();
      if (response.ok) {
        setEditorialLocked(false);
        onRefreshUser();
        alert('Editorial unlocked successfully!');
      } else {
        alert(data.error);
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans pointer-events-auto">
      
      {/* Back to index catalog */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-slate-300 flex items-center space-x-1.5 transition select-none cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Challenges Catalog</span>
        </button>

        <div className="flex items-center space-x-3 text-xs bg-slate-900 px-4 py-2 rounded-xl border border-slate-850">
          <Coins className="h-4 w-4 text-amber-500" />
          <span className="font-semibold text-slate-300">{user.stats.coins} Coins</span>
        </div>
      </div>

      {/* Code Editor workspace 2 Column structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        
        {/* Left Column Description and AI tabs panel (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden relative backdrop-blur-md">
          
          {/* Tabs header */}
          <div className="flex bg-slate-950/45 border-b border-slate-800/80">
            {[
              { id: 'desc', label: 'Description', icon: FileText },
              { id: 'editorial', label: 'Editorial', icon: BookOpen },
              { id: 'solutions', label: 'Discussions', icon: HelpCircle },
              { id: 'notes', label: 'My Notes', icon: Code }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePaneTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-1.5 py-4 text-[11px] font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                    activePaneTab === tab.id
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab contents panel (Scrollable) */}
          <div className="p-6 flex-1 overflow-y-auto max-h-[550px]" style={{ scrollbarWidth: 'thin' }}>
            
            {activePaneTab === 'desc' && (
              <div className="space-y-6">
                
                {/* Header metrics */}
                <div className="space-y-3">
                  <h2 className="text-2xl font-black text-slate-100">{problem.title}</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                      problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                      problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-rose-500/10 text-rose-400'
                    }`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">•</span>
                    <span className="text-xs text-slate-400 font-semibold bg-slate-950/20 px-2 py-0.5 rounded">{problem.tag}</span>
                    <span className="text-xs text-slate-500 font-bold">•</span>
                    <span className="text-xs text-slate-550 font-medium">{problem.level} Curriculum</span>
                  </div>
                </div>

                {/* Problem Description rendering */}
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap select-text selection:bg-indigo-500/10">
                  {problem.description}
                </div>

                {/* Constraint list */}
                {problem.constraints && problem.constraints.length > 0 && (
                  <div className="space-y-2 border-t border-slate-850 pt-5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Constraints</h4>
                    <ul className="list-disc pl-5 text-xs text-slate-500 space-y-1.5 font-mono">
                      {problem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Problems Examples rendering */}
                {problem.examples && problem.examples.map((ex, i) => (
                  <div key={i} className="space-y-2 bg-slate-950/45 border border-slate-850 p-4 rounded-xl font-mono text-xs">
                    <h4 className="font-bold text-slate-400 uppercase text-[10px]">Example {i + 1}</h4>
                    <p className="text-slate-300"><strong className="text-slate-500 font-normal">Input:</strong> {ex.input}</p>
                    <p className="text-slate-300"><strong className="text-slate-500 font-normal">Output:</strong> {ex.output}</p>
                    {ex.explanation && (
                      <p className="text-slate-500 italic mt-2 text-[11px] font-sans">
                        <strong>Explanation:</strong> {ex.explanation}
                      </p>
                    )}
                  </div>
                ))}

              </div>
            )}

            {activePaneTab === 'editorial' && (
              <div className="space-y-6">
                <div className="flex bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4 space-x-3 items-center">
                  <BookOpen className="h-5 w-5 text-indigo-400" />
                  <p className="text-xs text-slate-300">
                    Learn the verified math proofs, state maps, and O(N) optimized code patterns curated by our panel of masters.
                  </p>
                </div>

                {editorialLocked ? (
                  <div className="text-center py-12 border border-dashed border-slate-850 rounded-2xl space-y-4">
                    <Coins className="h-10 w-10 text-amber-500 mx-auto animate-bounce" />
                    <div>
                      <h4 className="font-bold text-slate-150">This Editorial is Locked</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        Editorial unlocks instantly for <strong className="text-emerald-400 font-normal">FREE after solving</strong> the challenge, or buy lifetime access immediately for <strong className="text-amber-400">15 Coins</strong>.
                      </p>
                    </div>
                    <button
                      onClick={handleUnlockEditorial}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-lg hover:shadow-indigo-500/10 font-bold text-xs rounded-xl transition cursor-pointer select-none"
                    >
                      Unlock for 15 Coins
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap select-text font-sans">
                    {problem.editorial || 'No editorial posted for this challenge yet.'}
                  </div>
                )}
              </div>
            )}

            {activePaneTab === 'solutions' && (
              <div className="space-y-5">
                <h3 className="font-bold text-sm text-slate-300">Student Discussion Forum</h3>
                
                {/* Message lists */}
                <div className="space-y-3">
                  {solutionDiscussions.map((disc, idx) => (
                    <div key={idx} className="bg-slate-950/50 border border-slate-850 rounded-xl p-4 text-xs space-y-2">
                      <div className="flex justify-between items-center text-slate-500">
                        <span className="font-bold text-indigo-400">{disc.author}</span>
                        <span>{disc.time}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{disc.body}</p>
                      <button
                        onClick={() => {
                          const updated = [...solutionDiscussions];
                          updated[idx].votes += 1;
                          setSolutionDiscussions(updated);
                        }}
                        className="text-[10px] text-slate-500 hover:text-slate-300 font-semibold cursor-pointer"
                      >
                        ▲ {disc.votes} Upvotes
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add solution discussion */}
                <div className="space-y-2 border-t border-slate-800 pt-4">
                  <textarea
                    rows={3}
                    placeholder="Share your recursive trace, alternative libraries, or logic logs..."
                    value={newDiscussionMsg}
                    onChange={(e) => setNewDiscussionMsg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-100 outline-none resize-none placeholder:text-slate-600"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handlePostDiscussion}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition"
                    >
                      Post Thread
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activePaneTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-300">My Workspace Notes</h3>
                  <button
                    onClick={handleSaveNotes}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Save Notes
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Notes are persisted locally on this client so you can review variables tracks, complexities, or custom layouts freely.
                </p>
                <textarea
                  rows={20}
                  placeholder="Record variables patterns, edge checks, or general logs for this challenge..."
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 font-mono rounded-xl p-4 text-xs text-slate-200 outline-none resize-none h-[400px]"
                />
              </div>
            )}

          </div>
        </div>

        {/* Right Column Custom Editor workspace & Console (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md relative h-full">
          
          {/* Editor Header settings bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-950/45 border-b border-slate-800/80 gap-3">
            
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Code className="h-4.5 w-4.5 text-indigo-400" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-slate-200 outline-none cursor-pointer border border-slate-800 px-3 py-1.5 rounded-xl bg-slate-950"
              >
                <option value="JavaScript" className="bg-slate-950">JavaScript (Node v20)</option>
                <option value="Python" className="bg-slate-950">Python (v3.11)</option>
                <option value="Java" className="bg-slate-950 font-sans">Java (OpenJDK 17)</option>
                <option value="C++" className="bg-slate-950 font-sans">C++ (GCC G++17)</option>
              </select>
            </div>

            {/* AI Assistant quick buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleGetHint}
                disabled={loadingHint}
                className="px-3 py-2 bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/25 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition select-none disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5 fill-current" />
                <span>{loadingHint ? 'Loading hint...' : `AI Hint${hintCount > 0 ? ` (${hintCount})` : ''}`}</span>
              </button>

              <button
                onClick={handleReviewCode}
                disabled={loadingReview}
                className="px-3 py-2 bg-indigo-600/15 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/25 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition select-none disabled:opacity-50"
              >
                <Cpu className="h-3.5 w-3.5 fill-current animate-spin-slow" />
                <span>{loadingReview ? 'Auditing...' : 'AI Code Review'}</span>
              </button>
            </div>

          </div>

          {/* Premium Multiline Editor window with Line Numbers */}
          <div className="flex-1 bg-slate-950/90 relative group flex select-text">
            
            {/* Simulated Line numbers gutter */}
            <div className="w-11 bg-slate-950 border-r border-slate-900 select-none text-[10px] text-slate-700 font-mono py-4 text-center leading-6 pointer-events-none">
              {Array.from({ length: 30 }).map((_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>

            <textarea
              value={editorCode}
              onChange={(e) => setEditorCode(e.target.value)}
              spellCheck={false}
              className="w-full bg-transparent font-mono text-xs text-indigo-300 placeholder:text-slate-800 outline-none resize-none p-4 leading-6 focus:ring-0 active:ring-0 selection:bg-indigo-500/20 selection:text-indigo-200"
              placeholder="// Write your solution here"
              rows={22}
            />
          </div>

          {/* Inline Sandbox run inputs / logs */}
          <div className="bg-slate-950/95 border-t border-slate-850 p-5">
            
            <div className="flex border-b border-slate-850 pb-3 mb-4 text-xs font-extrabold text-slate-400 uppercase tracking-widest gap-4">
              <button
                onClick={() => setActiveConsoleTab('run')}
                className={`py-1 cursor-pointer select-none ${activeConsoleTab === 'run' ? 'text-indigo-400 border-b-2 border-indigo-500 font-bold' : ''}`}
              >
                Sandbox Terminal
              </button>
              <button
                onClick={() => setActiveConsoleTab('submit')}
                className={`py-1 cursor-pointer select-none ${activeConsoleTab === 'submit' ? 'text-indigo-400 border-b-2 border-indigo-500 font-bold' : ''}`}
              >
                Submission Logs
              </button>
            </div>

            {/* Sandbox input values */}
            {activeConsoleTab === 'run' && (
              <div className="space-y-4">
                
                {/* Custom inputs optional configuration */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Configure Custom Input test cases (Optional)</span>
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder={problem.tests[0] ? problem.tests[0].input.replace(/\n/g, '  |  ') : "Custom input value"}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-650 outline-none font-mono focus:border-indigo-500"
                  />
                </div>

                {/* Outputs results frame */}
                <div className="space-y-1.5">
                  {(isRunning) ? (
                    <div className="flex items-center space-x-2 py-6 text-xs text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                      <span>Compiling sources in sandboxed VM. Please wait...</span>
                    </div>
                  ) : runStats ? (
                    <div className="bg-slate-900/50 border border-slate-855 rounded-xl p-4 font-mono text-xs space-y-3">
                      
                      {/* Passed or Syntax check */}
                      {runStats.error ? (
                        <div className="flex items-center space-x-2 text-rose-500 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg text-[11px]">
                          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                          <span>Syntax Error: {runStats.error}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 uppercase font-bold">Passed test runs:</span>
                          <span className={`${runStats.passed === runStats.total ? 'text-emerald-450' : 'text-rose-450'} font-black`}>
                            {runStats.passed} / {runStats.total}
                          </span>
                        </div>
                      )}

                      {/* Line outputs comparisons */}
                      {runOutputs && runOutputs.map((outStr, i) => (
                        <div key={i} className="text-[11px] space-y-1 border-t border-slate-850/60 pt-2 first:border-0 first:pt-0">
                          <p className="text-slate-500">Test Case #{i + 1}</p>
                          <p className="text-indigo-400">Actual output: <span className="text-slate-200">{JSON.stringify(outStr)}</span></p>
                          {problem.tests[i] && (
                            <p className="text-emerald-500">Expected: <span className="text-slate-400">{problem.tests[i].expected}</span></p>
                          )}
                        </div>
                      ))}

                    </div>
                  ) : (
                    <p className="text-xs text-slate-650 italic py-3 select-none">No active terminal runs reported. Click "Run Code" to compile.</p>
                  )}
                </div>

              </div>
            )}

            {/* Submission log values */}
            {activeConsoleTab === 'submit' && (
              <div className="space-y-4">
                {isSubmitting ? (
                  <div className="flex items-center space-x-2 py-6 text-xs text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                    <span>Grading all test cases, analyzing dynamic limits. Please wait...</span>
                  </div>
                ) : submitResult ? (
                  <div className="bg-slate-900/60 border border-slate-850 rounded-xl p-5 space-y-4">
                    
                    {/* Header check */}
                    <div className="flex items-center space-x-3">
                      {submitResult.status === 'Accepted' ? (
                        <div className="p-2 bg-emerald-500/15 border border-emerald-500/25 rounded-xl text-emerald-400">
                          <CheckCircle className="h-6 w-6" />
                        </div>
                      ) : (
                        <div className="p-2 bg-rose-500/15 border border-rose-500/25 rounded-xl text-rose-400">
                          <AlertCircle className="h-6 w-6" />
                        </div>
                      )}
                      <div>
                        <h4 className={`text-base font-extrabold ${submitResult.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {submitResult.status === 'Accepted' ? 'Submission Accepted!' : 'Submission Failed'}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono">{submitResult.id} • {submitResult.submittedAt.split('T')[0]}</p>
                      </div>
                    </div>

                    {/* Stats metrics */}
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono border-t border-slate-850/80 pt-4">
                      <div>
                        <p className="text-slate-500 uppercase text-[9px] tracking-wider">Test cases passed</p>
                        <p className="text-sm font-bold text-slate-200">{submitResult.passedCount} / {submitResult.totalCount}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 uppercase text-[9px] tracking-wider">Simulated CPU Speed</p>
                        <p className="text-sm font-bold text-slate-200">{submitResult.runtimeMs} ms</p>
                      </div>
                      <div>
                        <p className="text-slate-500 uppercase text-[9px] tracking-wider">Reward allocated</p>
                        <p className="text-sm font-bold text-amber-400">+{submitResult.coinsEarned} Coins / +{submitResult.xpEarned} XP</p>
                      </div>
                      <div>
                        <p className="text-slate-500 uppercase text-[9px] tracking-wider">Language Compiled</p>
                        <p className="text-sm font-bold text-slate-200">{submitResult.language}</p>
                      </div>
                    </div>

                  </div>
                ) : (
                  <p className="text-xs text-slate-650 italic py-3 select-none">No active grade history created. Submit code to invoke the test suite.</p>
                )}
              </div>
            )}

            {/* AI Assistant Output logs on demand */}
            {(aiHint || aiReview) && (
              <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/25 rounded-xl text-xs relative select-text selection:bg-indigo-500/20">
                <button
                  onClick={() => { setAiHint(''); setAiReview(''); }}
                  className="absolute top-2 right-2 text-slate-500 hover:text-slate-250 hover:scale-105 transition scale-95"
                >
                  ✕
                </button>
                <div className="flex items-center space-x-1.5 text-indigo-400 mb-2">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  <span className="font-bold uppercase tracking-wider text-[10px]">AI Co-Pilot Analytics</span>
                </div>
                {aiHint && (
                  <div className="space-y-3">
                    <p className="text-slate-200 leading-relaxed font-sans">{aiHint}</p>
                    {hintCount > 2 && (
                      <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-indigo-500/10 pt-2.5">
                        <span>💡 Dynamic Hint Limit Reached for free tier.</span>
                        <button onClick={handleUnlockHint} className="text-indigo-400 hover:underline font-bold">Unlocking Premium hint (5 Coins)</button>
                      </div>
                    )}
                  </div>
                )}
                {aiReview && (
                  <div className="space-y-2 whitespace-pre-wrap leading-relaxed text-slate-200 leading-relaxed max-h-[300px] overflow-y-auto font-sans" style={{ scrollbarWidth: 'none' }}>
                    {aiReview}
                  </div>
                )}
              </div>
            )}

            {/* Core Action triggers bar */}
            <div className="flex items-center justify-end space-x-3 mt-5 pt-4 border-t border-slate-850">
              <button
                onClick={() => handleRunCode(false)}
                disabled={isRunning || isSubmitting}
                className="px-5 py-3 bg-slate-900 hover:bg-slate-850 text-indigo-400 border border-slate-800 rounded-xl text-xs font-bold transition select-none disabled:opacity-40 cursor-pointer"
              >
                Run Code
              </button>

              <button
                onClick={handleSubmitCode}
                disabled={isRunning || isSubmitting}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl hover:shadow-lg hover:shadow-indigo-500/10 transition select-none disabled:opacity-40 cursor-pointer"
              >
                Submit Code
              </button>
            </div>

          </div>

        </div>

      </div>
      
    </div>
  );
}
