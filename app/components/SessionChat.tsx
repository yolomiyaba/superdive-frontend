// SessionChat.tsx
import React, { useCallback, useEffect, useState } from "react";
import { Message } from "../types/chat";

interface SessionChatProps {
  userId: string;
  sessionId: number;
  onNewLog: (message: string, type: 'user' | 'server') => void;
}

const SessionChat: React.FC<SessionChatProps> = ({ userId, sessionId, onNewLog }) => {
  const [input, setInput] = useState<string>("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(
      `ws://superdive-demo-backend-alb-179482814.ap-northeast-1.elb.amazonaws.com/ws/chat/${userId}`
    );

    const processServerMessage = (rawMessage: string): Message => {
        const timestamp = new Date().toLocaleTimeString();
      
        // システムメッセージの判定（参加・退出）
        if (rawMessage.includes('joined the session') || rawMessage.includes('left the session')) {
          return {
            text: rawMessage,
            type: 'system',
            timestamp
          };
        }
      
        // エコーメッセージの判定（自分の発言）
        if (rawMessage.startsWith('You: ')) {
          return {
            text: rawMessage.replace('You: ', ''),
            type: 'user',
            sender: 'You',
            timestamp
          };
        }
      
        // 他のユーザーからのメッセージの判定
        if (rawMessage.startsWith('User ')) {
          const [, userId, ...messageParts] = rawMessage.match(/User (.*?): (.*)/) || [];
          if (userId && messageParts) {
            return {
              text: messageParts.join(''),
              type: 'server',
              sender: userId,
              timestamp
            };
          }
        }
      
        // Echo: プレフィックスの除去
        if (rawMessage.startsWith('Echo: ')) {
          return {
            text: rawMessage.replace('Echo: ', ''),
            type: 'user',
            sender: 'You',
            timestamp
          };
        }
      
        // その他のメッセージ
        return {
          text: rawMessage,
          type: 'server',
          timestamp
        };
      };
    
      ws.onmessage = (event) => {
        console.log('Received message:', event.data);
        const message = processServerMessage(event.data);
        onNewLog(message.text, 'user');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };

      setSocket(ws);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        // ws.close();
        console.log('ds')
      }
    };
  }, [userId, sessionId, onNewLog]);

  const sendMessage = useCallback(
    (message: string) => {
      if (!socket || !message.trim()) return;
      
      socket.send(message);
      onNewLog(message, 'user');
      setInput("");
    },
    [socket, onNewLog]
  );

  useEffect(() => {
    if (!isVoiceMode || typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("SpeechRecognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ja-JP";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.abort();
  }, [isListening, isVoiceMode, sendMessage]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto p-4">
        <h1 className="text-xl font-bold mb-4">セッションチャット</h1>
        <div className="space-y-4 mb-4">
          <button
            onClick={() => setIsVoiceMode((prev) => !prev)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isVoiceMode ? "文字入力モードに切り替え" : "音声入力モードに切り替え"}
          </button>
        </div>

        {isVoiceMode ? (
          <div>
            <button
              onClick={() => setIsListening((prev) => !prev)}
              className={`px-4 py-2 ${
                isListening ? 'bg-red-500' : 'bg-green-500'
              } text-white rounded hover:opacity-80`}
            >
              {isListening ? "認識停止" : "認識開始"}
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendMessage(input);
                }
              }}
              placeholder="メッセージを入力"
              className="flex-grow px-4 py-2 border rounded"
            />
            <button
              onClick={() => sendMessage(input)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              送信
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionChat;