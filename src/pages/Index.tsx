
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import VideoUpload from "@/components/VideoUpload";
import AnalysisResults from "@/components/AnalysisResults";
import { Upload, Activity, Target, TrendingUp } from "lucide-react";

const Index = () => {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleVideoUpload = (file: File) => {
    setUploadedVideo(file);
    // Simulate analysis process
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      // Mock analysis data
      setAnalysisData({
        totalBounces: 24,
        averageSpeed: 45.2,
        maxSpeed: 62.8,
        trajectory: [
          { x: 10, y: 20, time: 0 },
          { x: 25, y: 15, time: 0.5 },
          { x: 40, y: 30, time: 1.0 },
          { x: 55, y: 10, time: 1.5 },
          { x: 70, y: 25, time: 2.0 },
        ],
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Target className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Tennis Ball Tracker</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced AI-powered tennis ball tracking and analysis. Upload your tennis videos to get detailed insights on ball trajectory, speed, and bounce patterns.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <Upload className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Easy Upload</h3>
              <p className="text-gray-600">Drag and drop your tennis videos for instant analysis</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <Activity className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">Advanced AI tracks ball movement frame by frame</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-gray-600">Get insights on speed, trajectory, and bounce patterns</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {!uploadedVideo ? (
          <VideoUpload onVideoUpload={handleVideoUpload} />
        ) : (
          <AnalysisResults 
            video={uploadedVideo}
            analysisData={analysisData}
            isAnalyzing={isAnalyzing}
            onNewUpload={() => {
              setUploadedVideo(null);
              setAnalysisData(null);
              setIsAnalyzing(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
