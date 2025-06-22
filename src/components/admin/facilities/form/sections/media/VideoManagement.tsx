import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Video, VideoIcon, Trash2, Edit, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/useTranslation";

interface FacilityVideo {
  id: number;
  facility_id: number;
  title: string;
  description: string;
  url: string;
  source: string; // 'youtube', 'vimeo', etc.
  created_at: string;
  display_order: number;
  is_featured: boolean;
}

interface VideoManagementProps {
  facilityId: number;
}

export const VideoManagement: React.FC<VideoManagementProps> = ({ facilityId }) => {
  const { tSync } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<FacilityVideo | null>(null);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoDescription, setNewVideoDescription] = useState("");

  // Fetch videos
  const { data: videos, isLoading } = useQuery({
    queryKey: ["facility-videos", facilityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facility_videos")
        .select("*")
        .eq("facility_id", facilityId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as FacilityVideo[];
    },
    enabled: !!facilityId,
  });

  // Add video mutation
  const addVideoMutation = useMutation({
    mutationFn: async (videoData: Partial<FacilityVideo>) => {
      const { data, error } = await supabase
        .from("facility_videos")
        .insert([{ ...videoData, facility_id: facilityId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facility-videos", facilityId] });
      resetForm();
      toast({
        title: tSync("admin.facility.videos.addSuccess", "Video added"),
        description: tSync(
          "admin.facility.videos.addSuccessDesc",
          "The video has been successfully added to this facility."
        ),
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: tSync("admin.facility.videos.addError", "Error adding video"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update video mutation
  const updateVideoMutation = useMutation({
    mutationFn: async (videoData: Partial<FacilityVideo>) => {
      const { data, error } = await supabase
        .from("facility_videos")
        .update(videoData)
        .eq("id", videoData.id!)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facility-videos", facilityId] });
      resetForm();
      toast({
        title: tSync("admin.facility.videos.updateSuccess", "Video updated"),
        description: tSync(
          "admin.facility.videos.updateSuccessDesc",
          "The video has been successfully updated."
        ),
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: tSync("admin.facility.videos.updateError", "Error updating video"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete video mutation
  const deleteVideoMutation = useMutation({
    mutationFn: async (videoId: number) => {
      const { error } = await supabase
        .from("facility_videos")
        .delete()
        .eq("id", videoId);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facility-videos", facilityId] });
      toast({
        title: tSync("admin.facility.videos.deleteSuccess", "Video removed"),
        description: tSync(
          "admin.facility.videos.deleteSuccessDesc",
          "The video has been successfully removed from this facility."
        ),
      });
    },
    onError: (error) => {
      toast({
        title: tSync("admin.facility.videos.deleteError", "Error removing video"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleVideoSubmit = () => {
    if (!newVideoUrl.trim()) {
      toast({
        title: tSync("admin.facility.videos.urlRequired", "URL required"),
        description: tSync(
          "admin.facility.videos.urlRequiredDesc",
          "Please provide a valid URL for the video."
        ),
        variant: "destructive",
      });
      return;
    }

    // Extract video source from URL (simplified example)
    let source = "other";
    if (newVideoUrl.includes("youtube.com") || newVideoUrl.includes("youtu.be")) {
      source = "youtube";
    } else if (newVideoUrl.includes("vimeo.com")) {
      source = "vimeo";
    }

    if (currentVideo) {
      updateVideoMutation.mutate({
        id: currentVideo.id,
        title: newVideoTitle,
        description: newVideoDescription,
        url: newVideoUrl,
        source,
      });
    } else {
      addVideoMutation.mutate({
        title: newVideoTitle,
        description: newVideoDescription,
        url: newVideoUrl,
        source,
        display_order: videos?.length || 0,
        is_featured: !videos || videos.length === 0, // First video is featured
      });
    }
  };

  const resetForm = () => {
    setNewVideoUrl("");
    setNewVideoTitle("");
    setNewVideoDescription("");
    setCurrentVideo(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (video: FacilityVideo) => {
    setCurrentVideo(video);
    setNewVideoUrl(video.url);
    setNewVideoTitle(video.title);
    setNewVideoDescription(video.description);
    setIsDialogOpen(true);
  };

  const handleDeleteVideo = (videoId: number) => {
    if (confirm(tSync("admin.facility.videos.confirmDelete", "Are you sure you want to delete this video?"))) {
      deleteVideoMutation.mutate(videoId);
    }
  };

  // Extract YouTube/Vimeo ID from URL (simplified)
  const getEmbedUrl = (url: string, source: string): string => {
    if (source === "youtube") {
      const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    } else if (source === "vimeo") {
      const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|)(\d+)/);
      if (match && match[1]) {
        return `https://player.vimeo.com/video/${match[1]}`;
      }
    }
    return url; // Return original if not matching
  };

  return (
    <div className="space-y-8">
      {/* Add Video Button */}
      <div className="flex justify-end">
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {tSync("admin.facility.videos.addNew", "Add New Video")}
        </Button>
      </div>

      {/* Video listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-2 flex items-center justify-center py-12">
            <div className="text-gray-500">
              {tSync("admin.common.loading", "Loading...")}
            </div>
          </div>
        ) : !videos || videos.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-500 bg-gray-50 border border-gray-100 rounded-md">
            <VideoIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>
              {tSync(
                "admin.facility.videos.noVideos",
                "No videos have been added for this facility yet."
              )}
            </p>
            <Button onClick={openAddDialog} variant="outline" className="mt-4">
              {tSync("admin.facility.videos.addFirst", "Add your first video")}
            </Button>
          </div>
        ) : (
          videos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <div className="aspect-video relative bg-black">
                <iframe
                  src={getEmbedUrl(video.url, video.source)}
                  className="w-full h-full"
                  allowFullScreen
                  title={video.title}
                ></iframe>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-start justify-between">
                  <span className="text-base">{video.title}</span>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEditDialog(video)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteVideo(video.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-500 line-clamp-2">
                  {video.description || tSync("admin.facility.videos.noDescription", "No description provided.")}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Video Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentVideo
                ? tSync("admin.facility.videos.editVideo", "Edit Video")
                : tSync("admin.facility.videos.addVideo", "Add New Video")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="video-url">
                {tSync("admin.facility.videos.videoUrl", "Video URL")}
              </Label>
              <Input
                id="video-url"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                placeholder={tSync(
                  "admin.facility.videos.videoUrlPlaceholder",
                  "e.g., https://youtube.com/watch?v=..."
                )}
              />
              <p className="text-xs text-gray-500">
                {tSync(
                  "admin.facility.videos.supportedPlatforms",
                  "Supported platforms: YouTube, Vimeo"
                )}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-title">
                {tSync("admin.facility.videos.videoTitle", "Title")}
              </Label>
              <Input
                id="video-title"
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                placeholder={tSync(
                  "admin.facility.videos.videoTitlePlaceholder",
                  "Enter a title for this video"
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-description">
                {tSync("admin.facility.videos.videoDescription", "Description")}
              </Label>
              <Textarea
                id="video-description"
                value={newVideoDescription}
                onChange={(e) => setNewVideoDescription(e.target.value)}
                placeholder={tSync(
                  "admin.facility.videos.videoDescriptionPlaceholder",
                  "Enter a description for this video (optional)"
                )}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
            >
              {tSync("common.cancel", "Cancel")}
            </Button>
            <Button onClick={handleVideoSubmit}>
              {currentVideo
                ? tSync("common.save", "Save")
                : tSync("common.add", "Add")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
