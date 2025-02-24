import { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LobbyServices } from "../domain";

export default function useLobby() {  
  const service = new LobbyServices();
  const [pageData, setPageData] = useState();
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const navigate = useNavigate(); 
  const { control, handleSubmit, watch, setValue, register, formState: { errors } } = useForm();
  const watchFields = watch();

  const [isLoading, setIsLoading] = useState(false); 

  async function getLobby() {
    const response = await service.get();
    setPageData(response);
  }

  const toggleVideo = async () => {
    if (isVideoEnabled) {
      if (videoStream) {
        videoStream.getTracks().forEach(track => {
          if (track.kind === 'video') {
            track.stop();
          }
        });
        setVideoStream(null);
      }
      setIsVideoEnabled(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsVideoEnabled(true);
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const handleJoinMeeting = () => {
    // Implement join meeting logic
  };

  return { 
    isLoading, 
    setIsLoading,
    control, 
    handleSubmit, 
    watch, 
    setValue, 
    watchFields,
    navigate,
    getLobby,
    pageData,
    errors,
    register,
    videoStream,
    audioStream,
    setVideoStream,
    setAudioStream,
    toggleVideo,
    toggleAudio,
    handleJoinMeeting,
    videoRef,
    isVideoEnabled,
    isAudioEnabled
  }; 
}