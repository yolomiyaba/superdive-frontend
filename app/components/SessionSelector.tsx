import React, { useState, useEffect } from "react";
import axios from "axios";

interface Session {
  id: number;
  name: string;
}

interface SessionSelectorProps {
  onSessionStart: (userId: string, sessionId: number) => void;
}

const SessionSelector: React.FC<SessionSelectorProps> = ({ onSessionStart }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const userId = "user123"; // ユーザーIDは固定または動的に取得

  useEffect(() => {
    const fetchSessions = async () => {
      const response = await axios.get("http://superdive-demo-backend-alb-179482814.ap-northeast-1.elb.amazonaws.com/sessions");
      setSessions(response.data);
    };
    fetchSessions();
  }, []);

  const handleStartSession = async () => {
    if (!selectedSession) {
      alert("セッションを選択してください");
      return;
    }

    await axios.post("http://superdive-demo-backend-alb-179482814.ap-northeast-1.elb.amazonaws.com/select-session", {
      user_id: userId,
      session_id: selectedSession,
    });

    alert("セッションが開始されました");
    onSessionStart(userId, selectedSession);
  };

  return (
    <div>
      <h1>セッション選択</h1>
      <select value={selectedSession ?? ""} onChange={(e) => setSelectedSession(Number(e.target.value))}>
        <option value="" disabled>
          セッションを選択してください
        </option>
        {sessions.map((session) => (
          <option key={session.id} value={session.id}>
            {session.name}
          </option>
        ))}
      </select>
      <button onClick={handleStartSession}>セッションを開始</button>
    </div>
  );
};

export default SessionSelector;
