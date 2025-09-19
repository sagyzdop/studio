"use client";

import { useEffect, useState } from "react";
import { ChartDisplay } from "./chart-display";
import { AddToDashboardModal } from "./add-to-dashboard-modal";

export function ChatClient() {
  const [data, setData] = useState<any | null>(null);
  const [wsStatus, setWsStatus] = useState("Connecting to server...");
  const [isAddToDashboardModalOpen, setIsAddToDashboardModalOpen] =
    useState(false);

  useEffect(() => {
    const wsUrl = "wss://845ad840422c.ngrok-free.app/ws"; // Replace with your ngrok WebSocket URL

    let socket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connectWebSocket = () => {
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("WebSocket connection established.");
        setWsStatus("Connected to Live Feed");
      };

      socket.onmessage = (event) => {
        console.log("Data received from server.");
        try {
          const parsedData = JSON.parse(event.data);

          setData({
            results: parsedData.results,
            sqlQuery: parsedData.sql_query,
          });
        } catch (e) {
          console.error("Failed to parse incoming JSON:", e);
        }
      };

      socket.onclose = () => {
        console.log(
          "WebSocket connection closed. Reconnecting in 3 seconds..."
        );
        setWsStatus("Connection Lost. Retrying...");
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        reconnectTimeout = setTimeout(connectWebSocket, 3000); // Attempt to reconnect
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setWsStatus("Connection Error");
        if (socket) {
          socket.close(); // Close the socket to trigger onclose and reconnect
        }
      };
    };

    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount and clean up on unmount

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background/80 px-6 backdrop-blur-sm">
        <h1 className="text-2xl font-semibold font-headline">Chat</h1>
      </header>
      <div className="flex-1 grid md:grid-cols-2 gap-6 p-6 overflow-hidden">
        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Data Visualization</h2>
          </div>
          <div className="flex-1 rounded-lg border bg-card p-4 overflow-auto relative">
            {" "}
            {/* Added relative class here */}
            <ChartDisplay data={data} wsStatus={wsStatus} />
          </div>
        </div>
        <div className="flex flex-col gap-4 overflow-hidden">
          <h2 className="text-lg font-semibold">Chatbot</h2>
          <div className="flex-1 rounded-lg border overflow-hidden">
            <iframe
              id="chatbot-iframe"
              src="http://hackathon.shai.pro/chatbot/uCPYEHCID0iKkPpt"
              className="w-full h-full min-h-[700px]"
              allow="microphone"
            ></iframe>
          </div>
        </div>
      </div>
      <AddToDashboardModal
        sqlQuery={data?.sqlQuery || ""}
        open={isAddToDashboardModalOpen}
        setOpen={setIsAddToDashboardModalOpen}
      />
    </div>
  );
}
