
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileVideo, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VideoUploadProps {
  onVideoUpload: (file: File) => void;
}

const VideoUpload = ({ onVideoUpload }: VideoUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (videoFile) {
      handleFileSelect(videoFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file (MP4, AVI, MOV, etc.)",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast({
        title: "File too large",
        description: "Please upload a video file smaller than 100MB",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onVideoUpload(selectedFile);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="max-w-2xl mx-auto border-0 shadow-xl">
      <CardContent className="p-8">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragOver
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-green-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <>
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Upload Tennis Video</h3>
              <p className="text-gray-600 mb-6">
                Drag and drop your tennis video here, or click to browse
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-600 hover:bg-green-700"
              >
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <p className="text-sm text-gray-400 mt-4">
                Supported formats: MP4, AVI, MOV, WMV (Max 100MB)
              </p>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 p-4 bg-green-50 rounded-lg">
                <FileVideo className="h-8 w-8 text-green-600" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleUpload}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Process Video
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change File
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoUpload;
