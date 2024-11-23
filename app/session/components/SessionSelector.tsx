import React, { useState, useEffect } from "react";
import { Session, SessionResponse, SessionSelectorProps, User, UserResponse } from "../../types/chat";

const SessionSelector: React.FC<SessionSelectorProps> = ({ onSessionSelected }) => {
  const [userId, setUserId] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionResponse, userResponse] = await Promise.all([
          fetch("http://superdive-demo-backend-alb-179482814.ap-northeast-1.elb.amazonaws.com/sessions"),
          fetch("http://superdive-demo-backend-alb-179482814.ap-northeast-1.elb.amazonaws.com/users")
        ]);

        if (!sessionResponse.ok || !userResponse.ok) {
          throw new Error("APIからのレスポンスが正常ではありません");
        }

        const sessionData: SessionResponse = await sessionResponse.json();
        const userData: UserResponse = await userResponse.json();

        setSessions(sessionData.sessions);

        // ユーザーデータの設定
        if (userData.users) {
          setUsers(userData.users);
        } else {
          throw new Error("ユーザーデータの形式が正しくありません");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "データの取得に失敗しました");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 残りのコンポーネントコードは同じ

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

      if (!response.ok) {
        throw new Error("セッション選択に失敗しました");
      }

      onSessionSelected(userId, parseInt(selectedSession));
    } catch (err) {
      console.error("Error selecting session:", err);
      alert(err instanceof Error ? err.message : "セッション選択に失敗しました");
    }
  };

  if (loading) {
    return <div>データを読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
          ユーザー
        </label>
        <select
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">ユーザーを選択してください</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
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