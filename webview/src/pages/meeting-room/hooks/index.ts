import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMedia } from '@/contexts/mediaContext';
import apiService, { Participant, Room, Message } from '@/infra/services/api';
import socketService from '@/infra/services/socket';

export default function useMeetingRoom() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLeavingRoom, setIsLeavingRoom] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    isVideoEnabled,
    isAudioEnabled,
    setVideoEnabled,
    setAudioEnabled,
    videoDeviceId,
    audioDeviceId,
  } = useMedia();

  // Obter roomId da URL
  const getRoomIdFromUrl = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    const roomId = searchParams.get('roomId');
    console.log('RoomId from URL:', roomId);

    if (!roomId) {
      console.error('Room ID not found in URL');
      setError('ID da sala não encontrado na URL');
    }

    return roomId;
  }, [location.search]);

  // Configurar a conexão WebSocket
  const setupSocketConnection = useCallback(() => {
    const roomId = getRoomIdFromUrl();

    if (!roomId) return;

    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');

    if (!userId || !userName) {
      setError('Informações do usuário não encontradas');
      return;
    }

    // Conectar ao WebSocket
    socketService.connect();

    // Entrar na sala
    socketService.joinRoom(roomId, {
      id: userId,
      userName,
      isVideoEnabled,
      isAudioEnabled,
    });

    // Configurar handlers para eventos de WebSocket
    socketService.on('participant-joined', (participant: Participant) => {
      setParticipants((prev) => [...prev, participant]);
    });

    socketService.on('participant-left', (data: { participantId: string }) => {
      setParticipants((prev) => prev.filter((p) => p.id !== data.participantId));
    });

    socketService.on('room-participants', (roomParticipants: Participant[]) => {
      setParticipants(roomParticipants);
    });

    socketService.on(
      'participant-media-toggle',
      (data: { participantId: string; type: 'video' | 'audio'; enabled: boolean }) => {
        const { participantId, type, enabled } = data;

        setParticipants((prev) =>
          prev.map((p) => {
            if (p.id === participantId) {
              return {
                ...p,
                isVideoEnabled: type === 'video' ? enabled : p.isVideoEnabled,
                isAudioEnabled: type === 'audio' ? enabled : p.isAudioEnabled,
              };
            }
            return p;
          })
        );
      }
    );

    socketService.on('new-message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketService.on('room-messages', (messages: Message[]) => {
      setMessages(messages);
    });

    socketService.on('room-error', (error: { message: string }) => {
      setError(error.message);
    });

    return () => {
      // Remover os handlers de eventos ao desmontar
      socketService.off('participant-joined', () => {});
      socketService.off('participant-left', () => {});
      socketService.off('room-participants', () => {});
      socketService.off('participant-media-toggle', () => {});
      socketService.off('new-message', () => {});
      socketService.off('room-messages', () => {});
      socketService.off('room-error', () => {});

      // Sair da sala e desconectar
      socketService.leaveRoom();
      socketService.disconnect();
    };
  }, [getRoomIdFromUrl, isVideoEnabled, isAudioEnabled]);

  // Configurar dispositivos de mídia
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

  // Função principal para carregar a sala
  const getMeetingRoom = useCallback(async () => {
    const roomId = getRoomIdFromUrl();
    console.log('Loading meeting room with ID:', roomId);

    if (!roomId) {
      navigate('/');
      return;
    }

    try {
      // Primeiro tentar obter os detalhes da sala
      const room = await apiService.getRoomById(roomId);
      setRoom(room);

      // Inicializar a lista de participantes
      if (room.participants) {
        setParticipants(room.participants);
      }

      // Verificar se o usuário já está na sala
      const userId = localStorage.getItem('userId');
      const isParticipant = room.participants.some((p) => p.id === userId);

      if (!isParticipant) {
        console.log('User not in room, attempting to join automatically');
        // Se não for participante, tenta entrar automaticamente
        const userName = localStorage.getItem('userName') || 'Usuário';

        try {
          // Tentar entrar na sala
          await apiService.joinRoom(roomId, userName, isVideoEnabled, isAudioEnabled);
          console.log('Joined room successfully via direct URL');

          // Buscar novamente os detalhes da sala após o join
          const updatedRoom = await apiService.getRoomById(roomId);
          setRoom(updatedRoom);
          setParticipants(updatedRoom.participants);
        } catch (joinError) {
          console.error('Error joining room via URL:', joinError);
          setError('Não foi possível entrar na sala automaticamente');
          // Redirecionar para a página inicial
          navigate('/');
          return;
        }
      }

      // Buscar mensagens da sala
      const roomMessages = await apiService.getMessages(roomId);
      setMessages(roomMessages);

      // Configurar a conexão WebSocket
      setupSocketConnection();
    } catch (error) {
      console.error('Error loading meeting room:', error);
      setError('Erro ao carregar a sala de reunião');
      navigate('/');
    }
  }, [getRoomIdFromUrl, navigate, isVideoEnabled, isAudioEnabled, setupSocketConnection]);

  // Carregar detalhes da sala e configurar WebSocket
  useEffect(() => {
    getMeetingRoom();
  }, [getMeetingRoom]);

  // Alternar vídeo
  const toggleVideo = () => {
    const newState = !isVideoEnabled;
    setVideoEnabled(newState);
    videoStream?.getTracks().forEach((track) => (track.enabled = newState));

    // Notificar outros participantes
    const roomId = getRoomIdFromUrl();
    if (roomId) {
      socketService.toggleMedia('video', newState);
    }
  };

  // Alternar áudio
  const toggleAudio = () => {
    const newState = !isAudioEnabled;
    setAudioEnabled(newState);
    audioStream?.getTracks().forEach((track) => (track.enabled = newState));

    // Notificar outros participantes
    const roomId = getRoomIdFromUrl();
    if (roomId) {
      socketService.toggleMedia('audio', newState);
    }
  };

  // Enviar mensagem no chat
  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    socketService.sendMessage(currentMessage);
    setCurrentMessage('');
  };

  // Sair da sala de reunião
  const handleLeaveMeeting = async () => {
    setIsLeavingRoom(true);

    try {
      const roomId = getRoomIdFromUrl();
      if (roomId) {
        await apiService.leaveRoom(roomId);
      }

      socketService.leaveRoom();
      socketService.disconnect();

      navigate('/');
    } catch (error) {
      console.error('Error leaving meeting:', error);
    } finally {
      setIsLeavingRoom(false);
    }
  };

  // Encerrar a reunião (apenas para o host)
  const handleEndMeeting = async () => {
    setIsLeavingRoom(true);

    try {
      const roomId = getRoomIdFromUrl();
      if (roomId) {
        await apiService.endRoom(roomId);
      }

      socketService.leaveRoom();
      socketService.disconnect();

      navigate('/');
    } catch (error) {
      console.error('Error ending meeting:', error);
    } finally {
      setIsLeavingRoom(false);
    }
  };

  // Verificar se o usuário atual é o host da sala
  const isHost = room?.hostId === localStorage.getItem('userId');

  return {
    videoRef,
    room,
    participants,
    messages,
    currentMessage,
    setCurrentMessage,
    sendMessage,
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
    handleLeaveMeeting,
    handleEndMeeting,
    isLeavingRoom,
    error,
    isHost,
    getMeetingRoom,
    // Para compatibilidade com o template
    handleSendMessage: sendMessage,
    currentUser: {
      id: localStorage.getItem('userId') || '',
      userName: localStorage.getItem('userName') || 'Você',
      isVideoEnabled,
      isAudioEnabled,
      isSpeaking: false,
    },
  };
}
