'use client';
import * as faceapi from '@vladmandic/face-api';
import { useEffect, useRef, useState } from 'react';

const MODEL_URL = '/models';

export default function WebFaceDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    (async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (videoRef.current) {
        (videoRef.current as HTMLVideoElement).srcObject = stream as unknown as MediaStream;
        await videoRef.current.play();
        setReady(true);
      }

      interval = window.setInterval(async () => {
        if (!videoRef.current || !canvasRef.current) return;
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        const dims = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
        faceapi.matchDimensions(canvasRef.current, dims);
        const resized = faceapi.resizeResults(detections, dims);

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, dims.width, dims.height);
        faceapi.draw.drawDetections(canvasRef.current, resized);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
        faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
      }, 150);
    })();

    return () => {
      if (interval) window.clearInterval(interval);
      const videoElement = videoRef.current;
      const s = (videoElement?.srcObject as unknown as MediaStream | null) || null;
      const tracks = s?.getTracks() ?? [];
      for (const track of tracks) {
        track.stop();
      }
    };
  }, []);

  return (
    <div className="relative w-full max-w-md">
      <video ref={videoRef} playsInline muted className="w-full h-auto rounded-lg" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <p className="mt-2 text-sm text-gray-500">{ready ? 'Modelos y cámara listos' : 'Cargando modelos...'}</p>
    </div>
  );
}


