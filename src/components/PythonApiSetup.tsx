
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code, Server, Zap, CheckCircle } from "lucide-react";

const PythonApiSetup = () => {
  return (
    <Card className="max-w-4xl mx-auto border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-6 w-6 text-blue-600" />
          Python Computer Vision API Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            This application now calls a Python API for real computer vision analysis. 
            You need to set up a Python service to handle the actual video processing.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Code className="h-5 w-5" />
            Required Python API Structure
          </h3>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">API Endpoint:</h4>
            <code className="text-sm bg-white p-2 rounded border block">
              POST /analyze-video
            </code>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Expected Request Body:</h4>
            <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
{`{
  "video_url": "https://...",
  "video_name": "video.mp4",
  "video_id": "uuid"
}`}
            </pre>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Expected Response:</h4>
            <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
{`{
  "total_bounces": 25,
  "average_speed": 45.8,
  "max_speed": 78.2,
  "min_speed": 12.5,
  "processing_time_seconds": 8,
  "frames_analyzed": 420,
  "ball_detection_confidence": 0.94,
  "trajectory_data": [
    {"x": 0, "y": 15, "time": 0.0},
    {"x": 4, "y": 18, "time": 0.1}
  ],
  "processed_video_url": "https://...", // optional
  "processed_video_name": "video_processed.mp4" // optional
}`}
            </pre>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Recommended Libraries
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• FastAPI or Flask (web framework)</li>
                <li>• OpenCV (computer vision)</li>
                <li>• YOLO or similar (object detection)</li>
                <li>• NumPy (numerical operations)</li>
                <li>• Pillow (image processing)</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Environment Setup</h4>
              <p className="text-sm text-blue-700">
                Set the <code>PYTHON_API_URL</code> environment variable in your Supabase Edge Function settings to point to your Python service (e.g., http://localhost:8000).
              </p>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Development Mode:</strong> When the Python API is not available, the system will fall back to mock data for testing the UI and workflow.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default PythonApiSetup;
