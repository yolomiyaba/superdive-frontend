import React from "react";

type STTLoggerComponentProps = {
  logs: string[];
};

const STTLoggerComponent: React.FC<STTLoggerComponentProps> = ({ logs }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "5px",
        height: "100%",
        overflowY: "auto",
        backgroundColor: "#f4f4f4",
      }}
    >
      <h2>会話ログ</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {logs.map((log, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            {log}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default STTLoggerComponent;
