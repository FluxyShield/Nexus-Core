import React from 'react';
import { Channel } from '../types';
import { Hash, Volume2 } from 'lucide-react';

interface ChannelListProps {
  channels: Channel[];
  activeChannelId: string;
  onSelect: (channel: Channel) => void;
}

interface ChannelRowProps {
  channel: Channel;
  isActive: boolean;
  onSelect: (channel: Channel) => void;
}

const ChannelRow: React.FC<ChannelRowProps> = ({ channel, isActive, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(channel)}
      className={`
        flex items-center px-2 py-1 mx-2 rounded cursor-pointer group mb-0.5
        ${isActive ? 'bg-discord-light text-white' : 'text-discord-muted hover:bg-discord-dark hover:text-discord-text'}
      `}
    >
      {channel.type === 'text' ? (
        <Hash size={20} className="mr-1.5 text-discord-muted" />
      ) : (
        <Volume2 size={20} className="mr-1.5 text-discord-muted" />
      )}
      <span className={`font-medium truncate ${isActive ? 'text-white' : ''}`}>
        {channel.name}
      </span>
    </div>
  );
};

export const ChannelList: React.FC<ChannelListProps> = ({ channels, activeChannelId, onSelect }) => {
  const textChannels = channels.filter(c => c.type === 'text');
  const voiceChannels = channels.filter(c => c.type === 'voice');

  return (
    <div className="flex-1 overflow-y-auto py-3">
      {/* Text Channels */}
      <div className="mb-4">
        <div className="flex items-center justify-between px-4 mb-1 text-xs font-bold text-discord-muted hover:text-discord-text uppercase cursor-pointer">
          <span>Salons Textuels</span>
          <span>+</span>
        </div>
        {textChannels.map(c => (
          <ChannelRow 
            key={c.id} 
            channel={c} 
            isActive={activeChannelId === c.id} 
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* Voice Channels */}
      <div>
        <div className="flex items-center justify-between px-4 mb-1 text-xs font-bold text-discord-muted hover:text-discord-text uppercase cursor-pointer">
          <span>Salons Vocaux</span>
          <span>+</span>
        </div>
        {voiceChannels.map(c => (
          <ChannelRow 
            key={c.id} 
            channel={c} 
            isActive={activeChannelId === c.id} 
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};