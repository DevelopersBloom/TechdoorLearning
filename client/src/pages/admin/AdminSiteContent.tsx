import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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
  const [activeSection, setActiveSection] = useState("homepage");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: content = [], isLoading } = useQuery({
    queryKey: ["/api/admin/site-content", activeSection],
  });

  const updateContentMutation = useMutation({
    mutationFn: async (data: { section: string; key: string; value: string; type?: string }) => {
      return apiRequest("/api/admin/site-content", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-content"] });
      toast({ title: "Content updated successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update content", description: error.message, variant: "destructive" });
    },
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (data: { section: string; key: string }) => {
      return apiRequest("/api/admin/site-content", {
        method: "DELETE",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-content"] });
      toast({ title: "Content deleted successfully!" });
    },
  });

  const getContentValue = (key: string) => {
    const item = content.find((c: SiteContent) => c.key === key);
    return item?.value || "";
  };

  const handleSave = (key: string, value: string, type: string = "text") => {
    updateContentMutation.mutate({
      section: activeSection,
      key,
      value,
      type,
    });
  };

  const handleDelete = (key: string) => {
    deleteContentMutation.mutate({
      section: activeSection,
      key,
    });
  };

  const ContentField = ({ 
    title, 
    key, 
    description, 
    type = "text", 
    multiline = false 
  }: { 
    title: string; 
    key: string; 
    description: string; 
    type?: string; 
    multiline?: boolean;
  }) => {
    const [value, setValue] = useState(getContentValue(key));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
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
              onClick={() => handleSave(key, value, type)}
              disabled={updateContentMutation.isPending}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            {value && (
              <Button
                onClick={() => handleDelete(key)}
                disabled={deleteContentMutation.isPending}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
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
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Content Management</h1>
        <p className="text-muted-foreground">
          Edit the content that appears on your website pages
        </p>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection}>
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
              key="main_title"
              description="The main headline on your homepage"
            />
            <ContentField
              title="Subtitle"
              key="subtitle"
              description="Supporting text under the main title"
            />
            <ContentField
              title="Welcome Text"
              key="welcome_text"
              description="Introduction text for new visitors"
              multiline
            />
            <ContentField
              title="Hero Image URL"
              key="hero_image"
              description="URL for the main banner image"
              type="image"
            />
            <ContentField
              title="CTA Button Text"
              key="cta_text"
              description="Text for the call-to-action button"
            />
            <ContentField
              title="CTA Button Link"
              key="cta_link"
              description="Where the CTA button should link to"
            />
          </div>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ContentField
              title="Mission Statement"
              key="mission"
              description="Your organization's mission"
              multiline
            />
            <ContentField
              title="Values"
              key="values"
              description="Core values and principles"
              multiline
            />
            <ContentField
              title="Team Story"
              key="team_story"
              description="Story about your team"
              multiline
            />
            <ContentField
              title="About Image URL"
              key="about_image"
              description="URL for the about page image"
              type="image"
            />
            <ContentField
              title="Founded Year"
              key="founded_year"
              description="When was the organization founded?"
            />
            <ContentField
              title="Team Size"
              key="team_size"
              description="Number of team members"
            />
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ContentField
              title="Office Address"
              key="address"
              description="Physical office address"
              multiline
            />
            <ContentField
              title="Email Address"
              key="email"
              description="Contact email address"
            />
            <ContentField
              title="Phone Number"
              key="phone"
              description="Contact phone number"
            />
            <ContentField
              title="Business Hours"
              key="hours"
              description="When you're available"
              multiline
            />
            <ContentField
              title="Contact Hero Image"
              key="contact_image"
              description="URL for contact page image"
              type="image"
            />
          </div>
        </TabsContent>

        <TabsContent value="instructors" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ContentField
              title="Instructors Page Title"
              key="page_title"
              description="Title for the instructors page"
            />
            <ContentField
              title="Page Description"
              key="page_description"
              description="Description for the instructors page"
              multiline
            />
            <ContentField
              title="Join Our Team Text"
              key="join_team_text"
              description="Text encouraging instructors to apply"
              multiline
            />
            <ContentField
              title="Instructor Application Email"
              key="application_email"
              description="Email for instructor applications"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}