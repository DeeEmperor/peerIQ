import { 
  User, InsertUser, 
  StudyGroup, InsertStudyGroup, 
  GroupMember, InsertGroupMember,
  JoinRequest, InsertJoinRequest,
  Course, InsertCourse,
  FlashcardDeck, InsertFlashcardDeck,
  Flashcard, InsertFlashcard,
  Test, InsertTest,
  TestResult, InsertTestResult,
  UserStat, InsertUserStat,
  Notification, InsertNotification,
  NotificationSetting, InsertNotificationSetting
} from '@shared/schema';
import { firestore } from './firebase';

import { db } from "./db";
import { eq, and, or, desc, gt } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";
import { 
  users, studyGroups, groupMembers, joinRequests, courses, 
  flashcardDecks, flashcards, tests, testResults, userStats, 
  notifications, notificationSettings 
} from "@shared/schema";
import type { 
  User, InsertUser, StudyGroup, InsertStudyGroup, 
  GroupMember, InsertGroupMember, JoinRequest, InsertJoinRequest, 
  Course, InsertCourse, FlashcardDeck, InsertFlashcardDeck, 
  Flashcard, InsertFlashcard, Test, InsertTest, 
  TestResult, InsertTestResult, UserStat, 
  Notification, InsertNotification, NotificationSetting 
} from "@shared/schema";

