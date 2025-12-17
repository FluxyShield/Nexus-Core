import React from 'react';

interface AuthScreenProps {
  onLogin: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex h-screen w-full bg-[url('https://picsum.photos/id/1029/1920/1080')] bg-cover bg-center items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      <div className="bg-discord-dark p-8 rounded shadow-2xl w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Bienvenue !</h1>
          <p className="text-discord-muted">Nous sommes ravis de vous revoir.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-discord-muted uppercase mb-2">Email</label>
            <input 
              type="email" 
              className="w-full bg-discord-darker border border-black/20 rounded p-2 text-white focus:outline-none focus:border-discord-primary transition-colors"
              placeholder="user@nexus.com" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-discord-muted uppercase mb-2">Mot de passe</label>
            <input 
              type="password" 
              className="w-full bg-discord-darker border border-black/20 rounded p-2 text-white focus:outline-none focus:border-discord-primary transition-colors"
            />
            <div className="text-xs text-blue-400 mt-1 cursor-pointer hover:underline">Mot de passe oublié ?</div>
          </div>

          <button 
            onClick={onLogin}
            className="w-full bg-discord-primary hover:bg-blue-600 text-white font-medium py-3 rounded transition-colors"
          >
            Se connecter
          </button>

          <div className="text-sm text-discord-muted mt-2">
            Besoin d'un compte ? <span className="text-blue-400 cursor-pointer hover:underline">S'inscrire</span>
          </div>
        </div>
      </div>
    </div>
  );
};