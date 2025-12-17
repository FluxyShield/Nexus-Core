import React from 'react';
import { Server } from '../types';

interface ServerListProps {
  servers: Server[];
  activeId: string;
  onSelect: (server: Server) => void;
}

export const ServerList: React.FC<ServerListProps> = ({ servers, activeId, onSelect }) => {
  return (
    <div className="w-[72px] bg-discord-darkest flex flex-col items-center py-3 gap-2 overflow-y-auto no-scrollbar">
      {/* Home Button Mock */}
      <div className="w-12 h-12 rounded-full bg-discord-dark hover:bg-discord-primary transition-all duration-200 flex items-center justify-center cursor-pointer mb-2">
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
           <path d="M19.7,4.6C18.2,3.9,16.4,3.3,14.6,3c-0.1,0-0.2,0-0.3,0.1c-0.3,0.5-0.6,1.2-0.8,1.6c-1.8-0.3-3.6-0.3-5.3,0C8,4.2,7.7,3.6,7.4,3.1C7.3,3,7.2,3,7.1,3C5.3,3.3,3.5,3.9,2,4.6C1.9,4.6,1.9,4.7,1.8,4.7c-3.1,4.6-4,9-3.6,13.3c0,0.1,0,0.2,0.1,0.2c2.1,1.6,4.2,2.5,6.2,3.1c0.1,0,0.2,0,0.3-0.1c0.5-0.6,0.9-1.3,1.3-2c0-0.1,0-0.2-0.1-0.3c-0.7-0.3-1.4-0.6-2.1-0.9c-0.1,0-0.1-0.1-0.1-0.2c0.1-0.1,0.3-0.2,0.4-0.3c0-0.1,0.1-0.1,0.1-0.1c4.4,2,9.1,2,13.4,0c0.1,0,0.1,0,0.1,0.1c0.2,0.1,0.3,0.2,0.4,0.3c0,0.1,0,0.2-0.1,0.2c-0.7,0.3-1.4,0.6-2.1,0.9c-0.1,0-0.1,0.1-0.1,0.3c0.4,0.7,0.9,1.4,1.3,2c0.1,0.1,0.2,0.1,0.3,0.1c2-0.6,4.1-1.5,6.2-3.1c0.1,0,0.1-0.1,0.1-0.2c0.5-4.4-0.5-8.8-3.7-13.4C21.8,4.7,21.8,4.6,19.7,4.6z"/>
        </svg>
      </div>

      <div className="w-8 h-[2px] bg-discord-dark rounded-lg mb-2" />

      {servers.map((server) => {
        const isActive = activeId === server.id;
        return (
          <div key={server.id} className="relative w-full flex justify-center group">
            {/* Active Pill */}
            <div 
              className={`absolute left-0 w-1 bg-white rounded-r-lg transition-all duration-200
                ${isActive ? 'h-10 top-1' : 'h-2 top-5 opacity-0 group-hover:opacity-100 group-hover:h-5'}
              `} 
            />
            
            <button
              onClick={() => onSelect(server)}
              className={`
                w-12 h-12 rounded-[24px] transition-all duration-200 overflow-hidden cursor-pointer
                ${isActive ? 'rounded-[16px]' : 'group-hover:rounded-[16px]'}
              `}
            >
              <img src={server.icon} alt={server.name} className="w-full h-full object-cover" />
            </button>
          </div>
        );
      })}
      
      {/* Add Server Button Mock */}
      <div className="w-12 h-12 rounded-full bg-discord-dark hover:bg-green-600 transition-all duration-200 flex items-center justify-center cursor-pointer text-green-600 hover:text-white mt-2 group">
        <span className="text-2xl font-light">+</span>
      </div>
    </div>
  );
};