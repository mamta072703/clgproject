import React, { useState, useEffect } from 'react';
import {
  Code,
  Coins,
  Flame,
  User,
  Shield,
  Trophy,
  Activity,
  LogOut,
  Sparkles,
  Award,
  BookOpen,
  LayoutDashboard,
  Palette,
  Settings,
  ShieldAlert,
  Loader2
} from 'lucide-react';

// Subcomponents
import AuthLayout from './components/AuthLayout';
import OnboardingWizard from './components/OnboardingWizard';
import DashboardView from './components/DashboardView';
import ProblemsListView from './components/ProblemsListView';
import ProblemRunnerView from './components/ProblemRunnerView';
import LeaderboardView from './components/LeaderboardView';
import ProfileView from './components/ProfileView';
import AdminPanel from './components/AdminPanel';

import { UserProfile, Problem, LeaderboardEntry } from './types';

export default function App() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Layout tabs
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Problems' | 'Leaderboard' | 'Profile' | 'Admin Panel'>('Dashboard');
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);

  // Global database cache
  const [problems, setProblems] = useState<Problem[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  // Dashboard states
  const [potdProblem, setPotdProblem] = useState<Problem | null>(null);
  const [recommended, setRecommended] = useState<Problem[]>([]);

  // Theme Accent selector (Unlocked with shop or selectable for premium feel)
  const [themeAccent, setThemeAccent] = useState<'indigo' | 'amber' | 'purple' | 'emerald'>('indigo');

  // Load email session on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('codequest_session_email');
    if (savedEmail) {
      setSessionEmail(savedEmail);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch full user profile & DB caches once sessionEmail updates
  useEffect(() => {
    if (!sessionEmail) return;

    const bootstrapAndSync = async () => {
      setLoading(true);
      try {
        await handleSyncProfile();
        await handleSyncGlobalCaches();
      } catch (e) {
        console.error('Core sync failure, resetting session keys', e);
        localStorage.removeItem('codequest_session_email');
        setSessionEmail(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAndSync();
  }, [sessionEmail]);

  // Sync profile details
  const handleSyncProfile = async () => {
    if (!sessionEmail) return;
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'x-user-email': sessionEmail
        }
      });
      const data = await response.json();
      if (response.ok && data.user) {
        setUser(data.user);
      } else {
        throw new Error('Authentication expired or failed.');
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  // Sync global problems catalogs, submissions lists, leaderboards
  const handleSyncGlobalCaches = async () => {
    if (!sessionEmail) return;
    try {
      // 1. Fetch catalog
      const probRes = await fetch('/api/problems');
      const probData = await probRes.json();
      if (probRes.ok) {
        setProblems(probData.problems || []);
      }

      // 2. Fetch Leaderboard
      const leadRes = await fetch('/api/leaderboard');
      const leadData = await leadRes.json();
      if (leadRes.ok) {
        setLeaderboard(leadData.leaderboard || []);
      }

      // 3. Fetch user submissions
      const subRes = await fetch('/api/submissions', {
        headers: { 'x-user-email': sessionEmail }
      });
      const subData = await subRes.json();
      if (subRes.ok) {
        setSubmissions(subData.submissions || []);
      }

      // 4. Fetch dashboard tailored stats (reccomended, potd problem)
      const dashRes = await fetch('/api/dashboard', {
        headers: { 'x-user-email': sessionEmail }
      });
      const dashData = await dashRes.json();
      if (dashRes.ok) {
        setRecommended(dashData.recommended || []);
        setPotdProblem(dashData.potdProblem || null);
      }
    } catch (e) {
      console.error('Failed caching dynamic DB variables:', e);
    }
  };

  // Login handler
  const handleLogin = async (email: string, name: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      const data = await response.json();
      if (response.ok && data.user) {
        localStorage.setItem('codequest_session_email', email);
        setSessionEmail(email);
        setUser(data.user);
      } else {
        alert(data.error || 'Autheticate transition failed');
      }
    } catch (e: any) {
      alert('Network failure details: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Onboarding completion
  const handleCompleteOnboarding = async (level: string, langList: string[], goalList: string[]) => {
    if (!sessionEmail) return;
    setLoading(true);
    try {
      const response = await fetch('/api/auth/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': sessionEmail
        },
        body: JSON.stringify({
          experienceLevel: level,
          preferredLanguages: langList,
          goals: goalList
        })
      });

      const data = await response.json();
      if (response.ok && data.user) {
        setUser(data.user);
        await handleSyncGlobalCaches();
      } else {
        alert('Failed saving goals onboarding checklist');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Close session
  const handleLogout = () => {
    localStorage.removeItem('codequest_session_email');
    setSessionEmail(null);
    setUser(null);
    setSelectedProblemId(null);
    setActiveTab('Dashboard');
  };

  // Nav actions
  const handleSelectProblemID = (probId: string) => {
    setSelectedProblemId(probId);
  };

  const handleBackToCatalog = () => {
    setSelectedProblemId(null);
    handleSyncGlobalCaches();
    handleSyncProfile();
  };

  // Loading animation state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans">
        <div className="space-y-4 text-center">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider animate-pulse">
            Syncing CodeQuest Core Database Collections
          </p>
        </div>
      </div>
    );
  }

  // Auth screen fallback
  if (!sessionEmail || !user) {
    return <AuthLayout onLogin={handleLogin} />;
  }

  // Onboarding wizard screen fallback
  if (!user.onboarded) {
    return <OnboardingWizard onComplete={handleCompleteOnboarding} />;
  }

  // Get active selected Problem details
  const activeProblem = problems.find(p => p.id === selectedProblemId);

  // Theme Accent color templates keys
  const getThemeAccentClass = () => {
    if (themeAccent === 'amber') return 'text-amber-400 border-amber-500/30';
    if (themeAccent === 'purple') return 'text-purple-400 border-purple-500/30';
    if (themeAccent === 'emerald') return 'text-emerald-450 border-emerald-500/30';
    return 'text-indigo-400 border-indigo-500/30';
  };

  const getThemeBgClass = () => {
    if (themeAccent === 'amber') return 'bg-amber-600 hover:bg-amber-550 shadow-amber-500/10';
    if (themeAccent === 'purple') return 'bg-purple-600 hover:bg-purple-550 shadow-purple-500/10';
    if (themeAccent === 'emerald') return 'bg-emerald-600 hover:bg-emerald-555 shadow-emerald-500/10';
    return 'bg-indigo-600 hover:bg-indigo-550 shadow-indigo-500/10';
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-400 flex flex-col font-sans relative antialiased select-none pointer-events-auto">
      
      {/* Background visual cues */}
      <div className="absolute inset-x-0 top-0 h-96 bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Modern High-End Top Header Bar */}
      <header className="sticky top-0 z-30 h-16 bg-[#0F1219] border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
        
        {/* Branding */}
        <div onClick={handleBackToCatalog} className="flex items-center space-x-2.5 cursor-pointer selection:bg-transparent">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-black italic">
            CQ
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white">
              CodeQuest
            </h1>
          </div>
        </div>

        {/* Floating Top navigation links with responsive icons */}
        {!selectedProblemId && (
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {[
              { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'Problems', label: 'Problems', icon: BookOpen },
              { id: 'Leaderboard', label: 'Leaderboard', icon: Trophy },
              { id: 'Profile', label: 'Portfolio', icon: User },
              ...(user.isAdmin ? [{ id: 'Admin Panel', label: 'Admin', icon: ShieldAlert }] : [])
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1.5 pb-5 pt-5 transition-colors text-xs font-bold cursor-pointer ${
                    isActive
                      ? 'text-white border-b-2 border-indigo-500'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* User Stats and logout logs */}
        <div className="flex items-center space-x-4">
          
          {/* Theme custom accents pill */}
          <div className="flex items-center space-x-1 px-2.5 py-1.5 bg-[#0B0E14] border border-slate-800 rounded-xl text-xs">
            <Palette className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <div className="flex space-x-1 pl-1">
              {(['indigo', 'purple', 'emerald', 'amber'] as any[]).map(color => (
                <button
                  key={color}
                  onClick={() => setThemeAccent(color)}
                  className={`h-2.5 w-2.5 rounded-full border transition ${
                    color === 'indigo' ? 'bg-indigo-500 border-indigo-400' :
                    color === 'purple' ? 'bg-purple-500 border-purple-400' :
                    color === 'emerald' ? 'bg-emerald-500 border-emerald-400' :
                    'bg-amber-500 border-amber-450'
                  } ${themeAccent === color ? 'scale-125 border-white' : 'scale-95 opacity-55'}`}
                  title={`${color} accent`}
                />
              ))}
            </div>
          </div>

          {/* User Streaks */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/20 px-3 py-1.5 rounded-full border border-slate-800 text-[10px] font-mono">
            <span className="text-orange-400">🔥</span>
            <span className="text-slate-200">{user.stats.streak} DAY STREAK</span>
          </div>

          {/* Coins */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/20 px-3 py-1.5 rounded-full border border-slate-800 text-[10px] font-mono">
            <span className="text-yellow-400">🪙</span>
            <span className="text-slate-200">{user.stats.coins} COINS</span>
          </div>

          {/* Mini profile frame check */}
          <div
            onClick={() => { setSelectedProblemId(null); setActiveTab('Profile'); }}
            className="flex items-center space-x-2 cursor-pointer outline-none border border-slate-805 px-3 py-1 rounded-xl bg-[#0B0E14] hover:bg-slate-800/30 transition"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              referrerPolicy="no-referrer"
              className={`h-7 w-7 rounded bg-slate-950 border ${
                user.profileFrame === 'amber-glow' ? 'ring-2 ring-amber-500 border-amber-400' :
                user.profileFrame === 'cyberpunk' ? 'ring-2 ring-purple-500 border-purple-400' :
                user.profileFrame === 'aurora' ? 'ring-2 ring-emerald-400 border-emerald-350' :
                'border-slate-800'
              }`}
            />
            <span className="hidden sm:inline text-xs font-bold text-slate-300 line-clamp-1 max-w-[100px]">{user.name}</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2.5 bg-[#0B0E14] hover:bg-rose-500/10 border border-slate-800 text-slate-500 hover:text-rose-450 rounded-xl transition cursor-pointer"
            title="Authenticate Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

      </header>

      {/* Floating Bottom Navigation (Only visible on responsive mobile viewports) */}
      <nav className="flex md:hidden fixed bottom-0 inset-x-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-955 p-3 items-center justify-around z-30">
        {[
          { id: 'Dashboard', label: 'Hub', icon: LayoutDashboard },
          { id: 'Problems', label: 'Solve', icon: BookOpen },
          { id: 'Leaderboard', label: 'Trophy', icon: Trophy },
          { id: 'Profile', label: 'User', icon: User }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setSelectedProblemId(null); setActiveTab(tab.id as any); }}
              className={`flex flex-col items-center space-y-1 ${isActive ? 'text-indigo-400' : 'text-slate-600'}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main body viewport */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 lg:px-8 py-8 pb-24 md:pb-12">
        {selectedProblemId && activeProblem ? (
          <ProblemRunnerView
            problem={activeProblem}
            user={user}
            onBack={handleBackToCatalog}
            onRefreshUser={handleSyncProfile}
          />
        ) : (
          <div>
            {activeTab === 'Dashboard' && (
              <DashboardView
                user={user}
                potdProblem={potdProblem || problems[0]}
                recommended={recommended}
                submissions={submissions}
                onSelectProblem={handleSelectProblemID}
                onNavigateToTab={(tab: any) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'Problems' && (
              <ProblemsListView
                problems={problems}
                user={user}
                onSelectProblem={handleSelectProblemID}
              />
            )}

            {activeTab === 'Leaderboard' && (
              <LeaderboardView
                leaderboard={leaderboard}
                currentUser={user}
              />
            )}

            {activeTab === 'Profile' && (
              <ProfileView
                user={user}
                onRefreshUser={handleSyncProfile}
              />
            )}

            {activeTab === 'Admin Panel' && user.isAdmin && (
              <AdminPanel
                problems={problems}
                onRefreshProblems={handleSyncGlobalCaches}
                adminEmail={user.email}
              />
            )}
          </div>
        )}
      </main>

      {/* Standard modern footer signature details */}
      <footer className="h-8 px-6 bg-[#0F1219] border-t border-slate-800 flex items-center justify-between shrink-0 select-none">
        <div className="flex gap-6 text-[10px] font-mono text-slate-500">
          <span>SYSTEM: OPTIMAL</span>
          <span>LATENCY: 14MS</span>
          <span>SESSION: A92-X1</span>
        </div>
        <div className="text-[10px] font-mono text-slate-500">
          &copy; 2026 CODEQUEST ENTERPRISE
        </div>
      </footer>

    </div>
  );
}
