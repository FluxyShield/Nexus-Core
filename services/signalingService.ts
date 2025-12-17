// Simulation class for WebRTC Signaling
// This code demonstrates how the frontend handles signaling logic.

type SignalType = 'offer' | 'answer' | 'ice-candidate' | 'join-room';

export class SignalingService {
  private socket: any; // Mock socket
  private roomId: string | null = null;

  constructor() {
    console.log('[Signaling] Service Initialized');
    this.socket = {
      emit: (event: string, data: any) => console.log(`[Socket Out] ${event}:`, data),
      on: (event: string, cb: Function) => console.log(`[Socket Listener] Registered for ${event}`),
    };
  }

  public joinRoom(roomId: string) {
    this.roomId = roomId;
    this.socket.emit('join-voice', { roomId });
    return new Promise((resolve) => setTimeout(resolve, 500)); // Fake latency
  }

  public sendOffer(offer: RTCSessionDescriptionInit) {
    this.socket.emit('signal', {
      type: 'offer',
      payload: offer,
      roomId: this.roomId
    });
  }

  public sendAnswer(answer: RTCSessionDescriptionInit) {
    this.socket.emit('signal', {
      type: 'answer',
      payload: answer,
      roomId: this.roomId
    });
  }

  public sendIceCandidate(candidate: RTCIceCandidate) {
    this.socket.emit('signal', {
      type: 'ice-candidate',
      payload: candidate,
      roomId: this.roomId
    });
  }
}