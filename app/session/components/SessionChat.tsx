import React, { useEffect, useRef, useState } from "react";

interface SessionChatProps {
  userId: string;
  sessionId: number;
  onNewLog: (message: string, type: "user" | "system") => void;
}

type MessageKind = "message" | "feedback" | "summary";

interface Message {
  kind: MessageKind;
  content: string;
}

const SessionChat: React.FC<SessionChatProps> = ({ userId, sessionId, onNewLog }) => {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState<string>("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://superdive-demo-backend-alb-179482814.ap-northeast-1.elb.amazonaws.com/ws/chat/${userId}`);

    ws.onmessage = (event) => {
      const data: Message = JSON.parse(event.data);
      console.log("Received message:", data);

      switch (data.kind) {
        case "message":
          // setMessages((prev) => [...prev, data]);
          setLastMessage(data.content);
          onNewLog(data.content, "system");
          break;
        case "feedback":
          setFeedback(data.content);
          break;
        case "summary":
          setSummary(data.content);
          break;
        default:
          console.error("Unknown message type:", data.kind);
      }

      // onNewLog(data.content, "system");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socketRef.current = ws;

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [userId, sessionId, onNewLog]);

  const startListening = () => {
    if (isListening || typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("SpeechRecognition is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.lang = "ja-JP";
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";

        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          interimTranscript += transcript;
        }

        setCurrentTranscript(interimTranscript); // リアルタイムで更新
      };

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }

    recognitionRef.current.start();
  };

  const stopListening = () => {
    // if (recognitionRef.current) {
    //   recognitionRef.current.stop();
    // }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null; // 音声認識インスタンスをリセット
    }
    setIsListening(false);
  };

  const handleSendMessage = (goToNext: boolean) => {
    if (!currentTranscript.trim()) return;

    // WebSocketで送信
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      // socketRef.current.send(currentTranscript);
      socketRef.current.send(
        JSON.stringify({
          content: currentTranscript,
          go_to_next: goToNext, // フラグを送信
        })
      );
    }

    // ログに登録
    onNewLog(currentTranscript, "user");

    stopListening();
    // 入力をクリア
    setCurrentTranscript("");
  };

  const handleNextQuestion = () => {
    handleSendMessage(true); // go_to_next: true を送信
  };

  const handleAddResponse = () => {
    handleSendMessage(false); // go_to_next: false を送信
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // 高さをリセット
      textarea.style.height = `${textarea.scrollHeight}px`; // 内容に応じて高さを調整
    }
  };

  useEffect(() => {
    adjustTextareaHeight(); // 初期表示時に高さを調整
  }, [currentTranscript]);

return (
  <div className="h-full flex flex-col bg-gray-100">
    <div className="flex-grow overflow-y-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">エネルギーを高めるセッション</h1>

      {/* 問いかけ */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">問いかけ</h2>
        <div className="p-2 bg-gray-100 rounded mb-4">
          {lastMessage ? `${lastMessage}` : "まだメッセージがありません"}
        </div>
      </div>

      <div className="space-y-4 mt-4">
          <button
            onClick={() => setIsVoiceMode((prev) => !prev)}
            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-md shadow-md"
          >
            {isVoiceMode ? "文字入力モードに切り替え" : "音声入力モードに切り替え"}
          </button>
      </div>

      {isVoiceMode ? (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`px-6 py-2 font-medium text-white rounded-md shadow-md ${
                  isListening ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isListening ? "認識停止" : "認識開始"}
              </button>
              <textarea
                ref={textareaRef}
                value={currentTranscript}
                onInput={adjustTextareaHeight}
                readOnly
                className="flex-grow px-4 py-2 border rounded-md bg-gray-50 text-gray-800 shadow-inner resize-none overflow-hidden"
                placeholder="話した内容がここに表示されます..."
              />
            </div>
            {/* <button
              onClick={handleNextQuestion}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-md"
            >
              次の質問へ
            </button> */}
            <button
    onClick={handleAddResponse}
    className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md shadow-md"
  >
    回答を送信
  </button>
  <button
    onClick={handleNextQuestion}
    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-md"
  >
    次の質問へ
  </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <textarea
              ref={textareaRef}
              value={currentTranscript}
              onChange={(e) => setCurrentTranscript(e.target.value)}
              onInput={adjustTextareaHeight}
              className="flex-grow px-4 py-2 border rounded-md bg-white shadow-inner text-gray-800 resize-none overflow-hidden"
              placeholder="テキストを入力してください..."
            />
            {/* <button
              onClick={handleNextQuestion}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-md"
            >
              次の質問へ
            </button> */}
            <button
    onClick={handleAddResponse}
    className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md shadow-md"
  >
    回答を送信
  </button>
  <button
    onClick={handleNextQuestion}
    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-md"
  >
    次の質問へ
  </button>
          </div>
        )}

      {/* 感想 */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">感想</h2>
        <div className="p-4 bg-blue-50 rounded shadow-md text-gray-800">
          {feedback ? feedback : <div className="text-gray-500">感想はまだありません</div>}
        </div>
      </div>
      <div className="space-y-2">
  <h2 className="text-lg font-semibold text-gray-700">まとめ</h2>
  <div className="p-4 bg-yellow-50 rounded shadow-md text-gray-800">
    {(() => {
      let parsedSummary: { 客体: string; 信念: string; 意志: string }[] = [];
      if (summary) {
        try {
          // 不要な文字や記号を削除
          const sanitizedSummary = summary.replace(/```json|```/g, "").trim();
          parsedSummary = JSON.parse(sanitizedSummary);
        } catch (error) {
          console.error("Failed to parse summary JSON:", error);
        }
      }

      return parsedSummary && parsedSummary.length > 0 ? (
        <table className="min-w-full bg-white border-collapse border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2 text-left">客体</th>
              <th className="border border-gray-200 px-4 py-2 text-left">信念</th>
              <th className="border border-gray-200 px-4 py-2 text-left">意志</th>
            </tr>
          </thead>
          <tbody>
            {parsedSummary.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-4 py-2">{item.客体}</td>
                <td className="border border-gray-200 px-4 py-2">{item.信念}</td>
                <td className="border border-gray-200 px-4 py-2">{item.意志}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-gray-500">まとめはまだありません</div>
      );
    })()}
  </div>
</div>

    </div>
  </div>
);
};

export default SessionChat;