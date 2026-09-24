/**
 * CodeQuest Shared TypeScript Interfaces and Types
 */

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type Language = 'C' | 'C++' | 'Java' | 'Python' | 'JavaScript' | 'C#' | 'Go' | 'Rust';

export type Goal = 'Learn Programming' | 'Crack Coding Interviews' | 'Competitive Programming' | 'College Preparation' | 'Placement Preparation';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface TestCase {
  input: string;
  expected: string;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  level: ExperienceLevel;
  difficulty: Difficulty;
  category: 'Programming Basics' | 'Data Structures' | 'Algorithms';
  tag: string; // e.g., 'Arrays', 'Recursion', 'Loops'
  description: string; // Markdown formatted
  constraints: string[];
  examples: ProblemExample[];
  boilerplate: Record<string, string>; // Language -> Starter Code
  tests: TestCase[];
  coinsReward: number;
  xpReward: number;
  hints: string[];
  editorial: string;
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  problemTitle: string;
  language: string;
  code: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  errorMessage?: string;
  passedCount: number;
  totalCount: number;
  runtimeMs: number;
  memoryKb: number;
  submittedAt: string;
  xpEarned: number;
  coinsEarned: number;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  streak: number;
  lastSolveDate?: string;
  problemsSolved: string[]; // Problem IDs
  topicCompletion: Record<string, number>; // Topic tag -> completion percentage
  difficultyDistribution: Record<Difficulty, number>; // Difficulty -> Count
  weeklyProgress: { day: string; solved: number; date: string }[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badge: string; // Icon name
  category: string; // e.g. "Milestone", "Streak", "Specialty"
  unlockedAt?: string;
}

export interface UserProfile {
  email: string;
  name: string;
  avatarUrl: string;
  profileFrame?: string; // e.g., "glowing-gold", "neon-matrix"
  experienceLevel?: ExperienceLevel;
  preferredLanguages?: Language[];
  goals?: Goal[];
  onboarded: boolean;
  isAdmin: boolean;
  stats: UserStats;
  achievements: Achievement[];
}

export interface LeaderboardEntry {
  email: string;
  name: string;
  avatarUrl: string;
  level: number;
  xp: number;
  coins: number;
  solvedCount: number;
  streak: number;
  rank: number;
}

export interface POTDState {
  problemId: string;
  date: string;
  completed: boolean;
  streakMaintained: boolean;
}
