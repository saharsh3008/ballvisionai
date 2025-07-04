
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import TrajectoryChart from "./TrajectoryChart";
import ProcessedVideoPlayer from "./ProcessedVideoPlayer";
import { Upload, Activity, Target, Zap, RotateCcw, Clock, Video } from "lucide-react";
import type { AnalysisData } from "@/hooks/useVideoAnalysis";

interface AnalysisResultsProps {
  analysisData: AnalysisData | null;
  isAnalyzing: boolean;
  uploadProgress: number;
  processingStage: string;
  onNewUpload: () => void;
}

const AnalysisResults = ({ analysisData, isAnalyzing, uploadProgress, processingStage, onNewUpload }: AnalysisResultsProps) => {
  if (isAnalyzing) {
    return (
      <Card className="max-w-4xl mx-auto border-0 shadow-xl">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 mb-4">
              <Activity className="h-8 w-8 text-green-600 animate-pulse" />
              <h2 className="text-2xl font-bold">Processing Video with Computer Vision...</h2>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <Progress value={uploadProgress} className="h-3" />
              <p className="text-lg font-medium text-green-600">{processingStage}</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ Video uploaded successfully</p>
                <p className="flex items-center gap-2">
                  <Activity className="h-4 w-4 animate-spin" />
                  Computer vision analysis in progress...
                </p>
                <p className="text-gray-500">🎾 Detecting tennis ball in each frame...</p>
                <p className="text-gray-500">📈 Calculating trajectory and speed...</p>
                <p className="text-gray-500">🎬 Generating video with tracking overlays...</p>
              </div>
            </div>
            
            <p className="text-gray-500">Advanced processing may take several minutes for high-quality analysis</p>
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
                Computer Vision Analysis Complete
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Processing Time: {analysisData.processing_time_seconds}s | 
                Frames Analyzed: {analysisData.frames_analyzed} | 
                Detection Confidence: {(analysisData.ball_detection_confidence * 100).toFixed(1)}%
              </p>
            </div>
            <Button onClick={onNewUpload} variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              New Analysis
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Processed Video Player */}
      {analysisData.processed_video_url && (
        <ProcessedVideoPlayer 
          videoUrl={analysisData.processed_video_url}
          videoName={analysisData.processed_video_name || 'processed_video.mp4'}
          originalVideoName={`Original video (ID: ${analysisData.id.slice(0, 8)})`}
        />
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <RotateCcw className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Bounces</p>
                <p className="text-2xl font-bold text-gray-900">{analysisData.total_bounces}</p>
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
                <p className="text-2xl font-bold text-gray-900">{analysisData.average_speed} km/h</p>
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
                <p className="text-2xl font-bold text-gray-900">{analysisData.max_speed} km/h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Min Speed</p>
                <p className="text-2xl font-bold text-gray-900">{analysisData.min_speed} km/h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trajectory Chart */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Ball Trajectory Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <TrajectoryChart data={analysisData.trajectory_data || []} />
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Computer Vision Results</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Speed Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum Speed:</span>
                  <span className="font-medium">{analysisData.min_speed} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Speed:</span>
                  <span className="font-medium">{analysisData.average_speed} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maximum Speed:</span>
                  <span className="font-medium">{analysisData.max_speed} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Speed Variance:</span>
                  <span className="font-medium">±{(analysisData.max_speed - analysisData.min_speed).toFixed(1)} km/h</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Processing Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bounces:</span>
                  <span className="font-medium">{analysisData.total_bounces}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frames Analyzed:</span>
                  <span className="font-medium">{analysisData.frames_analyzed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Detection Confidence:</span>
                  <span className="font-medium">{(analysisData.ball_detection_confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Time:</span>
                  <span className="font-medium">{analysisData.processing_time_seconds}s</span>
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
