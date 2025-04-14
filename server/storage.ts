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

export interface IStorage {
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
export const storage = new MemStorage();
