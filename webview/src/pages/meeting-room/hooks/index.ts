import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedia } from '@/contexts/mediaContext';
import { MeetingRoomServices } from '../domain';

interface ChatMessage {
  id: string;
  userName: string;
  message: string;
  timestamp: Date;
}

export default function useMeetingRoom() {
  const navigate = useNavigate();
  const service = new MeetingRoomServices();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [pageData, setPageData] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

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

  const handleLeaveMeeting = () => {
    navigate('/');
  };

  async function getMeetingRoom() {
    const response = await service.get();
    setPageData(response);
  }

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userName: 'You', // In a real app, this would come from user context
      message: message.trim(),
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  return {
    videoStream,
    audioStream,
    setVideoStream,
    setAudioStream,
    toggleVideo,
    toggleAudio,
    handleLeaveMeeting,
    videoRef,
    isVideoEnabled,
    isAudioEnabled,
    getMeetingRoom,
    pageData,
    messages,
    handleSendMessage
  };
}