import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  Video, 
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Settings
} from "lucide-react";
import type { AdminStats } from "@/lib/types";
import type { Course } from "@shared/schema";

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: recentCourses } = useQuery<Course[]>({
    queryKey: ["/api/admin/courses"],
  });

  // Redirect if not admin
  if (user && !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const recentActivity = [
    {
      type: "enrollment",
      message: "New student enrolled in React Development Course",
      time: "2 minutes ago",
      icon: Users
    },
    {
      type: "course",
      message: "Python Data Science course updated",
      time: "15 minutes ago",
      icon: BookOpen
    },
    {
      type: "lesson",
      message: "New lesson added to Mobile Development course",
      time: "1 hour ago",
      icon: Video
    },
    {
      type: "completion",
      message: "Student completed Full Stack Web Development",
      time: "2 hours ago",
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-emerald-50/50 to-background dark:from-primary/10 dark:via-emerald-950/50 dark:to-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.firstName || "Admin"}!</p>
            </div>
            <div className="flex space-x-3">
              <Button asChild>
                <Link href="/admin/courses">
                  <Plus className="mr-2 h-4 w-4" />
                  New Course
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/lessons">
                  <Video className="mr-2 h-4 w-4" />
                  Manage Lessons
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.totalStudents?.toLocaleString() || "0"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.totalCourses || "0"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Lessons</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.totalLessons || "0"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Video className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.avgCompletionRate ? Math.round(stats.avgCompletionRate) : "0"}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-foreground">Recent Courses</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/courses">
                    <Eye className="mr-2 h-4 w-4" />
                    View All
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {recentCourses && recentCourses.length > 0 ? (
                  <div className="space-y-4">
                    {recentCourses.slice(0, 5).map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors">
                        <div className="flex items-center space-x-4">
                          <img
                            src={course.imageUrl || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=60&h=60&fit=crop"}
                            alt={course.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-foreground">{course.title}</h4>
                            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                              <span>{course.category}</span>
                              <Badge variant={course.isPublished ? "default" : "secondary"}>
                                {course.isPublished ? "Published" : "Draft"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{course.studentCount || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/courses/${course.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/courses?edit=${course.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No courses yet. Create your first course!</p>
                    <Button className="mt-4" asChild>
                      <Link href="/admin/courses">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Course
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <activity.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link href="/admin/courses">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Course
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/lessons">
                    <Video className="mr-2 h-4 w-4" />
                    Add Lesson
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/site-content">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Website Pages
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
