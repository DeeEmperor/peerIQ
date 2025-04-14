import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from 'ws';
import WebSocket from 'ws';
import { storage } from "./storage";
import { setupAuth } from "./auth";
import {
  insertStudyGroupSchema,
  insertGroupMemberSchema,
  insertJoinRequestSchema,
  insertCourseSchema,
  insertFlashcardDeckSchema,
  insertFlashcardSchema,
  insertTestSchema,
  insertTestResultSchema,
  insertNotificationSchema,
} from "@shared/schema";
import { z } from "zod";

// Middleware to check if user is authenticated
const authMiddleware = (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized: Not authenticated' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Setup authentication
  setupAuth(app);
  
  // WebSocket server for real-time collaboration
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
  });

  // User routes
  app.get('/api/user/profile', authMiddleware, async (req, res) => {
    try {
      // req.user is provided by passport
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Failed to get user profile' });
    }
  });

  app.patch('/api/user/profile', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Only allow updating certain fields
      const allowedFields = ['name', 'avatar', 'availability', 'studyStyle'];
      const updateData: Record<string, any> = {};
      
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }
      
      const updatedUser = await storage.updateUser(user.id, updateData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Failed to update user profile' });
    }
  });

  // Study Group routes
  app.post('/api/groups', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const validatedData = insertStudyGroupSchema.parse({
        ...req.body,
        leadId: user.id
      });
      
      const group = await storage.createStudyGroup(validatedData);
      
      // Automatically add the creator as a member with 'lead' role
      await storage.addMemberToGroup({
        groupId: group.id,
        userId: user.id,
        role: 'lead'
      });
      
      res.status(201).json(group);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Create group error:', error);
      res.status(500).json({ message: 'Failed to create study group' });
    }
  });

  app.get('/api/groups', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const groups = await storage.getStudyGroupsByUser(user.id);
      res.json(groups);
    } catch (error) {
      console.error('Get groups error:', error);
      res.status(500).json({ message: 'Failed to get study groups' });
    }
  });

  app.get('/api/groups/:id', authMiddleware, async (req, res) => {
    try {
      const groupId = parseInt(req.params.id);
      const group = await storage.getStudyGroup(groupId);
      
      if (!group) {
        return res.status(404).json({ message: 'Study group not found' });
      }
      
      res.json(group);
    } catch (error) {
      console.error('Get group error:', error);
      res.status(500).json({ message: 'Failed to get study group' });
    }
  });

  app.patch('/api/groups/:id', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const groupId = parseInt(req.params.id);
      const group = await storage.getStudyGroup(groupId);
      
      if (!group) {
        return res.status(404).json({ message: 'Study group not found' });
      }
      
      // Only the group lead can update the group
      if (group.leadId !== user.id) {
        return res.status(403).json({ message: 'Unauthorized: Only group lead can update group' });
      }
      
      // Only allow updating certain fields
      const allowedFields = ['name', 'description', 'isPublic', 'democratizedApproval'];
      const updateData: Record<string, any> = {};
      
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }
      
      const updatedGroup = await storage.updateStudyGroup(groupId, updateData);
      res.json(updatedGroup);
    } catch (error) {
      console.error('Update group error:', error);
      res.status(500).json({ message: 'Failed to update study group' });
    }
  });

  // Join Request routes
  app.post('/api/groups/:id/join', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const groupId = parseInt(req.params.id);
      const group = await storage.getStudyGroup(groupId);
      
      if (!group) {
        return res.status(404).json({ message: 'Study group not found' });
      }
      
      // Check if already a member
      const members = await storage.getGroupMembers(groupId);
      const isMember = members.some(member => member.userId === user.id);
      
      if (isMember) {
        return res.status(400).json({ message: 'Already a member of this group' });
      }
      
      // Check if already requested to join
      const requests = await storage.getJoinRequests(groupId);
      const hasRequested = requests.some(request => 
        request.userId === user.id && request.status === 'pending'
      );
      
      if (hasRequested) {
        return res.status(400).json({ message: 'Join request already submitted' });
      }
      
      // If group is public, add member directly
      if (group.isPublic) {
        await storage.addMemberToGroup({
          groupId,
          userId: user.id,
          role: 'member'
        });
        
        return res.status(201).json({ message: 'Successfully joined group' });
      }
      
      // Otherwise create a join request
      const joinRequest = await storage.createJoinRequest({
        groupId,
        userId: user.id
      });
      
      res.status(201).json(joinRequest);
    } catch (error) {
      console.error('Join group error:', error);
      res.status(500).json({ message: 'Failed to join study group' });
    }
  });

  app.get('/api/groups/:id/join-requests', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const groupId = parseInt(req.params.id);
      const group = await storage.getStudyGroup(groupId);
      
      if (!group) {
        return res.status(404).json({ message: 'Study group not found' });
      }
      
      // Only the group lead can view join requests
      if (group.leadId !== user.id) {
        return res.status(403).json({ message: 'Unauthorized: Only group lead can view join requests' });
      }
      
      const requests = await storage.getJoinRequests(groupId);
      res.json(requests);
    } catch (error) {
      console.error('Get join requests error:', error);
      res.status(500).json({ message: 'Failed to get join requests' });
    }
  });

  app.patch('/api/join-requests/:id', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const requestId = parseInt(req.params.id);
      const status = req.body.status;
      
      if (status !== 'accepted' && status !== 'rejected') {
        return res.status(400).json({ message: 'Invalid status' });
      }
      
      const updatedRequest = await storage.updateJoinRequestStatus(requestId, status);
      
      // If request is accepted, add user to group
      if (status === 'accepted') {
        await storage.addMemberToGroup({
          groupId: updatedRequest.groupId,
          userId: updatedRequest.userId,
          role: 'member'
        });
      }
      
      res.json(updatedRequest);
    } catch (error) {
      console.error('Update join request error:', error);
      res.status(500).json({ message: 'Failed to update join request' });
    }
  });

  // Course routes
  app.post('/api/groups/:id/courses', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const groupId = parseInt(req.params.id);
      const group = await storage.getStudyGroup(groupId);
      
      if (!group) {
        return res.status(404).json({ message: 'Study group not found' });
      }
      
      // Only the group lead can create courses
      if (group.leadId !== user.id) {
        return res.status(403).json({ message: 'Unauthorized: Only group lead can create courses' });
      }
      
      const validatedData = insertCourseSchema.parse({
        ...req.body,
        groupId
      });
      
      const course = await storage.createCourse(validatedData);
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Create course error:', error);
      res.status(500).json({ message: 'Failed to create course' });
    }
  });

  app.get('/api/groups/:id/courses', authMiddleware, async (req, res) => {
    try {
      const groupId = parseInt(req.params.id);
      const courses = await storage.getCoursesByGroup(groupId);
      res.json(courses);
    } catch (error) {
      console.error('Get courses error:', error);
      res.status(500).json({ message: 'Failed to get courses' });
    }
  });

  // Flashcard routes
  app.post('/api/courses/:id/flashcard-decks', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      const validatedData = insertFlashcardDeckSchema.parse({
        ...req.body,
        courseId,
        createdBy: user.id
      });
      
      const deck = await storage.createFlashcardDeck(validatedData);
      res.status(201).json(deck);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Create flashcard deck error:', error);
      res.status(500).json({ message: 'Failed to create flashcard deck' });
    }
  });

  app.get('/api/courses/:id/flashcard-decks', authMiddleware, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const decks = await storage.getFlashcardDecksByCourse(courseId);
      res.json(decks);
    } catch (error) {
      console.error('Get flashcard decks error:', error);
      res.status(500).json({ message: 'Failed to get flashcard decks' });
    }
  });

  app.post('/api/flashcard-decks/:id/flashcards', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const deckId = parseInt(req.params.id);
      const deck = await storage.getFlashcardDeck(deckId);
      
      if (!deck) {
        return res.status(404).json({ message: 'Flashcard deck not found' });
      }
      
      const validatedData = insertFlashcardSchema.parse({
        ...req.body,
        deckId,
        createdBy: user.id
      });
      
      const flashcard = await storage.createFlashcard(validatedData);
      
      // Update user stats for flashcard contribution
      const course = await storage.getCourse(deck.courseId);
      if (course) {
        const userStats = await storage.getUserStats(user.id, course.groupId);
        if (userStats) {
          await storage.updateUserStats(user.id, course.groupId, {
            flashcardContributions: userStats.flashcardContributions + 1
          });
        } else {
          await storage.updateUserStats(user.id, course.groupId, {
            flashcardContributions: 1
          });
        }
      }
      
      res.status(201).json(flashcard);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Create flashcard error:', error);
      res.status(500).json({ message: 'Failed to create flashcard' });
    }
  });

  app.get('/api/flashcard-decks/:id/flashcards', authMiddleware, async (req, res) => {
    try {
      const deckId = parseInt(req.params.id);
      const flashcards = await storage.getFlashcardsByDeck(deckId);
      res.json(flashcards);
    } catch (error) {
      console.error('Get flashcards error:', error);
      res.status(500).json({ message: 'Failed to get flashcards' });
    }
  });

  // Test routes
  app.post('/api/courses/:id/tests', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      const validatedData = insertTestSchema.parse({
        ...req.body,
        courseId,
        createdBy: user.id
      });
      
      const test = await storage.createTest(validatedData);
      res.status(201).json(test);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Create test error:', error);
      res.status(500).json({ message: 'Failed to create test' });
    }
  });

  app.get('/api/courses/:id/tests', authMiddleware, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const tests = await storage.getTestsByCourse(courseId);
      res.json(tests);
    } catch (error) {
      console.error('Get tests error:', error);
      res.status(500).json({ message: 'Failed to get tests' });
    }
  });

  app.get('/api/tests/upcoming', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const tests = await storage.getUpcomingTestsByUser(user.id);
      res.json(tests);
    } catch (error) {
      console.error('Get upcoming tests error:', error);
      res.status(500).json({ message: 'Failed to get upcoming tests' });
    }
  });

  app.post('/api/tests/:id/results', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const testId = parseInt(req.params.id);
      const test = await storage.getTest(testId);
      
      if (!test) {
        return res.status(404).json({ message: 'Test not found' });
      }
      
      const validatedData = insertTestResultSchema.parse({
        ...req.body,
        userId: user.id,
        testId
      });
      
      const result = await storage.createTestResult(validatedData);
      
      // Update user stats for test completion
      const course = await storage.getCourse(test.courseId);
      if (course) {
        const userStats = await storage.getUserStats(user.id, course.groupId);
        if (userStats) {
          await storage.updateUserStats(user.id, course.groupId, {
            testsCompleted: userStats.testsCompleted + 1,
            totalPoints: userStats.totalPoints + result.score
          });
        } else {
          await storage.updateUserStats(user.id, course.groupId, {
            testsCompleted: 1,
            totalPoints: result.score
          });
        }
      }
      
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Create test result error:', error);
      res.status(500).json({ message: 'Failed to create test result' });
    }
  });

  // Leaderboard routes
  app.get('/api/groups/:id/leaderboard', authMiddleware, async (req, res) => {
    try {
      const groupId = parseInt(req.params.id);
      const group = await storage.getStudyGroup(groupId);
      
      if (!group) {
        return res.status(404).json({ message: 'Study group not found' });
      }
      
      const leaderboard = await storage.getLeaderboard(groupId);
      res.json(leaderboard);
    } catch (error) {
      console.error('Get leaderboard error:', error);
      res.status(500).json({ message: 'Failed to get leaderboard' });
    }
  });

  // Notification routes
  app.get('/api/notifications', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const notifications = await storage.getUserNotifications(user.id);
      res.json(notifications);
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({ message: 'Failed to get notifications' });
    }
  });

  app.patch('/api/notifications/:id/read', authMiddleware, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const success = await storage.markNotificationAsRead(notificationId);
      
      if (!success) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Mark notification as read error:', error);
      res.status(500).json({ message: 'Failed to mark notification as read' });
    }
  });

  app.delete('/api/notifications/:id', authMiddleware, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const success = await storage.deleteNotification(notificationId);
      
      if (!success) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Delete notification error:', error);
      res.status(500).json({ message: 'Failed to delete notification' });
    }
  });

  app.get('/api/notification-settings', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const settings = await storage.getNotificationSettings(user.id);
      res.json(settings || {});
    } catch (error) {
      console.error('Get notification settings error:', error);
      res.status(500).json({ message: 'Failed to get notification settings' });
    }
  });

  app.patch('/api/notification-settings', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const settings = await storage.updateNotificationSettings(user.id, req.body);
      res.json(settings);
    } catch (error) {
      console.error('Update notification settings error:', error);
      res.status(500).json({ message: 'Failed to update notification settings' });
    }
  });

  return httpServer;
}