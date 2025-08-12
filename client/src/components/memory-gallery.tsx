import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  Camera, 
  Heart, 
  MessageCircle, 
  Trash2, 
  Plus,
  X,
  Calendar,
  Image as ImageIcon
} from "lucide-react";
import PhotoUpload from "./photo-upload";

interface MemoryGalleryProps {
  goalId?: string;
  userId?: string;
}

export default function MemoryGallery({ goalId, userId }: MemoryGalleryProps) {
  const { toast } = useToast();
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  // Get photo memories
  const { data: memories, isLoading } = useQuery({
    queryKey: ["/api/memories", { goalId, userId }],
    retry: false,
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: async ({ file, caption }: { file: File; caption: string }) => {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('caption', caption);
      if (goalId) formData.append('goalId', goalId);

      const response = await fetch('/api/memories/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memories"] });
      setShowUpload(false);
      toast({
        title: "Photo uploaded",
        description: "Your memory has been saved to your gallery",
      });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (memoryId: string) => {
      return await apiRequest("DELETE", `/api/memories/${memoryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memories"] });
      toast({
        title: "Photo deleted",
        description: "Memory has been removed from your gallery",
      });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Failed to delete photo. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpload = async (file: File, caption: string) => {
    await uploadPhotoMutation.mutateAsync({ file, caption });
  };

  const handleDelete = async (memoryId: string) => {
    if (confirm("Are you sure you want to delete this memory?")) {
      await deletePhotoMutation.mutateAsync(memoryId);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-primary" />
              <span>Progress Memories</span>
            </CardTitle>
            <Button
              onClick={() => setShowUpload(true)}
              size="sm"
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Photo</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {memories && memories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memories.map((memory: any) => (
                <div key={memory.id} className="group relative">
                  <div className="aspect-square overflow-hidden rounded-lg bg-slate-100">
                    <img
                      src={memory.photoUrl}
                      alt={memory.caption || "Progress photo"}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onClick={() => setSelectedPhoto(memory)}
                    />
                  </div>
                  
                  {/* Overlay with delete button */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(memory.id)}
                      disabled={deletePhotoMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Caption and date */}
                  <div className="mt-2 space-y-1">
                    {memory.caption && (
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {memory.caption}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(memory.createdAt), 'MMM d, yyyy')}</span>
                      </span>
                      {memory.tags && memory.tags.length > 0 && (
                        <div className="flex space-x-1">
                          {memory.tags.slice(0, 2).map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No memories yet</h3>
              <p className="text-slate-600 mb-4">
                Start capturing your progress with photos and build your journey gallery
              </p>
              <Button onClick={() => setShowUpload(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Photo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <PhotoUpload
            onUpload={handleUpload}
            onCancel={() => setShowUpload(false)}
            isUploading={uploadPhotoMutation.isPending}
            goalId={goalId}
          />
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white"
                onClick={() => setSelectedPhoto(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <img
                src={selectedPhoto.photoUrl}
                alt={selectedPhoto.caption || "Progress photo"}
                className="w-full max-h-96 object-contain"
              />
              
              <div className="p-6">
                {selectedPhoto.caption && (
                  <p className="text-lg text-slate-800 mb-4">{selectedPhoto.caption}</p>
                )}
                
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(selectedPhoto.createdAt), 'MMMM d, yyyy "at" h:mm a')}</span>
                  </span>
                  
                  {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
                    <div className="flex space-x-2">
                      {selectedPhoto.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}