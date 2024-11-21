// // STTLoggerComponent.tsx
// import React from 'react';

// interface STTLoggerComponentProps {
//   logs: { message: string; type: 'user' | 'server'; timestamp: string }[];
// }

// const STTLoggerComponent: React.FC<STTLoggerComponentProps> = ({ logs }) => {
//   return (
//     <div className="h-full overflow-y-auto p-4 bg-gray-50">
//       <h2 className="text-xl font-bold mb-4">通信ログ</h2>
//       <div className="space-y-2">
//         {logs.map((log, index) => (
//           <div
//             key={index}
//             className={`p-2 rounded ${
//               log.type === 'user' ? 'bg-blue-100' : 'bg-green-100'
//             }`}
//           >
//             <div className="text-xs text-gray-500">{log.timestamp}</div>
//             <div className="mt-1">
//               <span className="font-bold">
//                 {log.type === 'user' ? 'You: ' : 'Server: '}
//               </span>
//               {log.message}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default STTLoggerComponent;