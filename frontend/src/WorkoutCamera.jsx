import { useEffect, useRef, useState } from "react";
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

function WorkoutCamera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const poseRef = useRef(null);
  const animationRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Workout states
  const [reps, setReps] = useState(0);
  const [squatState, setSquatState] = useState("Stand");
  const [formStatus, setFormStatus] = useState("Ready");

  // Refs prevent duplicate counting
  const squatStateRef = useRef("Stand");
  const repsRef = useRef(0);

  // Calculate angle between three body points
  const calculateAngle = (a, b, c) => {
    const radians =
      Math.atan2(c.y - b.y, c.x - b.x) -
      Math.atan2(a.y - b.y, a.x - b.x);

    let angle = Math.abs((radians * 180) / Math.PI);

    if (angle > 180) {
      angle = 360 - angle;
    }

    return angle;
  };

  // Load MediaPipe pose model
  const loadPoseModel = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
    );

    poseRef.current = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
      },
      runningMode: "VIDEO",
      numPoses: 1,
    });
  };

  // Detect pose and count squats
  const drawPose = () => {
    if (!videoRef.current || !canvasRef.current || !poseRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      animationRef.current = requestAnimationFrame(drawPose);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const result = poseRef.current.detectForVideo(
      video,
      performance.now()
    );

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (result.landmarks && result.landmarks.length > 0) {
      const landmarks = result.landmarks[0];

      // MediaPipe landmark indexes
      const leftHip = landmarks[23];
      const leftKnee = landmarks[25];
      const leftAnkle = landmarks[27];

      const rightHip = landmarks[24];
      const rightKnee = landmarks[26];
      const rightAnkle = landmarks[28];

      // Calculate both knee angles
      const leftAngle = calculateAngle(
        leftHip,
        leftKnee,
        leftAnkle
      );

      const rightAngle = calculateAngle(
        rightHip,
        rightKnee,
        rightAnkle
      );

      // Average both knees
      const kneeAngle = (leftAngle + rightAngle) / 2;

      // Squat detection
      if (kneeAngle < 100) {
        setSquatState("Down");
        squatStateRef.current = "Down";
        setFormStatus("Good squat position");
      } else if (
        kneeAngle > 160 &&
        squatStateRef.current === "Down"
      ) {
        // One complete squat
        repsRef.current += 1;

        setReps(repsRef.current);
        setSquatState("Up");
        squatStateRef.current = "Up";
        setFormStatus("Rep completed!");
      } else if (kneeAngle > 160) {
        setSquatState("Stand");
        setFormStatus("Ready");
      }

      // Draw skeleton
      const drawingUtils = new DrawingUtils(ctx);

      drawingUtils.drawLandmarks(landmarks, {
        radius: 6,
        lineWidth: 3,
      });

      drawingUtils.drawConnectors(
        landmarks,
        PoseLandmarker.POSE_CONNECTIONS,
        {
          lineWidth: 4,
        }
      );
    }

    animationRef.current = requestAnimationFrame(drawPose);
  };

  // Start camera
  const startCamera = async () => {
    try {
      setError("");
      setLoading(true);

      await loadPoseModel();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;

      videoRef.current.srcObject = stream;

      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = resolve;
      });

      await videoRef.current.play();

      setCameraOn(true);
      setLoading(false);

      animationRef.current = requestAnimationFrame(drawPose);
    } catch (err) {
      console.error("MediaPipe startup error:", err);

      setLoading(false);

      setError(
        "MediaPipe could not start. Open the browser console for details."
      );
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);
  };

  // Cleanup when component closes
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  return (
    <div className="camera-container">
      <div className="camera-screen">

        {/* Camera */}
        <video
          ref={videoRef}
          className="camera-video"
          autoPlay
          playsInline
          muted
        />

        {/* Skeleton */}
        <canvas
          ref={canvasRef}
          className="pose-canvas"
        />

        {/* Initial screen */}
        {!cameraOn && !loading && (
          <div className="camera-overlay">
            <h3>AI Workout Camera</h3>

            <p>
              Use MediaPipe AI to detect your exercise
              posture and count squats.
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="camera-overlay">
            <h3>Loading AI Pose Detection...</h3>

            <p>
              Please wait a few seconds.
            </p>
          </div>
        )}

        {/* AI status */}
        {cameraOn && (
          <>
            <div className="pose-status">
              <span className="status-dot"></span>

              AI Pose Detection Active
            </div>

            {/* Workout statistics */}
            <div className="workout-stats">

              <div className="workout-stat">
                <strong>{reps}</strong>
                <span>Reps</span>
              </div>

              <div className="workout-stat">
                <strong>{squatState}</strong>
                <span>Position</span>
              </div>

              <div className="workout-stat">
                <strong>{formStatus}</strong>
                <span>Form</span>
              </div>

            </div>
          </>
        )}
      </div>

      {/* Camera controls */}
      <div className="camera-controls">

        {!cameraOn ? (
          <button
            onClick={startCamera}
            disabled={loading}
          >
            {loading
              ? "Loading AI..."
              : "Start AI Camera"}
          </button>
        ) : (
          <button onClick={stopCamera}>
            Stop Camera
          </button>
        )}

      </div>

      {/* Error */}
      {error && (
        <p className="camera-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default WorkoutCamera;