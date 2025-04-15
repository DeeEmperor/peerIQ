export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  availability?: string;
  studyStyle?: string;
  firebaseId?: string;
}

export interface StudyGroup {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  leadId: number;
  createdAt: string;
  democratizedApproval: boolean;
}

export interface GroupMember {
  id: number;
  groupId: number;
  userId: number;
  joinedAt: string;
  role: string;
}

export interface JoinRequest {
  id: number;
  groupId: number;
  userId: number;
  requestedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Course {
  id: number;
  groupId: number;
  name: string;
  description?: string;
  createdAt: string;
}

export interface FlashcardDeck {
  id: number;
  courseId: number;
  name: string;
  description?: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  cardCount?: number; // Derived property
}

export interface Flashcard {
  id: number;
  deckId: number;
  question: string;
  answer: string;
  tags?: string[];
  category?: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface Test {
  id: number;
  courseId: number;
  name: string;
  description?: string;
  testDate: string;
  testType: 'multiple-choice' | 'short-answer' | 'essay';
  questionCount: number;
  createdBy: number;
  createdAt: string;
}

export interface TestResult {
  id: number;
  testId: number;
  userId: number;
  score: number;
  answers?: Record<string, any>;
  completedAt: string;
}

export interface UserStat {
  id: number;
  userId: number;
  groupId: number;
  testScores: number;
  attendance: number;
  flashcardContributions: number;
  totalPoints: number;
  lastUpdated: string;
  testsCompleted?: number;
  user?: {
    id: number;
    username: string;
    name: string;
    avatar?: string;
  };
}

export interface Notification {
  id: number;
  userId: number;
  type: 'test_reminder' | 'new_content' | 'session_start';
  content: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationSetting {
  id: number;
  userId: number;
  testReminders: boolean;
  newContent: boolean;
  sessionReminders: boolean;
  emailNotifications: boolean;
}

export interface StatOverview {
  weeklyTime: string;
  testsCompleted: number;
  flashcardsCreated: number;
  activeGroups: number;
}

export interface GroupWithProgress extends StudyGroup {
  memberCount: number;
  meetingTime?: string;
  role: 'Group Lead' | 'Member';
  nextTest?: {
    daysUntil: number;
    readiness: number;
  };
}
