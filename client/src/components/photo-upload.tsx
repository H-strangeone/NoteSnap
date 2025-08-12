import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { X, Upload, Camera, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadProps {
  onUpload: (file: File, caption: string) => Promise<void>;
  onCancel: () => void;
  isUploading?: boolean;
  goalId?: string;
}

export default function PhotoUpload({ onUpload, onCancel, isUploading = false, goalId }: PhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      await onUpload(selectedFile, caption);
      toast({
        title: "Photo uploaded",
        description: "Your progress photo has been saved",
      });
      handleCancel();
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview("");
    setCaption("");
    onCancel();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Progress Photo</h3>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {!selectedFile ? (
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <p className="text-slate-600 mb-2">Click to upload a photo</p>
              <p className="text-sm text-slate-400">PNG, JPG up to 5MB</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => {
                  setSelectedFile(null);
                  setPreview("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Caption</label>
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Describe your progress..."
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1"
              >
                {isUploading ? "Uploading..." : "Upload Photo"}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}