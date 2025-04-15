import { db } from "./db";
import { eq, and, or, desc, gt, inArray } from "drizzle-orm";
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
  TestResult, InsertTestResult, UserStat, InsertUserStat,
  Notification, InsertNotification, NotificationSetting, InsertNotificationSetting
} from "@shared/schema";

// PostgreSQL session store
const PostgresSessionStore = connectPg(session);

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
  //testsCompleted(userId: number, groupId: number, stats: Partial<UserStat>): Promise<UserStat>;

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
    const [user] = await db.select().from(users).where(eq(users.firebaseId, firebaseId as any));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    
    if (!updatedUser) {
      throw new Error(`User with id ${id} not found`);
    }
    
    return updatedUser;
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
    // Get groups where user is a member
    const memberGroupIds = await db
      .select({ groupId: groupMembers.groupId })
      .from(groupMembers)
      .where(eq(groupMembers.userId, userId));
    
    // Get groups where user is the lead
    const groups = await db
      .select()
      .from(studyGroups)
      .where(
        or(
          eq(studyGroups.leadId, userId),
          inArray(studyGroups.id, memberGroupIds.map(g => g.groupId))
        )
      );
    
    return groups;
  }

  async updateStudyGroup(id: number, groupData: Partial<StudyGroup>): Promise<StudyGroup> {
    const [updatedGroup] = await db
      .update(studyGroups)
      .set(groupData)
      .where(eq(studyGroups.id, id))
      .returning();
    
    if (!updatedGroup) {
      throw new Error(`Study Group with id ${id} not found`);
    }
    
    return updatedGroup;
  }

  async deleteStudyGroup(id: number): Promise<boolean> {
    const result = await db
      .delete(studyGroups)
      .where(eq(studyGroups.id, id))
      .returning({ id: studyGroups.id });
    
    return result.length > 0;
  }

  // Group Member operations
  async addMemberToGroup(memberData: InsertGroupMember): Promise<GroupMember> {
    const [member] = await db.insert(groupMembers).values(memberData).returning();
    return member;
  }

  async getGroupMembers(groupId: number): Promise<GroupMember[]> {
    const members = await db
      .select()
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));
    
    return members;
  }

  async removeMemberFromGroup(groupId: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.userId, userId)
        )
      )
      .returning({ id: groupMembers.id });
    
    return result.length > 0;
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
    
    if (!member) {
      throw new Error(`Member not found in group ${groupId}`);
    }
    
    return member;
  }

  // Join Request operations
  async createJoinRequest(requestData: InsertJoinRequest): Promise<JoinRequest> {
    const [request] = await db.insert(joinRequests).values(requestData).returning();
    return request;
  }

  async getJoinRequests(groupId: number): Promise<JoinRequest[]> {
    const requests = await db
      .select()
      .from(joinRequests)
      .where(eq(joinRequests.groupId, groupId));
    
    return requests;
  }

  async getJoinRequestsByUser(userId: number): Promise<JoinRequest[]> {
    const requests = await db
      .select()
      .from(joinRequests)
      .where(eq(joinRequests.userId, userId));
    
    return requests;
  }

  async updateJoinRequestStatus(requestId: number, status: string): Promise<JoinRequest> {
    const [updatedRequest] = await db
      .update(joinRequests)
      .set({ status })
      .where(eq(joinRequests.id, requestId))
      .returning();
    
    if (!updatedRequest) {
      throw new Error(`Join Request with id ${requestId} not found`);
    }
    
    return updatedRequest;
  }

  // Course operations
  async createCourse(courseData: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(courseData).returning();
    return course;
  }

  async getCoursesByGroup(groupId: number): Promise<Course[]> {
    const coursesList = await db
      .select()
      .from(courses)
      .where(eq(courses.groupId, groupId));
    
    return coursesList;
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async updateCourse(id: number, courseData: Partial<Course>): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set(courseData)
      .where(eq(courses.id, id))
      .returning();
    
    if (!updatedCourse) {
      throw new Error(`Course with id ${id} not found`);
    }
    
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<boolean> {
    const result = await db
      .delete(courses)
      .where(eq(courses.id, id))
      .returning({ id: courses.id });
    
    return result.length > 0;
  }

  // Flashcard Deck operations
  async createFlashcardDeck(deckData: InsertFlashcardDeck): Promise<FlashcardDeck> {
    const [deck] = await db.insert(flashcardDecks).values(deckData).returning();
    return deck;
  }

  async getFlashcardDecksByCourse(courseId: number): Promise<FlashcardDeck[]> {
    const decks = await db
      .select()
      .from(flashcardDecks)
      .where(eq(flashcardDecks.courseId, courseId));
    
    return decks;
  }

  async getFlashcardDecksByUser(userId: number): Promise<FlashcardDeck[]> {
    const decks = await db
      .select()
      .from(flashcardDecks)
      .where(eq(flashcardDecks.createdBy, userId));
    
    return decks;
  }

  async getFlashcardDeck(id: number): Promise<FlashcardDeck | undefined> {
    const [deck] = await db.select().from(flashcardDecks).where(eq(flashcardDecks.id, id));
    return deck;
  }

  async updateFlashcardDeck(id: number, deckData: Partial<FlashcardDeck>): Promise<FlashcardDeck> {
    // Add the updatedAt timestamp
    const dataWithTimestamp = {
      ...deckData,
      updatedAt: new Date()
    };
    
    const [updatedDeck] = await db
      .update(flashcardDecks)
      .set(dataWithTimestamp)
      .where(eq(flashcardDecks.id, id))
      .returning();
    
    if (!updatedDeck) {
      throw new Error(`Flashcard Deck with id ${id} not found`);
    }
    
    return updatedDeck;
  }

  async deleteFlashcardDeck(id: number): Promise<boolean> {
    const result = await db
      .delete(flashcardDecks)
      .where(eq(flashcardDecks.id, id))
      .returning({ id: flashcardDecks.id });
    
    return result.length > 0;
  }

  // Flashcard operations
  async createFlashcard(cardData: InsertFlashcard): Promise<Flashcard> {
    const [flashcard] = await db.insert(flashcards).values(cardData).returning();
    return flashcard;
  }

  async getFlashcardsByDeck(deckId: number): Promise<Flashcard[]> {
    const cards = await db
      .select()
      .from(flashcards)
      .where(eq(flashcards.deckId, deckId));
    
    return cards;
  }

  async getFlashcard(id: number): Promise<Flashcard | undefined> {
    const [flashcard] = await db.select().from(flashcards).where(eq(flashcards.id, id));
    return flashcard;
  }

  async updateFlashcard(id: number, cardData: Partial<Flashcard>): Promise<Flashcard> {
    // Add the updatedAt timestamp
    const dataWithTimestamp = {
      ...cardData,
      updatedAt: new Date()
    };
    
    const [updatedFlashcard] = await db
      .update(flashcards)
      .set(dataWithTimestamp)
      .where(eq(flashcards.id, id))
      .returning();
    
    if (!updatedFlashcard) {
      throw new Error(`Flashcard with id ${id} not found`);
    }
    
    return updatedFlashcard;
  }

  async deleteFlashcard(id: number): Promise<boolean> {
    const result = await db
      .delete(flashcards)
      .where(eq(flashcards.id, id))
      .returning({ id: flashcards.id });
    
    return result.length > 0;
  }

  // Test operations
  async createTest(testData: InsertTest): Promise<Test> {
    const [test] = await db.insert(tests).values(testData).returning();
    return test;
  }

  async getTestsByCourse(courseId: number): Promise<Test[]> {
    const testList = await db
      .select()
      .from(tests)
      .where(eq(tests.courseId, courseId));
    
    return testList;
  }

  async getUpcomingTestsByUser(userId: number): Promise<Test[]> {
    // First get groups the user is a member of
    const memberGroups = await db
      .select({ groupId: groupMembers.groupId })
      .from(groupMembers)
      .where(eq(groupMembers.userId, userId));
    
    // Get courses in those groups
    const groupCourses = await db
      .select({ courseId: courses.id })
      .from(courses)
      .where(inArray(courses.groupId, memberGroups.map(g => g.groupId)));
    
    // Get upcoming tests for those courses
    const now = new Date();
    const upcomingTests = await db
      .select()
      .from(tests)
      .where(
        and(
          inArray(tests.courseId, groupCourses.map(c => c.courseId)),
          gt(tests.testDate, now)
        )
      )
      .orderBy(tests.testDate);
    
    return upcomingTests;
  }

  async getTest(id: number): Promise<Test | undefined> {
    const [test] = await db.select().from(tests).where(eq(tests.id, id));
    return test;
  }

  async updateTest(id: number, testData: Partial<Test>): Promise<Test> {
    const [updatedTest] = await db
      .update(tests)
      .set(testData)
      .where(eq(tests.id, id))
      .returning();
    
    if (!updatedTest) {
      throw new Error(`Test with id ${id} not found`);
    }
    
    return updatedTest;
  }

  async deleteTest(id: number): Promise<boolean> {
    const result = await db
      .delete(tests)
      .where(eq(tests.id, id))
      .returning({ id: tests.id });
    
    return result.length > 0;
  }

  // Test Result operations
  async createTestResult(resultData: InsertTestResult): Promise<TestResult> {
    const [result] = await db.insert(testResults).values(resultData).returning();
    return result;
  }

  async getTestResultsByTest(testId: number): Promise<TestResult[]> {
    const results = await db
      .select()
      .from(testResults)
      .where(eq(testResults.testId, testId));
    
    return results;
  }

  async getTestResultsByUser(userId: number): Promise<TestResult[]> {
    const results = await db
      .select()
      .from(testResults)
      .where(eq(testResults.userId, userId));
    
    return results;
  }

  async getTestResult(id: number): Promise<TestResult | undefined> {
    const [result] = await db.select().from(testResults).where(eq(testResults.id, id));
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
    const validStatsData = statsData;
    // First check if stats exist
    const existingStats = await this.getUserStats(userId, groupId);
    
    if (existingStats) {
      // Update existing stats
      const updatedData = {
        ...statsData,
        lastUpdated: new Date()
      };
      
      const [updatedStats] = await db
        .update(userStats)
        .set(updatedData)
        .where(
          and(
            eq(userStats.userId, userId),
            eq(userStats.groupId, groupId)
          )
        )
        .returning();
      
      return updatedStats;
    } else {
      // Create new stats
      const defaultStats = {
        userId,
        groupId,
        testScores: 0,
        attendance: 0,
        flashcardContributions: 0,
        totalPoints: 0,
        lastUpdated: new Date()
      };
      
      // Merge with provided data
      const newStats = {
        ...defaultStats,
        ...statsData
      };
      
      const [createdStats] = await db
        .insert(userStats)
        .values(newStats)
        .returning();
      
      return createdStats;
    }
  }

  async getLeaderboard(groupId: number, limit: number = 10): Promise<UserStat[]> {
    const leaderboard = await db
      .select()
      .from(userStats)
      .where(eq(userStats.groupId, groupId))
      .orderBy(desc(userStats.totalPoints))
      .limit(limit);
    
    return leaderboard;
  }

  // Notification operations
  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(notificationData).returning();
    return notification;
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
    
    return userNotifications;
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const result = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning({ id: notifications.id });
    
    return result.length > 0;
  }

  async deleteNotification(id: number): Promise<boolean> {
    const result = await db
      .delete(notifications)
      .where(eq(notifications.id, id))
      .returning({ id: notifications.id });
    
    return result.length > 0;
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
    // First check if settings exist
    const existingSettings = await this.getNotificationSettings(userId);
    
    if (existingSettings) {
      // Update existing settings
      const [updatedSettings] = await db
        .update(notificationSettings)
        .set(settingsData)
        .where(eq(notificationSettings.userId, userId))
        .returning();
      
      return updatedSettings;
    } else {
      // Create new settings with defaults and provided data
      const defaultSettings = {
        userId,
        emailNotifications: true,
        pushNotifications: true,
        groupUpdates: true,
        testReminders: true,
        joinRequests: true
      };
      
      // Merge with provided data
      const newSettings = {
        ...defaultSettings,
        ...settingsData
      };
      
      const [createdSettings] = await db
        .insert(notificationSettings)
        .values(newSettings)
        .returning();
      
      return createdSettings;
    }
  }
}

export const storage = new DatabaseStorage();