import React, { useState } from 'react';
import { Flame, Coins, Shield, Users, Trophy, GraduationCap } from 'lucide-react';
import { LeaderboardEntry, UserProfile } from '../types';

interface LeaderboardViewProps {
  leaderboard: LeaderboardEntry[];
  currentUser: UserProfile;
}

export default function LeaderboardView({ leaderboard, currentUser }: LeaderboardViewProps) {
  const [subsetTab, setSubsetTab] = useState<'global' | 'collegiate' | 'friends'>('global');

  // Filter or mock collegiate or friends rankings based on tab
  const getRankings = () => {
    if (subsetTab === 'collegiate') {
      return leaderboard.filter((_, i) => i % 2 === 0);
    }
    if (subsetTab === 'friends') {
      return leaderboard.filter((_, i) => i % 3 === 0 || i === 0);
    }
    return leaderboard;
  };

  const displayedList = getRankings();

  return (
    <div className="space-y-6 font-sans text-slate-400">
      
      {/* Header banner with motivational details */}
      <div className="relative overflow-hidden rounded-xl bg-[#0B0E14] border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Trophy className="h-5 w-5 fill-current" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">Arena Leaderboards</span>
          </div>
          <h2 className="text-xl font-bold text-white">CodeQuest Hall of Grandmasters</h2>
          <p className="text-xs text-slate-500">Practice daily to secure your rank among elite developers. Standings refresh in real-time.</p>
        </div>

        {/* Dynamic sub tab filters */}
        <div className="flex p-1 bg-slate-900/60 border border-slate-800 rounded-lg space-x-1">
          {[
            { id: 'global', label: 'Global Rank', icon: Shield },
            { id: 'collegiate', label: 'Colleges', icon: GraduationCap },
            { id: 'friends', label: 'Friends', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSubsetTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold cursor-pointer transition rounded ${
                  subsetTab === tab.id
                    ? 'bg-indigo-600 font-bold text-white shadow shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="font-mono text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Table listing */}
      <div className="bg-[#0D1017] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-805 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest bg-[#0F1219]">
                <th className="py-4 px-6 text-center w-20">Rank</th>
                <th className="py-4 px-4">Developer</th>
                <th className="py-4 px-4 text-center">Solved Challenges</th>
                <th className="py-4 px-4 text-center">XP Level</th>
                <th className="py-4 px-4 text-center">Streak Status</th>
                <th className="py-4 px-6 text-right">Coin Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {displayedList.length > 0 ? (
                displayedList.map((entry, idx) => {
                  const isCurUser = entry.email === currentUser.email;
                  const rankPos = idx + 1;
                  return (
                    <tr
                      key={entry.email}
                      className={`group select-none transition ${
                        isCurUser ? 'bg-indigo-500/5' : 'hover:bg-[#0B0E14]/75'
                      }`}
                    >
                      {/* Rank badges */}
                      <td className="py-4 px-6 text-center">
                        {rankPos === 1 ? (
                          <div className="inline-flex items-center justify-center px-2 py-1 bg-amber-500/15 text-amber-500 rounded border border-amber-500/20 font-bold text-xs">
                            🥇 1st
                          </div>
                        ) : rankPos === 2 ? (
                          <div className="inline-flex items-center justify-center px-2 py-1 bg-slate-300/15 text-slate-300 rounded border border-slate-300/20 font-bold text-xs">
                            🥈 2nd
                          </div>
                        ) : rankPos === 3 ? (
                          <div className="inline-flex items-center justify-center px-2 py-1 bg-amber-600/15 text-amber-600 rounded border border-amber-600/20 font-bold text-xs">
                            🥉 3rd
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-500 font-mono">#{rankPos}</span>
                        )}
                      </td>

                      {/* User details */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={entry.avatarUrl}
                            alt={entry.name}
                            referrerPolicy="no-referrer"
                            className="h-8 w-8 bg-slate-950 rounded border border-slate-800"
                          />
                          <div>
                            <span className="font-bold text-slate-200 group-hover:text-white transition-colors block">
                              {entry.name}
                              {isCurUser && (
                                <span className="inline-block ml-2 px-1.5 py-0.5 bg-indigo-505/15 text-indigo-400 border border-indigo-500/20 rounded text-[9px] font-mono font-bold uppercase">
                                  YOU
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">{entry.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Solved challenge totals */}
                      <td className="py-4 px-4 text-center">
                        <span className="text-xs font-bold text-slate-350 bg-slate-900 border border-slate-800 px-3 py-1 rounded font-mono">
                          {entry.solvedCount} Solved
                        </span>
                      </td>

                      {/* Level and XP values */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-xs font-bold text-slate-200 font-mono">Level {entry.level}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{entry.xp} total XP</span>
                        </div>
                      </td>

                      {/* Streaks days */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center space-x-1 text-xs text-rose-500 font-bold font-mono">
                          <Flame className="h-4 w-4" />
                          <span>{entry.streak} Days</span>
                        </span>
                      </td>

                      {/* Coin points count */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center space-x-1 text-xs text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 font-bold font-mono">
                          <Coins className="h-3.5 w-3.5" />
                          <span>{entry.coins}</span>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-500 font-mono bg-[#0D1017]">
                    No active leaderboard participants found in database collections.
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
