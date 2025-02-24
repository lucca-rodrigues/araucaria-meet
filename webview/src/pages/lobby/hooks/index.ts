import { useState, useRef, useEffect } from 'react';
import { useMedia } from '@/contexts/mediaContext';
import { LobbyServices } from '../domain';

export default function useLobby() {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [pageData, setPageData] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const service = new LobbyServices();

  const {
    isVideoEnabled,
    isAudioEnabled,
    setVideoEnabled,
    setAudioEnabled,
    videoDeviceId,
    audioDeviceId,
  } = useMedia();

  useEffect(() => {
    async function setupMediaDevices() {
      try {
        if (isVideoEnabled) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: videoDeviceId ? { deviceId: videoDeviceId } : true,
          });
          setVideoStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }

        if (isAudioEnabled) {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: audioDeviceId ? { deviceId: audioDeviceId } : true,
          });
          setAudioStream(stream);
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    }

    setupMediaDevices();

    return () => {
      videoStream?.getTracks().forEach((track) => track.stop());
      audioStream?.getTracks().forEach((track) => track.stop());
    };
  }, [isVideoEnabled, isAudioEnabled, videoDeviceId, audioDeviceId]);

  const toggleVideo = () => {
    setVideoEnabled(!isVideoEnabled);
    videoStream?.getTracks().forEach(track => track.enabled = !track.enabled);
  };

  const toggleAudio = () => {
    setAudioEnabled(!isAudioEnabled);
    audioStream?.getTracks().forEach(track => track.enabled = !track.enabled);
  };

  const handleJoinMeeting = () => {
    console.log('Joining meeting with:', { videoStream, audioStream });
  };

  async function getLobby() {
    const response = await service.get();
    setPageData(response);
  }

  return {
    videoStream,
    audioStream,
    setVideoStream,
    setAudioStream,
    toggleVideo,
    toggleAudio,
    handleJoinMeeting,
    videoRef,
    isVideoEnabled,
    isAudioEnabled,
    watchFields: {},
    getLobby,
    pageData
  };
}