
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Play, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProcessedVideoPlayerProps {
  videoUrl: string;
  videoName: string;
  originalVideoName: string;
}

const ProcessedVideoPlayer = ({ videoUrl, videoName, originalVideoName }: ProcessedVideoPlayerProps) => {
  const handleDownload = () => {
    // Create a download link
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = videoName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your processed video is being downloaded.",
    });
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-green-600" />
          Processed Video Output
        </CardTitle>
        <p className="text-sm text-gray-600">
          Video with ball tracking, trajectory lines, and speed overlays
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <Eye className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Enhanced Video Features:</p>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• Real-time ball tracking overlay</li>
                <li>• Speed annotations on each frame</li>
                <li>• Trajectory path visualization</li>
                <li>• Bounce detection markers</li>
                <li>• Performance statistics display</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          <video 
            controls 
            className="w-full h-full rounded-lg"
            poster="/placeholder.svg"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">{videoName}</p>
            <p className="text-sm text-gray-600">Processed from: {originalVideoName}</p>
          </div>
          <Button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessedVideoPlayer;
