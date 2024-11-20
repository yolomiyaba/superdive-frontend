import React, { useState } from "react";
import SessionSelector from "./SessionSelector";
import SessionChat from "./SessionChat";

type MicrophoneSTTComponentProps = {
    onTranscript: (transcript: string) => void; // コールバックを追加
  };

const App: React.FC<MicrophoneSTTComponentProps>  = ({ onTranscript }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);

  const handleSessionStart = (userId: string, sessionId: number) => {
    setUserId(userId);
    setSessionId(sessionId);
  };


  console.log(onTranscript, "ontranscript at App");

  return (
    <div>
        <SessionSelector onSessionStart={handleSessionStart} />
      {userId && sessionId ? (
        <SessionChat userId={userId} sessionId={sessionId} onTranscript={onTranscript} />
      ) : (
        // <SessionSelector onSessionStart={handleSessionStart} />
        <></>
      )}
    </div>
  );
};

export default App;
