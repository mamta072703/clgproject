import React, { useState } from 'react';
import {
  Award,
  Coins,
  Crown,
  ShoppingBag,
  Palette
} from 'lucide-react';
import { UserProfile, Achievement } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  onRefreshUser: () => void;
}

export default function ProfileView({ user, onRefreshUser }: ProfileViewProps) {
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const shopItems = [
    { id: 'normal', label: 'Classic Slate', cost: 0, desc: 'Default premium matte frameset.' },
    { id: 'amber-glow', label: 'Glowing Amber', cost: 50, desc: 'Surrounds your avatar with a dynamic amber cosmic aura.' },
    { id: 'cyberpunk', label: 'Matrix Cyberpunk', cost: 100, desc: 'Pristine retro-matrix digital interface grid frame.' },
    { id: 'aurora', label: 'Aurora Emerald', cost: 200, desc: 'Elite celestial aurora light curtains animation frame.' }
  ];

  const handleBuyFrame = async (frameId: string, cost: number) => {
    if (frameId === user.profileFrame) {
      alert('Frame already active on profile!');
      return;
    }

    if (user.stats.coins < cost) {
      alert('Insufficient coin reserves. Keep practicing to secure free coins!');
      return;
    }

    setPurchaseLoading(true);
    try {
      const response = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email
        },
        body: JSON.stringify({
          itemType: 'frame',
          itemId: frameId,
          cost
        })
      });

      const data = await response.json();
      if (response.ok) {
        onRefreshUser();
        alert(`Successfully equipped ${frameId} frame!`);
      } else {
        alert(data.error || 'Failed frame equip');
      }
    } catch (e: any) {
      alert(e.message || 'Server connection error');
    } finally {
      setPurchaseLoading(false);
    }
  };

  // Get active frame border styles
  const getFrameBorderClass = (frame: string) => {
    if (frame === 'amber-glow') return 'ring-4 ring-amber-500 shadow-xl shadow-amber-500/20';
    if (frame === 'cyberpunk') return 'ring-4 ring-purple-650 shadow-xl shadow-purple-650/25 border-dashed';
    if (frame === 'aurora') return 'ring-4 ring-emerald-400 shadow-xl shadow-emerald-400/20';
    return 'ring-2 ring-slate-800';
  };

  return (
    <div className="space-y-6 font-sans text-slate-400">
      
      {/* Profile summary header cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Details Sheet */}
        <div className="md:col-span-1 bg-[#0B0E14] border border-slate-805 rounded-xl p-6 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-indigo-505" />
          
          <div className="relative mt-4">
            {/* Equiped Custom frame */}
            <div className={`rounded p-1 overflow-hidden transition-all duration-300 ${getFrameBorderClass(user.profileFrame || 'normal')}`}>
              <img
                src={user.avatarUrl}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="h-28 w-28 bg-slate-950 rounded border border-slate-800"
              />
            </div>
            {user.profileFrame && user.profileFrame !== 'normal' && (
              <span className="absolute -bottom-2 -right-2 p-1.5 bg-indigo-600 border border-indigo-500 rounded text-white font-mono text-[8px] uppercase tracking-widest animate-pulse">
                LEGENDARY
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-white mt-5 tracking-tight">{user.name}</h3>
          <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>

          <div className="grid grid-cols-2 gap-4 w-full border-t border-slate-800 mt-6 pt-5 text-center text-xs">
            <div className="border-r border-slate-800">
              <span className="text-slate-500 block uppercase font-mono text-[10px] tracking-wider">Level</span>
              <span className="text-base font-extrabold text-indigo-400 mt-0.5 block">{user.stats.level}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px] tracking-wider">Coins</span>
              <span className="text-base font-extrabold text-amber-500 mt-0.5 block flex items-center justify-center space-x-1 font-mono">
                <Coins className="h-4 w-4 text-amber-550" />
                <span>{user.stats.coins}</span>
              </span>
            </div>
          </div>

          {user.isAdmin && (
            <div className="flex items-center space-x-1 px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-[9px] font-mono font-bold uppercase mt-6 tracking-widest">
              <span>SaaS Administrator</span>
            </div>
          )}
        </div>

        {/* Dynamic Skill set and targets (2 Cols) */}
        <div className="md:col-span-2 bg-[#0B0E14] border border-slate-805 rounded-xl p-6 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
              <Palette className="h-4.5 w-4.5 text-indigo-450" />
              <span>Personalized Learning Curriculum</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
              <div className="bg-[#0D1017] p-4 rounded-lg border border-slate-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Skill Bracket</span>
                <p className="font-bold text-slate-200">{user.experienceLevel || 'Beginner Practice Line'}</p>
              </div>

              <div className="bg-[#0D1017] p-4 rounded-lg border border-slate-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Language targets</span>
                <p className="font-bold text-slate-200">{user.preferredLanguages ? user.preferredLanguages.join(', ') : 'JavaScript'}</p>
              </div>

              <div className="bg-[#0D1017] p-4 rounded-lg border border-slate-800/80 sm:col-span-2 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Target Career goals</span>
                <p className="font-bold text-slate-200">{user.goals ? user.goals.join('  |  ') : 'Learn Programming Fundamentals'}</p>
              </div>
            </div>
          </div>

          {/* Topic Completion Percentages */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Concept Progress Distributions</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {Object.entries(user.stats?.topicCompletion || {}).map(([tag, percent]) => (
                <div key={tag} className="p-3 bg-[#0D1017] rounded-lg border border-slate-800/80 text-center font-mono">
                  <span className="text-slate-550 block truncate text-[11px] font-sans font-medium">{tag}</span>
                  <span className="font-bold text-indigo-400 mt-1 block">{percent}% Completed</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Grid: Unlocks Shop and Badges lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Quest store frames (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0B0E14] border border-slate-805 rounded-xl p-6 space-y-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-indigo-450" />
              <h3 className="font-bold text-white text-sm">Quest Customization Shop</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Unlock custom avatar borders</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shopItems.map(item => {
              const isActive = user.profileFrame === item.id;
              return (
                <div key={item.id} className="p-4 bg-[#0D1017] border border-slate-800 rounded-lg flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-200 text-sm">{item.label}</h4>
                      {item.cost > 0 && (
                        <div className="inline-flex items-center space-x-1 text-xs text-amber-500 font-bold bg-amber-500/5 px-2 py-0.5 border border-amber-500/10 rounded font-mono">
                          <span>{item.cost}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-normal">{item.desc}</p>
                  </div>

                  <button
                    onClick={() => handleBuyFrame(item.id, item.cost)}
                    disabled={purchaseLoading}
                    className={`w-full py-1.5 rounded text-xs font-bold border transition cursor-pointer ${
                      isActive
                        ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400'
                        : 'bg-indigo-600 hover:bg-indigo-550 border-transparent text-white shadow shadow-indigo-500/10'
                    }`}
                  >
                    {isActive ? 'Currently Equipped' : 'Equip Border'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Full Badges sheets (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0B0E14] border border-slate-805 rounded-xl p-6 space-y-5">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-indigo-455" />
            <h3 className="font-bold text-white text-sm">Badge Achievements</h3>
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
            {user.achievements && user.achievements.length > 0 ? (
              user.achievements.map((ach: Achievement) => (
                <div key={ach.id} className="p-3 bg-[#0D1017] border border-slate-800 rounded-lg flex items-center space-x-3.5">
                  <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded text-indigo-400">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-black text-slate-200 flex items-center space-x-1.5">
                      <span>{ach.title}</span>
                      <span className="inline-block px-1.5 py-0.2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[9px] font-mono font-bold">
                        +50 COINS
                      </span>
                    </h5>
                    <p className="text-[10px] text-slate-500 leading-normal">{ach.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-lg text-slate-500 space-y-2">
                <Award className="h-8 w-8 text-slate-700 mx-auto" />
                <p className="text-xs font-semibold">Ready to scale the rankings?</p>
                <p className="text-[10px] text-slate-600 max-w-xs mx-auto mt-1 leading-normal">
                  Solve Easy, Medium or Hard problems to unlock custom milestone badges and secure massive coins rewards.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
      
    </div>
  );
}
