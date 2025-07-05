
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
import numpy as np
import requests
import tempfile
import os
from typing import List, Dict, Any
import time
from ultralytics import YOLO
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Tennis Ball Analysis API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLO model for ball detection
try:
    model = YOLO('yolov8n.pt')  # Using nano model for speed
    logger.info("YOLO model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load YOLO model: {e}")
    model = None

class VideoAnalysisRequest(BaseModel):
    video_url: str
    video_name: str
    video_id: str

class TrajectoryPoint(BaseModel):
    x: float
    y: float
    time: float

class AnalysisResponse(BaseModel):
    total_bounces: int
    average_speed: float
    max_speed: float
    min_speed: float
    processing_time_seconds: int
    frames_analyzed: int
    ball_detection_confidence: float
    trajectory_data: List[TrajectoryPoint]
    processed_video_url: str = None
    processed_video_name: str = None

def download_video(url: str) -> str:
    """Download video from URL to temporary file"""
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
        
        for chunk in response.iter_content(chunk_size=8192):
            temp_file.write(chunk)
        
        temp_file.close()
        return temp_file.name
    except Exception as e:
        logger.error(f"Failed to download video: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to download video: {e}")

def detect_ball_in_frame(frame, model):
    """Detect tennis ball in a single frame"""
    if model is None:
        return None, 0.0
    
    try:
        results = model(frame, classes=[32])  # Class 32 is typically 'sports ball'
        
        if len(results[0].boxes) > 0:
            # Get the detection with highest confidence
            best_detection = None
            best_confidence = 0.0
            
            for box in results[0].boxes:
                confidence = float(box.conf[0])
                if confidence > best_confidence:
                    best_confidence = confidence
                    best_detection = box
            
            if best_detection is not None and best_confidence > 0.3:  # Confidence threshold
                x1, y1, x2, y2 = best_detection.xyxy[0].cpu().numpy()
                center_x = (x1 + x2) / 2
                center_y = (y1 + y2) / 2
                return (int(center_x), int(center_y)), best_confidence
        
        return None, 0.0
    except Exception as e:
        logger.error(f"Error in ball detection: {e}")
        return None, 0.0

def calculate_speed(point1, point2, time_diff, fps):
    """Calculate speed between two points"""
    if point1 is None or point2 is None or time_diff <= 0:
        return 0.0
    
    # Calculate pixel distance
    dx = point2[0] - point1[0]
    dy = point2[1] - point1[1]
    pixel_distance = np.sqrt(dx**2 + dy**2)
    
    # Convert to real-world distance (rough estimation)
    # Assuming tennis court is ~23.77m long and video width represents court width
    meters_per_pixel = 23.77 / 1920  # Rough approximation
    real_distance = pixel_distance * meters_per_pixel
    
    # Calculate speed in m/s then convert to km/h
    speed_ms = real_distance / time_diff
    speed_kmh = speed_ms * 3.6
    
    return speed_kmh

def detect_bounces(trajectory_data: List[TrajectoryPoint]) -> int:
    """Detect ball bounces by analyzing trajectory changes"""
    if len(trajectory_data) < 3:
        return 0
    
    bounces = 0
    min_bounce_height_change = 20  # Minimum pixel change to consider a bounce
    
    for i in range(1, len(trajectory_data) - 1):
        prev_point = trajectory_data[i - 1]
        curr_point = trajectory_data[i]
        next_point = trajectory_data[i + 1]
        
        # Check if ball direction changes significantly (bounce pattern)
        if (prev_point.y < curr_point.y and next_point.y < curr_point.y and 
            abs(curr_point.y - prev_point.y) > min_bounce_height_change):
            bounces += 1
    
    return bounces

def analyze_video(video_path: str) -> AnalysisResponse:
    """Analyze tennis video for ball tracking"""
    start_time = time.time()
    
    try:
        # Open video
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError("Could not open video file")
        
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        trajectory_data = []
        speeds = []
        confidences = []
        frames_analyzed = 0
        
        frame_number = 0
        prev_position = None
        prev_time = 0
        
        logger.info(f"Processing video: {total_frames} frames at {fps} FPS")
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            current_time = frame_number / fps
            
            # Detect ball in current frame
            ball_position, confidence = detect_ball_in_frame(frame, model)
            
            if ball_position is not None:
                trajectory_data.append(TrajectoryPoint(
                    x=float(ball_position[0]),
                    y=float(ball_position[1]),
                    time=current_time
                ))
                
                confidences.append(confidence)
                
                # Calculate speed if we have previous position
                if prev_position is not None:
                    time_diff = current_time - prev_time
                    speed = calculate_speed(prev_position, ball_position, time_diff, fps)
                    if speed > 0 and speed < 200:  # Filter unrealistic speeds
                        speeds.append(speed)
                
                prev_position = ball_position
                prev_time = current_time
            
            frames_analyzed += 1
            frame_number += 1
            
            # Process every 2nd frame for performance
            cap.read()
            frame_number += 1
        
        cap.release()
        
        # Calculate statistics
        total_bounces = detect_bounces(trajectory_data)
        avg_speed = np.mean(speeds) if speeds else 0.0
        max_speed = np.max(speeds) if speeds else 0.0
        min_speed = np.min(speeds) if speeds else 0.0
        avg_confidence = np.mean(confidences) if confidences else 0.0
        
        processing_time = int(time.time() - start_time)
        
        logger.info(f"Analysis complete: {len(trajectory_data)} detections, {total_bounces} bounces")
        
        return AnalysisResponse(
            total_bounces=total_bounces,
            average_speed=round(avg_speed, 2),
            max_speed=round(max_speed, 2),
            min_speed=round(min_speed, 2),
            processing_time_seconds=processing_time,
            frames_analyzed=frames_analyzed,
            ball_detection_confidence=round(avg_confidence, 2),
            trajectory_data=trajectory_data
        )
        
    except Exception as e:
        logger.error(f"Error analyzing video: {e}")
        raise HTTPException(status_code=500, detail=f"Error analyzing video: {e}")

@app.post("/analyze-video", response_model=AnalysisResponse)
async def analyze_video_endpoint(request: VideoAnalysisRequest):
    """Main endpoint for tennis ball video analysis"""
    logger.info(f"Received analysis request for video: {request.video_name}")
    
    video_path = None
    try:
        # Download video
        video_path = download_video(request.video_url)
        
        # Analyze video
        result = analyze_video(video_path)
        
        logger.info(f"Analysis completed successfully for video: {request.video_name}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    finally:
        # Clean up temporary file
        if video_path and os.path.exists(video_path):
            try:
                os.unlink(video_path)
            except Exception as e:
                logger.warning(f"Failed to clean up temp file: {e}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "timestamp": time.time()
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Tennis Ball Analysis API",
        "version": "1.0.0",
        "endpoints": {
            "analyze": "/analyze-video",
            "health": "/health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
