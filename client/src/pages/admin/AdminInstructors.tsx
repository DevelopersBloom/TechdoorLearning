import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Edit, Trash2, User, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInstructorSchema, type Instructor, type InsertInstructor } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function AdminInstructors() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

  const { data: instructors = [], isLoading } = useQuery<Instructor[]>({
    queryKey: ["/api/admin/instructors"],
  });

  const form = useForm({
    defaultValues: {
      name: "",
      title: "",
      bio: "",
      profileImageUrl: "",
      expertise: "",
      rating: "",
      studentCount: 0,
    },
  });

  const createInstructorMutation = useMutation({
    mutationFn: async (data: InsertInstructor) => {
      return apiRequest("/api/admin/instructors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/instructors"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Instructor created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create instructor",
        variant: "destructive",
      });
    },
  });

  const updateInstructorMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertInstructor> }) => {
      return apiRequest(`/api/admin/instructors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/instructors"] });
      setIsDialogOpen(false);
      setEditingInstructor(null);
      form.reset();
      toast({
        title: "Success",
        description: "Instructor updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update instructor",
        variant: "destructive",
      });
    },
  });

  const deleteInstructorMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/instructors/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/instructors"] });
      toast({
        title: "Success",
        description: "Instructor deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete instructor",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    // Convert expertise string to array (handle comma-separated values)
    let expertiseArray: string[] = [];
    if (data.expertise) {
      if (typeof data.expertise === 'string') {
        // Split by comma and trim whitespace
        expertiseArray = data.expertise.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
      } else if (Array.isArray(data.expertise)) {
        expertiseArray = data.expertise;
      }
    }
    
    const processedData = {
      ...data,
      expertise: expertiseArray
    };
    
    if (editingInstructor) {
      updateInstructorMutation.mutate({ id: editingInstructor.id, data: processedData });
    } else {
      createInstructorMutation.mutate(processedData);
    }
  };

  const handleEdit = (instructor: Instructor) => {
    setEditingInstructor(instructor);
    form.reset({
      name: instructor.name,
      title: instructor.title,
      bio: instructor.bio || "",
      profileImageUrl: instructor.profileImageUrl || "",
      expertise: Array.isArray(instructor.expertise) ? instructor.expertise.join(", ") : (instructor.expertise || ""),
      rating: instructor.rating || "",
      studentCount: instructor.studentCount || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this instructor?")) {
      deleteInstructorMutation.mutate(id);
    }
  };

  const handleNewInstructor = () => {
    setEditingInstructor(null);
    form.reset({
      name: "",
      bio: "",
      photoUrl: "",
      expertise: "",
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Instructor Management</h1>
          <p className="text-muted-foreground">
            Manage your academy's instructors
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewInstructor}>
              <Plus className="w-4 h-4 mr-2" />
              Add Instructor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingInstructor ? "Edit Instructor" : "Add New Instructor"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Instructor name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expertise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expertise</FormLabel>
                      <FormControl>
                        <Input placeholder="Area of expertise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/photo.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief biography" 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createInstructorMutation.isPending || updateInstructorMutation.isPending}
                  >
                    {(createInstructorMutation.isPending || updateInstructorMutation.isPending) ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    {editingInstructor ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {instructors.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <User className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No instructors yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by adding your first instructor
            </p>
            <Button onClick={handleNewInstructor}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Instructor
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor) => (
            <Card key={instructor.id}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  {instructor.photoUrl ? (
                    <img
                      src={instructor.photoUrl}
                      alt={instructor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-lg">{instructor.name}</CardTitle>
                    {instructor.expertise && (
                      <p className="text-sm text-muted-foreground">
                        {instructor.expertise}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {instructor.bio && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {instructor.bio}
                  </p>
                )}
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(instructor)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(instructor.id)}
                    disabled={deleteInstructorMutation.isPending}
                  >
                    {deleteInstructorMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}