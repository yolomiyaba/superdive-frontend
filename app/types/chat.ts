// types/chat.ts
export interface Message {
  text: string;
  type: 'user' | 'server' | 'system';
  sender?: string;
  timestamp: string;
}

export interface Session {
  id: number;
  name: string;
}

export interface SessionResponse {
  sessions: Session[];
}

export interface User {
  id: number;
  name: string;
}

export interface UserResponse {
  users: User[];
}

export interface SessionSelectorProps {
  onSessionSelected: (userId: string, sessionId: number) => void;
}

export interface SessionSelectorForEditProps {
  onSessionSelected: (sessionId: number) => void;
}

export interface SessionChatProps {
  userId: string;
  sessionId: number;
  onNewLog: (message: Message) => void;
}

export interface STTLoggerComponentProps {
  logs: Message[];
}

//   declare global {
//     interface Window {
//       SpeechRecognition: any;
//       webkitSpeechRecognition: any;
//     }
//   }