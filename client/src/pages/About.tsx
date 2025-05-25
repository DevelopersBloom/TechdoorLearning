import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Heart, 
  Rocket, 
  Users, 
  BookOpen,
  Trophy,
  Globe,
  Award
} from "lucide-react";

export default function About() {
  const stats = [
    { value: "25,000+", label: "Students Enrolled" },
    { value: "18,500+", label: "Courses Completed" },
    { value: "50+", label: "Expert Instructors" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  const values = [
    {
      icon: Target,
      title: "Quality Education",
      description: "We believe everyone deserves access to high-quality, industry-relevant technology education that transforms careers and lives."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Our learning community supports each other through collaborative projects, peer mentoring, and shared knowledge."
    },
    {
      icon: Rocket,
      title: "Innovation Focus",
      description: "We stay ahead of technology trends to ensure our curriculum remains current, relevant, and future-ready."
    },
    {
      icon: Heart,
      title: "Student Success",
      description: "Every decision we make is guided by what's best for our students' learning journey and career advancement."
    }
  ];

  const milestones = [
    {
      year: "2020",
      title: "Founded",
      description: "Techdoor Academy was established with a mission to democratize technology education."
    },
    {
      year: "2021",
      title: "First 1,000 Students",
      description: "Reached our first major milestone with students from over 50 countries."
    },
    {
      year: "2022",
      title: "Corporate Partnerships",
      description: "Formed partnerships with leading tech companies for internships and job placements."
    },
    {
      year: "2023",
      title: "10,000+ Graduates",
      description: "Celebrated over 10,000 successful course completions and career transitions."
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Expanded our reach to serve students in over 100 countries worldwide."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-emerald-50/50 to-background dark:from-primary/10 dark:via-emerald-950/50 dark:to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              About Techdoor Academy
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're on a mission to democratize technology education and empower the next generation of developers, data scientists, and tech innovators worldwide.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Mission & Story */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission & Story</h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                Founded in 2020, Techdoor Academy emerged from a simple yet powerful belief: 
                quality technology education should be accessible to everyone, regardless of their 
                background or location.
              </p>
              <p className="leading-relaxed">
                We started as a small team of passionate educators and industry professionals 
                who saw the growing gap between traditional education and the rapidly evolving 
                tech industry. Our founders, having worked at companies like Google, Meta, and 
                Tesla, understood firsthand what skills truly matter in today's job market.
              </p>
              <p className="leading-relaxed">
                Today, we're proud to have helped thousands of students transition into 
                successful tech careers, with our graduates working at top companies around 
                the world. But we're just getting started.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" 
              alt="Educational technology classroom with diverse students collaborating"
              className="rounded-2xl shadow-2xl w-full"
            />
            <div className="absolute -bottom-8 -left-8 bg-background p-6 rounded-xl shadow-lg border">
              <div className="text-3xl font-bold text-primary mb-1">5+ Years</div>
              <div className="text-sm text-muted-foreground">Teaching Excellence</div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These principles guide everything we do and shape how we serve our students and community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gradient-to-r from-primary/5 to-emerald-500/5 dark:from-primary/10 dark:to-emerald-500/10 rounded-2xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Impact in Numbers</h2>
            <p className="text-xl text-muted-foreground">
              See the measurable difference we're making in technology education
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From a small startup to a global education platform - here are the key milestones in our story.
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border lg:left-1/2 lg:transform lg:-translate-x-0.5"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-8 w-4 h-4 bg-primary rounded-full border-4 border-background lg:left-1/2 lg:transform lg:-translate-x-2 z-10"></div>
                  
                  {/* Content */}
                  <div className={`ml-20 lg:ml-0 lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge variant="outline" className="text-primary border-primary font-bold">
                            {milestone.year}
                          </Badge>
                          <h3 className="text-xl font-bold text-foreground">{milestone.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recognition */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-12">Recognition & Awards</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">Best Online Education Platform</h3>
                <p className="text-muted-foreground text-sm">EdTech Awards 2023</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">Innovation in Learning</h3>
                <p className="text-muted-foreground text-sm">Tech Education Summit 2023</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">Global Impact Award</h3>
                <p className="text-muted-foreground text-sm">Education Excellence Foundation 2024</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-primary text-primary-foreground rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Help us continue transforming lives through technology education. Whether as a student, 
            instructor, or partner, there's a place for you at Techdoor Academy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/api/login"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Start Learning Today
            </a>
            <a 
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