export interface IStorage {
  // Session store
  sessionStore: session.Store;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByFirebaseId(firebaseId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;

  // Study Group operations
  createStudyGroup(group: InsertStudyGroup): Promise<StudyGroup>;
  getStudyGroup(id: number): Promise<StudyGroup | undefined>;
  getStudyGroupsByUser(userId: number): Promise<StudyGroup[]>;
  updateStudyGroup(id: number, group: Partial<StudyGroup>): Promise<StudyGroup>;
  deleteStudyGroup(id: number): Promise<boolean>;

  // Group Member operations
  addMemberToGroup(member: InsertGroupMember): Promise<GroupMember>;
  getGroupMembers(groupId: number): Promise<GroupMember[]>;
  removeMemberFromGroup(groupId: number, userId: number): Promise<boolean>;
  updateMemberRole(groupId: number, userId: number, role: string): Promise<GroupMember>;

  // Join Request operations
  createJoinRequest(request: InsertJoinRequest): Promise<JoinRequest>;
  getJoinRequests(groupId: number): Promise<JoinRequest[]>;
  getJoinRequestsByUser(userId: number): Promise<JoinRequest[]>;
  updateJoinRequestStatus(requestId: number, status: string): Promise<JoinRequest>;

  // Course operations
  createCourse(course: InsertCourse): Promise<Course>;
  getCoursesByGroup(groupId: number): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  updateCourse(id: number, course: Partial<Course>): Promise<Course>;
  deleteCourse(id: number): Promise<boolean>;

  // Flashcard Deck operations
  createFlashcardDeck(deck: InsertFlashcardDeck): Promise<FlashcardDeck>;
  getFlashcardDecksByCourse(courseId: number): Promise<FlashcardDeck[]>;
  getFlashcardDecksByUser(userId: number): Promise<FlashcardDeck[]>;
  getFlashcardDeck(id: number): Promise<FlashcardDeck | undefined>;
  updateFlashcardDeck(id: number, deck: Partial<FlashcardDeck>): Promise<FlashcardDeck>;
  deleteFlashcardDeck(id: number): Promise<boolean>;

  // Flashcard operations
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;
  getFlashcardsByDeck(deckId: number): Promise<Flashcard[]>;
  getFlashcard(id: number): Promise<Flashcard | undefined>;
  updateFlashcard(id: number, flashcard: Partial<Flashcard>): Promise<Flashcard>;
  deleteFlashcard(id: number): Promise<boolean>;

  // Test operations
  createTest(test: InsertTest): Promise<Test>;
  getTestsByCourse(courseId: number): Promise<Test[]>;
  getUpcomingTestsByUser(userId: number): Promise<Test[]>;
  getTest(id: number): Promise<Test | undefined>;
  updateTest(id: number, test: Partial<Test>): Promise<Test>;
  deleteTest(id: number): Promise<boolean>;

  // Test Result operations
  createTestResult(result: InsertTestResult): Promise<TestResult>;
  getTestResultsByTest(testId: number): Promise<TestResult[]>;
  getTestResultsByUser(userId: number): Promise<TestResult[]>;
  getTestResult(id: number): Promise<TestResult | undefined>;

  // User Stats operations
  getUserStats(userId: number, groupId: number): Promise<UserStat | undefined>;
  updateUserStats(userId: number, groupId: number, stats: Partial<UserStat>): Promise<UserStat>;
  getLeaderboard(groupId: number, limit?: number): Promise<UserStat[]>;

  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<boolean>;
  deleteNotification(id: number): Promise<boolean>;

  // Notification Settings operations
  getNotificationSettings(userId: number): Promise<NotificationSetting | undefined>;
  updateNotificationSettings(userId: number, settings: Partial<NotificationSetting>): Promise<NotificationSetting>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private studyGroups: Map<number, StudyGroup>;
  private groupMembers: Map<number, GroupMember>;
  private joinRequests: Map<number, JoinRequest>;
  private courses: Map<number, Course>;
  private flashcardDecks: Map<number, FlashcardDeck>;
  private flashcards: Map<number, Flashcard>;
  private tests: Map<number, Test>;
  private testResults: Map<number, TestResult>;
  private userStats: Map<number, UserStat>;
  private notifications: Map<number, Notification>;
  private notificationSettings: Map<number, NotificationSetting>;
  private currentId: {
    user: number;
    studyGroup: number;
    groupMember: number;
    joinRequest: number;
    course: number;
    flashcardDeck: number;
    flashcard: number;
    test: number;
    testResult: number;
    userStat: number;
    notification: number;
    notificationSetting: number;
  };

  constructor() {
    this.users = new Map();
    this.studyGroups = new Map();
    this.groupMembers = new Map();
    this.joinRequests = new Map();
    this.courses = new Map();
    this.flashcardDecks = new Map();
    this.flashcards = new Map();
    this.tests = new Map();
    this.testResults = new Map();
    this.userStats = new Map();
    this.notifications = new Map();
    this.notificationSettings = new Map();
    this.currentId = {
      user: 1,
      studyGroup: 1,
      groupMember: 1,
      joinRequest: 1,
      course: 1,
      flashcardDeck: 1,
      flashcard: 1,
      test: 1,
      testResult: 1,
      userStat: 1,
      notification: 1,
      notificationSetting: 1,
    };
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByFirebaseId(firebaseId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.firebaseId === firebaseId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.user++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error(`User with id ${id} not found`);
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Study Group operations
  async createStudyGroup(group: InsertStudyGroup): Promise<StudyGroup> {
    const id = this.currentId.studyGroup++;
    const now = new Date();
    const studyGroup: StudyGroup = { ...group, id, createdAt: now };
    this.studyGroups.set(id, studyGroup);
    return studyGroup;
  }

  async getStudyGroup(id: number): Promise<StudyGroup | undefined> {
    return this.studyGroups.get(id);
  }

  async getStudyGroupsByUser(userId: number): Promise<StudyGroup[]> {
    const memberGroups = Array.from(this.groupMembers.values())
      .filter(member => member.userId === userId)
      .map(member => member.groupId);
    
    return Array.from(this.studyGroups.values())
      .filter(group => memberGroups.includes(group.id) || group.leadId === userId);
  }

  async updateStudyGroup(id: number, groupData: Partial<StudyGroup>): Promise<StudyGroup> {
    const group = this.studyGroups.get(id);
    if (!group) throw new Error(`Study Group with id ${id} not found`);
    
    const updatedGroup = { ...group, ...groupData };
    this.studyGroups.set(id, updatedGroup);
    return updatedGroup;
  }

  async deleteStudyGroup(id: number): Promise<boolean> {
    return this.studyGroups.delete(id);
  }

  // Group Member operations
  async addMemberToGroup(member: InsertGroupMember): Promise<GroupMember> {
    const id = this.currentId.groupMember++;
    const now = new Date();
    const groupMember: GroupMember = { ...member, id, joinedAt: now };
    this.groupMembers.set(id, groupMember);
    return groupMember;
  }

  async getGroupMembers(groupId: number): Promise<GroupMember[]> {
    return Array.from(this.groupMembers.values())
      .filter(member => member.groupId === groupId);
  }

  async removeMemberFromGroup(groupId: number, userId: number): Promise<boolean> {
    const memberToRemove = Array.from(this.groupMembers.values())
      .find(member => member.groupId === groupId && member.userId === userId);
    
    if (!memberToRemove) return false;
    return this.groupMembers.delete(memberToRemove.id);
  }

  async updateMemberRole(groupId: number, userId: number, role: string): Promise<GroupMember> {
    const member = Array.from(this.groupMembers.values())
      .find(m => m.groupId === groupId && m.userId === userId);
    
    if (!member) throw new Error(`Member not found in group ${groupId}`);
    
    const updatedMember = { ...member, role };
    this.groupMembers.set(member.id, updatedMember);
    return updatedMember;
  }

  // Join Request operations
  async createJoinRequest(request: InsertJoinRequest): Promise<JoinRequest> {
    const id = this.currentId.joinRequest++;
    const now = new Date();
    const joinRequest: JoinRequest = { ...request, id, requestedAt: now, status: 'pending' };
    this.joinRequests.set(id, joinRequest);
    return joinRequest;
  }

  async getJoinRequests(groupId: number): Promise<JoinRequest[]> {
    return Array.from(this.joinRequests.values())
      .filter(request => request.groupId === groupId);
  }

  async getJoinRequestsByUser(userId: number): Promise<JoinRequest[]> {
    return Array.from(this.joinRequests.values())
      .filter(request => request.userId === userId);
  }

  async updateJoinRequestStatus(requestId: number, status: string): Promise<JoinRequest> {
    const request = this.joinRequests.get(requestId);
    if (!request) throw new Error(`Join Request with id ${requestId} not found`);
    
    const updatedRequest = { ...request, status };
    this.joinRequests.set(requestId, updatedRequest);
    return updatedRequest;
  }

  // Course operations
  async createCourse(course: InsertCourse): Promise<Course> {
    const id = this.currentId.course++;
    const now = new Date();
    const newCourse: Course = { ...course, id, createdAt: now };
    this.courses.set(id, newCourse);
    return newCourse;
  }

  async getCoursesByGroup(groupId: number): Promise<Course[]> {
    return Array.from(this.courses.values())
      .filter(course => course.groupId === groupId);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async updateCourse(id: number, courseData: Partial<Course>): Promise<Course> {
    const course = this.courses.get(id);
    if (!course) throw new Error(`Course with id ${id} not found`);
    
    const updatedCourse = { ...course, ...courseData };
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<boolean> {
    return this.courses.delete(id);
  }

  // Flashcard Deck operations
  async createFlashcardDeck(deck: InsertFlashcardDeck): Promise<FlashcardDeck> {
    const id = this.currentId.flashcardDeck++;
    const now = new Date();
    const flashcardDeck: FlashcardDeck = { 
      ...deck, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.flashcardDecks.set(id, flashcardDeck);
    return flashcardDeck;
  }

  async getFlashcardDecksByCourse(courseId: number): Promise<FlashcardDeck[]> {
    return Array.from(this.flashcardDecks.values())
      .filter(deck => deck.courseId === courseId);
  }

  async getFlashcardDecksByUser(userId: number): Promise<FlashcardDeck[]> {
    return Array.from(this.flashcardDecks.values())
      .filter(deck => deck.createdBy === userId);
  }

  async getFlashcardDeck(id: number): Promise<FlashcardDeck | undefined> {
    return this.flashcardDecks.get(id);
  }

  async updateFlashcardDeck(id: number, deckData: Partial<FlashcardDeck>): Promise<FlashcardDeck> {
    const deck = this.flashcardDecks.get(id);
    if (!deck) throw new Error(`Flashcard Deck with id ${id} not found`);
    
    const updatedDeck = { 
      ...deck, 
      ...deckData,
      updatedAt: new Date()
    };
    this.flashcardDecks.set(id, updatedDeck);
    return updatedDeck;
  }

  async deleteFlashcardDeck(id: number): Promise<boolean> {
    return this.flashcardDecks.delete(id);
  }

  // Flashcard operations
  async createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard> {
    const id = this.currentId.flashcard++;
    const now = new Date();
    const newFlashcard: Flashcard = { 
      ...flashcard, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.flashcards.set(id, newFlashcard);
    return newFlashcard;
  }

  async getFlashcardsByDeck(deckId: number): Promise<Flashcard[]> {
    return Array.from(this.flashcards.values())
      .filter(card => card.deckId === deckId);
  }

  async getFlashcard(id: number): Promise<Flashcard | undefined> {
    return this.flashcards.get(id);
  }

  async updateFlashcard(id: number, cardData: Partial<Flashcard>): Promise<Flashcard> {
    const flashcard = this.flashcards.get(id);
    if (!flashcard) throw new Error(`Flashcard with id ${id} not found`);
    
    const updatedFlashcard = { 
      ...flashcard, 
      ...cardData,
      updatedAt: new Date()
    };
    this.flashcards.set(id, updatedFlashcard);
    return updatedFlashcard;
  }

  async deleteFlashcard(id: number): Promise<boolean> {
    return this.flashcards.delete(id);
  }

  // Test operations
  async createTest(test: InsertTest): Promise<Test> {
    const id = this.currentId.test++;
    const now = new Date();
    const newTest: Test = { ...test, id, createdAt: now };
    this.tests.set(id, newTest);
    return newTest;
  }

  async getTestsByCourse(courseId: number): Promise<Test[]> {
    return Array.from(this.tests.values())
      .filter(test => test.courseId === courseId);
  }

  async getUpcomingTestsByUser(userId: number): Promise<Test[]> {
    // Get groups the user is a member of
    const userGroups = Array.from(this.groupMembers.values())
      .filter(member => member.userId === userId)
      .map(member => member.groupId);
    
    // Get courses in those groups
    const userCourses = Array.from(this.courses.values())
      .filter(course => userGroups.includes(course.groupId))
      .map(course => course.id);
    
    // Get upcoming tests for those courses
    const now = new Date();
    return Array.from(this.tests.values())
      .filter(test => 
        userCourses.includes(test.courseId) && 
        new Date(test.testDate) > now
      )
      .sort((a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime());
  }

  async getTest(id: number): Promise<Test | undefined> {
    return this.tests.get(id);
  }

  async updateTest(id: number, testData: Partial<Test>): Promise<Test> {
    const test = this.tests.get(id);
    if (!test) throw new Error(`Test with id ${id} not found`);
    
    const updatedTest = { ...test, ...testData };
    this.tests.set(id, updatedTest);
    return updatedTest;
  }

  async deleteTest(id: number): Promise<boolean> {
    return this.tests.delete(id);
  }

  // Test Result operations
  async createTestResult(result: InsertTestResult): Promise<TestResult> {
    const id = this.currentId.testResult++;
    const now = new Date();
    const testResult: TestResult = { ...result, id, completedAt: now };
    this.testResults.set(id, testResult);
    return testResult;
  }

  async getTestResultsByTest(testId: number): Promise<TestResult[]> {
    return Array.from(this.testResults.values())
      .filter(result => result.testId === testId);
  }

  async getTestResultsByUser(userId: number): Promise<TestResult[]> {
    return Array.from(this.testResults.values())
      .filter(result => result.userId === userId);
  }

  async getTestResult(id: number): Promise<TestResult | undefined> {
    return this.testResults.get(id);
  }

  // User Stats operations
  async getUserStats(userId: number, groupId: number): Promise<UserStat | undefined> {
    return Array.from(this.userStats.values())
      .find(stat => stat.userId === userId && stat.groupId === groupId);
  }

  async updateUserStats(userId: number, groupId: number, statsData: Partial<UserStat>): Promise<UserStat> {
    let userStat = await this.getUserStats(userId, groupId);
    
    if (!userStat) {
      // Create new stats if they don't exist
      const id = this.currentId.userStat++;
      const now = new Date();
      userStat = {
        id,
        userId,
        groupId,
        testScores: 0,
        attendance: 0,
        flashcardContributions: 0,
        totalPoints: 0,
        lastUpdated: now
      };
    }
    
    const updatedStats = { 
      ...userStat, 
      ...statsData,
      lastUpdated: new Date(),
      // Recalculate total points if any component changed
      totalPoints: (statsData.testScores !== undefined ? statsData.testScores : userStat.testScores) +
                  (statsData.attendance !== undefined ? statsData.attendance : userStat.attendance) +
                  (statsData.flashcardContributions !== undefined ? statsData.flashcardContributions : userStat.flashcardContributions)
    };
    
    this.userStats.set(updatedStats.id, updatedStats);
    return updatedStats;
  }

  async getLeaderboard(groupId: number, limit: number = 10): Promise<UserStat[]> {
    return Array.from(this.userStats.values())
      .filter(stat => stat.groupId === groupId)
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, limit);
  }

  // Notification operations
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = this.currentId.notification++;
    const now = new Date();
    const newNotification: Notification = { 
      ...notification, 
      id, 
      read: false,
      createdAt: now
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    
    const updatedNotification = { ...notification, read: true };
    this.notifications.set(id, updatedNotification);
    return true;
  }

  async deleteNotification(id: number): Promise<boolean> {
    return this.notifications.delete(id);
  }

  // Notification Settings operations
  async getNotificationSettings(userId: number): Promise<NotificationSetting | undefined> {
    return Array.from(this.notificationSettings.values())
      .find(setting => setting.userId === userId);
  }

  async updateNotificationSettings(userId: number, settingsData: Partial<NotificationSetting>): Promise<NotificationSetting> {
    let settings = await this.getNotificationSettings(userId);
    
    if (!settings) {
      // Create default settings if they don't exist
      const id = this.currentId.notificationSetting++;
      settings = {
        id,
        userId,
        testReminders: true,
        newContent: true,
        sessionReminders: true,
        emailNotifications: true
      };
    }
    
    const updatedSettings = { ...settings, ...settingsData };
    this.notificationSettings.set(updatedSettings.id, updatedSettings);
    return updatedSettings;
  }
}

// Export an instance of the storage
import { db } from "./db";
import { eq, and, or, desc, gt } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";
import { users, studyGroups, groupMembers, joinRequests, courses, 
        flashcardDecks, flashcards, tests, testResults, userStats, 
        notifications, notificationSettings } from "@shared/schema";
import type { User, InsertUser, StudyGroup, InsertStudyGroup, 
              GroupMember, InsertGroupMember, JoinRequest, InsertJoinRequest, 
              Course, InsertCourse, FlashcardDeck, InsertFlashcardDeck, 
              Flashcard, InsertFlashcard, Test, InsertTest, 
              TestResult, InsertTestResult, UserStat, 
              Notification, InsertNotification, NotificationSetting } from "@shared/schema";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByFirebaseId(firebaseId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseId, firebaseId));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Study Group operations
  async createStudyGroup(groupData: InsertStudyGroup): Promise<StudyGroup> {
    const [group] = await db.insert(studyGroups).values(groupData).returning();
    return group;
  }

  async getStudyGroup(id: number): Promise<StudyGroup | undefined> {
    const [group] = await db.select().from(studyGroups).where(eq(studyGroups.id, id));
    return group;
  }

  async getStudyGroupsByUser(userId: number): Promise<StudyGroup[]> {
    const members = await db
      .select()
      .from(groupMembers)
      .where(eq(groupMembers.userId, userId));
    
    const groupIds = members.map(member => member.groupId);
    
    if (groupIds.length === 0) return [];
    
    const groups = await db
      .select()
      .from(studyGroups)
      .where(
        groupIds.map(id => eq(studyGroups.id, id))
          .reduce((acc, condition) => acc ? or(acc, condition) : condition)
      );
    
    return groups;
  }

  async updateStudyGroup(id: number, groupData: Partial<StudyGroup>): Promise<StudyGroup> {
    const [group] = await db
      .update(studyGroups)
      .set(groupData)
      .where(eq(studyGroups.id, id))
      .returning();
    return group;
  }

  async deleteStudyGroup(id: number): Promise<boolean> {
    await db.delete(studyGroups).where(eq(studyGroups.id, id));
    return true;
  }

  // Group Member operations
  async addMemberToGroup(memberData: InsertGroupMember): Promise<GroupMember> {
    const [member] = await db.insert(groupMembers).values(memberData).returning();
    return member;
  }

  async getGroupMembers(groupId: number): Promise<GroupMember[]> {
    return await db.select().from(groupMembers).where(eq(groupMembers.groupId, groupId));
  }

  async removeMemberFromGroup(groupId: number, userId: number): Promise<boolean> {
    await db
      .delete(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.userId, userId)
        )
      );
    return true;
  }

  async updateMemberRole(groupId: number, userId: number, role: string): Promise<GroupMember> {
    const [member] = await db
      .update(groupMembers)
      .set({ role })
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.userId, userId)
        )
      )
      .returning();
    return member;
  }

