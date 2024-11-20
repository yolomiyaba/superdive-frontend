"use client";

import React, { useState } from "react";
import STTLoggerComponent from "./STTLoggerComponent";
import SessionSelector from "./SessionSelector";
import SessionChat from "./SessionChat";

const SessionComponent = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);

  // セッション選択時の処理
  const handleSessionStart = (userId: string, sessionId: number) => {
    setUserId(userId);
    setSessionId(sessionId);
  };

  // ログ追加処理
  const handleNewTranscript = (transcript: string) => {
    setLogs((prevLogs) => [...prevLogs, transcript]);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      {userId && sessionId ? (
        <>
          {/* 左側: チャットセッション */}
          <div style={{ flex: 1, padding: "20px", borderRight: "1px solid #ccc" }}>
            <SessionChat
              userId={userId}
              sessionId={sessionId}
              onTranscript={handleNewTranscript}
            />
          </div>

          {/* 右側: ログ表示 */}
          <div style={{ flex: 1, padding: "20px" }}>
            <STTLoggerComponent logs={logs} />
          </div>
        </>
      ) : (
        <div style={{ flex: 1, padding: "20px" }}>
          <SessionSelector onSessionStart={handleSessionStart} />
        </div>
      )}
    </div>
  );
};

export default SessionComponent;
