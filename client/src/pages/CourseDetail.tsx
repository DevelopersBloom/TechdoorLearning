import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Play, 
  Lock, 
  Clock, 
  Users, 
  Star, 
  BookOpen,
  CheckCircle,
  PlayCircle
} from "lucide-react";
import type { CourseWithInstructor } from "@/lib/types";
import type { Lesson, Enrollment } from "@shared/schema";

export default function CourseDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: course, isLoading: courseLoading } = useQuery<CourseWithInstructor>({
    queryKey: [`/api/courses/${id}`],
  });

  const { data: lessons } = useQuery<Lesson[]>({
    queryKey: [`/api/courses/${id}/lessons`],
    enabled: !!id,
  });

  const { data: enrollment } = useQuery<Enrollment>({
    queryKey: [`/api/enrollments/${id}`],
    enabled: !!id && isAuthenticated,
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/enrollments", { courseId: parseInt(id!) });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Successfully enrolled!",
        description: "You can now start learning this course.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/enrollments/${id}`] });
    },
    onError: (error: any) => {
      toast({
        title: "Enrollment failed",
        description: error.message || "Failed to enroll in course. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEnroll = () => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    enrollMutation.mutate();
  };

  if (courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Course not found</h1>
          <p className="text-muted-foreground">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const completedLessons = enrollment?.completedLessons || [];
  const totalLessons = lessons?.length || 0;
  const progress = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;
  const isEnrolled = !!enrollment;

  return (
    <div className="min-h-screen bg-background">
      {/* Course Header */}
      <section className="bg-gradient-to-br from-primary/5 via-emerald-50/50 to-background dark:from-primary/10 dark:via-emerald-950/50 dark:to-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <Badge variant="outline" className="text-primary border-primary mb-4">
                {course.category}
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {course.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {course.description}
              </p>
              
              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">{parseFloat(course.rating).toFixed(1)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{course.studentCount || 0} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{course.duration || "Self-paced"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <span>{totalLessons} lessons</span>
                </div>
              </div>

              {/* Instructor */}
              {course.instructor && (
                <div className="flex items-center space-x-4 p-4 bg-card rounded-lg border">
                  <img
                    src={course.instructor.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop"}
                    alt={course.instructor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground">{course.instructor.name}</h3>
                    <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  {/* Course Image */}
                  <div className="relative mb-6">
                    <img
                      src={course.imageUrl || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop"}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {!isEnrolled && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
                        <Button
                          size="lg"
                          className="bg-white/90 hover:bg-white text-primary hover:text-primary/80"
                          onClick={handleEnroll}
                          disabled={enrollMutation.isPending}
                        >
                          <PlayCircle className="mr-2 h-5 w-5" />
                          Preview Course
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {parseFloat(course.price) === 0 ? "Free" : `$${parseFloat(course.price).toFixed(2)}`}
                    </div>
                    <p className="text-sm text-muted-foreground">Full lifetime access</p>
                  </div>

                  {isEnrolled ? (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      <Button className="w-full" size="lg">
                        <Play className="mr-2 h-5 w-5" />
                        Continue Learning
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={handleEnroll}
                      disabled={enrollMutation.isPending}
                    >
                      {enrollMutation.isPending ? "Enrolling..." : "Enroll Now - Free"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Course Description */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">About This Course</h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* What You'll Learn */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-foreground mb-6">What You'll Learn</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Master the fundamentals and advanced concepts",
                  "Build real-world projects from scratch",
                  "Understand best practices and industry standards",
                  "Get hands-on experience with modern tools",
                  "Learn from industry experts",
                  "Receive a certificate of completion"
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Course Curriculum */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Course Curriculum
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lessons?.map((lesson, index) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isAccessible = isEnrolled || lesson.isPreview;
                  
                  return (
                    <div
                      key={lesson.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isAccessible ? "hover:bg-muted/50 cursor-pointer" : "opacity-60"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        ) : isAccessible ? (
                          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                            <Play className="w-3 h-3 text-primary" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                            <Lock className="w-3 h-3 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {lesson.title}
                        </h4>
                        <div className="flex items-center text-xs text-muted-foreground space-x-2">
                          <span className="flex items-center">
                            <PlayCircle className="w-3 h-3 mr-1" />
                            Video
                          </span>
                          <span>{lesson.duration || "5:00"}</span>
                          {lesson.isPreview && (
                            <Badge variant="secondary" className="text-xs">
                              Preview
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {!lessons?.length && (
                  <p className="text-center text-muted-foreground py-4">
                    No lessons available yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
