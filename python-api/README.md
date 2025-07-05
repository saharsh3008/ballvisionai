
# Tennis Ball Analysis API

A FastAPI-based computer vision service for analyzing tennis ball movement in videos.

## Features

- Real-time tennis ball detection using YOLO v8
- Ball trajectory tracking and analysis
- Speed calculation (km/h)
- Bounce detection
- Comprehensive video analysis metrics

## Setup Instructions

### Option 1: Local Development

1. **Install Python 3.9+**

2. **Install dependencies:**
   ```bash
   cd python-api
   pip install -r requirements.txt
   ```

3. **Run the API:**
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000`

### Option 2: Docker

1. **Build and run with Docker Compose:**
   ```bash
   cd python-api
   docker-compose up --build
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /analyze-video
Analyzes a tennis video for ball tracking.

**Request:**
```json
{
  "video_url": "https://example.com/video.mp4",
  "video_name": "tennis_match.mp4",
  "video_id": "uuid-string"
}
```

**Response:**
```json
{
  "total_bounces": 15,
  "average_speed": 45.8,
  "max_speed": 78.2,
  "min_speed": 12.5,
  "processing_time_seconds": 8,
  "frames_analyzed": 420,
  "ball_detection_confidence": 0.94,
  "trajectory_data": [
    {"x": 100, "y": 200, "time": 0.1}
  ]
}
```

### GET /health
Health check endpoint.

### GET /
API information and available endpoints.

## Configuration

The API automatically downloads the YOLO v8 nano model on first run. For better accuracy, you can replace `yolov8n.pt` with `yolov8s.pt` or `yolov8m.pt` in the code.

## Performance Notes

- The API processes every 2nd frame for better performance
- Ball detection confidence threshold is set to 0.3
- Speed calculations use rough court dimension estimates
- Unrealistic speeds (>200 km/h) are filtered out

## Integration

Set the `PYTHON_API_URL` environment variable in your Supabase Edge Function to:
- Local: `http://localhost:8000`
- Docker: `http://localhost:8000`
- Production: Your deployed API URL

## Troubleshooting

1. **YOLO model fails to load:** The model will download automatically on first run
2. **OpenCV issues:** Make sure system dependencies are installed (see Dockerfile)
3. **Memory issues:** Use smaller YOLO model (yolov8n.pt) or reduce video resolution
4. **Network issues:** Ensure the API can access video URLs from your storage

## Next Steps

1. **Deploy to cloud:** Use services like Railway, Render, or AWS
2. **Improve accuracy:** Fine-tune YOLO model with tennis-specific data
3. **Add video processing:** Generate annotated videos with ball tracking overlays
4. **Scale processing:** Add background job queues for large videos
