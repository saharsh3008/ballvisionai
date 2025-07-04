
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { videoId } = await req.json()

    // Update status to processing
    await supabaseClient
      .from('video_analyses')
      .update({ status: 'processing' })
      .eq('id', videoId)

    // Get the original video info
    const { data: videoInfo } = await supabaseClient
      .from('video_analyses')
      .select('video_name, video_url')
      .eq('id', videoId)
      .single()

    // Simulate computer vision processing
    // In a real implementation, you would:
    // 1. Download the video from storage
    // 2. Process it with OpenCV or similar
    // 3. Extract ball tracking data
    // 4. Generate processed video with overlays
    // 5. Upload processed video to storage
    
    console.log('Starting video processing for:', videoInfo?.video_name)
    await new Promise(resolve => setTimeout(resolve, 8000)) // Simulate longer processing time

    // Generate processed video filename
    const originalName = videoInfo?.video_name || 'video'
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
    const processedVideoName = `${nameWithoutExt}_processed.mp4`

    // Simulate uploading processed video (in real implementation, this would be the actual processed video)
    // For now, we'll use the same video URL but with a different name to simulate
    const processedVideoUrl = videoInfo?.video_url // In real implementation, this would be the new processed video URL

    // Mock computer vision results
    const analysisResults = {
      status: 'completed',
      total_bounces: Math.floor(Math.random() * 30) + 15,
      average_speed: Math.round((Math.random() * 30 + 40) * 100) / 100,
      max_speed: Math.round((Math.random() * 20 + 70) * 100) / 100,
      min_speed: Math.round((Math.random() * 15 + 15) * 100) / 100,
      processing_time_seconds: 8,
      frames_analyzed: Math.floor(Math.random() * 500) + 300,
      ball_detection_confidence: Math.round((Math.random() * 0.3 + 0.7) * 100) / 100,
      trajectory_data: generateMockTrajectory(),
      processed_video_url: processedVideoUrl,
      processed_video_name: processedVideoName
    }

    console.log('Processing complete, updating record with results')

    // Update the record with analysis results
    const { error } = await supabaseClient
      .from('video_analyses')
      .update(analysisResults)
      .eq('id', videoId)

    if (error) {
      console.error('Error updating analysis record:', error)
      throw error
    }

    console.log('Video processing completed successfully')

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing video:', error)
    
    // Update status to failed if possible
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )
      
      const { videoId } = await req.json()
      await supabaseClient
        .from('video_analyses')
        .update({ status: 'failed' })
        .eq('id', videoId)
    } catch (updateError) {
      console.error('Failed to update status to failed:', updateError)
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

function generateMockTrajectory() {
  const trajectory = []
  for (let i = 0; i <= 20; i++) {
    const x = i * 4
    const y = Math.sin(i * 0.3) * 10 + 15 + Math.random() * 5
    trajectory.push({ x, y, time: i * 0.1 })
  }
  return trajectory
}
