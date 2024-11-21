// STTLoggerComponent.tsx
interface Message {
    text: string;
    type: 'user' | 'server' | 'system';
    sender?: string;
    timestamp: string;
  }
  
  interface STTLoggerComponentProps {
    logs: Message[];
  }
  
  const STTLoggerComponent: React.FC<STTLoggerComponentProps> = ({ logs }) => {
    return (
      <div className="h-full overflow-y-auto p-4 bg-gray-50">
        <h2 className="text-xl font-bold mb-4">セッションログ</h2>
        <div className="space-y-2">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`p-2 rounded ${
                log.type === 'user' 
                  ? 'bg-blue-100' 
                  : log.type === 'system'
                  ? 'bg-gray-100'
                  : 'bg-green-100'
              }`}
            >
              <div className="text-xs text-gray-500">{log.timestamp}</div>
              <div className="mt-1">
                {log.type === 'system' ? (
                  <span className="text-gray-600">{log.text}</span>
                ) : (
                  <>
                    <span className="font-bold">
                      {log.sender}: 
                    </span>
                    <span>{log.text}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };  

export default STTLoggerComponent;