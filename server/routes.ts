import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertCourseSchema, insertLessonSchema, insertInstructorSchema, insertEnrollmentSchema, insertLessonProgressSchema, insertSiteContentSchema } from "@shared/schema";
import { z } from "zod";

// Admin middleware
const isAdmin = async (req: any, res: any, next: any) => {
  try {
    if (!req.isAuthenticated() || !req.user?.claims?.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userId = req.user.claims.sub;
    const adminCheck = await storage.isAdmin(userId);
    
    if (!adminCheck) {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ message: "Authentication error" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const { category, search } = req.query;
      const courses = await storage.getPublishedCourses({
        category: category as string,
        search: search as string,
      });
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourseWithInstructor(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.get("/api/courses/:id/lessons", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lessons = await storage.getLessonsByCourse(id);
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  app.get("/api/instructors", async (req, res) => {
    try {
      const instructors = await storage.getInstructors();
      res.json(instructors);
    } catch (error) {
      console.error("Error fetching instructors:", error);
      res.status(500).json({ message: "Failed to fetch instructors" });
    }
  });

  // Authenticated routes
  app.get("/api/enrollments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const enrollments = await storage.getUserEnrollments(userId);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  app.post("/api/enrollments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const enrollmentData = insertEnrollmentSchema.parse({
        ...req.body,
        userId,
      });
      
      // Check if already enrolled
      const existing = await storage.getUserEnrollment(userId, enrollmentData.courseId);
      if (existing) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }
      
      const enrollment = await storage.enrollUser(enrollmentData);
      res.json(enrollment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid enrollment data", errors: error.errors });
      }
      console.error("Error creating enrollment:", error);
      res.status(500).json({ message: "Failed to enroll in course" });
    }
  });

  app.put("/api/lesson-progress", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progressData = insertLessonProgressSchema.parse({
        ...req.body,
        userId,
      });
      
      const progress = await storage.updateLessonProgress(progressData);
      
      // Update enrollment progress if lesson is completed
      if (progressData.isCompleted && progressData.courseId) {
        const courseId = progressData.courseId;
        const courseLessons = await storage.getLessonsByCourse(courseId);
        const enrollment = await storage.getUserEnrollment(userId, courseId);
        
        if (enrollment) {
          const completedLessons = [...(enrollment.completedLessons || []), progressData.lessonId];
          const uniqueCompleted = [...new Set(completedLessons.filter(id => id != null))] as number[];
          const progressPercentage = (uniqueCompleted.length / courseLessons.length) * 100;
          
          await storage.updateEnrollmentProgress(userId, courseId, progressPercentage, uniqueCompleted);
        }
      }
      
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      }
      console.error("Error updating lesson progress:", error);
      res.status(500).json({ message: "Failed to update lesson progress" });
    }
  });

  app.get("/api/lesson-progress/:lessonId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const lessonId = parseInt(req.params.lessonId);
      const progress = await storage.getLessonProgress(userId, lessonId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching lesson progress:", error);
      res.status(500).json({ message: "Failed to fetch lesson progress" });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  // Admin - Instructors
  app.get("/api/admin/instructors", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const instructors = await storage.getInstructors();
      res.json(instructors);
    } catch (error) {
      console.error("Error fetching instructors:", error);
      res.status(500).json({ message: "Failed to fetch instructors" });
    }
  });

  app.post("/api/admin/instructors", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const instructorData = insertInstructorSchema.parse(req.body);
      const instructor = await storage.createInstructor(instructorData);
      res.json(instructor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid instructor data", errors: error.errors });
      }
      console.error("Error creating instructor:", error);
      res.status(500).json({ message: "Failed to create instructor" });
    }
  });

  app.put("/api/admin/instructors/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const instructorData = insertInstructorSchema.partial().parse(req.body);
      const instructor = await storage.updateInstructor(id, instructorData);
      res.json(instructor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid instructor data", errors: error.errors });
      }
      console.error("Error updating instructor:", error);
      res.status(500).json({ message: "Failed to update instructor" });
    }
  });

  app.delete("/api/admin/instructors/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteInstructor(id);
      res.json({ message: "Instructor deleted successfully" });
    } catch (error) {
      console.error("Error deleting instructor:", error);
      res.status(500).json({ message: "Failed to delete instructor" });
    }
  });

  // Admin - Courses
  app.get("/api/admin/courses", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { category, search } = req.query;
      const courses = await storage.getCourses({
        category: category as string,
        search: search as string,
      });
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.post("/api/admin/courses", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid course data", errors: error.errors });
      }
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  app.put("/api/admin/courses/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const courseData = insertCourseSchema.partial().parse(req.body);
      const course = await storage.updateCourse(id, courseData);
      res.json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid course data", errors: error.errors });
      }
      console.error("Error updating course:", error);
      res.status(500).json({ message: "Failed to update course" });
    }
  });

  app.delete("/api/admin/courses/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCourse(id);
      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "Failed to delete course" });
    }
  });

  // Admin - Lessons
  app.get("/api/admin/courses/:courseId/lessons", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const lessons = await storage.getLessonsByCourse(courseId);
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  app.post("/api/admin/lessons", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const lessonData = insertLessonSchema.parse(req.body);
      const lesson = await storage.createLesson(lessonData);
      res.json(lesson);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid lesson data", errors: error.errors });
      }
      console.error("Error creating lesson:", error);
      res.status(500).json({ message: "Failed to create lesson" });
    }
  });

  app.put("/api/admin/lessons/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lessonData = insertLessonSchema.partial().parse(req.body);
      const lesson = await storage.updateLesson(id, lessonData);
      res.json(lesson);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid lesson data", errors: error.errors });
      }
      console.error("Error updating lesson:", error);
      res.status(500).json({ message: "Failed to update lesson" });
    }
  });

  app.delete("/api/admin/lessons/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteLesson(id);
      res.json({ message: "Lesson deleted successfully" });
    } catch (error) {
      console.error("Error deleting lesson:", error);
      res.status(500).json({ message: "Failed to delete lesson" });
    }
  });

  // Admin - Site Content Management
  app.get("/api/admin/site-content", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { section } = req.query;
      const content = await storage.getSiteContent(section as string);
      res.json(content);
    } catch (error) {
      console.error("Error fetching site content:", error);
      res.status(500).json({ message: "Failed to fetch site content" });
    }
  });

  app.put("/api/admin/site-content", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { section, key, value, type } = req.body;
      const content = await storage.updateSiteContent(section, key, value, type);
      res.json(content);
    } catch (error) {
      console.error("Error updating site content:", error);
      res.status(500).json({ message: "Failed to update site content" });
    }
  });

  app.delete("/api/admin/site-content", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { section, key } = req.body;
      await storage.deleteSiteContent(section, key);
      res.json({ message: "Site content deleted successfully" });
    } catch (error) {
      console.error("Error deleting site content:", error);
      res.status(500).json({ message: "Failed to delete site content" });
    }
  });

  // Public site content routes
  app.get("/api/site-content", async (req, res) => {
    try {
      const { section } = req.query;
      const content = await storage.getSiteContent(section as string);
      res.json(content);
    } catch (error) {
      console.error("Error fetching site content:", error);
      res.status(500).json({ message: "Failed to fetch site content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}