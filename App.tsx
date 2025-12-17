import React, { useState } from 'react';
import { ServerList } from './components/ServerList';
import { ChannelList } from './components/ChannelList';
import { ChatArea } from './components/ChatArea';
import { ArchitectureDocs } from './components/ArchitectureDocs';
import { AuthScreen } from './components/AuthScreen';
import { CallOverlay } from './components/CallOverlay';
import { SettingsScreen } from './components/SettingsScreen';
import { User, Server, Channel, Message, CallState, AppView } from './types';
import { 
  Users, 
  Settings, 
  Hash, 
  Volume2, 
  Mic, 
  Headphones, 
  Monitor, 
  PhoneOff 
} from 'lucide-react';

// Mock Initial Data
const INITIAL_SERVERS: Server[] = [
  { id: '1', name: 'Dev Team', icon: 'https://picsum.photos/id/1/200/200' },
  { id: '2', name: 'Gaming', icon: 'https://picsum.photos/id/2/200/200' },
  { id: '3', name: 'Design', icon: 'https://picsum.photos/id/3/200/200' },
];

const INITIAL_CHANNELS: Channel[] = [
  { id: 'c1', name: 'général', type: 'text', serverId: '1' },
  { id: 'c2', name: 'backend-ops', type: 'text', serverId: '1' },
  { id: 'c3', name: 'Architecture', type: 'text', serverId: '1' },
  { id: 'v1', name: 'Daily Meeting', type: 'voice', serverId: '1', users: [] },
  { id: 'v2', name: 'Music Lounge', type: 'voice', serverId: '1', users: [] },
];

const INITIAL_MESSAGES: Message[] = [
  { id: 'm1', content: 'Bienvenue sur Nexus ! Cliquez sur le bouton "Architecture" en bas à gauche pour voir la spec technique ou **System** pour les paramètres.', sender: 'System', timestamp: new Date().toISOString(), channelId: 'c1' },
  { id: 'm2', content: 'Le système de fichiers supporte jusqu\'à `2Go` par upload.', sender: 'Alice', timestamp: new Date().toISOString(), channelId: 'c1' },
];

export default function App() {
  // State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeServer, setActiveServer] = useState<Server>(INITIAL_SERVERS[0]);
  const [activeChannel, setActiveChannel] = useState<Channel>(INITIAL_CHANNELS[0]);
  const [currentView, setCurrentView] = useState<AppView>('chat');
  const [callState, setCallState] = useState<CallState>({ status: 'idle', duration: 0 });
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [showSettings, setShowSettings] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: 'DevUser', avatar: '' });
  
  // Handlers
  const handleLogin = () => setIsAuthenticated(true);
  
  const handleSendMessage = (content: string, attachment?: File) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'Moi',
      timestamp: new Date().toISOString(),
      channelId: activeChannel.id,
      attachment: attachment ? { name: attachment.name, size: attachment.size, type: attachment.type } : undefined
    };
    setMessages([...messages, newMessage]);
  };

  const handleStartCall = () => {
    setCallState({ status: 'calling', duration: 0 });
    // Simulate 30s ringing logic
    setTimeout(() => {
      setCallState(prev => {
        if (prev.status === 'calling') {
          return { status: 'connected', duration: 0 }; // Auto connect mock
        }
        return prev;
      });
    }, 4000); // Shortened for demo (instead of 30s)
  };

  const handleEndCall = () => {
    setCallState({ status: 'idle', duration: 0 });
  };

  const handleUpdateUser = (data: any) => {
    setCurrentUser(prev => ({ ...prev, ...data }));
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-full bg-discord-dark font-sans text-discord-text overflow-hidden">
      {/* 1. Server List (Leftmost) */}
      <ServerList 
        servers={INITIAL_SERVERS} 
        activeId={activeServer.id} 
        onSelect={setActiveServer} 
      />

      {/* 2. Channel List (Sidebar) */}
      <div className="flex flex-col w-60 bg-discord-darker h-full">
        <header 
          className="h-12 flex items-center px-4 font-bold shadow-sm border-b border-gray-900 hover:bg-discord-light transition cursor-pointer"
          onClick={() => setCurrentView(currentView === 'chat' ? 'docs' : 'chat')}
          title="Toggle Docs/Chat"
        >
          {activeServer.name}
        </header>

        <ChannelList 
          channels={INITIAL_CHANNELS.filter(c => c.serverId === activeServer.id)}
          activeChannelId={activeChannel.id}
          onSelect={(c) => {
            setActiveChannel(c);
            if (c.type === 'voice') handleStartCall();
            else setCurrentView('chat');
          }}
        />

        {/* User Controls Footer */}
        <div className="mt-auto bg-discord-darkest p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-discord-primary relative overflow-hidden flex items-center justify-center">
              {currentUser.avatar ? <img src={currentUser.avatar} className="w-full h-full object-cover" /> : <span className="text-white font-bold">D</span>}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-discord-darkest"></span>
            </div>
            <div className="text-sm">
              <div className="font-bold text-white truncate max-w-[80px]">{currentUser.username}</div>
              <div className="text-xs text-discord-muted">#1337</div>
            </div>
          </div>
          <div className="flex gap-1">
            <button className="p-1 hover:bg-discord-light rounded"><Mic size={16} /></button>
            <button className="p-1 hover:bg-discord-light rounded"><Headphones size={16} /></button>
            <button 
              className={`p-1 hover:bg-discord-light rounded ${showSettings ? 'text-white' : ''}`}
              onClick={() => setShowSettings(true)}
              title="Paramètres Utilisateur"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col bg-discord-dark relative">
        {/* Header */}
        <header className="h-12 flex items-center px-4 border-b border-discord-darker shadow-sm justify-between">
          <div className="flex items-center gap-2">
            <Hash className="text-discord-muted" size={24} />
            <h3 className="font-bold text-white">{activeChannel.name}</h3>
            {activeChannel.type === 'text' && (
              <span className="text-xs text-discord-muted hidden md:inline ml-2">
                | Salon principal pour les discussions générales
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-discord-muted">
            <Users size={24} className="hover:text-white cursor-pointer" />
          </div>
        </header>

        {/* Dynamic View */}
        {currentView === 'docs' ? (
          <ArchitectureDocs />
        ) : (
          <ChatArea 
            messages={messages.filter(m => m.channelId === activeChannel.id)}
            channelName={activeChannel.name}
            onSendMessage={handleSendMessage}
          />
        )}
      </div>

      {/* Call Overlay (Global) */}
      {callState.status !== 'idle' && (
        <CallOverlay 
          state={callState} 
          channelName={activeChannel.type === 'voice' ? activeChannel.name : 'Appel en cours'}
          onHangup={handleEndCall}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsScreen 
          onClose={() => setShowSettings(false)}
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
        />
      )}
    </div>
  );
}