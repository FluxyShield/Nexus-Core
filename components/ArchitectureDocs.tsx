import React from 'react';
import { Database, FolderTree, Server, CloudLightning } from 'lucide-react';

export const ArchitectureDocs: React.FC = () => {
  return (
    <div className="flex-1 bg-discord-dark overflow-y-auto p-8 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="border-b border-discord-light pb-4">
          <h1 className="text-3xl font-bold text-white mb-2">Documentation Technique</h1>
          <p className="text-discord-muted">Spécifications pour l'implémentation Full-Stack (Node/Go + WebRTC).</p>
        </div>

        {/* Folder Structure */}
        <section className="bg-discord-darker rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-4 text-discord-primary">
            <FolderTree size={24} />
            <h2 className="text-xl font-bold text-white">Structure des Dossiers (Monorepo)</h2>
          </div>
          <pre className="text-sm font-mono text-gray-300 overflow-x-auto bg-black/30 p-4 rounded border border-gray-700">
{`root/
├── apps/
│   ├── web/                 # Frontend (Next.js/React + Tailwind)
│   │   ├── src/
│   │   │   ├── components/  # Composants UI (Chat, Voice, etc.)
│   │   │   ├── hooks/       # useWebRTC, useSocket
│   │   │   ├── stores/      # Zustand/Redux (State management)
│   │   │   └── services/    # api.ts, socket.ts
│   │
│   ├── api/                 # Backend (Fastify/Node.js ou Go)
│   │   ├── src/
│   │   │   ├── modules/     # Auth, Chat, Voice (Domain Driven)
│   │   │   ├── plugins/     # Database, Redis, Socket.io
│   │   │   └── server.ts    # Entry point
│   │
│   └── media-server/        # Worker WebRTC (Mediasoup/LiveKit)
│       ├── config/
│       └── main.go (ou js)
│
├── packages/
│   ├── db/                  # Schéma Prisma & Migrations
│   ├── ui/                  # Composants partagés
│   └── config/              # ESLint, TSConfig
│
├── storage/                 # Volume local pour fichiers (Max 2GB chunks)
├── docker-compose.yml       # Orchestration (DB, Redis, App)
└── README.md`}
          </pre>
        </section>

        {/* Database Schema */}
        <section className="bg-discord-darker rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-4 text-green-500">
            <Database size={24} />
            <h2 className="text-xl font-bold text-white">Schéma de Base de Données (PostgreSQL)</h2>
          </div>
          <div className="text-discord-text mb-2">Format Prisma Schema (Conceptuel)</div>
          <pre className="text-sm font-mono text-gray-300 overflow-x-auto bg-black/30 p-4 rounded border border-gray-700">
{`model User {
  id        String    @id @default(uuid())
  email     String    @unique
  username  String
  password  String    // Hashed (Argon2)
  avatar    String?
  status    String    @default("offline") // Sync via Redis
  servers   Member[]
  messages  Message[]
}

model Server {
  id        String    @id @default(uuid())
  name      String
  ownerId   String
  channels  Channel[]
  members   Member[]
}

model Channel {
  id        String    @id @default(uuid())
  name      String
  type      String    // "text" | "voice"
  serverId  String
  server    Server    @relation(fields: [serverId], references: [id])
  messages  Message[]
}

model Message {
  id          String   @id @default(uuid())
  content     String   @db.Text
  fileUrl     String?  // Chemin vers stockage local
  fileSize    Int?
  senderId    String
  channelId   String
  createdAt   DateTime @default(now())
  
  sender      User     @relation(fields: [senderId], references: [id])
  channel     Channel  @relation(fields: [channelId], references: [id])
}

// Table de liaison pour les rôles et permissions
model Member {
  userId    String
  serverId  String
  roles     String[] // ["admin", "moderator"]
  
  user      User     @relation(fields: [userId], references: [id])
  server    Server   @relation(fields: [serverId], references: [id])

  @@id([userId, serverId])
}`}
          </pre>
        </section>

        {/* WebRTC Signaling */}
        <section className="bg-discord-darker rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-4 text-yellow-500">
            <CloudLightning size={24} />
            <h2 className="text-xl font-bold text-white">Logique Serveur WebRTC (Pseudo-code)</h2>
          </div>
          <p className="text-discord-muted mb-4">
            Utilisation de Socket.io pour la signalisation et Mediasoup pour le SFU (Selective Forwarding Unit).
          </p>
          <pre className="text-sm font-mono text-gray-300 overflow-x-auto bg-black/30 p-4 rounded border border-gray-700">
{`// server/signaling.ts

socket.on('join-voice', async ({ channelId, rtpCapabilities }) => {
  // 1. Créer ou récupérer le Router Mediasoup pour ce salon
  const router = await getMediasoupRouter(channelId);

  // 2. Créer un Transport WebRTC côté serveur (Consumer/Producer)
  const transport = await router.createWebRtcTransport(config);

  // 3. Renvoyer les paramètres DTLS au client
  socket.emit('transport-created', {
    id: transport.id,
    iceParameters: transport.iceParameters,
    iceCandidates: transport.iceCandidates,
    dtlsParameters: transport.dtlsParameters,
  });
});

socket.on('connect-transport', async ({ transportId, dtlsParameters }) => {
  const transport = getTransport(transportId);
  await transport.connect({ dtlsParameters });
});

socket.on('produce', async ({ transportId, kind, rtpParameters }) => {
  // Le client envoie son flux audio/vidéo
  const transport = getTransport(transportId);
  const producer = await transport.produce({ kind, rtpParameters });
  
  // Informer les autres utilisateurs du salon
  socket.to(channelId).emit('new-producer', { producerId: producer.id });
});`}
          </pre>
        </section>

      </div>
    </div>
  );
};