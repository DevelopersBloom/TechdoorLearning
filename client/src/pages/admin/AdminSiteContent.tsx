import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface SiteContent {
  id: number;
  section: string;
  key: string;
  value: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSiteContent() {
  const { toast } = useToast();

  const { data: content = [], isLoading } = useQuery<SiteContent[]>({
    queryKey: ["/api/admin/site-content"],
  });

  const updateContentMutation = useMutation({
    mutationFn: async ({ section, key, value, type }: { section: string; key: string; value: string; type: string }) => {
      return apiRequest(`/api/admin/site-content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, key, value, type }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-content"] });
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update content",
        variant: "destructive",
      });
    },
  });

  const deleteContentMutation = useMutation({
    mutationFn: async ({ section, key }: { section: string; key: string }) => {
      return apiRequest(`/api/admin/site-content`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, key }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-content"] });
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error", 
        description: error.message || "Failed to delete content",
        variant: "destructive",
      });
    },
  });

  const getContentValue = (section: string, key: string): string => {
    const item = content.find((c: SiteContent) => c.section === section && c.key === key);
    return item?.value || "";
  };

  const handleSave = (section: string, key: string, value: string, type: string = "text") => {
    if (!value.trim()) return;
    updateContentMutation.mutate({ section, key, value, type });
  };

  const handleDelete = (section: string, key: string) => {
    deleteContentMutation.mutate({ section, key });
  };

  const ContentField = ({ 
    title, 
    section,
    contentKey, 
    description, 
    type = "text", 
    multiline = false 
  }: { 
    title: string; 
    section: string;
    contentKey: string; 
    description: string; 
    type?: string; 
    multiline?: boolean;
  }) => {
    const [value, setValue] = useState(getContentValue(section, contentKey));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {multiline ? (
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Enter ${title.toLowerCase()}`}
              rows={4}
            />
          ) : (
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Enter ${title.toLowerCase()}`}
            />
          )}
          <div className="flex justify-between">
            <Button
              onClick={() => handleSave(section, contentKey, value, type)}
              disabled={updateContentMutation.isPending}
              size="sm"
            >
              {updateContentMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save
            </Button>
            {value && (
              <Button
                onClick={() => handleDelete(section, contentKey)}
                disabled={deleteContentMutation.isPending}
                variant="destructive"
                size="sm"
              >
                {deleteContentMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Delete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
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
      <div>
        <h1 className="text-3xl font-bold">Site Content Management</h1>
        <p className="text-muted-foreground">
          Manage content that appears throughout your website
        </p>
      </div>

      <Tabs defaultValue="homepage" className="space-y-6">
        <TabsList>
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="instructors">Instructors</TabsTrigger>
        </TabsList>

        <TabsContent value="homepage" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ContentField
              title="Main Title"
              section="homepage"
              contentKey="main_title"
              description="The main headline on your homepage"
            />
            <ContentField
              title="Subtitle"
              section="homepage"
              contentKey="subtitle"
              description="Supporting text under the main title"
            />
            <ContentField
              title="Welcome Text"
              section="homepage"
              contentKey="welcome_text"
              description="Introduction text for new visitors"
              multiline
            />
            <ContentField
              title="Hero Button Text"
              section="homepage"
              contentKey="hero_button"
              description="Text for the main call-to-action button"
            />
          </div>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <div className="grid gap-6">
            <ContentField
              title="About Title"
              section="about"
              contentKey="title"
              description="Main title for the about page"
            />
            <ContentField
              title="About Description"
              section="about"
              contentKey="description"
              description="Main content describing your academy"
              multiline
            />
            <ContentField
              title="Mission Statement"
              section="about"
              contentKey="mission"
              description="Your academy's mission and values"
              multiline
            />
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ContentField
              title="Contact Title"
              section="contact"
              contentKey="title"
              description="Title for the contact page"
            />
            <ContentField
              title="Phone Number"
              section="contact"
              contentKey="phone"
              description="Primary contact phone number"
            />
            <ContentField
              title="Email Address"
              section="contact"
              contentKey="email"
              description="Primary contact email"
            />
            <ContentField
              title="Office Address"
              section="contact"
              contentKey="address"
              description="Physical office address"
              multiline
            />
          </div>
        </TabsContent>

        <TabsContent value="instructors" className="space-y-6">
          <div className="grid gap-6">
            <ContentField
              title="Instructors Page Title"
              section="instructors"
              contentKey="title"
              description="Main title for the instructors page"
            />
            <ContentField
              title="Instructors Description"
              section="instructors"
              contentKey="description"
              description="Introduction text about your instructors"
              multiline
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}