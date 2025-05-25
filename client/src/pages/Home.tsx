import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Play, 
  Clock, 
  Trophy,
  TrendingUp,
  Calendar,
  Star
} from "lucide-react";
import type { EnrollmentWithCourse } from "@/lib/types";

export default function Home() {
  const { user } = useAuth();

  const { data: enrollments, isLoading } = useQuery<EnrollmentWithCourse[]>({
    queryKey: ["/api/enrollments"],
  });

  const { data: courses } = useQuery({
    queryKey: ["/api/courses"],
  });

  const recentCourses = courses?.slice(0, 3) || [];
  const activeEnrollments = enrollments?.filter(e => !e.completedAt) || [];
  const completedCourses = enrollments?.filter(e => e.completedAt) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-emerald-50/50 to-background dark:from-primary/10 dark:via-emerald-950/50 dark:to-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Welcome back, {user?.firstName || "Student"}!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Continue your learning journey and achieve your goals
            </p>
            <Button size="lg" asChild>
              <Link href="/courses">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Courses
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                  <p className="text-2xl font-bold text-foreground">{enrollments?.length || 0}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground">{completedCourses.length}</p>
                </div>
                <Trophy className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-foreground">{activeEnrollments.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold text-foreground">
                    {enrollments?.reduce((acc, e) => {
                      const duration = e.course.duration || "0h";
                      const hours = parseInt(duration.split('h')[0]) || 0;
                      return acc + hours;
                    }, 0) || 0}h
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Courses */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">Continue Learning</h2>
            
            {activeEnrollments.length > 0 ? (
              <div className="space-y-6">
                {activeEnrollments.map((enrollment) => (
                  <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {enrollment.course.title}
                          </h3>
                          <Badge variant="outline" className="text-primary border-primary mb-3">
                            {enrollment.course.category}
                          </Badge>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">
                                {Math.round(parseFloat(enrollment.progress))}%
                              </span>
                            </div>
                            <Progress value={parseFloat(enrollment.progress)} className="h-2" />
                          </div>
                        </div>
                        <Button asChild>
                          <Link href={`/courses/${enrollment.course.id}`}>
                            <Play className="mr-2 h-4 w-4" />
                            Continue
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your learning journey by enrolling in a course
                  </p>
                  <Button asChild>
                    <Link href="/courses">Browse Courses</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Recent Courses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentCourses.map((course: any) => (
                  <div key={course.id} className="flex items-center space-x-3">
                    <img
                      src={course.imageUrl || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=60&h=60&fit=crop"}
                      alt={course.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {course.title}
                      </h4>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        {parseFloat(course.rating).toFixed(1)}
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/courses">View All</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Achievements */}
            {completedCourses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Courses Completed</span>
                      <Badge variant="secondary">{completedCourses.length}</Badge>
                    </div>
                    {completedCourses.length >= 3 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Dedicated Learner</span>
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                          Unlocked
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
