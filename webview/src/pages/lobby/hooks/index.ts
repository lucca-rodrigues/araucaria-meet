import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedia } from '@/contexts/mediaContext';
import { LobbyServices } from '../domain';

export default function useLobby() {
  const navigate = useNavigate();
  const service = new LobbyServices();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [pageData, setPageData] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);

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
    videoStream?.getTracks().forEach((track) => (track.enabled = !track.enabled));
  };

  const toggleAudio = () => {
    setAudioEnabled(!isAudioEnabled);
    audioStream?.getTracks().forEach((track) => (track.enabled = !track.enabled));
  };

  const handleJoinMeeting = async () => {
    if (!userName.trim()) {
      return;
    }

    try {
      // const response = await service.create({
      //   userName,
      //   isVideoEnabled,
      //   isAudioEnabled,
      // });

      // const hasParticipants = response?.participants?.length > 0;

      // if (hasParticipants) {
      //   setIsWaiting(true);
      //   // Poll for approval status
      //   const pollInterval = setInterval(async () => {
      //     const status = await service.get();
      //     if (status?.approved) {
      //       clearInterval(pollInterval);
      //       navigate('/meeting-room');
      //     }
      //   }, 3000);
      // } else {
      //   // If no participants, directly navigate to meeting room
      //   navigate('/meeting-room');
      // }
      navigate('/meeting-room');
    } catch (error) {
      console.error('Error joining meeting:', error);
    }
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
    userName,
    setUserName,
    isWaiting,
    getLobby,
    pageData,
  };
}
