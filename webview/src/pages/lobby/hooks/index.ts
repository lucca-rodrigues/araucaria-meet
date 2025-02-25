import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedia } from '@/contexts/mediaContext';
import apiService from '@/infra/services/api';

export default function useLobby() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [userName, setUserName] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);

  // Estados para agendamento
  const [isSchedulingMode, setIsSchedulingMode] = useState(false);
  const [scheduleTitle, setScheduleTitle] = useState('');
  const [scheduleDescription, setScheduleDescription] = useState('');
  const [scheduleOwnerEmail, setScheduleOwnerEmail] = useState('');
  const [scheduleParticipantEmail, setScheduleParticipantEmail] = useState('');
  const [scheduleParticipants, setScheduleParticipants] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduleEndDate, setScheduleEndDate] = useState('');
  const [scheduleEndTime, setScheduleEndTime] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleError, setScheduleError] = useState('');

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

  const handleCreateRoom = async () => {
    if (!userName.trim()) {
      return;
    }

    try {
      setIsCreatingRoom(true);

      // Armazenar nome do usuário para uso posterior
      localStorage.setItem('userName', userName);

      const room = await apiService.createRoom(userName, isVideoEnabled, isAudioEnabled);

      // Corrigir a rota para usar o caminho definido em routes.tsx
      navigate(`/room-meeting?roomId=${room.roomId}`);
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!userName.trim() || !roomId.trim()) {
      return;
    }

    try {
      setIsJoiningRoom(true);

      // Armazenar nome do usuário para uso posterior
      localStorage.setItem('userName', userName);

      await apiService.joinRoom(roomId, userName, isVideoEnabled, isAudioEnabled);

      // Corrigir a rota para usar o caminho definido em routes.tsx
      navigate(`/room-meeting?roomId=${roomId}`);
    } catch (error) {
      console.error('Error joining room:', error);
    } finally {
      setIsJoiningRoom(false);
    }
  };

  const toggleSchedulingMode = () => {
    setIsSchedulingMode(!isSchedulingMode);
  };

  const addParticipant = () => {
    if (scheduleParticipantEmail && !scheduleParticipants.includes(scheduleParticipantEmail)) {
      setScheduleParticipants([...scheduleParticipants, scheduleParticipantEmail]);
      setScheduleParticipantEmail('');
    }
  };

  const removeParticipant = (email: string) => {
    setScheduleParticipants(scheduleParticipants.filter((p) => p !== email));
  };

  const handleScheduleRoom = async () => {
    setScheduleError('');

    if (
      !scheduleTitle ||
      !scheduleOwnerEmail ||
      !scheduleDate ||
      !scheduleTime ||
      !scheduleEndDate ||
      !scheduleEndTime
    ) {
      setScheduleError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Verificar formato de email do organizador
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(scheduleOwnerEmail)) {
      setScheduleError('Email do organizador inválido');
      return;
    }

    // Verificar emails dos participantes
    for (const email of scheduleParticipants) {
      if (!emailRegex.test(email)) {
        setScheduleError(`Email inválido para o participante: ${email}`);
        return;
      }
    }

    // Converter as datas e horas para o formato correto
    const startDateObj = new Date(`${scheduleDate}T${scheduleTime}`);
    const endDateObj = new Date(`${scheduleEndDate}T${scheduleEndTime}`);

    // Verificar se a data de início é anterior à data de término
    if (startDateObj >= endDateObj) {
      setScheduleError('A data de início deve ser anterior à data de término');
      return;
    }

    try {
      setIsScheduling(true);

      // Chamar a API para agendar a sala
      const room = await apiService.scheduleRoom(
        scheduleOwnerEmail,
        scheduleParticipants,
        startDateObj,
        endDateObj,
        scheduleTitle,
        scheduleDescription
      );

      // Limpar campos e mostrar mensagem de sucesso
      resetScheduleForm();
      // Mostrar algum feedback de sucesso (você pode adicionar um estado para isso)
      alert(`Reunião agendada com sucesso! ID da sala: ${room.roomId}`);
    } catch (error) {
      console.error('Error scheduling room:', error);
      setScheduleError('Erro ao agendar reunião. Por favor, tente novamente.');
    } finally {
      setIsScheduling(false);
    }
  };

  const resetScheduleForm = () => {
    setIsSchedulingMode(false);
    setScheduleTitle('');
    setScheduleDescription('');
    setScheduleOwnerEmail('');
    setScheduleParticipantEmail('');
    setScheduleParticipants([]);
    setScheduleDate('');
    setScheduleTime('');
    setScheduleEndDate('');
    setScheduleEndTime('');
    setScheduleError('');
  };

  const getLobby = useCallback(() => {
    // Método para carregar dados iniciais da tela de lobby, se necessário
    const savedUserName = localStorage.getItem('userName');
    if (savedUserName) {
      setUserName(savedUserName);
    }
  }, []);

  return {
    videoRef,
    userName,
    setUserName,
    roomId,
    setRoomId,
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
    handleCreateRoom,
    handleJoinRoom,
    isCreatingRoom,
    isJoiningRoom,
    // Estados e métodos para agendamento
    isSchedulingMode,
    toggleSchedulingMode,
    scheduleTitle,
    setScheduleTitle,
    scheduleDescription,
    setScheduleDescription,
    scheduleOwnerEmail,
    setScheduleOwnerEmail,
    scheduleParticipantEmail,
    setScheduleParticipantEmail,
    scheduleParticipants,
    addParticipant,
    removeParticipant,
    scheduleDate,
    setScheduleDate,
    scheduleTime,
    setScheduleTime,
    scheduleEndDate,
    setScheduleEndDate,
    scheduleEndTime,
    setScheduleEndTime,
    handleScheduleRoom,
    isScheduling,
    scheduleError,
    resetScheduleForm,
    getLobby,
    // Para compatibilidade com o template
    handleJoinMeeting: () => {
      if (roomId) {
        handleJoinRoom();
      } else {
        handleCreateRoom();
      }
    },
    // Estado de espera (pode ser usado para indicar que está aguardando aprovação)
    isWaiting: isJoiningRoom || isCreatingRoom,
  };
}
