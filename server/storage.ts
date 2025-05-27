import {
  users,
  instructors,
  courses,
  lessons,
  enrollments,
  lessonProgress,
  siteContent,
  type User,
  type UpsertUser,
  type InsertUser,
  type Instructor,
  type InsertInstructor,
  type Course,
  type InsertCourse,
  type Lesson,
  type InsertLesson,
  type Enrollment,
  type InsertEnrollment,
  type LessonProgress,
  type InsertLessonProgress,
  type SiteContent,
  type InsertSiteContent,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, sql, ilike } from "drizzle-orm";

export interface IStorage {
  // User operations (for custom auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  
  // Admin operations
  isAdmin(userId: string): Promise<boolean>;
  
  // Instructor operations
  getInstructors(): Promise<Instructor[]>;
  getInstructor(id: number): Promise<Instructor | undefined>;
  createInstructor(instructor: InsertInstructor): Promise<Instructor>;
  updateInstructor(id: number, instructor: Partial<InsertInstructor>): Promise<Instructor>;
  deleteInstructor(id: number): Promise<void>;
  
  // Course operations
  getCourses(filters?: { category?: string; search?: string }): Promise<Course[]>;
  getPublishedCourses(filters?: { category?: string; search?: string }): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  getCourseWithInstructor(id: number): Promise<(Course & { instructor: Instructor }) | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course>;
  deleteCourse(id: number): Promise<void>;
  
