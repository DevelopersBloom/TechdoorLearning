import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Play, 
  Star, 
  Users, 
  Clock, 
  BookOpen,
  Trophy,
  Target,
  Heart,
  Rocket
} from "lucide-react";

export default function Landing() {
  const stats = [
    { value: "25,000+", label: "Active Students" },
    { value: "150+", label: "Courses" },
    { value: "50+", label: "Expert Instructors" },
    { value: "98%", label: "Success Rate" },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Quality Education",
      description: "Learn from industry professionals with years of experience in top tech companies."
    },
    {
      icon: Users,
      title: "Community Driven", 
      description: "Join a supportive learning community with collaborative projects and peer mentoring."
    },
    {
      icon: Rocket,
      title: "Innovation Focus",
      description: "Stay ahead with cutting-edge curriculum that reflects the latest industry trends."
    }
  ];

  const featuredCourses = [
    {
      id: 1,
      title: "Complete React & Node.js Development",
      category: "Web Development",
      level: "Beginner",
      duration: "24 hours",
      students: "2,340",
      rating: "4.9",
      price: "Free",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "Python Data Science Masterclass",
      category: "Data Science", 
      level: "Intermediate",
      duration: "32 hours",
      students: "1,890",
      rating: "4.8",
      price: "Free",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "React Native Mobile Apps",
      category: "Mobile Development",
      level: "Advanced", 
      duration: "18 hours",
      students: "945",
      rating: "4.7",
      price: "Free",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-emerald-50/50 to-background dark:from-primary/10 dark:via-emerald-950/50 dark:to-background py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="animate-slide-up">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">Technology</span> Skills for the Future
                </h1>
                <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
                  Join thousands of students learning cutting-edge technology skills through our comprehensive online courses. From beginner to expert, we've got you covered.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="text-lg" asChild>
                    <a href="/api/login">
                      <Play className="mr-2 h-5 w-5" />
                      Start Learning Today
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg" asChild>
                    <Link href="/courses">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Browse Courses
                    </Link>
                  </Button>
                </div>
                {/* Stats */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-primary">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-5">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop" 
                  alt="Students collaborating on online learning"
                  className="rounded-2xl shadow-2xl w-full"
                />
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-background p-4 rounded-xl shadow-lg animate-bounce-subtle">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium">Live Classes</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg">
                  <div className="text-sm font-semibold">98% Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our most popular courses designed by industry experts to help you master in-demand skills.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="course-card group cursor-pointer">
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant={course.level === 'Beginner' ? 'default' : course.level === 'Intermediate' ? 'secondary' : 'destructive'}
                    >
                      {course.level}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/90 hover:bg-white text-muted-foreground hover:text-red-500"
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
                      <span className="ml-1 text-sm text-muted-foreground">{course.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{course.students} students</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">{course.price}</div>
                    <Button className="btn-primary" asChild>
                      <a href="/api/login">Enroll Now</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/courses">
                View All Courses
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose Techdoor Academy?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're committed to providing the highest quality education and support for your learning journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have already transformed their careers with our courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg" asChild>
              <a href="/api/login">
                <GraduationCap className="mr-2 h-5 w-5" />
                Get Started Free
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link href="/courses">
                Browse Courses
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
