import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, Heart } from "lucide-react";
import type { Course } from "@shared/schema";

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: number) => void;
  showEnrollButton?: boolean;
}

export function CourseCard({ course, onEnroll, showEnrollButton = true }: CourseCardProps) {
  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEnroll?.(course.id);
  };

  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="course-card group cursor-pointer">
        <div className="relative">
          <img
            src={course.imageUrl || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop"}
            alt={course.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 left-4">
            {course.level === "beginner" && (
              <Badge variant="secondary" className="bg-green-500 text-white">
                Beginner
              </Badge>
            )}
            {course.level === "intermediate" && (
              <Badge variant="secondary" className="bg-yellow-500 text-white">
                Intermediate
              </Badge>
            )}
            {course.level === "advanced" && (
              <Badge variant="secondary" className="bg-red-500 text-white">
                Advanced
              </Badge>
            )}
          </div>
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/90 hover:bg-white text-muted-foreground hover:text-red-500"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className="text-primary border-primary">
              {course.category}
            </Badge>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="ml-1 text-sm text-muted-foreground">
                {parseFloat(course.rating).toFixed(1)}
              </span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {course.shortDescription || course.description}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{course.duration || "Self-paced"}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span>{course.studentCount || 0} students</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">
              {parseFloat(course.price) === 0 ? "Free" : `$${parseFloat(course.price).toFixed(2)}`}
            </div>
            {showEnrollButton && (
              <Button onClick={handleEnroll} className="btn-primary">
                Enroll Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
