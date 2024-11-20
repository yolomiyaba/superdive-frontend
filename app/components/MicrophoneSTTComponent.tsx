// "use client"; // クライアントサイドで動作するコンポーネント

// import React, { useState, useEffect } from "react";
// import useWebSocket from 'react-use-websocket';
// // import SessionChat from "./SessionChat";
// import App from "./App";

// type MicrophoneSTTComponentProps = {
//     onTranscript: (transcript: string) => void; // コールバックを追加
//   };

// const MicrophoneSTTComponent: React.FC<MicrophoneSTTComponentProps> = ({ onTranscript }) => {
//     const [isListening, setIsListening] = useState(false);
//     const [transcript, setTranscript] = useState<string>("");
//     const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

//     const [messages, setMessages] = useState<string[]>([]);
//     const socketUrl = 'ws://superdive-demo-backend-alb-179482814.ap-northeast-1.elb.amazonaws.com/ws';

//   // WebSocket接続を初期化
//     const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
//         onOpen: () => console.log('Connected to WebSocket'),
//         onClose: () => console.log('Disconnected from WebSocket'),
//         onError: (event) => console.error('WebSocket error:', event),
//         // shouldReconnect: (closeEvent) => true, // 自動再接続
//     });

//     useEffect(() => {
//         if (lastMessage !== null) {
//           setMessages((prev) => [...prev, lastMessage.data]);
//         }
//       }, [lastMessage]);
    
//     useEffect(() => {
//       if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
//         const recognitionInstance: SpeechRecognition = new SpeechRecognition();
//         recognitionInstance.lang = "ja-JP";
//         recognitionInstance.interimResults = true;
//         recognitionInstance.continuous = true;
  
//         recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
//         //   let interimTranscript = "";
//           for (let i = event.resultIndex; i < event.results.length; i++) {
//             const result = event.results[i];
//             if (result.isFinal) {
//               const finalTranscript = result[0].transcript;
//               setTranscript((prev) => prev + finalTranscript);
//               sendMessage(finalTranscript);
//               onTranscript(finalTranscript); // ログに追加
//             } else {
//             //   interimTranscript += result[0].transcript;
//             }
//           }
//         };
  
//         recognitionInstance.onerror = (event) => {
//           console.error("SpeechRecognition error:", event);
//         };
  
//         setRecognition(recognitionInstance);
//       } else {
//         console.error("SpeechRecognition is not supported in this browser.");
//       }
//     }, [onTranscript, sendMessage]);

    
  
//     const toggleListening = () => {
//       if (!recognition) return;
  
//       if (isListening) {
//         recognition.stop();
//         setIsListening(false);
//       } else {
//         recognition.start();
//         setTranscript("");
//         setIsListening(true);
//       }
//     };

//     const connectionStatus: { [key: number]: string } = {
//         0: 'Connecting',
//         1: 'Open',
//         2: 'Closing',
//         3: 'Closed',
//       };
//     const status = connectionStatus[readyState] ?? 'Unknown';
  
//     return (
//       <div>
//         {/* <h1>マイク入力とSTT (Speech-to-Text)</h1>
//         <button onClick={toggleListening}>{isListening ? "停止" : "開始"}</button>
//         <p>{transcript || (isListening ? "話してください..." : "ここにテキストが表示されます")}</p>
//         <p> status: {status} </p>
//         <ul>
//         {messages.map((msg, idx) => (
//           <li key={idx}>{msg}</li>
//         ))}
//       </ul> */}
//       {/* <SessionChat /> */}
//       <App />
//       </div>
//     );
// };
  
// export default MicrophoneSTTComponent;