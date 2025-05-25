import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, BookOpen, ExternalLink } from "lucide-react";
import type { Instructor } from "@shared/schema";

export default function Instructors() {
  const { data: instructors, isLoading } = useQuery<Instructor[]>({
    queryKey: ["/api/instructors"],
  });

  const featuredInstructors = [
    {
      name: "Sarah Johnson",
      title: "Senior Full Stack Developer",
      company: "Ex-Google, Ex-Meta",
      bio: "Sarah brings over 8 years of experience in full-stack development, having worked on large-scale applications at Google and Meta. She specializes in React, Node.js, and cloud architecture.",
      expertise: ["React", "Node.js", "AWS", "TypeScript"],
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop",
      rating: "4.9",
      students: "12,500",
      courses: "15"
    },
    {
      name: "Dr. Michael Chen",
      title: "Data Science Lead",
      company: "Ex-Tesla, Ex-Netflix",
      bio: "PhD in Machine Learning from Stanford. Michael has led data science teams at Tesla and Netflix, working on recommendation systems and autonomous vehicle AI.",
      expertise: ["Python", "Machine Learning", "TensorFlow", "Statistics"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
      rating: "4.8",
      students: "8,900",
      courses: "12"
    },
    {
      name: "Lisa Rodriguez",
      title: "Mobile Development Specialist",
      company: "Ex-Uber, Ex-Spotify",
      bio: "Lisa has 6+ years of experience building scalable mobile applications at Uber and Spotify. She's an expert in React Native and native iOS/Android development.",
      expertise: ["React Native", "Swift", "Kotlin", "Mobile UX"],
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
      rating: "4.7",
      students: "5,200",
      courses: "8"
    },
    {
      name: "Alex Rodriguez",
      title: "DevOps Engineer",
      company: "Ex-Amazon, Ex-Microsoft",
      bio: "Alex spent 7 years at Amazon and Microsoft building cloud infrastructure and CI/CD pipelines. Expert in AWS, Docker, Kubernetes, and automation.",
      expertise: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop",
      rating: "4.9",
      students: "6,800",
      courses: "10"
    },
    {
      name: "Emily Watson",
      title: "UI/UX Design Lead",
      company: "Ex-Apple, Ex-Adobe",
      bio: "Emily led design teams at Apple and Adobe, creating user experiences for millions of users. She specializes in design systems, prototyping, and user research.",
      expertise: ["Figma", "Design Systems", "User Research", "Prototyping"],
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop",
      rating: "4.8",
      students: "4,500",
      courses: "7"
    },
    {
      name: "David Kim",
      title: "Cybersecurity Expert",
      company: "Ex-NSA, Ex-FireEye",
      bio: "David has 10+ years in cybersecurity, including work at NSA and FireEye. He specializes in penetration testing, security architecture, and threat analysis.",
      expertise: ["Penetration Testing", "Security Architecture", "Incident Response", "Compliance"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
      rating: "4.9",
      students: "3,200",
      courses: "6"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const displayInstructors = instructors && instructors.length > 0 ? instructors : featuredInstructors;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-emerald-50/50 to-background dark:from-primary/10 dark:via-emerald-950/50 dark:to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Meet Our Expert Instructors
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn from industry professionals with years of experience at top tech companies. 
              Our instructors bring real-world expertise directly to your learning journey.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Expert Instructors</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground">Years Avg Experience</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">25+</div>
              <div className="text-muted-foreground">Top Companies</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">4.8</div>
              <div className="text-muted-foreground">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Instructors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayInstructors.map((instructor, index) => (
            <Card key={instructor.id || index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <img
                    src={instructor.profileImageUrl || featuredInstructors[index]?.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"}
                    alt={instructor.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover shadow-lg group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2">{instructor.name}</h3>
                <p className="text-primary font-medium mb-3">{instructor.title}</p>
                
                {featuredInstructors[index]?.company && (
                  <p className="text-sm text-muted-foreground mb-4">{featuredInstructors[index].company}</p>
                )}
                
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {instructor.bio || featuredInstructors[index]?.bio}
                </p>
                
                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {(instructor.expertise || featuredInstructors[index]?.expertise || []).slice(0, 4).map((skill: string, skillIndex: number) => (
                    <Badge key={skillIndex} variant="outline" className="text-primary border-primary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-semibold">
                        {instructor.rating ? parseFloat(instructor.rating).toFixed(1) : featuredInstructors[index]?.rating || "4.8"}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-primary mr-1" />
                      <span className="font-semibold">
                        {instructor.studentCount ? instructor.studentCount.toLocaleString() : featuredInstructors[index]?.students || "0"}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <BookOpen className="h-4 w-4 text-primary mr-1" />
                      <span className="font-semibold">{featuredInstructors[index]?.courses || "5"}</span>
                    </div>
                    <div className="text-muted-foreground text-xs">Courses</div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Courses
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Join as Instructor CTA */}
        <section className="mt-20 bg-gradient-to-r from-primary/5 to-emerald-500/5 dark:from-primary/10 dark:to-emerald-500/10 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Become an Instructor</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Share your expertise with thousands of eager learners. Join our community of world-class instructors 
            and help shape the next generation of tech professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/contact">
                Apply to Teach
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/contact">
                Learn More
              </a>
            </Button>
          </div>
        </section>

        {/* What Makes Our Instructors Special */}
        <section className="mt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">What Makes Our Instructors Special</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our rigorous selection process ensures you learn from the best in the industry.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Industry Veterans</h3>
                <p className="text-muted-foreground">
                  All our instructors have 5+ years of experience at top tech companies and startups.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Teaching Excellence</h3>
                <p className="text-muted-foreground">
                  Every instructor goes through our comprehensive teaching methodology training program.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Continuous Learning</h3>
                <p className="text-muted-foreground">
                  Our instructors stay current with the latest technologies and industry best practices.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
