import React, { useState, useEffect } from "react";
import { Session, SessionResponse, SessionSelectorProps } from "../../types/chat";

const SessionSelector: React.FC<SessionSelectorProps> = ({ onSessionSelected }) => {
  const [userId, setUserId] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(
          "http://superdive-demo-backend-alb-179482814.ap-northeast-1.elb.amazonaws.com/sessions"
        );
        const data: SessionResponse = await response.json();
        
        // 定義済みセッションとアクティブセッションを結合
        const allSessions = [
          ...data.predefined,
          ...data.active.filter(activeSession => 
            !data.predefined.some(predefined => predefined.id === activeSession.id)
          )
        ];
        
        setSessions(allSessions);
        setLoading(false);
      } catch (err) {
        setError("セッション一覧の取得に失敗しました");
        setLoading(false);
        console.error("Error fetching sessions:", err);
      }
    };

    fetchSessions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !selectedSession) {
      alert("ユーザーIDとセッションを選択してください");
      return;
    }

    try {
      const response = await fetch(
        "http://superdive-demo-backend-alb-179482814.ap-northeast-1.elb.amazonaws.com/select-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            session_id: parseInt(selectedSession),
          }),
        }
      );

      if (response.ok) {
        onSessionSelected(userId, parseInt(selectedSession));
      } else {
        throw new Error("セッション選択に失敗しました");
      }
    } catch (err) {
      console.error("Error selecting session:", err);
      alert("セッション選択に失敗しました");
    }
  };

  if (loading) {
    return <div>セッション一覧を読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
          ユーザーID
        </label>
        <select
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">ユーザーIDを選択してください</option>
          <option value="Kensaku.Takagi">Kensaku.Takagi</option>
          <option value="Yasufumi.Urata">Yasufumi.Urata</option>
          <option value="Masaki.Hashimoto">Masaki.Hashimoto</option>
          <option value="Dev">Dev</option>
        </select>
      </div>

      <div>
        <label htmlFor="session" className="block text-sm font-medium text-gray-700">
          セッション
        </label>
        <select
          id="session"
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">セッションを選択してください</option>
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.name}
              {session.users !== undefined && ` (${session.users}人が参加中)`}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        セッションを開始
      </button>
    </form>
  );
};

export default SessionSelector;
