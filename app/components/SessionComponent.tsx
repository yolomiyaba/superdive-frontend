// SessionComponent.tsx
import React, { useState } from "react";
import STTLoggerComponent from "./STTLoggerComponent";
import SessionSelector from "./SessionSelector";
import SessionChat from "./SessionChat";
import { Message } from "../types/chat";

// interface Log {
//   message: string;
//   type: 'user' | 'server';
//   timestamp: string;
// }

const SessionComponent = () => {
    const [logs, setLogs] = useState<Message[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<number | null>(null);
  
    const handleSessionStart = (userId: string, sessionId: number) => {
      setUserId(userId);
      setSessionId(sessionId);
    };

    const handleNewLog = (text: string, type: 'user' | 'server' | 'system', sender?: string) => {
        const message: Message = {
          text,
          type,
          sender,
          timestamp: new Date().toISOString(),
        };
        setLogs(prevLogs => [...prevLogs, message]);
    };
      
  
    return (
      <div className="flex h-screen bg-white">
        {userId && sessionId ? (
          <>
            <div className="flex-1 border-r">
              <SessionChat
                userId={userId}
                sessionId={sessionId}
                onNewLog={handleNewLog}
              />
            </div>
            <div className="flex-1">
              <STTLoggerComponent logs={logs} />
            </div>
          </>
        ) : (
          <div className="flex-1 p-4">
            <SessionSelector onSessionSelected={handleSessionStart} />
          </div>
        )}
      </div>
    );
  };

export default SessionComponent;