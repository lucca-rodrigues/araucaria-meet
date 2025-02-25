import { io, Socket } from 'socket.io-client';
import { Participant, Message } from './api';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

type EventCallback<T = any> = (arg: T) => void;

interface MessageData {
  roomId: string;
  message: string;
  userId: string;
  userName: string;
}

class SocketService {
  private socket: Socket | null = null;
  private roomId: string | null = null;
  private callbacks: Record<string, EventCallback[]> = {};

  // Inicializa a conexão WebSocket
  connect(): void {
    if (this.socket) return;

    this.socket = io(SOCKET_URL);
    this.setupListeners();
  }

  // Desconecta o WebSocket
  disconnect(): void {
    if (!this.socket) return;

    this.socket.disconnect();
    this.socket = null;
    this.roomId = null;
  }

  // Configura os listeners padrão do WebSocket
  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.emit('connect');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.emit('disconnect');
    });

    this.socket.on('participant-joined', (participant: Participant) => {
      console.log('Participant joined:', participant);
      this.emit('participant-joined', participant);
    });

    this.socket.on('participant-left', (data: { participantId: string }) => {
      console.log('Participant left:', data);
      this.emit('participant-left', data);
    });

    this.socket.on('room-participants', (participants: Participant[]) => {
      console.log('Received room participants:', participants);
      this.emit('room-participants', participants);
    });

    this.socket.on(
      'participant-media-toggle',
      (data: { participantId: string; type: 'video' | 'audio'; enabled: boolean }) => {
        console.log('Participant toggled media:', data);
        this.emit('participant-media-toggle', data);
      }
    );

    this.socket.on('new-message', (message: Message) => {
      console.log('New message:', message);
      this.emit('new-message', message);
    });

    this.socket.on('room-messages', (messages: Message[]) => {
      console.log('Received room messages:', messages);
      this.emit('room-messages', messages);
    });

    this.socket.on('room-error', (error: { message: string }) => {
      console.error('Room error:', error);
      this.emit('room-error', error);
    });
  }

  // Entra em uma sala
  joinRoom(roomId: string, participant: Participant): void {
    if (!this.socket) {
      this.connect();
    }

    this.roomId = roomId;
    this.socket?.emit('join-room', { roomId, participant });
  }

  // Sai de uma sala
  leaveRoom(): void {
    if (!this.socket || !this.roomId) return;

    const userId = localStorage.getItem('userId');
    if (userId) {
      this.socket.emit('leave-room', { roomId: this.roomId, participantId: userId });
    }
  }

  // Alterna o estado de áudio/vídeo
  toggleMedia(type: 'video' | 'audio', enabled: boolean): void {
    if (!this.socket || !this.roomId) return;

    const userId = localStorage.getItem('userId');
    if (userId) {
      this.socket.emit('toggle-media', {
        roomId: this.roomId,
        participantId: userId,
        type,
        enabled,
      });
    }
  }

  // Envia uma mensagem no chat
  sendMessage(message: string): void {
    if (!this.socket || !this.roomId) return;

    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName') || 'Usuário';

    const messageData: MessageData = {
      roomId: this.roomId,
      message: message,
      userId: userId || '',
      userName: userName,
    };

    this.socket.emit('send-message', messageData);
  }

  // Registra um callback para um evento
  on<T = any>(event: string, callback: EventCallback<T>): void {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback as EventCallback);
  }

  // Remove um callback para um evento
  off(event: string, callback: EventCallback): void {
    if (!this.callbacks[event]) return;

    this.callbacks[event] = this.callbacks[event].filter((cb) => cb !== callback);
  }

  // Emite um evento para todos os callbacks registrados
  private emit(event: string, ...args: unknown[]): void {
    if (!this.callbacks[event]) return;

    const arg = args.length === 1 ? args[0] : args;
    for (const callback of this.callbacks[event]) {
      callback(arg);
    }
  }
}

export default new SocketService();
