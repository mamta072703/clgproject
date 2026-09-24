import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  Award,
  Calendar,
  Layers,
  CheckCircle,
  FileText
} from 'lucide-react';
import { Problem, ExperienceLevel, Difficulty } from '../types';

interface AdminPanelProps {
  problems: Problem[];
  onRefreshProblems: () => void;
  adminEmail: string;
}

export default function AdminPanel({ problems, onRefreshProblems, adminEmail }: AdminPanelProps) {
  // Adding state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProblemId, setEditingProblemId] = useState<string | null>(null);

  // Form states
  const [probId, setProbId] = useState('');
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState<ExperienceLevel>('Beginner');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [category, setCategory] = useState<'Programming Basics' | 'Data Structures' | 'Algorithms'>('Programming Basics');
  const [tag, setTag] = useState('Arrays');
  const [description, setDescription] = useState('');
  const [constraints, setConstraints] = useState('1 <= nums.length <= 100\nOnly one valid answer exists.');
  const [examplesInput1, setExamplesInput1] = useState('nums = [1, 2], target = 3');
  const [examplesOutput1, setExamplesOutput1] = useState('[0, 1]');
  const [tests, setTests] = useState('[1, 2]\\n3: [0, 1]\n[3, 3]\\n6: [0, 1]');
  const [boilerplate, setBoilerplate] = useState('function solve(nums) {\n  // your code\n}');

  // Manage POTD
  const [selectedPOTD, setSelectedPOTD] = useState('two-sum');

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!probId || !title) return;

    // Convert string inputs to proper schemas
    const constraintArray = constraints.split('\n').filter(c => c.trim().length > 0);
    const examples = [{ input: examplesInput1, output: examplesOutput1 }];
    
    // Parse tests
    const formattedTests = tests.split('\n').map(line => {
      const parts = line.split(':');
      return {
        input: (parts[0] || '').replace(/\\n/g, '\n').trim(),
        expected: (parts[1] || '').trim()
      };
    });

    const newProblem: Problem = {
      id: probId,
      title,
      level,
      difficulty,
      category,
      tag,
      description,
      constraints: constraintArray,
      examples,
      boilerplate: {
        'JavaScript': boilerplate,
        'Python': 'def solve():\n    pass'
      },
      tests: formattedTests,
      coinsReward: difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 20 : 40,
      xpReward: difficulty === 'Easy' ? 50 : difficulty === 'Medium' ? 100 : 200,
      hints: ['Follow variables states'],
      editorial: '### Solution Review\n\nWalk variables step by step.'
    };

    try {
      const response = await fetch('/api/admin/problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': adminEmail
        },
        body: JSON.stringify({ problem: newProblem })
      });

      if (response.ok) {
        alert('Coding Challenge registed inside CodeQuest registry!');
        onRefreshProblems();
        resetForm();
      } else {
        const err = await response.json();
        alert(err.error || 'Failed registration');
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeleteProblem = async (id: string) => {
    if (!window.confirm('Are you absolutely sure you want to delete this challenge permanently?')) return;

    try {
      const response = await fetch(`/api/admin/problems/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-email': adminEmail
        }
      });

      if (response.ok) {
        alert('Challenge removed from catalog.');
        onRefreshProblems();
      } else {
        alert('Deletion failed');
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleSetPOTD = async () => {
    try {
      const response = await fetch('/api/admin/potd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': adminEmail
        },
        body: JSON.stringify({ problemId: selectedPOTD })
      });

      if (response.ok) {
         alert('Secured POTD challenge assigned for standard curriculum!');
         onRefreshProblems();
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const resetForm = () => {
    setProbId('');
    setTitle('');
    setDescription('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 font-sans text-slate-100 pointer-events-auto">
      
      {/* SaaS Admin heading banner */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex items-center space-x-3.5 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-red-500/80 pointer-events-none" />
        <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/15 rounded-xl">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div className="space-y-0.5">
          <h2 className="text-lg font-extrabold tracking-tight">SaaS Central Command Panel</h2>
          <p className="text-xs text-slate-500">Administrate database problem sets, assign daily POTDs, and control core metrics.</p>
        </div>
      </div>

      {/* Dynamic POTD Assign and statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* POTD scheduler */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-350 uppercase tracking-widest flex items-center space-x-1.5">
            <Calendar className="h-4.5 w-4.5 text-indigo-450" />
            <span>Problem of the Day</span>
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            <span className="text-slate-500 block">Select active challenge for POTD rewards multiplier:</span>
            <select
              value={selectedPOTD}
              onChange={(e) => setSelectedPOTD(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 px-3.5 py-3 rounded-xl text-slate-200 text-xs"
            >
              {problems.map(p => (
                <option key={p.id} value={p.id}>{p.title} ({p.difficulty})</option>
              ))}
            </select>
            <button
              onClick={handleSetPOTD}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white font-bold rounded-xl transition cursor-pointer select-none"
            >
              Commit POTD Challenge
            </button>
          </div>
        </div>

        {/* Dynamic Telemetrics */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 space-y-4 md:col-span-2">
          <h4 className="text-sm font-bold text-slate-350 uppercase tracking-widest flex items-center space-x-2">
            <Layers className="h-4.5 w-4.5 text-indigo-400" />
            <span>Problemset Database Metrics</span>
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-center text-xs">
            <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-900/80">
              <span className="text-slate-550 block font-semibold uppercase text-[9px]">Total Curriculums</span>
              <span className="text-lg font-bold text-slate-150 block mt-1">{problems.length} Problems</span>
            </div>
            <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-900/80">
              <span className="text-slate-550 block font-semibold uppercase text-[9px]">Easy Problems</span>
              <span className="text-lg font-bold text-slate-150 block mt-1">{problems.filter(p => p.difficulty === 'Easy').length}</span>
            </div>
            <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-900/80">
              <span className="text-slate-550 block font-semibold uppercase text-[9px]">Medium Problems</span>
              <span className="text-lg font-bold text-slate-150 block mt-1">{problems.filter(p => p.difficulty === 'Medium').length}</span>
            </div>
            <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-900/80">
              <span className="text-slate-550 block font-semibold uppercase text-[9px]">Hard Problems</span>
              <span className="text-lg font-bold text-slate-150 block mt-1">{problems.filter(p => p.difficulty === 'Hard').length}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Database CRUD controller actions */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-200">Catalog Registry List</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-550 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition select-none cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Custom Challenge</span>
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleCreateProblem} className="bg-slate-950/60 p-6 rounded-2xl border border-slate-850 space-y-4 text-xs font-sans">
            <h4 className="font-bold text-sm text-indigo-400 mb-2 uppercase tracking-wide">Register New Coding Problem</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 font-semibold uppercase text-[9px] mb-1.5">Challenge ID (unique, e.g., 'fizz-buzz')</label>
                <input
                  type="text"
                  required
                  value={probId}
                  onChange={(e) => setProbId(e.target.value)}
                  placeholder="fizz-buzz"
                  className="w-full bg-slate-905 border border-slate-800 px-3.5 py-3 text-xs text-slate-200 outline-none rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold uppercase text-[9px] mb-1.5">Problem Display Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Fizz Buzz Classic"
                  className="w-full bg-slate-905 border border-slate-800 px-3.5 py-3 text-xs text-slate-200 outline-none rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-500 font-semibold uppercase text-[9px] mb-1.5">Experience Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 px-3.5 py-3 rounded-xl text-slate-350"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold uppercase text-[9px] mb-1.5">Difficulty Tier</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 px-3.5 py-3 rounded-xl text-slate-350"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold uppercase text-[9px] mb-1.5">Category Tree</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 px-3.5 py-3 rounded-xl text-slate-350"
                >
                  <option value="Programming Basics">Programming Basics</option>
                  <option value="Data Structures">Data Structures</option>
                  <option value="Algorithms">Algorithms</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold uppercase text-[9px] mb-1.5">Topic Tag</label>
                <input
                  type="text"
                  required
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Arrays"
                  className="w-full bg-slate-905 border border-slate-805 px-3.5 py-3 text-xs text-slate-200 outline-none rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold uppercase text-[9px] mb-1.5">Markdown Description Body</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give details about problem, patterns, etc..."
                className="w-full bg-slate-950 border border-slate-800 p-4 text-xs text-slate-200 outline-none rounded-xl font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 font-semibold uppercase text-[9px] mb-1.5">Constraints (newline separated)</label>
                <textarea
                  rows={2}
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold uppercase text-[9px] mb-1.5">Automated Tests (Syntax 'input: expected', newline sep)</label>
                <textarea
                  rows={2}
                  value={tests}
                  onChange={(e) => setTests(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-xs text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold uppercase text-[9px] mb-1.5">JavaScript Boilerplate Starter Code</label>
              <textarea
                rows={3}
                value={boilerplate}
                onChange={(e) => setBoilerplate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-xs text-slate-200 resize-none"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2 justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl hover:text-slate-200 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-550 text-white rounded-xl font-bold shadow shadow-emerald-500/10"
              >
                Save Coding Challenge
              </button>
            </div>
          </form>
        )}

        {/* Existing problem definitions listing */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Registered Active Challenges ({problems.length})</span>
          {problems.map(prob => (
            <div key={prob.id} className="p-4 bg-slate-950/45 border border-slate-850 rounded-xl flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-205 text-sm">{prob.title}</h4>
                <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                  <span>ID: {prob.id}</span>
                  <span>•</span>
                  <span>{prob.tag}</span>
                  <span>•</span>
                  <span className={`${
                    prob.difficulty === 'Easy' ? 'text-emerald-450' : prob.difficulty === 'Medium' ? 'text-amber-450' : 'text-rose-455'
                  }`}>{prob.difficulty}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDeleteProblem(prob.id)}
                  className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-xl transition cursor-pointer select-none"
                  title="Remove permanently from DB"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
      
    </div>
  );
}
