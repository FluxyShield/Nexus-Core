export interface Server {
  id: string;
  name: string;
  icon: string;
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  serverId: string;
  users?: string[]; // IDs of users currently in voice
}

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  channelId: string;
  attachment?: {
    name: string;
    size: number;
    type: string;
  };
}

export interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
}

export type CallStatus = 'idle' | 'calling' | 'ringing' | 'connected';

export interface CallState {
  status: CallStatus;
  duration: number; // in seconds
}

export type AppView = 'chat' | 'docs';