  // Lesson operations
  getLessonsByCourse(courseId: number): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: number, lesson: Partial<InsertLesson>): Promise<Lesson>;
  deleteLesson(id: number): Promise<void>;
  
  // Enrollment operations
  getUserEnrollments(userId: string): Promise<(Enrollment & { course: Course })[]>;
  getUserEnrollment(userId: string, courseId: number): Promise<Enrollment | undefined>;
  enrollUser(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollmentProgress(userId: string, courseId: number, progress: number, completedLessons: number[]): Promise<void>;
  
  // Lesson progress operations
  getLessonProgress(userId: string, lessonId: number): Promise<LessonProgress | undefined>;
  updateLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress>;
  
  // Analytics
  getAdminStats(): Promise<{
    totalStudents: number;
    totalCourses: number;
    totalLessons: number;
    avgCompletionRate: number;
  }>;
  
  // Site content operations
  getSiteContent(section?: string): Promise<SiteContent[]>;
  getSiteContentByKey(section: string, key: string): Promise<SiteContent | undefined>;
  updateSiteContent(section: string, key: string, value: string, type?: string): Promise<SiteContent>;
  deleteSiteContent(section: string, key: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, parseInt(id)));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async isAdmin(userId: string): Promise<boolean> {
    // Check the isAdmin field in the database
    const user = await this.getUser(userId);
    return user?.isAdmin || false;
  }

  // Instructor operations
  async getInstructors(): Promise<Instructor[]> {
    return await db.select().from(instructors).orderBy(asc(instructors.name));
  }

  async getInstructor(id: number): Promise<Instructor | undefined> {
    const [instructor] = await db.select().from(instructors).where(eq(instructors.id, id));
    return instructor;
  }

  async createInstructor(instructor: InsertInstructor): Promise<Instructor> {
    const [newInstructor] = await db.insert(instructors).values(instructor).returning();
    return newInstructor;
  }

  async updateInstructor(id: number, instructor: Partial<InsertInstructor>): Promise<Instructor> {
    const [updatedInstructor] = await db
      .update(instructors)
      .set({ ...instructor, updatedAt: new Date() })
      .where(eq(instructors.id, id))
      .returning();
    return updatedInstructor;
  }

  async deleteInstructor(id: number): Promise<void> {
    await db.delete(instructors).where(eq(instructors.id, id));
  }

  // Course operations
  async getCourses(filters?: { category?: string; search?: string }): Promise<Course[]> {
    let query = db.select().from(courses);
    
    if (filters?.category && filters.category !== 'all') {
      query = query.where(eq(courses.category, filters.category));
    }
    
    if (filters?.search) {
      query = query.where(ilike(courses.title, `%${filters.search}%`));
    }
    
    return await query.orderBy(desc(courses.createdAt));
  }

  async getPublishedCourses(filters?: { category?: string; search?: string }): Promise<Course[]> {
    let query = db.select().from(courses).where(eq(courses.isPublished, true));
    
    if (filters?.category && filters.category !== 'all') {
      query = query.where(and(eq(courses.isPublished, true), eq(courses.category, filters.category)));
    }
    
    if (filters?.search) {
      query = query.where(and(eq(courses.isPublished, true), ilike(courses.title, `%${filters.search}%`)));
    }
    
    return await query.orderBy(desc(courses.createdAt));
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async getCourseWithInstructor(id: number): Promise<(Course & { instructor: Instructor }) | undefined> {
    const [result] = await db
      .select()
      .from(courses)
      .leftJoin(instructors, eq(courses.instructorId, instructors.id))
      .where(eq(courses.id, id));
    
    if (!result?.courses) return undefined;
    
    return {
      ...result.courses,
      instructor: result.instructors!,
    };
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set({ ...course, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Lesson operations
  async getLessonsByCourse(courseId: number): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, courseId))
      .orderBy(asc(lessons.order));
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db.insert(lessons).values(lesson).returning();
    return newLesson;
  }

  async updateLesson(id: number, lesson: Partial<InsertLesson>): Promise<Lesson> {
    const [updatedLesson] = await db
      .update(lessons)
      .set({ ...lesson, updatedAt: new Date() })
      .where(eq(lessons.id, id))
      .returning();
    return updatedLesson;
  }

  async deleteLesson(id: number): Promise<void> {
    await db.delete(lessons).where(eq(lessons.id, id));
  }

  // Enrollment operations
  async getUserEnrollments(userId: string): Promise<(Enrollment & { course: Course })[]> {
    const results = await db
      .select()
      .from(enrollments)
      .leftJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt));
    
    return results.map(result => ({
      ...result.enrollments,
      course: result.courses!,
    }));
  }

  async getUserEnrollment(userId: string, courseId: number): Promise<Enrollment | undefined> {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
    return enrollment;
  }

  async enrollUser(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
    
    // Update course student count
    await db
      .update(courses)
      .set({ 
        studentCount: sql`${courses.studentCount} + 1` 
      })
      .where(eq(courses.id, enrollment.courseId));
    
    return newEnrollment;
  }

  async updateEnrollmentProgress(userId: string, courseId: number, progress: number, completedLessons: number[]): Promise<void> {
    await db
      .update(enrollments)
      .set({ 
        progress: progress.toString(), 
        completedLessons,
        completedAt: progress >= 100 ? new Date() : null 
      })
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
  }

  // Lesson progress operations
  async getLessonProgress(userId: string, lessonId: number): Promise<LessonProgress | undefined> {
    const [progress] = await db
      .select()
      .from(lessonProgress)
      .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId)));
    return progress;
  }

  async updateLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress> {
    const [updatedProgress] = await db
      .insert(lessonProgress)
      .values(progress)
      .onConflictDoUpdate({
        target: [lessonProgress.userId, lessonProgress.lessonId],
        set: {
          ...progress,
          updatedAt: new Date(),
        },
      })
      .returning();
    return updatedProgress;
  }

  // Analytics
  async getAdminStats(): Promise<{
    totalStudents: number;
    totalCourses: number;
    totalLessons: number;
    avgCompletionRate: number;
  }> {
    const [studentCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [courseCount] = await db.select({ count: sql<number>`count(*)` }).from(courses);
    const [lessonCount] = await db.select({ count: sql<number>`count(*)` }).from(lessons);
    const [completionRate] = await db.select({ 
      avg: sql<number>`avg(case when progress >= 100 then 100 else progress end)` 
    }).from(enrollments);
    
    return {
      totalStudents: studentCount.count,
      totalCourses: courseCount.count,
      totalLessons: lessonCount.count,
      avgCompletionRate: completionRate.avg || 0,
    };
  }

  // Site content operations
  async getSiteContent(section?: string): Promise<SiteContent[]> {
    if (section) {
      return await db.select().from(siteContent).where(eq(siteContent.section, section));
    }
    return await db.select().from(siteContent);
  }

  async getSiteContentByKey(section: string, key: string): Promise<SiteContent | undefined> {
    const [content] = await db.select().from(siteContent)
      .where(and(eq(siteContent.section, section), eq(siteContent.key, key)));
    return content;
  }

  async updateSiteContent(section: string, key: string, value: string, type: string = "text"): Promise<SiteContent> {
    const existing = await this.getSiteContentByKey(section, key);
    
    if (existing) {
      const [updated] = await db
        .update(siteContent)
        .set({ value, type, updatedAt: new Date() })
        .where(and(eq(siteContent.section, section), eq(siteContent.key, key)))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(siteContent)
        .values({ section, key, value, type })
        .returning();
      return created;
    }
  }

  async deleteSiteContent(section: string, key: string): Promise<void> {
    await db.delete(siteContent)
      .where(and(eq(siteContent.section, section), eq(siteContent.key, key)));
  }
}

export const storage = new DatabaseStorage();
