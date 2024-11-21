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
    users?: number;
  }
  
  export interface SessionResponse {
    predefined: Session[];
    active: Session[];
  }
  
  export interface SessionSelectorProps {
    onSessionStart: (userId: string, sessionId: number) => void;
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