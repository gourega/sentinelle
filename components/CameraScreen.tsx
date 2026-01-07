
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraScreenProps {
  onCapture: (image: string) => void;
  onCancel: () => void;
  ghostImage?: string; // Image à superposer en transparence pour le suivi
}

const CameraScreen: React.FC<CameraScreenProps> = ({ onCapture, onCancel, ghostImage }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' },
          audio: false 
        });
        setStream(mediaStream);
        if (videoRef.current) { videoRef.current.srcObject = mediaStream; }
      } catch (err) {}
    };
    startCamera();
    return () => { if (stream) { stream.getTracks().forEach(track => track.stop()); } };
  }, []);

  const takePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        onCapture(canvas.toDataURL('image/jpeg'));
      }
    }
  }, [onCapture]);

  return (
    <div className="relative h-screen w-full flex flex-col bg-black overflow-hidden">
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 h-full w-full object-cover opacity-90" />
      
      {/* Ghost Overlay for tracking evolution */}
      {ghostImage && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen grayscale">
          <img src={ghostImage} className="w-full h-full object-cover" alt="Ghost" />
          <div className="absolute inset-0 bg-primary/20"></div>
        </div>
      )}

      <div className="relative z-10 flex items-center justify-between px-6 pt-12 pb-4 w-full bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={onCancel} className="flex items-center justify-center size-10 rounded-full bg-black/20 backdrop-blur-md text-white">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex-1 text-center">
          {ghostImage && <p className="text-[10px] font-black uppercase text-primary tracking-widest animate-pulse">Mode Suivi : Alignez les repères</p>}
        </div>
      </div>

      <div className="flex-grow relative z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="relative w-72 h-72">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
        </div>
      </div>

      <div className="relative z-20 w-full flex flex-col items-center justify-end pb-10 pt-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <button onClick={takePhoto} className="relative flex items-center justify-center size-20 rounded-full border-[4px] border-white active:scale-90 transition-all">
          <div className="w-16 h-16 bg-white rounded-full"></div>
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraScreen;
