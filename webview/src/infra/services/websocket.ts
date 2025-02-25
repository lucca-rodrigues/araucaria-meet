import { io, Socket } from 'socket.io-client';
import { Participant, Message } from './api';

interface RtcData {
  to: string;
  from: string;
  [key: string]: any;
}

class WebSocketService {
  private socket: Socket | null = null;
  private participants: Participant[] = [];
  private messages: Message[] = [];
  private participantListeners: ((participants: Participant[]) => void)[] = [];
  private messageListeners: ((messages: Message[]) => void)[] = [];
  private offerHandler: ((data: RtcData) => void) | null = null;
  private answerHandler: ((data: RtcData) => void) | null = null;
  private iceCandidateHandler: ((data: RtcData) => void) | null = null;

  public connect(roomId: string): void {
    if (this.socket) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    this.socket = io(serverUrl, {
      query: {
        roomId,
        userId,
      },
    });

    this.setupListeners();
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connection-success', (data: { socketId: string }) => {
      console.log('Connection established with socket ID:', data.socketId);
    });

    this.socket.on('participants', (participants: Participant[]) => {
      this.participants = participants;
      this.participantListeners.forEach((listener) => listener(participants));
    });

    this.socket.on('user-joined', (participant: Participant) => {
      console.log('User joined:', participant);
    });

    this.socket.on('user-left', (participantId: string) => {
      console.log('User left:', participantId);
    });

    this.socket.on('offer', (data: RtcData) => {
      if (this.offerHandler) {
        this.offerHandler(data);
      }
    });

    this.socket.on('answer', (data: RtcData) => {
      if (this.answerHandler) {
        this.answerHandler(data);
      }
    });

    this.socket.on('ice-candidate', (data: RtcData) => {
      if (this.iceCandidateHandler) {
        this.iceCandidateHandler(data);
      }
    });

    this.socket.on('receive-message', (message: Message) => {
      this.messages.push(message);
      this.messageListeners.forEach((listener) => listener([...this.messages]));
    });

    this.socket.on('receive-messages', (messages: Message[]) => {
      this.messages = messages;
      this.messageListeners.forEach((listener) => listener([...this.messages]));
    });
  }

  public onParticipantsUpdated(listener: (participants: Participant[]) => void): void {
    this.participantListeners.push(listener);

    // Immediately provide current participants to the new listener
    listener([...this.participants]);

    // Return a function to remove the listener
    return () => {
      this.participantListeners = this.participantListeners.filter((l) => l !== listener);
    };
  }

  public onOffer(handler: (data: RtcData) => void): void {
    this.offerHandler = handler;
  }

  public onAnswer(handler: (data: RtcData) => void): void {
    this.answerHandler = handler;
  }

  public onIceCandidate(handler: (data: RtcData) => void): void {
    this.iceCandidateHandler = handler;
  }

  public sendOffer(to: string, offer: any): void {
    if (!this.socket) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    this.socket.emit('offer', {
      to,
      from: userId,
      offer,
    });
  }

  public sendAnswer(to: string, answer: any): void {
    if (!this.socket) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    this.socket.emit('answer', {
      to,
      from: userId,
      answer,
    });
  }

  public sendIceCandidate(to: string, candidate: any): void {
    if (!this.socket) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    this.socket.emit('ice-candidate', {
      to,
      from: userId,
      candidate,
    });
  }

  public sendMessage(message: string): void {
    if (!this.socket) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    this.socket.emit('send-message', {
      message,
      userId,
    });
  }

  public onMessageReceived(listener: (messages: Message[]) => void): void {
    this.messageListeners.push(listener);

    // Immediately provide current messages to the new listener
    listener([...this.messages]);

    // Return a function to remove the listener
    return () => {
      this.messageListeners = this.messageListeners.filter((l) => l !== listener);
    };
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.participants = [];
      this.messages = [];
    }
  }
}

export default new WebSocketService();
