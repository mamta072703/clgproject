import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  Play,
  Coins,
  Cpu
} from 'lucide-react';
import { Problem, UserProfile, Difficulty, ExperienceLevel } from '../types';

interface ProblemsListViewProps {
  problems: Problem[];
  user: UserProfile;
  onSelectProblem: (id: string) => void;
}

export default function ProblemsListView({ problems, user, onSelectProblem }: ProblemsListViewProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'Basics' | 'Data Structures' | 'Algorithms'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | Difficulty>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | ExperienceLevel>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const solvedIds = user.stats?.problemsSolved || [];

  // Filter problems based on active parameters
  const filteredProblems = problems.filter(prob => {
    // 1. Tab category filter
    if (activeTab === 'Basics' && prob.category !== 'Programming Basics') return false;
    if (activeTab === 'Data Structures' && prob.category !== 'Data Structures') return false;
    if (activeTab === 'Algorithms' && prob.category !== 'Algorithms') return false;

    // 2. Difficulty filter
    if (difficultyFilter !== 'all' && prob.difficulty !== difficultyFilter) return false;

    // 3. Level filter
    if (levelFilter !== 'all' && prob.level !== levelFilter) return false;

    // 4. Query search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const inTitle = prob.title.toLowerCase().includes(q);
      const inTag = prob.tag.toLowerCase().includes(q);
      const inDesc = prob.description.toLowerCase().includes(q);
      if (!inTitle && !inTag && !inDesc) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 font-sans text-slate-400">
      
      {/* Category Progress Stats Overview - Sleek technical data card blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-[#0B0E14] border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Programming Basics</h4>
            <span className="text-xs text-indigo-400 font-mono font-bold">
              {Math.min(Math.round((problems.filter(p => p.category === 'Programming Basics' && solvedIds.includes(p.id)).length / Math.max(problems.filter(p => p.category === 'Programming Basics').length, 1)) * 100), 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#0D1017] rounded-full overflow-hidden border border-slate-800/40">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${Math.min(Math.round((problems.filter(p => p.category === 'Programming Basics' && solvedIds.includes(p.id)).length / Math.max(problems.filter(p => p.category === 'Programming Basics').length, 1)) * 100), 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-[#0B0E14] border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Data Structures</h4>
            <span className="text-xs text-indigo-400 font-mono font-bold">
              {Math.min(Math.round((problems.filter(p => p.category === 'Data Structures' && solvedIds.includes(p.id)).length / Math.max(problems.filter(p => p.category === 'Data Structures').length, 1)) * 100), 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#0D1017] rounded-full overflow-hidden border border-slate-800/40">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${Math.min(Math.round((problems.filter(p => p.category === 'Data Structures' && solvedIds.includes(p.id)).length / Math.max(problems.filter(p => p.category === 'Data Structures').length, 1)) * 100), 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-[#0B0E14] border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Algorithms</h4>
            <span className="text-xs text-indigo-400 font-mono font-bold">
              {Math.min(Math.round((problems.filter(p => p.category === 'Algorithms' && solvedIds.includes(p.id)).length / Math.max(problems.filter(p => p.category === 'Algorithms').length, 1)) * 100), 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#0D1017] rounded-full overflow-hidden border border-slate-800/40">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${Math.min(Math.round((problems.filter(p => p.category === 'Algorithms' && solvedIds.includes(p.id)).length / Math.max(problems.filter(p => p.category === 'Algorithms').length, 1)) * 100), 100)}%` }}
            />
          </div>
        </div>

      </div>

      {/* Interactive Tabs and Filters panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-[#0B0E14] border border-slate-800 rounded-xl">
        
        {/* Category triggers */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Challenges' },
            { id: 'Basics', label: 'Basics' },
            { id: 'Data Structures', label: 'Data Structures' },
            { id: 'Algorithms', label: 'Algorithms' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900/40 text-slate-400 hover:text-white border border-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search problems or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0D1017] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-indigo-500"
          />
        </div>

      </div>

      {/* Filters selectors Row */}
      <div className="flex flex-wrap gap-3">
        
        {/* Selection level */}
        <div className="flex items-center space-x-2 bg-[#0B0E14] border border-slate-805 px-3 py-1.5 rounded-lg">
          <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Tier:</span>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as any)}
            className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer pr-1"
          >
            <option value="all" className="bg-[#0B0E14]">All Experience Levels</option>
            <option value="Beginner" className="bg-[#0B0E14]">Beginner</option>
            <option value="Intermediate" className="bg-[#0B0E14]">Intermediate</option>
            <option value="Advanced" className="bg-[#0B0E14]">Advanced</option>
          </select>
        </div>

        {/* Selection difficulty */}
        <div className="flex items-center space-x-2 bg-[#0B0E14] border border-slate-805 px-3 py-1.5 rounded-lg">
          <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Difficulty:</span>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as any)}
            className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer pr-1"
          >
            <option value="all" className="bg-[#0B0E14]">All Difficulties</option>
            <option value="Easy" className="bg-[#0B0E14]">Easy</option>
            <option value="Medium" className="bg-[#0B0E14]">Medium</option>
            <option value="Hard" className="bg-[#0B0E14]">Hard</option>
          </select>
        </div>

      </div>

      {/* Problems data grid table */}
      <div className="bg-[#0D1017] border border-slate-805 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest bg-[#0F1219]">
                <th className="py-4.5 px-6">Status</th>
                <th className="py-4.5 px-4">Title</th>
                <th className="py-4.5 px-4">Topic / Tag</th>
                <th className="py-4.5 px-4">Difficulty</th>
                <th className="py-4.5 px-4">Curriculum Level</th>
                <th className="py-4.5 px-4 text-center">Reward</th>
                <th className="py-4.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProblems.length > 0 ? (
                filteredProblems.map(prob => {
                  const isSolved = solvedIds.includes(prob.id);
                  return (
                    <tr
                      key={prob.id}
                      className="group border-b border-slate-800 bg-[#0D1017] hover:bg-[#0B0E14]/70 transition duration-150 text-sm align-middle"
                    >
                      <td className="py-4.5 px-6">
                        {isSolved ? (
                          <CheckCircle className="h-4.5 w-4.5 text-green-500 fill-green-500/10" />
                        ) : (
                          <div className="h-4 w-4 rounded border border-slate-800" />
                        )}
                      </td>
                      <td className="py-4.5 px-4">
                        <span className="font-bold text-slate-200 group-hover:text-white block transition-colors">
                          {prob.title}
                        </span>
                      </td>
                      <td className="py-4.5 px-4">
                        <span className="px-2 py-0.5 bg-slate-900 text-slate-400 rounded text-xs border border-slate-800 font-mono text-[10.5px]">
                          {prob.tag}
                        </span>
                      </td>
                      <td className="py-4.5 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          prob.difficulty === 'Easy' ? 'bg-green-505/10 text-green-500 border border-green-500/20' :
                          prob.difficulty === 'Medium' ? 'bg-amber-505/10 text-amber-500 border border-amber-500/20' :
                          'bg-rose-505/10 text-rose-500 border border-rose-500/20'
                        }`}>
                          {prob.difficulty}
                        </span>
                      </td>
                      <td className="py-4.5 px-4">
                        <span className="text-xs text-slate-500 font-mono">
                          {prob.level}
                        </span>
                      </td>
                      <td className="py-4.5 px-4 text-center">
                        <div className="inline-flex items-center space-x-1 text-xs text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 font-mono">
                          <Coins className="h-3.5 w-3.5" />
                          <span className="font-bold">+{prob.coinsReward}</span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-right">
                        <button
                          onClick={() => onSelectProblem(prob.id)}
                          className="px-4 py-1.5 bg-indigo-605/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ml-auto cursor-pointer"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          <span>{isSolved ? 'Review' : 'Solve'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-500 bg-[#0D1017]">
                    <Cpu className="h-8 w-8 text-slate-700 mx-auto mb-3" />
                    <p className="text-xs font-semibold uppercase tracking-wider font-mono">No matching records found</p>
                    <p className="text-[11px] text-slate-600 mt-1">Try resetting the difficulty or search filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
