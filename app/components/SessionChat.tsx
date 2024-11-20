import React, { useCallback, useEffect, useState } from "react";

interface SessionChatProps {
  userId: string;
  sessionId: number;
  onTranscript: (transcript: string) => void; // ログに転記するためのコールバック
}

const SessionChat: React.FC<SessionChatProps> = ({ userId, sessionId, onTranscript }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [isVoiceMode, setIsVoiceMode] = useState(false); // 音声モードの切り替え
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isListening, setIsListening] = useState(false); // 音声認識の状態

  useEffect(() => {
    // WebSocket接続を初期化
    const ws = new WebSocket(
      `ws://superdive-demo-backend-alb-179482814.ap-northeast-1.elb.amazonaws.com/ws/chat/${userId}`
    );
    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, `Server: ${event.data}`]);
    };
    setSocket(ws);

    return () => ws.close();
  }, [userId, sessionId]);

  const sendMessage = useCallback(
    (message: string) => {
      if (!socket || !message) return;
      socket.send(message);
      setMessages((prev) => [...prev, `You: ${message}`]);
      onTranscript(message); // ログに転記
    },
    [socket, onTranscript]
  );

  // 音声認識用のSpeechRecognitionインスタンス
  useEffect(() => {
    if (!isVoiceMode || typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("SpeechRecognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ja-JP"; // 日本語設定
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript; // 音声認識結果
      sendMessage(transcript); // WebSocketで送信
    };

    recognition.onerror = (event) => {
      console.error("SpeechRecognition error:", event);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.abort(); // コンポーネント終了時に認識停止
  }, [isListening, isVoiceMode, sendMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendClick = () => {
    sendMessage(input);
    setInput("");
  };

  const toggleInputMode = () => {
    setIsVoiceMode((prev) => !prev);
    setIsListening(false); // 音声モードを切り替えるときに停止
  };

  return (
    <div>
      <h1>セッションチャット</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <button onClick={toggleInputMode}>
        {isVoiceMode ? "文字入力モードに切り替え" : "音声入力モードに切り替え"}
      </button>

      {isVoiceMode ? (
        <div>
          <button onClick={() => setIsListening((prev) => !prev)}>
            {isListening ? "認識停止" : "認識開始"}
          </button>
        </div>
      ) : (
        <div>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="メッセージを入力"
          />
          <button onClick={handleSendClick}>送信</button>
        </div>
      )}
    </div>
  );
};

export default SessionChat;
