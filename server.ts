import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  readDb,
  writeDb,
  getOrCreateUser,
  addXPAndCoins,
  runCode
} from './server/db';
import { initialProblems } from './server/initialProblems';
import { Problem, Submission } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsers
  app.use(express.json());

  // Initialize Gemini Client
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // API: Health probe
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API: Authentication - Register or Login unified endpoint
  app.post('/api/auth/login', (req, res) => {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required.' });
    }
    const user = getOrCreateUser(email, name);
    res.json({ user });
  });

  // API: Get Current User Active Profile
  app.get('/api/auth/me', (req, res) => {
    const email = req.headers['x-user-email'] as string;
    if (!email) {
      return res.status(401).json({ error: 'Missing x-user-email header identification.' });
    }
    const user = getOrCreateUser(email, '');
    res.json({ user });
  });

  // API: Onboarding Save Preferences
  app.post('/api/auth/onboard', (req, res) => {
    const email = req.headers['x-user-email'] as string;
    if (!email) {
      return res.status(401).json({ error: 'Must be verified to configure onboarding goals.' });
    }
    const { experienceLevel, preferredLanguages, goals } = req.body;

    const db = readDb();
    const user = db.users[email];
    if (!user) {
      return res.status(404).json({ error: 'User slot not found.' });
    }

    user.experienceLevel = experienceLevel;
    user.preferredLanguages = preferredLanguages;
    user.goals = goals;
    user.onboarded = true;

    // Award +20 onboarding bonus coins
    user.stats.coins += 20;

    db.users[email] = user;
    writeDb(db);

    res.json({ success: true, user });
  });

  // API: Load Dashboard Telemetry
  app.get('/api/dashboard', (req, res) => {
    const email = req.headers['x-user-email'] as string;
    if (!email) {
      return res.status(401).json({ error: 'Identification required.' });
    }
    const user = getOrCreateUser(email, '');
    const db = readDb();

    // Grab Problem of the Day
    const potdId = db.potd?.problemId || 'two-sum';
    const potdProblem = db.problems.find(p => p.id === potdId) || db.problems[0];

    // Filter recommended questions (not solved, fits current skill tag or language)
    const userLevel = user.experienceLevel || 'Beginner';
    const solvedIds = user.stats.problemsSolved || [];
    
    const recommended = db.problems
      .filter(p => !solvedIds.includes(p.id) && (p.level === userLevel))
      .slice(0, 3);

    // Fallback if none left for current level
    if (recommended.length === 0) {
      recommended.push(...db.problems.filter(p => !solvedIds.includes(p.id)).slice(0, 3));
    }

    res.json({
      stats: user.stats,
      achievements: user.achievements,
      recommended,
      potd: db.potd,
      potdProblem
    });
  });

  // API: Retrieve Catalog of Problems
  app.get('/api/problems', (req, res) => {
    const db = readDb();
    res.json({ problems: db.problems });
  });

  // API: Retrieve specific Problem Details
  app.get('/api/problems/:id', (req, res) => {
    const db = readDb();
    const problem = db.problems.find(p => p.id === req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Coding Challenge not found in db.' });
    }
    res.json({ problem });
  });

  // API: Live Sandbox Run Code against sample tests
  app.post('/api/problems/:id/run', async (req, res) => {
    const { language, code, customInput } = req.body;
    try {
      const result = await runCode(req.params.id, language, code, customInput);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Execution sandboxing failed.' });
    }
  });

  // API: Push Final Submission and score evaluation
  app.post('/api/problems/:id/submit', async (req, res) => {
    const email = req.headers['x-user-email'] as string;
    if (!email) {
      return res.status(401).json({ error: 'Authentication email pointer required.' });
    }

    const { language, code } = req.body;
    const db = readDb();
    const problem = db.problems.find(p => p.id === req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem definition is missing.' });
    }

    try {
      const execution = await runCode(req.params.id, language, code);
      const isAccepted = execution.success;

      let coinsEarned = 0;
      let xpEarned = 0;

      const user = db.users[email] || getOrCreateUser(email, '');
      const hasSolvedAlready = user.stats?.problemsSolved?.includes(problem.id);

      if (isAccepted && !hasSolvedAlready) {
        coinsEarned = problem.coinsReward;
        xpEarned = problem.xpReward;

        // Check if Problem of the Day completion
        if (db.potd?.problemId === problem.id) {
          const todayStr = new Date().toISOString().split('T')[0];
          if (db.potd?.date === todayStr) {
            coinsEarned *= 2; // POTD awards double rewards!
            xpEarned *= 2;
          }
        }

        // Add progress
        addXPAndCoins(email, xpEarned, coinsEarned, problem.id, problem.difficulty);
      }

      // Record Submission History in persistent collection
      const submission: Submission = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        userId: email,
        problemId: problem.id,
        problemTitle: problem.title,
        language,
        code,
        status: isAccepted ? 'Accepted' : (execution.error ? 'Runtime Error' : 'Wrong Answer'),
        errorMessage: execution.error,
        passedCount: execution.passedCount,
        totalCount: execution.totalCount,
        runtimeMs: Math.floor(Math.random() * 80) + 15, // simulated runtime benchmark
        memoryKb: Math.floor(Math.random() * 2000) + 14000, // simulated memory allocation benchmark
        submittedAt: new Date().toISOString(),
        xpEarned,
        coinsEarned
      };

      db.submissions.unshift(submission);
      writeDb(db);

      res.json({
        submission,
        execution
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Submission execution failed.' });
    }
  });

  // API: Get User Submission Logs
  app.get('/api/submissions', (req, res) => {
    const email = req.headers['x-user-email'] as string;
    if (!email) {
      return res.status(401).json({ error: 'Required authorization header.' });
    }
    const db = readDb();
    const userHistory = db.submissions.filter(s => s.userId === email);
    res.json({ submissions: userHistory });
  });

  // API: Fetch Leaderboard ranking index
  app.get('/api/leaderboard', (req, res) => {
    const db = readDb();
    const allUsers = Object.values(db.users);

    const entries = allUsers.map(user => {
      return {
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        level: user.stats.level,
        xp: user.stats.xp,
        coins: user.stats.coins,
        solvedCount: user.stats.problemsSolved.length,
        streak: user.stats.streak,
        rank: 1
      };
    });

    // Sort by Solve Count, then XP
    entries.sort((a, b) => {
      if (b.solvedCount !== a.solvedCount) {
        return b.solvedCount - a.solvedCount;
      }
      return b.xp - a.xp;
    });

    // Assign indexed rank positions
    entries.forEach((entry, idx) => {
      entry.rank = idx + 1;
    });

    res.json({ leaderboard: entries });
  });

  // API: Custom Shop Purchase unlockables (Avatar, Frames)
  app.post('/api/shop/purchase', (req, res) => {
    const email = req.headers['x-user-email'] as string;
    const { itemType, itemId, cost } = req.body;

    if (!email) {
      return res.status(401).json({ error: 'Auth context necessary.' });
    }

    const db = readDb();
    const user = db.users[email];
    if (!user) {
      return res.status(404).json({ error: 'User does not exist.' });
    }

    if (user.stats.coins < cost) {
      return res.status(400).json({ error: 'Insufficient coins in balance.' });
    }

    user.stats.coins -= cost;
    if (itemType === 'frame') {
      user.profileFrame = itemId;
    }

    db.users[email] = user;
    writeDb(db);

    res.json({ success: true, user });
  });

  // API: Get AI Smart Recommendations
  app.post('/api/ai/recommend', async (req, res) => {
    const email = req.headers['x-user-email'] as string;
    if (!email) {
      return res.status(401).json({ error: 'Unauthorized credentials.' });
    }

    if (!ai) {
      return res.json({
        recommended: [],
        reasoning: "AI services are sleeping. Connect your API key in the Secrets panel to activate automated recommendation engines!"
      });
    }

    const db = readDb();
    const user = db.users[email];
    if (!user) return res.status(404).json({ error: 'User slot invalid.' });

    const solvedList = db.problems.filter(p => user.stats.problemsSolved.includes(p.id));
    const pendingList = db.problems.filter(p => !user.stats.problemsSolved.includes(p.id));

    const prompt = `You are CodeQuest's Personal AI Learning Advisor. 
The user is at experience level: "${user.experienceLevel}".
Preferred Languages: ${JSON.stringify(user.preferredLanguages)}.
Career/Learning Goals: ${JSON.stringify(user.goals)}.
Solved Problems: ${JSON.stringify(solvedList.map(s => ({ title: s.title, tag: s.tag, difficulty: s.difficulty })))}.
Pending Available Problems: ${JSON.stringify(pendingList.map(s => ({ id: s.id, title: s.title, tag: s.tag, level: s.level, difficulty: s.difficulty })))}.

Recommend the absolute best 2 problems from the Pending list to solve next to build their optimal engineering skill tree.
Return your recommendation as a JSON block with this schema:
{
  "recommendations": [
    {
      "problemId": "matching pending problem id",
      "reason": "Clear explanation of why this specific tag/difficulty helps them progress based on career goals."
    }
  ]
}
DO NOT output anything except the clean JSON string.`;

    try {
      const resp = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = JSON.parse(resp.text?.trim() || '{}');
      res.json(parsed);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API: AI Code Hint Generator
  app.post('/api/ai/hint', async (req, res) => {
    const { problemId, code, language, hintCount } = req.body;
    if (!ai) {
      return res.json({
        hint: "💡 Recommended tip: Think about the optimal space complexity and try drawing a trace map of variables manually. (API key not configured)"
      });
    }

    const db = readDb();
    const problem = db.problems.find(p => p.id === problemId);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    const prompt = `You are a helpful coding tutor at LeetCode's elite campus.
The user is solving the problem: "${problem.title}"
Problem Description: ${problem.description}
Constraints: ${JSON.stringify(problem.constraints)}
Language selected: ${language}
Their current code:
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

The user requested Hint #${hintCount || 1} out of 3.
Give them a clear, professional, supportive hint that points them in the right direction (such as identifying edge cases, code structural improvements, or lookup indexes) WITHOUT giving them the actual code solution! We want them to learn. Keep it under 150 words.`;

    try {
      const resp = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });
      res.json({ hint: resp.text });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API: AI Code Review and Complexity Analysis
  app.post('/api/ai/review', async (req, res) => {
    const { problemId, code, language } = req.body;
    if (!ai) {
      return res.json({
        review: "### Code Review\n\n- **Time Complexity**: Optimal (Simulated)\n- **Space Complexity**: Minimal (Simulated)\n\nAdd your Gemini API key inside AI Studio Settings to unlock deep code reviews & exact complexity analyses!"
      });
    }

    const db = readDb();
    const problem = db.problems.find(p => p.id === problemId);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    const prompt = `You are CodeQuest's Lead Enterprise Code Quality Auditor and Complexity Analyst.
Review the following user solution for the problem: "${problem.title}"
Language: ${language}
Source Code:
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Perform an elite complexity & review audit. Your response must state:
1. Expected Time Complexity (e.g. O(N log N)) with short proof explanation.
2. Expected Space Complexity (e.g. O(N)) with short proof explanation.
3. Logical strengths and specific areas of architectural improvement (like variable names, modularity, or overflow risks).
4. Bug vulnerabilities or missing edge cases (e.g. empty inputs, division by zero).

Return your audited response in beautiful Markdown. Make it professional and premium. Limit it to 300 words.`;

    try {
      const resp = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });
      res.json({ review: resp.text });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API: Admin controls (Create / Edit Problems)
  app.post('/api/admin/problems', (req, res) => {
    const email = req.headers['x-user-email'] as string;
    if (!email || email.toLowerCase() !== 'mamtachoudhary072703@gmail.com') {
      return res.status(403).json({ error: 'Unauthorized access. Admins only.' });
    }

    const { problem }: { problem: Problem } = req.body;
    if (!problem || !problem.id || !problem.title) {
      return res.status(400).json({ error: 'Invalid problem details.' });
    }

    const db = readDb();
    if (db.problems.some(p => p.id === problem.id)) {
      return res.status(400).json({ error: 'Challenge ID already exists in the catalog.' });
    }

    db.problems.push(problem);
    writeDb(db);
    res.json({ success: true, problems: db.problems });
  });

  app.put('/api/admin/problems/:id', (req, res) => {
    const email = req.headers['x-user-email'] as string;
    if (!email || email.toLowerCase() !== 'mamtachoudhary072703@gmail.com') {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    const problemData: Partial<Problem> = req.body.problem;
    const db = readDb();
    const index = db.problems.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Problem definition is missing.' });
    }

    db.problems[index] = { ...db.problems[index], ...problemData };
    writeDb(db);
    res.json({ success: true, problem: db.problems[index] });
  });

  app.delete('/api/admin/problems/:id', (req, res) => {
    const email = req.headers['x-user-email'] as string;
    if (!email || email.toLowerCase() !== 'mamtachoudhary072703@gmail.com') {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    const db = readDb();
    db.problems = db.problems.filter(p => p.id !== req.params.id);
    writeDb(db);
    res.json({ success: true, problems: db.problems });
  });

  app.post('/api/admin/potd', (req, res) => {
    const email = req.headers['x-user-email'] as string;
    if (!email || email.toLowerCase() !== 'mamtachoudhary072703@gmail.com') {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    const { problemId } = req.body;
    const db = readDb();
    db.potd = {
      problemId,
      date: new Date().toISOString().split('T')[0]
    };
    writeDb(db);
    res.json({ success: true, potd: db.potd });
  });

  // Serve static assets / integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CodeQuest server booted on port ${PORT}`);
  });
}

startServer();
