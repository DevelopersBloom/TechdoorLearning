import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Trash2, UserCheck, ArrowLeft, Calendar, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import type { User } from "@shared/schema";

export default function AdminStudents() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["/api/admin/students"],
  });

  const promoteToAdminMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await apiRequest(`/api/admin/students/${userId}/promote`, {
        method: "PUT",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/students"] });
      toast({
        title: "Success",
        description: "Student promoted to admin successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to promote student to admin",
        variant: "destructive",
      });
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await apiRequest(`/api/admin/students/${userId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/students"] });
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive",
      });
    },
  });

  const filteredStudents = students.filter((student: User) =>
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePromoteToAdmin = (userId: string) => {
    if (confirm("Are you sure you want to promote this student to admin?")) {
      promoteToAdminMutation.mutate(userId);
    }
  };

  const handleDeleteStudent = (userId: string) => {
    if (confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      deleteStudentMutation.mutate(userId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Student Management</h1>
        </div>
        <div className="text-center py-8">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Student Management</h1>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search students by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4">
        {filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? "No students found matching your search." : "No students found."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredStudents.map((student: User) => (
            <Card key={student.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {student.firstName && student.lastName 
                          ? `${student.firstName} ${student.lastName}`
                          : student.email}
                        {student.isAdmin && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {student.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined {student.createdAt ? format(new Date(student.createdAt), 'MMM d, yyyy') : 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!student.isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePromoteToAdmin(student.id)}
                        disabled={promoteToAdminMutation.isPending}
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Promote to Admin
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteStudent(student.id)}
                      disabled={deleteStudentMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}