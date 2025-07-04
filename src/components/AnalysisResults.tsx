
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import TrajectoryChart from "./TrajectoryChart";
import { Upload, Play, Activity, Target, Zap, RotateCcw } from "lucide-react";

interface AnalysisResultsProps {
  video: File;
  analysisData: any;
  isAnalyzing: boolean;
  onNewUpload: () => void;
}

const AnalysisResults = ({ video, analysisData, isAnalyzing, onNewUpload }: AnalysisResultsProps) => {
  if (isAnalyzing) {
    return (
      <Card className="max-w-4xl mx-auto border-0 shadow-xl">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 mb-4">
              <Activity className="h-8 w-8 text-green-600 animate-pulse" />
              <h2 className="text-2xl font-bold">Analyzing Video...</h2>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <Progress value={33} className="h-2" />
              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ Video uploaded successfully</p>
                <p className="flex items-center gap-2">
                  <Activity className="h-4 w-4 animate-spin" />
                  Detecting tennis ball in frames...
                </p>
                <p className="text-gray-400">⏳ Calculating trajectory and speed...</p>
                <p className="text-gray-400">⏳ Generating analysis report...</p>
              </div>
            </div>
            
            <p className="text-gray-500">This may take a few moments depending on video length</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisData) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Target className="h-6 w-6 text-green-600" />
                Analysis Complete
              </CardTitle>
              <p className="text-gray-600 mt-1">Video: {video.name}</p>
            </div>
            <Button onClick={onNewUpload} variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              New Analysis
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <RotateCcw className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Bounces</p>
                <p className="text-2xl font-bold text-gray-900">{analysisData.totalBounces}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Speed</p>
                <p className="text-2xl font-bold text-gray-900">{analysisData.averageSpeed} km/h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-full">
                <Zap className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Max Speed</p>
                <p className="text-2xl font-bold text-gray-900">{analysisData.maxSpeed} km/h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Video and Trajectory */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Video Player */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Original Video
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <video 
                controls 
                className="w-full h-full rounded-lg"
                src={URL.createObjectURL(video)}
              >
                Your browser does not support video playback.
              </video>
            </div>
          </CardContent>
        </Card>

        {/* Trajectory Chart */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Ball Trajectory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <TrajectoryChart data={analysisData.trajectory} />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Speed Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum Speed:</span>
                  <span className="font-medium">12.5 km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Speed:</span>
                  <span className="font-medium">{analysisData.averageSpeed} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maximum Speed:</span>
                  <span className="font-medium">{analysisData.maxSpeed} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Speed Variance:</span>
                  <span className="font-medium">±18.3 km/h</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Bounce Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bounces:</span>
                  <span className="font-medium">{analysisData.totalBounces}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Height:</span>
                  <span className="font-medium">1.2m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bounce Frequency:</span>
                  <span className="font-medium">2.1 per second</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Energy Loss:</span>
                  <span className="font-medium">15% per bounce</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResults;
