import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { PlusCircle, Gift, Smile, File as FileIcon, UploadCloud } from 'lucide-react';

interface ChatAreaProps {
  messages: Message[];
  channelName: string;
  onSendMessage: (content: string, attachment?: File) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, channelName, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        onSendMessage(inputValue);
        setInputValue('');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Simulate large file upload logic
      if (file.size > 2 * 1024 * 1024 * 1024) { // 2GB
         alert("Fichier trop volumineux (> 2 Go)");
         return;
      }
      
      // Simulate upload progress
      setIsUploading(true);
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            onSendMessage(`Fichier partagé : ${file.name}`, file);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-discord-dark">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col">
        <div className="mt-auto"> {/* Pushes messages to bottom if few */}
          {/* Welcome Message */}
          <div className="mb-8 mt-4 px-4">
            <div className="w-16 h-16 rounded-full bg-discord-light flex items-center justify-center mb-4">
              <span className="text-4xl">#</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Bienvenue dans #{channelName}</h1>
            <p className="text-discord-muted">C'est le début du salon #{channelName}.</p>
          </div>

          {messages.map((msg, idx) => {
            const isSameSender = idx > 0 && messages[idx - 1].sender === msg.sender;
            return (
              <div key={msg.id} className={`group flex px-4 py-1 hover:bg-[#32353b] ${!isSameSender ? 'mt-3' : ''}`}>
                {!isSameSender ? (
                  <img 
                    src={`https://ui-avatars.com/api/?name=${msg.sender}&background=random`} 
                    alt="avatar" 
                    className="w-10 h-10 rounded-full mr-4 cursor-pointer hover:opacity-80"
                  />
                ) : (
                  <div className="w-10 mr-4 text-[10px] text-discord-muted opacity-0 group-hover:opacity-100 text-right flex items-center justify-end">
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                )}
                
                <div className="flex-1">
                  {!isSameSender && (
                    <div className="flex items-center mb-1">
                      <span className="font-medium text-white mr-2 hover:underline cursor-pointer">{msg.sender}</span>
                      <span className="text-xs text-discord-muted">{new Date(msg.timestamp).toLocaleDateString()}</span>
                    </div>
                  )}
                  <p className={`text-discord-text leading-relaxed whitespace-pre-wrap ${msg.attachment ? 'italic text-discord-primary' : ''}`}>
                    {msg.content}
                  </p>
                  
                  {/* Attachment Preview */}
                  {msg.attachment && (
                    <div className="mt-2 bg-discord-darker p-3 rounded max-w-sm border border-discord-light flex items-center gap-3">
                      <FileIcon size={32} className="text-blue-400" />
                      <div className="overflow-hidden">
                        <div className="text-blue-400 font-medium truncate">{msg.attachment.name}</div>
                        <div className="text-xs text-discord-muted">{(msg.attachment.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="px-4 py-2 bg-discord-darker">
          <div className="flex justify-between text-xs text-discord-text mb-1">
            <span>Envoi du fichier...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-discord-dark h-2 rounded-full overflow-hidden">
            <div 
              className="bg-discord-primary h-full transition-all duration-200" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 pb-6 pt-2">
        <div className="bg-discord-light rounded-lg px-4 py-2.5 flex items-center gap-4">
          <div className="relative">
             <button 
               onClick={() => fileInputRef.current?.click()}
               className="text-discord-muted hover:text-discord-text transition-colors"
             >
               <PlusCircle size={24} fill="#B9BBBE" className="text-discord-light" />
             </button>
             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               onChange={handleFileChange}
             />
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Envoyer un message dans #${channelName}`}
            className="bg-transparent flex-1 text-discord-text placeholder-discord-muted outline-none"
          />

          <div className="flex items-center gap-3 text-discord-muted">
            <Gift size={24} className="cursor-pointer hover:text-discord-text" />
            <div className="cursor-pointer hover:text-discord-text">GIF</div>
            <Smile size={24} className="cursor-pointer hover:text-discord-text" />
          </div>
        </div>
        <div className="text-xs text-discord-muted mt-1 text-right">
           Support fichiers locaux (Max 2 Go)
        </div>
      </div>
    </div>
  );
};