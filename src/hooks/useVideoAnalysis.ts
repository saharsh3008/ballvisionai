
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
}

export const useVideoAnalysis = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');

  const uploadAndAnalyzeVideo = async (file: File) => {
    try {
      setIsAnalyzing(true);
      setUploadProgress(0);
      setProcessingStage('Uploading video...');

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

      setUploadProgress(30);
      setProcessingStage('Initializing computer vision analysis...');

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
      setProcessingStage('Starting video processing...');

      // Trigger video processing
      const { error: processError } = await supabase.functions.invoke('process-video', {
        body: { videoId: analysisRecord.id }
      });

      if (processError) {
        throw processError;
      }

      setUploadProgress(60);

      // Poll for completion with detailed status updates
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

        if (result.status === 'processing') {
          setUploadProgress(Math.min(85, uploadProgress + 5));
          setProcessingStage('Processing video with computer vision...');
          setTimeout(pollForResults, 2000);
        } else if (result.status === 'completed') {
          // Properly handle trajectory_data conversion from Json to our expected type
          const trajectoryData = Array.isArray(result.trajectory_data) 
            ? result.trajectory_data as Array<{ x: number; y: number; time: number }>
            : [];

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
            processed_video_url: result.processed_video_url,
            processed_video_name: result.processed_video_name
          });
          setIsAnalyzing(false);
          setUploadProgress(100);
          setProcessingStage('Complete!');
          toast({
            title: "Analysis complete!",
            description: "Your video has been processed with tracking overlays.",
          });
        } else if (result.status === 'failed') {
          setIsAnalyzing(false);
          setProcessingStage('');
          toast({
            title: "Analysis failed",
            description: "There was an error processing your video.",
            variant: "destructive",
          });
        } else {
          // Continue polling
          setTimeout(pollForResults, 2000);
        }
      };

      setTimeout(pollForResults, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setIsAnalyzing(false);
      setProcessingStage('');
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
    setProcessingStage('');
  };

  return {
    analysisData,
    isAnalyzing,
    uploadProgress,
    processingStage,
    uploadAndAnalyzeVideo,
    resetAnalysis
  };
};
