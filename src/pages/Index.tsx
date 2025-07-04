
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import VideoUpload from "@/components/VideoUpload";
import AnalysisResults from "@/components/AnalysisResults";
import { useVideoAnalysis } from "@/hooks/useVideoAnalysis";
import { Upload, Activity, Target, TrendingUp, Video } from "lucide-react";

const Index = () => {
  const { 
    analysisData, 
    isAnalyzing, 
    uploadProgress, 
    processingStage, 
    uploadAndAnalyzeVideo, 
    resetAnalysis 
  } = useVideoAnalysis();

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
            Advanced AI-powered tennis ball tracking and analysis. Upload your tennis videos to get detailed insights with visual tracking overlays, speed analysis, and trajectory visualization.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
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
              <h3 className="text-lg font-semibold mb-2">Computer Vision</h3>
              <p className="text-gray-600">Advanced AI tracks ball movement frame by frame</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <Video className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Visual Overlays</h3>
              <p className="text-gray-600">Get processed videos with tracking circles and speed data</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-gray-600">Complete analysis of speed, trajectory, and bounce patterns</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {!analysisData && !isAnalyzing ? (
          <VideoUpload onVideoUpload={uploadAndAnalyzeVideo} />
        ) : (
          <AnalysisResults 
            analysisData={analysisData}
            isAnalyzing={isAnalyzing}
            uploadProgress={uploadProgress}
            processingStage={processingStage}
            onNewUpload={resetAnalysis}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
