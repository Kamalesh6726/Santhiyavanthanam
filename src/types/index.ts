export type SessionType = 'pratah' | 'madhyahnika' | 'sayam';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  currentStreak: number;
  bestStreak: number;
  totalSessions: number;
}

export interface Session {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  type: SessionType;
  completed: boolean;
  completedAt?: string; // ISO string
}

export interface Challenge {
  id: string;
  name: string;
  creatorId: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: 'active' | 'completed' | 'upcoming';
  inviteCode: string;
}

export interface ChallengeMember {
  challengeId: string;
  userId: string;
  completionCount: number;
  streak: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface Friend {
  id: string;
  uid: string;
  name: string;
  username: string;
  avatar?: string;
  currentStreak: number;
  weeklyCompletion: number; // out of 21
  todayCompleted?: number;
  challengeStatus?: string;
}

export interface Wisdom {
  id: string;
  title?: string;
  titleTamil?: string;
  content?: string;
  contentTamil?: string;
  category: string;
  author?: string;
  tradition?: string;
  sourceName?: string;
  sourceUrl?: string;
  language?: string;
  isPublished: boolean;
  isFeatured?: boolean;
  createdAt?: any;
  updatedAt?: any;
  displayOrder?: number;
}

export interface Mantra {
  id: string;
  title: string;
  titleTamil?: string;
  originalText: string;
  transliteration?: string;
  meaning?: string;
  meaningTamil?: string;
  tradition?: string;
  sourceName?: string;
  sourceUrl?: string;
  isPublished: boolean;
  createdAt?: any;
  updatedAt?: any;
}
