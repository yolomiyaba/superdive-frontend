import React, { useState, useEffect } from "react";

interface InputComponentProps {
  onInput: (input: string) => void;
}

const InputComponent: React.FC<InputComponentProps> = ({ onInput }) => {
  const [input, setInput] = useState<string>("");
  const [isVoiceMode, setIsVoiceMode] = useState(false); // モード切り替え
  const [isListening, setIsListening] = useState(false); // 音声認識中か

  // 音声認識の設定
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
      onInput(transcript); // 入力内容を親に送信
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.abort(); // コンポーネント終了時に停止
  }, [isListening]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendClick = () => {
    if (input.trim()) {
      onInput(input); // 入力内容を親に送信
      setInput(""); // 入力欄をクリア
    }
  };

  return (
    <div>
      <button onClick={() => setIsVoiceMode((prev) => !prev)}>
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
            placeholder="文字を入力してください"
          />
          <button onClick={handleSendClick}>送信</button>
        </div>
      )}
    </div>
  );
};

export default InputComponent;
