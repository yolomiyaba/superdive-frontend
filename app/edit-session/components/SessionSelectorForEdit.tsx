import React, { useState, useEffect } from "react";
import { Session, SessionResponse, SessionSelectorForEditProps } from "../../types/chat";

const SessionSelectorForEdit: React.FC<SessionSelectorForEditProps> = ({ onSessionSelected }) => {
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'edit' | 'create'>('edit');

  useEffect(() => {
    if (mode === 'edit') {
      const fetchSessions = async () => {
        try {
          const response = await fetch(
            "http://superdive-demo-backend-alb-179482814.ap-northeast-1.elb.amazonaws.com/sessions"
          );
          const data: SessionResponse = await response.json();
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
    }
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'create') {
      // Handle creation logic here
      alert('Creating a new session...');
    } else if (mode === 'edit' && selectedSession) {
      try {
        const response = await fetch(
          "http://superdive-demo-backend-alb-179482814.ap-northeast-1.elb.amazonaws.com/select-session",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              session_id: parseInt(selectedSession),
            }),
          }
        );

        if (response.ok) {
          onSessionSelected(parseInt(selectedSession));
        } else {
          throw new Error("セッション選択に失敗しました");
        }
      } catch (err) {
        console.error("Error selecting session:", err);
        alert("セッション選択に失敗しました");
      }
    }
  };

  if (loading && mode === 'edit') {
    return <div>セッション一覧を読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div>
          <label>
            <input type="radio" value="edit" checked={mode === 'edit'} onChange={() => setMode('edit')} />
            セッションを編集
          </label>
          <label>
            <input type="radio" value="create" checked={mode === 'create'} onChange={() => setMode('create')} />
            新規セッションを作成
          </label>
        </div>
        {mode === 'edit' && (
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
        )}
      </div>
      
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {mode === 'edit' ? 'セッションを編集' : '新規セッションを作成'}
      </button>
    </form>
  );
};

export default SessionSelectorForEdit;
