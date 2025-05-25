import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertLessonSchema } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Video,
  Play,
  Lock,
  ArrowLeft,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import type { Course, Lesson } from "@shared/schema";
import type { z } from "zod";

type LessonFormData = z.infer<typeof insertLessonSchema>;

export default function AdminLessons() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const { data: courses } = useQuery<Course[]>({
    queryKey: ["/api/admin/courses"],
  });

  const { data: lessons, isLoading } = useQuery<Lesson[]>({
    queryKey: ["/api/admin/courses/lessons", selectedCourse],
    enabled: selectedCourse !== "all",
    queryFn: async () => {
      if (selectedCourse === "all") return [];
      const response = await fetch(`/api/admin/courses/${selectedCourse}/lessons`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch lessons");
      return response.json();
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LessonFormData>({
    resolver: zodResolver(insertLessonSchema),
    defaultValues: {
      isPreview: false,
      order: 1,
    },
  });

  const watchedValues = watch();

  // Redirect if not admin
  if (user && !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const createLessonMutation = useMutation({
    mutationFn: async (data: LessonFormData) => {
      const response = await apiRequest("POST", "/api/admin/lessons", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Lesson created successfully!",
        description: "The new lesson has been added to the course.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses/lessons"] });
      setIsCreateDialogOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create lesson",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const updateLessonMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<LessonFormData> }) => {
      const response = await apiRequest("PUT", `/api/admin/lessons/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Lesson updated successfully!",
        description: "The lesson has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses/lessons"] });
      setEditingLesson(null);
      reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update lesson",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/lessons/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Lesson deleted successfully!",
        description: "The lesson has been removed from the course.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses/lessons"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete lesson",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LessonFormData) => {
    if (editingLesson) {
      updateLessonMutation.mutate({ id: editingLesson.id, data });
    } else {
      createLessonMutation.mutate(data);
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    reset({
      courseId: lesson.courseId,
      title: lesson.title,
      description: lesson.description || "",
      videoUrl: lesson.videoUrl || "",
      duration: lesson.duration || "",
      order: lesson.order,
      isPreview: lesson.isPreview || false,
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = (lesson: Lesson) => {
    if (window.confirm(`Are you sure you want to delete "${lesson.title}"?`)) {
      deleteLessonMutation.mutate(lesson.id);
    }
  };

  const handleDialogClose = () => {
    setIsCreateDialogOpen(false);
    setEditingLesson(null);
    reset();
  };

  const filteredLessons = lessons?.filter(lesson => {
    const matchesSearch = !searchTerm || 
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }).sort((a, b) => a.order - b.order) || [];

  const selectedCourseData = courses?.find(course => course.id.toString() === selectedCourse);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-emerald-50/50 to-background dark:from-primary/10 dark:via-emerald-950/50 dark:to-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/admin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Lesson Management</h1>
                <p className="text-muted-foreground">Create and organize course content</p>
              </div>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setEditingLesson(null)}
                  disabled={selectedCourse === "all"}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Lesson
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingLesson ? "Edit Lesson" : "Create New Lesson"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="courseId">Course</Label>
                    <Select 
                      value={watchedValues.courseId?.toString() || selectedCourse} 
                      onValueChange={(value) => setValue("courseId", parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses?.map((course) => (
                          <SelectItem key={course.id} value={course.id.toString()}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.courseId && (
                      <p className="text-sm text-destructive">{errors.courseId.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Lesson Title</Label>
                    <Input
                      id="title"
                      placeholder="Introduction to React Components"
                      {...register("title")}
                      className={errors.title ? "border-destructive" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={3}
                      placeholder="Lesson description and learning objectives..."
                      {...register("description")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">Video URL</Label>
                    <Input
                      id="videoUrl"
                      placeholder="https://example.com/video.mp4"
                      {...register("videoUrl")}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        placeholder="15:30"
                        {...register("duration")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="order">Order</Label>
                      <Input
                        id="order"
                        type="number"
                        min="1"
                        {...register("order", { valueAsNumber: true })}
                        className={errors.order ? "border-destructive" : ""}
                      />
                      {errors.order && (
                        <p className="text-sm text-destructive">{errors.order.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPreview"
                      checked={watchedValues.isPreview}
                      onCheckedChange={(checked) => setValue("isPreview", checked)}
                    />
                    <Label htmlFor="isPreview">Make this lesson a free preview</Label>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createLessonMutation.isPending || updateLessonMutation.isPending}>
                      {(createLessonMutation.isPending || updateLessonMutation.isPending) 
                        ? "Saving..." 
                        : editingLesson 
                          ? "Update Lesson" 
                          : "Create Lesson"
                      }
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Selection and Search */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="space-y-2">
                <Label>Select Course</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses?.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCourse !== "all" && (
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search lessons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Info */}
        {selectedCourseData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="mr-2 h-5 w-5" />
                {selectedCourseData.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div>{selectedCourseData.category}</div>
                <div>{filteredLessons.length} lessons</div>
                <Badge variant={selectedCourseData.isPublished ? "default" : "secondary"}>
                  {selectedCourseData.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lessons List */}
        {selectedCourse === "all" ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Select a Course</h3>
              <p className="text-muted-foreground">
                Choose a course from the dropdown above to view and manage its lessons.
              </p>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        ) : filteredLessons.length > 0 ? (
          <div className="space-y-4">
            {filteredLessons.map((lesson, index) => (
              <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        {lesson.isPreview ? (
                          <Play className="w-6 h-6 text-primary" />
                        ) : (
                          <Lock className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{lesson.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                              <div>Lesson {lesson.order}</div>
                              <div>{lesson.duration || "TBD"}</div>
                              {lesson.isPreview && (
                                <Badge variant="outline" className="text-primary border-primary">
                                  Free Preview
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        {lesson.description && (
                          <p className="text-muted-foreground mb-3 line-clamp-2">
                            {lesson.description}
                          </p>
                        )}
                        {lesson.videoUrl && (
                          <div className="text-sm text-muted-foreground">
                            <Video className="h-3 w-3 inline mr-1" />
                            Video URL configured
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {index > 0 && (
                        <Button variant="ghost" size="sm" title="Move up">
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                      )}
                      {index < filteredLessons.length - 1 && (
                        <Button variant="ghost" size="sm" title="Move down">
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(lesson)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(lesson)}
                        disabled={deleteLessonMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No lessons found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? "Try adjusting your search terms" 
                  : "Get started by creating the first lesson for this course"
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Lesson
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
