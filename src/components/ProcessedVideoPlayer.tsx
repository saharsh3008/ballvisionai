
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Play } from "lucide-react";

interface ProcessedVideoPlayerProps {
  videoUrl: string;
  videoName: string;
  originalVideoName: string;
}

const ProcessedVideoPlayer = ({ videoUrl, videoName, originalVideoName }: ProcessedVideoPlayerProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = videoName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="h-5 w-5 text-green-600" />
            Processed Video with Tracking Overlays
          </div>
          <Button onClick={handleDownload} variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
            <Play className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 font-medium">Video with Computer Vision Overlays</p>
            <p className="text-sm text-gray-500 mt-1">
              Ball tracking circles • Trajectory lines • Speed annotations
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Original: {originalVideoName}
            </p>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Demo Mode:</strong> Video processing simulation completed. 
                In production, this would show the actual processed video with ball tracking overlays, 
                speed annotations, and trajectory visualization like in professional tennis analysis tools.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="font-medium text-blue-900">Ball Detection</p>
              <p className="text-blue-700">Real-time tracking circles</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="font-medium text-green-900">Trajectory Lines</p>
              <p className="text-green-700">Complete ball path visualization</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="font-medium text-purple-900">Speed Annotations</p>
              <p className="text-purple-700">Live speed data overlay</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessedVideoPlayer;
