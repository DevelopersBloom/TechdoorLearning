import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Home from "@/pages/Home";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import About from "@/pages/About";
import Instructors from "@/pages/Instructors";
import Contact from "@/pages/Contact";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminLessons from "@/pages/admin/AdminLessons";
import AdminSiteContent from "@/pages/admin/AdminSiteContent";
import AdminInstructors from "@/pages/admin/AdminInstructors";
import AdminStudents from "@/pages/admin/AdminStudents";
import { AdminRoute } from "@/components/AdminRoute";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Authentication routes */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      {/* Main routes */}
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Home} />
        </>
      )}
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:id" component={CourseDetail} />
      <Route path="/instructors" component={Instructors} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      
      {/* Admin routes */}
      <Route path="/admin">
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      </Route>
      <Route path="/admin/courses">
        <AdminRoute>
          <AdminCourses />
        </AdminRoute>
      </Route>
      <Route path="/admin/lessons">
        <AdminRoute>
          <AdminLessons />
        </AdminRoute>
      </Route>
      <Route path="/admin/site-content">
        <AdminRoute>
          <AdminSiteContent />
        </AdminRoute>
      </Route>
      <Route path="/admin/instructors">
        <AdminRoute>
          <AdminInstructors />
        </AdminRoute>
      </Route>
      <Route path="/admin/students">
        <AdminRoute>
          <AdminStudents />
        </AdminRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="techdoor-theme">
        <TooltipProvider>
          <Layout>
            <Router />
          </Layout>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
