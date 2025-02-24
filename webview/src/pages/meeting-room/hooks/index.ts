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
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentUser, setCurrentUser] = useState<Participant>({ 
    id: 'current-user',
    userName: 'You',
    isVideoEnabled: false,
    isAudioEnabled: false,
    isSpeaking: false
  });

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
          setCurrentUser(prev => ({ ...prev, isVideoEnabled: true }));
        }

        if (isAudioEnabled) {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: audioDeviceId ? { deviceId: audioDeviceId } : true,
          });
          setAudioStream(stream);
          setCurrentUser(prev => ({ ...prev, isAudioEnabled: true }));
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
    setCurrentUser(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }));
  };

  const toggleAudio = () => {
    setAudioEnabled(!isAudioEnabled);
    audioStream?.getTracks().forEach(track => track.enabled = !track.enabled);
    setCurrentUser(prev => ({ ...prev, isAudioEnabled: !prev.isAudioEnabled }));
  };

  const handleLeaveMeeting = () => {
    navigate('/');
  };

  async function getMeetingRoom() {
    try {
      const response = await service.get();
      setPageData(response);
      // Initialize with current user as the only participant for now
      setParticipants([currentUser]);
    } catch (error) {
      console.error('Error fetching meeting room:', error);
      // Handle error appropriately
    }
  }

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userName: currentUser.userName,
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
    handleSendMessage,
    participants,
    currentUser
  };
}