  // Join Request operations
  async createJoinRequest(requestData: InsertJoinRequest): Promise<JoinRequest> {
    const [request] = await db.insert(joinRequests).values(requestData).returning();
    return request;
  }

  async getJoinRequests(groupId: number): Promise<JoinRequest[]> {
    return await db
      .select()
      .from(joinRequests)
      .where(eq(joinRequests.groupId, groupId));
  }

  async getJoinRequestsByUser(userId: number): Promise<JoinRequest[]> {
    return await db
      .select()
      .from(joinRequests)
      .where(eq(joinRequests.userId, userId));
  }

  async updateJoinRequestStatus(requestId: number, status: string): Promise<JoinRequest> {
    const [request] = await db
      .update(joinRequests)
      .set({ status })
      .where(eq(joinRequests.id, requestId))
      .returning();
    return request;
  }

  // Course operations
  async createCourse(courseData: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(courseData).returning();
    return course;
  }

  async getCoursesByGroup(groupId: number): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.groupId, groupId));
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async updateCourse(id: number, courseData: Partial<Course>): Promise<Course> {
    const [course] = await db
      .update(courses)
      .set(courseData)
      .where(eq(courses.id, id))
      .returning();
    return course;
  }

  async deleteCourse(id: number): Promise<boolean> {
    await db.delete(courses).where(eq(courses.id, id));
    return true;
  }

  // Flashcard Deck operations
  async createFlashcardDeck(deckData: InsertFlashcardDeck): Promise<FlashcardDeck> {
    const [deck] = await db.insert(flashcardDecks).values(deckData).returning();
    return deck;
  }

  async getFlashcardDecksByCourse(courseId: number): Promise<FlashcardDeck[]> {
    return await db
      .select()
      .from(flashcardDecks)
      .where(eq(flashcardDecks.courseId, courseId));
  }

  async getFlashcardDecksByUser(userId: number): Promise<FlashcardDeck[]> {
    return await db
      .select()
      .from(flashcardDecks)
      .where(eq(flashcardDecks.createdBy, userId));
  }

  async getFlashcardDeck(id: number): Promise<FlashcardDeck | undefined> {
    const [deck] = await db
      .select()
      .from(flashcardDecks)
      .where(eq(flashcardDecks.id, id));
    return deck;
  }

  async updateFlashcardDeck(id: number, deckData: Partial<FlashcardDeck>): Promise<FlashcardDeck> {
    const [deck] = await db
      .update(flashcardDecks)
      .set(deckData)
      .where(eq(flashcardDecks.id, id))
      .returning();
    return deck;
  }

  async deleteFlashcardDeck(id: number): Promise<boolean> {
    await db.delete(flashcardDecks).where(eq(flashcardDecks.id, id));
    return true;
  }

  // Flashcard operations
  async createFlashcard(cardData: InsertFlashcard): Promise<Flashcard> {
    const [card] = await db.insert(flashcards).values(cardData).returning();
    return card;
  }

  async getFlashcardsByDeck(deckId: number): Promise<Flashcard[]> {
    return await db
      .select()
      .from(flashcards)
      .where(eq(flashcards.deckId, deckId));
  }

  async getFlashcard(id: number): Promise<Flashcard | undefined> {
    const [card] = await db
      .select()
      .from(flashcards)
      .where(eq(flashcards.id, id));
    return card;
  }

  async updateFlashcard(id: number, cardData: Partial<Flashcard>): Promise<Flashcard> {
    const [card] = await db
      .update(flashcards)
      .set(cardData)
      .where(eq(flashcards.id, id))
      .returning();
    return card;
  }

  async deleteFlashcard(id: number): Promise<boolean> {
    await db.delete(flashcards).where(eq(flashcards.id, id));
    return true;
  }

  // Test operations
  async createTest(testData: InsertTest): Promise<Test> {
    const [test] = await db.insert(tests).values(testData).returning();
    return test;
  }

  async getTestsByCourse(courseId: number): Promise<Test[]> {
    return await db
      .select()
      .from(tests)
      .where(eq(tests.courseId, courseId));
  }

  async getUpcomingTestsByUser(userId: number): Promise<Test[]> {
    const now = new Date();
    // This is more complex as we need to join tables
    // Get all courses from groups the user is a member of
    const members = await db
      .select()
      .from(groupMembers)
      .where(eq(groupMembers.userId, userId));
    
    const groupIds = members.map(member => member.groupId);
    
    if (groupIds.length === 0) return [];
    
    const coursesList = await db
      .select()
      .from(courses)
      .where(
        groupIds.map(id => eq(courses.groupId, id))
          .reduce((acc, condition) => acc ? or(acc, condition) : condition)
      );
    
    const courseIds = coursesList.map(course => course.id);
    
    if (courseIds.length === 0) return [];
    
    return await db
      .select()
      .from(tests)
      .where(
        and(
          courseIds.map(id => eq(tests.courseId, id))
            .reduce((acc, condition) => acc ? or(acc, condition) : condition),
          gt(tests.testDate, now)
        )
      );
  }

  async getTest(id: number): Promise<Test | undefined> {
    const [test] = await db
      .select()
      .from(tests)
      .where(eq(tests.id, id));
    return test;
  }

  async updateTest(id: number, testData: Partial<Test>): Promise<Test> {
    const [test] = await db
      .update(tests)
      .set(testData)
      .where(eq(tests.id, id))
      .returning();
    return test;
  }

  async deleteTest(id: number): Promise<boolean> {
    await db.delete(tests).where(eq(tests.id, id));
    return true;
  }

  // Test Result operations
  async createTestResult(resultData: InsertTestResult): Promise<TestResult> {
    const [result] = await db.insert(testResults).values(resultData).returning();
    return result;
  }

  async getTestResultsByTest(testId: number): Promise<TestResult[]> {
    return await db
      .select()
      .from(testResults)
      .where(eq(testResults.testId, testId));
  }

  async getTestResultsByUser(userId: number): Promise<TestResult[]> {
    return await db
      .select()
      .from(testResults)
      .where(eq(testResults.userId, userId));
  }

  async getTestResult(id: number): Promise<TestResult | undefined> {
    const [result] = await db
      .select()
      .from(testResults)
      .where(eq(testResults.id, id));
    return result;
  }

  // User Stats operations
  async getUserStats(userId: number, groupId: number): Promise<UserStat | undefined> {
    const [stats] = await db
      .select()
      .from(userStats)
      .where(
        and(
          eq(userStats.userId, userId),
          eq(userStats.groupId, groupId)
        )
      );
    return stats;
  }

  async updateUserStats(userId: number, groupId: number, statsData: Partial<UserStat>): Promise<UserStat> {
    const existing = await this.getUserStats(userId, groupId);
    
    if (existing) {
      const [stats] = await db
        .update(userStats)
        .set({...statsData, lastUpdated: new Date()})
        .where(
          and(
            eq(userStats.userId, userId),
            eq(userStats.groupId, groupId)
          )
        )
        .returning();
      return stats;
    } else {
      const [stats] = await db
        .insert(userStats)
        .values({userId, groupId, ...statsData})
        .returning();
      return stats;
    }
  }

  async getLeaderboard(groupId: number, limit: number = 10): Promise<UserStat[]> {
    return await db
      .select()
      .from(userStats)
      .where(eq(userStats.groupId, groupId))
      .orderBy(desc(userStats.totalPoints))
      .limit(limit);
  }

  // Notification operations
  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(notificationData)
      .returning();
    return notification;
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    await db
      .update(notifications)
      .set({read: true})
      .where(eq(notifications.id, id));
    return true;
  }

  async deleteNotification(id: number): Promise<boolean> {
    await db.delete(notifications).where(eq(notifications.id, id));
    return true;
  }

  // Notification Settings operations
  async getNotificationSettings(userId: number): Promise<NotificationSetting | undefined> {
    const [settings] = await db
      .select()
      .from(notificationSettings)
      .where(eq(notificationSettings.userId, userId));
    return settings;
  }

  async updateNotificationSettings(userId: number, settingsData: Partial<NotificationSetting>): Promise<NotificationSetting> {
    const existing = await this.getNotificationSettings(userId);
    
    if (existing) {
      const [settings] = await db
        .update(notificationSettings)
        .set(settingsData)
        .where(eq(notificationSettings.userId, userId))
        .returning();
      return settings;
    } else {
      const [settings] = await db
        .insert(notificationSettings)
        .values({userId, ...settingsData})
        .returning();
      return settings;
    }
  }
}

export const storage = new DatabaseStorage();
