import React from 'react';
import {
  Coins,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  Calendar,
  ChevronRight,
  Clock,
  TrendingUp
} from 'lucide-react';
import { UserProfile, Problem } from '../types';

interface DashboardViewProps {
  user: UserProfile;
  potdProblem: Problem;
  recommended: Problem[];
  submissions: any[];
  onSelectProblem: (id: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function DashboardView({
  user,
  potdProblem,
  recommended,
  submissions,
  onSelectProblem,
  onNavigateToTab
}: DashboardViewProps) {
  const solvedCount = user.stats?.problemsSolved?.length || 0;
  const currentLevel = user.stats?.level || 1;
  const currentXP = user.stats?.xp || 0;
  const xpToNext = user.stats?.xpToNextLevel || 100;
  const xpPercent = Math.min(Math.round((currentXP / xpToNext) * 100), 100);

  // Get experience tier label
  const getLevelLabel = (lvl: number) => {
    if (lvl <= 1) return 'Beginner';
    if (lvl === 2) return 'Learner';
    if (lvl === 3) return 'Explorer';
    if (lvl === 4) return 'Problem Solver';
    if (lvl === 5) return 'Ninja';
    if (lvl === 6) return 'Master';
    return 'Grandmaster';
  };

  // Extract recent submissions (limit 4)
  const recentSubmissions = submissions ? submissions.slice(0, 4) : [];

  // Weekly progress statistics custom chart calculations
  const weeklyData = user.stats?.weeklyProgress || [
    { day: 'Sun', solved: 0 },
    { day: 'Mon', solved: 0 },
    { day: 'Tue', solved: 0 },
    { day: 'Wed', solved: 0 },
    { day: 'Thu', solved: 0 },
    { day: 'Fri', solved: 0 },
    { day: 'Sat', solved: 0 }
  ];

  const maxWeeklySolves = Math.max(...weeklyData.map(w => w.solved), 1);

  // Dynamically group topics for Mastery progress bars based on metadata or fallback
  const topicMasteries = [
    { name: 'Dynamic Programming', value: user.stats?.topicCompletion?.['Dynamic Programming'] ?? 82, color: 'bg-cyan-500' },
    { name: 'Graph Theory', value: user.stats?.topicCompletion?.['Graph Theory'] ?? 45, color: 'bg-purple-500' },
    { name: 'Trees & Tries', value: user.stats?.topicCompletion?.['Trees & Tries'] ?? 91, color: 'bg-green-500' }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[240px_1fr_260px] gap-0 border border-slate-800 bg-[#0D1017] rounded-xl overflow-hidden shadow-2xl">
      
      {/* 1st Column: LEFT SIDEBAR (Current Status, Skills Mastery, AI Insight) */}
      <aside className="bg-[#0B0E14] border-b xl:border-b-0 xl:border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Current Status Badge container */}
          <div className="p-6 border-b border-slate-800/60">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Current Status</div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold text-sm">Level {currentLevel}</span>
              <span className="text-indigo-400 text-xs font-mono font-semibold uppercase">{getLevelLabel(currentLevel)}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-850 rounded-full mb-1 overflow-hidden border border-slate-800/30">
              <div 
                className="h-full bg-indigo-500 transition-all duration-1000 ease-out"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-right text-slate-500 font-mono">{currentXP} / {xpToNext} XP</div>
          </div>

          {/* Skills Mastery block */}
          <div className="px-6 py-6">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Skills Mastery</div>
            <div className="space-y-4">
              {topicMasteries.map((topic, index) => (
                <div key={index} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs tracking-tight">
                    <span className="text-slate-300 font-medium">{topic.name}</span>
                    <span className="text-slate-500 font-mono font-bold">{topic.value}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-850 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${topic.color} transition-all duration-1000`}
                      style={{ width: `${topic.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insight Box card element */}
        <div className="p-6 mt-auto">
          <div className="bg-indigo-950/20 border border-indigo-505/20 p-4 rounded-xl">
            <div className="text-[10px] text-indigo-400 font-mono font-bold mb-1 tracking-wider">AI INSIGHT</div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Focus on <strong className="text-indigo-300 font-semibold">{potdProblem?.tag || 'Binary Search'}</strong> patterns today. Your accuracy has improved by 12% recently.
            </p>
          </div>
        </div>
      </aside>

      {/* 2nd Column: CENTER SECTION (Greetings, POTD Banner, Recommended Grid) */}
      <section className="flex flex-col p-6 lg:p-8 bg-[#0D1017] border-b xl:border-b-0 border-slate-800">
        
        {/* Profile greetings header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, {user.name}.</h1>
            <p className="text-slate-500 text-sm mt-0.5">Continue your journey to Grandmaster rank.</p>
          </div>
          <div className="flex gap-2">
            {(user.preferredLanguages || ['JavaScript', 'Python']).slice(0, 3).map((lang, lidx) => (
              <span key={lidx} className="px-2.5 py-1 bg-slate-850 border border-slate-800 text-[10px] font-mono rounded text-slate-350">
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Core POTD Banner card */}
        <div className="bg-gradient-to-br from-indigo-650 via-indigo-700 to-indigo-850 p-6 rounded-2xl mb-8 relative overflow-hidden shadow-lg border border-indigo-500/10">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-[450px] space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white/20 text-white text-[10px] px-2.5 py-0.5 rounded font-black uppercase tracking-wider">
                  Problem of the Day
                </span>
                <span className="text-indigo-200 text-xs font-mono">+{potdProblem?.xpReward || 40} XP</span>
              </div>
              
              <h2 className="text-2xl font-bold text-white tracking-tight italic select-none">
                {potdProblem?.title || 'LRU Cache Implementation'}
              </h2>
              
              <p className="text-indigo-100/90 text-xs leading-relaxed max-w-sm line-clamp-2">
                {potdProblem ? potdProblem.description.replace(/[#*`]/g, '') : 'Design and implementation of custom highly optimized cache pipelines.'}
              </p>

              <div className="pt-2">
                <button 
                  onClick={() => onSelectProblem(potdProblem?.id || 'two-sum')}
                  className="bg-white text-indigo-900 px-5 py-2.5 rounded-lg font-bold text-xs hover:bg-slate-100 transition-colors shadow-md cursor-pointer"
                >
                  Solve Now
                </button>
              </div>
            </div>

            <div className="text-center px-8 py-3 bg-white/5 border border-white/10 rounded-xl min-w-[130px]">
              <div className="text-white/60 text-[9px] uppercase font-mono tracking-widest mb-1">Total Solved</div>
              <div className="text-3xl font-extrabold text-white">{solvedCount}</div>
            </div>
          </div>
        </div>

        {/* Dynamic customized recommended items for user */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm tracking-tight">Recommended For You</h3>
            <button 
              onClick={() => onNavigateToTab('Problems')}
              className="text-indigo-400 text-xs hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommended.slice(0, 4).map(prob => (
              <div 
                key={prob.id}
                onClick={() => onSelectProblem(prob.id)}
                className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl hover:border-slate-700 hover:bg-[#0B0E14] transition-all cursor-pointer flex flex-col justify-between min-h-[140px]"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-mono font-bold uppercase ${
                      prob.difficulty === 'Easy' ? 'text-green-500' :
                      prob.difficulty === 'Medium' ? 'text-yellow-500' :
                      'text-red-500'
                    }`}>
                      {prob.difficulty}
                    </span>
                    <span className="text-slate-500 text-[10px] font-mono">{prob.tag}</span>
                  </div>
                  <div className="text-slate-200 font-medium text-sm mb-1 group-hover:text-indigo-400">{prob.title}</div>
                  <p className="text-[11px] text-slate-500 leading-normal line-clamp-2 md:line-clamp-1">{prob.category} Mastery & Skills</p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-800/40 text-[10px]">
                  <span className="text-slate-400 font-medium">Reward: +{prob.coinsReward} Coins</span>
                  <span className="text-indigo-400 font-bold hover:text-indigo-350">Attempt &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 3rd Column: RIGHT SIDEBAR (Leaderboard, achievements, activity) */}
      <aside className="bg-[#0B0E14] border-t xl:border-t-0 xl:border-l border-slate-800 flex flex-col justify-between shrink-0">
        <div className="p-6">
          {/* Achievements widget */}
          <div className="mb-6">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Achievements</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square rounded-lg bg-slate-800/20 border border-slate-800 flex flex-col items-center justify-center p-1" title="Fast solver accolade">
                <div className="text-lg">🚀</div>
                <div className="text-[8px] text-center mt-1 text-slate-400 font-bold uppercase truncate w-full">Fastest</div>
              </div>
              <div className="aspect-square rounded-lg bg-slate-800/20 border border-slate-800 flex flex-col items-center justify-center p-1" title="Code master solved multiple challenges">
                <div className="text-lg">🧠</div>
                <div className="text-[8px] text-center mt-1 text-slate-400 font-bold uppercase truncate w-full">Solver</div>
              </div>
              <div className="aspect-square rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex flex-col items-center justify-center p-1" title="Hot active day streaks award">
                <div className="text-lg">💎</div>
                <div className="text-[8px] text-center mt-1 text-indigo-300 font-bold uppercase truncate w-full">Streak</div>
              </div>
            </div>
          </div>

          {/* Weekly Heat chart */}
          <div className="mb-6">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Weekly Progress</div>
            <div className="flex items-end justify-between h-20 bg-slate-900/25 border border-slate-800/60 rounded-xl px-4 py-3">
              {weeklyData.map((data, idx) => {
                const heightPercent = Math.max(Math.round((data.solved / maxWeeklySolves) * 100), 10);
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group relatve">
                    <div 
                      className="bg-indigo-500/30 group-hover:bg-indigo-500 rounded-t transition-all"
                      style={{ height: `${heightPercent}%`, width: '8px' }}
                      title={`${data.solved} solve(s)`}
                    />
                    <span className="text-[8px] text-slate-500 font-semibold mt-1.5">{data.day[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info/Recent log section */}
        <div className="mt-auto p-6 border-t border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Recent Activity</div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            {recentSubmissions && recentSubmissions.length > 0 ? (
              recentSubmissions.slice(0, 3).map((sub, idx) => (
                <div key={idx} className="text-[11px] flex items-center justify-between leading-none">
                  <div className="flex gap-2 items-center min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'Accepted' ? 'bg-green-500' : 'bg-rose-500'}`} />
                    <span className="text-slate-300 truncate font-sans max-w-[130px]" title={sub.problemTitle}>{sub.problemTitle}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono italic shrink-0">{sub.language}</span>
                </div>
              ))
            ) : (
              <div className="text-[11px] text-slate-500 font-mono italic">No recent logs</div>
            )}
          </div>
        </div>
      </aside>

    </div>
  );
}
