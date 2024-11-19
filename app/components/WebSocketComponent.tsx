// components/WebSocketComponent.tsx
'use client';

import React, { useState } from 'react';
import useWebSocket from 'react-use-websocket';

const WebSocketComponent = () => {
  const [messages, setMessages] = useState<string[]>([]);
  
  // WebSocketサーバーのURL
  const socketUrl = 'ws://localhost:8000/ws';

  // WebSocket接続を初期化
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log('Connected to WebSocket'),
    onClose: () => console.log('Disconnected from WebSocket'),
    onError: (event) => console.error('WebSocket error:', event),
    shouldReconnect: (closeEvent) => true, // 自動再接続
  });

  // 新しいメッセージを受信した場合に更新
  React.useEffect(() => {
    if (lastMessage !== null) {
      setMessages((prev) => [...prev, lastMessage.data]);
    }
  }, [lastMessage]);

  // WebSocketの状態
  const connectionStatus: { [key: number]: string } = {
    0: 'Connecting',
    1: 'Open',
    2: 'Closing',
    3: 'Closed',
  };
  const status = connectionStatus[readyState] ?? 'Unknown';

  return (
    <div>
      <h1>WebSocket Status: {status}</h1>
      <button onClick={() => sendMessage('Hello WebSocket!')}>Send Message</button>
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketComponent;
