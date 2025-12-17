import React, { useEffect, useState, useRef } from 'react';
import { CallState } from '../types';
import { Phone, Mic, Video, Monitor, PhoneOff, MicOff } from 'lucide-react';

interface CallOverlayProps {
  state: CallState;
  channelName: string;
  onHangup: () => void;
}

export const CallOverlay: React.FC<CallOverlayProps> = ({ state, channelName, onHangup }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);

  // Timer logic: Starts when status is 'connected'
  useEffect(() => {
    let interval: any;
    if (state.status === 'connected') {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [state.status]);

  // Clean up stream on unmount or when stream changes
  useEffect(() => {
    return () => {
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [screenStream]);

  // Attach stream to video element
  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream, isScreenSharing]);

  const stopScreenShare = () => {
    // Setting stream to null will trigger the useEffect cleanup which stops the tracks
    setScreenStream(null);
    setIsScreenSharing(false);
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      try {
        // @ts-ignore - getDisplayMedia might not be in all TS defs
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
            video: true,
            audio: false 
        });

        // Handle user stopping via browser UI
        stream.getVideoTracks()[0].onended = () => {
           stopScreenShare();
        };

        setScreenStream(stream);
        setIsScreenSharing(true);
      } catch (err) {
        console.error("Error starting screen share:", err);
        // Ensure state is clean if user cancelled or error occurred
        stopScreenShare();
      }
    }
  };

  // Format time as MM:SS (e.g. 05:30)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Draggable-like simulation positioning
  return (
    <div className="absolute top-4 right-4 w-80 bg-black rounded-lg shadow-2xl overflow-hidden border border-gray-800 z-50">
      {/* Video / Avatar Area */}
      <div className="h-48 bg-gray-900 relative flex items-center justify-center">
        {state.status === 'calling' && (
          <div className="flex flex-col items-center animate-pulse">
            <div className="w-20 h-20 rounded-full bg-discord-light mb-3 flex items-center justify-center">
              <Phone size={40} className="text-white" />
            </div>
            <span className="text-white font-bold">Appel en cours...</span>
            <span className="text-xs text-gray-400">Sonnerie (30s timeout)</span>
          </div>
        )}

        {state.status === 'connected' && (
          <div className="w-full h-full relative">
             {/* Mock Video Grid */}
             <div className="grid grid-cols-2 h-full">
                <div className="bg-gray-800 border-r border-b border-black flex items-center justify-center relative">
                   {isVideoOn ? (
                     <div className="w-full h-full bg-gray-700 animate-pulse flex items-center justify-center text-xs">Flux Caméra</div>
                   ) : (
                     <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">Moi</div>
                   )}
                   {isMuted && <MicOff size={14} className="absolute bottom-2 right-2 text-red-500" />}
                </div>
                <div className="bg-gray-800 border-b border-black flex items-center justify-center relative">
                    <img src="https://picsum.photos/id/1/100/100" className="w-10 h-10 rounded-full" />
                    <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-1 rounded">Alice</span>
                </div>
             </div>
             
             {/* Screen Share Overlay */}
             {isScreenSharing && (
               <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
                 {screenStream ? (
                   <video 
                     ref={screenVideoRef}
                     autoPlay 
                     playsInline 
                     muted 
                     className="w-full h-full object-contain bg-black"
                   />
                 ) : (
                    <div className="text-center">
                       <Monitor size={40} className="mx-auto text-blue-500 mb-2 animate-bounce" />
                       <span className="text-xs text-blue-400">Démarrage du partage...</span>
                    </div>
                 )}
                 <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-[10px] text-white flex items-center gap-1">
                      <Monitor size={12} className="text-blue-400" />
                      <span>Vous présentez</span>
                  </div>
               </div>
             )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-green-500 font-bold text-sm">{channelName}</div>
            <div className="text-gray-400 text-xs font-mono tracking-wide">
              {state.status === 'connected' ? formatTime(timer) : 'Connexion...'}
            </div>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <span>12ms</span>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-3 rounded-full ${isVideoOn ? 'bg-white text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
          >
            <Video size={20} />
          </button>
          
          <button 
             onClick={() => setIsMuted(!isMuted)}
             className={`p-3 rounded-full ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <button 
             onClick={toggleScreenShare}
             className={`p-3 rounded-full ${isScreenSharing ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
             title={isScreenSharing ? "Arrêter le partage" : "Partager l'écran"}
          >
            <Monitor size={20} />
          </button>

          <button 
            onClick={onHangup}
            className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600"
          >
            <PhoneOff size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};