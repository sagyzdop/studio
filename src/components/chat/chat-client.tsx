'use client';

import { useState } from 'react';
import { ChartDisplay } from './chart-display';

// This is a mock of the data structure that might come from the WebSocket
const MOCK_DATA_FROM_WS = {
  sqlQuery:
    "SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department ORDER BY employee_count DESC;",
  results: [
    { department: 'Engineering', employee_count: 75 },
    { department: 'Sales', employee_count: 52 },
    { department: 'Marketing', employee_count: 34 },
    { department: 'HR', employee_count: 12 },
  ],
};

export function ChatClient() {
  const [data, setData] = useState<any | null>(null);

  // Simulate receiving WebSocket data.
  // In a real app, this would be inside a useEffect hook with a WebSocket connection.
  const simulateWebSocketMessage = () => {
    setData(MOCK_DATA_FROM_WS);
  };
  
  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background/80 px-6 backdrop-blur-sm">
        <h1 className="text-2xl font-semibold font-headline">Chat</h1>
      </header>
      <div className="flex-1 grid md:grid-cols-2 gap-6 p-6 overflow-hidden">
        <div className="flex flex-col gap-4 overflow-hidden">
          <h2 className="text-lg font-semibold">Data Visualization</h2>
          <div className="flex-1 rounded-lg border bg-card p-4 overflow-auto">
            <ChartDisplay data={data} onSimulate={simulateWebSocketMessage} />
          </div>
        </div>
        <div className="flex flex-col gap-4 overflow-hidden">
          <h2 className="text-lg font-semibold">Chatbot</h2>
          <div className="flex-1 rounded-lg border overflow-hidden">
            <iframe
              src="http://hackathon.shai.pro/chatbot/uCPYEHCID0iKkPpt"
              className="w-full h-full border-0"
              title="Chatbot"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
