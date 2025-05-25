export interface CourseWithInstructor {
  id: number;
  title: string;
  description: string | null;
  shortDescription: string | null;
  category: string;
  level: string | null;
  duration: string | null;
  price: string;
  imageUrl: string | null;
  instructorId: number | null;
  rating: string;
  studentCount: number | null;
  isPublished: boolean | null;
  startDate: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  instructor: {
    id: number;
    name: string;
    title: string;
    bio: string | null;
    profileImageUrl: string | null;
    expertise: string[] | null;
    rating: string;
    studentCount: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
}

export interface EnrollmentWithCourse {
  id: number;
  userId: string;
  courseId: number;
  progress: string;
  completedLessons: number[] | null;
  lastAccessedLesson: number | null;
  enrolledAt: Date | null;
  completedAt: Date | null;
  course: {
    id: number;
    title: string;
    description: string | null;
    shortDescription: string | null;
    category: string;
    level: string | null;
    duration: string | null;
    price: string;
    imageUrl: string | null;
    instructorId: number | null;
    rating: string;
    studentCount: number | null;
    isPublished: boolean | null;
    startDate: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
}

export interface AdminStats {
  totalStudents: number;
  totalCourses: number;
  totalLessons: number;
  avgCompletionRate: number;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}
