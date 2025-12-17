import React, { useState, useEffect } from 'react';
import { X, User, Mic, Video, Monitor, Volume2 } from 'lucide-react';

interface SettingsScreenProps {
  onClose: () => void;
  currentUser: { username: string; avatar: string };
  onUpdateUser: (data: any) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose, currentUser, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState('account');
  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [username, setUsername] = useState(currentUser.username);

  useEffect(() => {
    // Check for support before calling
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        navigator.mediaDevices.enumerateDevices().then(devices => {
        setInputDevices(devices.filter(d => d.kind === 'audioinput'));
        });
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-discord-dark flex z-[100] animate-fade-in text-discord-text">
      {/* Sidebar */}
      <div className="w-[218px] bg-discord-darker flex flex-col items-end py-[60px] pr-2">
        <div className="w-[190px]">
          <div className="px-2 pb-1 text-xs font-bold text-discord-muted uppercase mb-1">Paramètres Utilisateur</div>
          <div
            onClick={() => setActiveTab('account')}
            className={`px-2 py-1.5 rounded cursor-pointer mb-0.5 ${activeTab === 'account' ? 'bg-discord-light text-white' : 'text-discord-muted hover:bg-discord-light hover:text-discord-text'}`}
          >
            Mon Compte
          </div>
          <div
            onClick={() => setActiveTab('voice')}
            className={`px-2 py-1.5 rounded cursor-pointer mb-0.5 ${activeTab === 'voice' ? 'bg-discord-light text-white' : 'text-discord-muted hover:bg-discord-light hover:text-discord-text'}`}
          >
            Voix & Vidéo
          </div>
          
          <div className="my-2 border-b border-gray-700"></div>
          
          <div
            onClick={onClose}
            className="px-2 py-1.5 rounded cursor-pointer text-red-500 hover:bg-discord-light flex items-center justify-between group"
          >
            <span>Se déconnecter</span>
            <X size={16} className="opacity-0 group-hover:opacity-100" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-discord-dark py-[60px] pl-10 pr-[60px] overflow-y-auto">
        <div className="max-w-[740px]">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-white">
              {activeTab === 'account' ? 'Mon Compte' : 'Paramètres Voix & Vidéo'}
            </h2>
            <div className="flex flex-col items-center group cursor-pointer" onClick={onClose}>
              <div className="w-9 h-9 border-2 border-discord-muted rounded-full flex items-center justify-center text-discord-muted group-hover:bg-discord-muted group-hover:text-white transition-colors">
                <X size={18} />
              </div>
              <span className="text-xs text-discord-muted mt-1 font-bold">ECHAP</span>
            </div>
          </div>

          {activeTab === 'account' && (
            <div className="bg-discord-darker rounded-lg p-4 flex items-center gap-4 border border-gray-800">
              <div className="w-20 h-20 rounded-full bg-discord-primary relative overflow-hidden group cursor-pointer">
                <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs font-bold uppercase">
                    Changer
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs font-bold text-discord-muted uppercase">Nom d'utilisateur</div>
                </div>
                <div className="bg-black/20 border border-black/30 rounded p-2 flex justify-between items-center">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-transparent text-white focus:outline-none flex-1"
                    />
                    <button
                        onClick={() => onUpdateUser({ username })}
                        className="bg-discord-primary hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors ml-2"
                    >
                        Modifier
                    </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-discord-muted uppercase mb-2">Périphérique d'entrée</label>
                <div className="relative">
                    <select className="w-full bg-discord-darker p-2.5 rounded text-white outline-none border border-black/30 appearance-none cursor-pointer">
                    {inputDevices.length > 0 ? (
                        inputDevices.map((device, idx) => (
                        <option key={idx} value={device.deviceId}>{device.label || `Microphone ${idx + 1}`}</option>
                        ))
                    ) : (
                        <option>Default (Microphone)</option>
                    )}
                    </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-discord-muted uppercase mb-2">Périphérique de sortie</label>
                <select className="w-full bg-discord-darker p-2.5 rounded text-white outline-none border border-black/30 appearance-none cursor-pointer">
                  <option>Default (Speakers)</option>
                </select>
              </div>

              <div className="my-4 border-b border-gray-700"></div>

              <div>
                <h3 className="text-white font-bold mb-2 text-xs uppercase text-discord-muted">Vérification du micro</h3>
                <p className="text-discord-text text-sm mb-4">Des problèmes de micro ? Dites quelque chose !</p>
                <div className="bg-discord-darker p-4 rounded-lg border border-gray-800">
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden relative">
                    <div className="absolute left-0 top-0 bottom-0 w-[40%] bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};