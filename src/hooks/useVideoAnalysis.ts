
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AnalysisData {
  id: string;
  total_bounces: number;
  average_speed: number;
  max_speed: number;
  min_speed: number;
  trajectory_data: Array<{ x: number; y: number; time: number }>;
  processing_time_seconds: number;
  frames_analyzed: number;
  ball_detection_confidence: number;
  status: string;
  processed_video_url?: string;
  processed_video_name?: string;
  error_message?: string;
}

export const useVideoAnalysis = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadAndAnalyzeVideo = async (file: File) => {
    try {
      setIsAnalyzing(true);
      setUploadProgress(0);

      // Generate unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name}`;

      // Upload video to Supabase Storage
      toast({
        title: "Uploading video...",
        description: "Please wait while we upload your video.",
      });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('tennis-videos')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress(25);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tennis-videos')
        .getPublicUrl(filename);

      // Create video analysis record
      const { data: analysisRecord, error: insertError } = await supabase
        .from('video_analyses')
        .insert({
          video_name: file.name,
          video_size: file.size,
          video_url: publicUrl,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      setUploadProgress(50);

      toast({
        title: "Processing with AI...",
        description: "Your video is being analyzed using computer vision models.",
      });

      // Trigger video processing
      const { data: processResult, error: processError } = await supabase.functions.invoke('process-video', {
        body: { videoId: analysisRecord.id }
      });

      if (processError) {
        throw processError;
      }

      // Check if fallback was used
      if (processResult?.fallback) {
        toast({
          title: "Using demo mode",
          description: "Python API not available - showing mock analysis results.",
          variant: "default",
        });
      }

      setUploadProgress(75);

      // Poll for completion
      const pollForResults = async () => {
        const { data: result, error } = await supabase
          .from('video_analyses')
          .select('*')
          .eq('id', analysisRecord.id)
          .single();

        if (error) {
          console.error('Error polling results:', error);
          return;
        }

        if (result.status === 'completed') {
          // Safely handle trajectory_data conversion
          let trajectoryData: Array<{ x: number; y: number; time: number }> = [];
          
          if (result.trajectory_data) {
            try {
              // Handle both direct array and JSON string cases
              const rawData = typeof result.trajectory_data === 'string' 
                ? JSON.parse(result.trajectory_data) 
                : result.trajectory_data;
              
              if (Array.isArray(rawData)) {
                trajectoryData = rawData.filter((point: any) => 
                  point && 
                  typeof point.x === 'number' && 
                  typeof point.y === 'number' && 
                  typeof point.time === 'number'
                );
              }
            } catch (e) {
              console.warn('Failed to parse trajectory data:', e);
            }
          }

          setAnalysisData({
            id: result.id,
            total_bounces: result.total_bounces || 0,
            average_speed: result.average_speed || 0,
            max_speed: result.max_speed || 0,
            min_speed: result.min_speed || 0,
            trajectory_data: trajectoryData,
            processing_time_seconds: result.processing_time_seconds || 0,
            frames_analyzed: result.frames_analyzed || 0,
            ball_detection_confidence: result.ball_detection_confidence || 0,
            status: result.status,
            processed_video_url: (result as any).processed_video_url,
            processed_video_name: (result as any).processed_video_name,
            error_message: (result as any).error_message
          });
          setIsAnalyzing(false);
          setUploadProgress(100);
          
          if (processResult?.fallback) {
            toast({
              title: "Demo analysis complete!",
              description: "Showing mock results. Set up Python API for real analysis.",
            });
          } else {
            toast({
              title: "Analysis complete!",
              description: "Your video has been successfully analyzed with AI.",
            });
          }
        } else if (result.status === 'failed') {
          setIsAnalyzing(false);
          const errorMsg = (result as any).error_message || "Unknown error occurred";
          toast({
            title: "Analysis failed",
            description: `Error: ${errorMsg}`,
            variant: "destructive",
          });
        } else {
          // Continue polling
          setTimeout(pollForResults, 3000);
        }
      };

      setTimeout(pollForResults, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      setIsAnalyzing(false);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload and process video.",
        variant: "destructive",
      });
    }
  };

  const resetAnalysis = () => {
    setAnalysisData(null);
    setIsAnalyzing(false);
    setUploadProgress(0);
  };

  return {
    analysisData,
    isAnalyzing,
    uploadProgress,
    uploadAndAnalyzeVideo,
    resetAnalysis
  };
};
