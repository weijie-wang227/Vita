import { Card, Button } from "./ui";
import type { User, ChatMessage } from "../lib/types";
import { useState, useEffect } from "react";

type ChatProp = {
  currentUser: User;
  id: string;
  title: string;
  fetchMessages: (chatId: string) => Promise<ChatMessage[]>;
  sendMessage: (chatId: string, message: string) => Promise<ChatMessage | null>;
};

export function Chat({
  currentUser,
  id,
  title,
  fetchMessages,
  sendMessage,
}: ChatProp) {
  const [message, setMessage] = useState("");

  // Temporary mock messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    async function loadChat() {
      if (!id) return;
      const messageData = await fetchMessages(id ?? "");
      console.log(messageData);
      setMessages(messageData);
    }
    loadChat();
  }, []);

  async function handleSendMessage() {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;
    if (!id) return;
    const response = sendMessage(id, trimmedMessage);
    const newMsg = await response;
    console.log(newMsg);
    if (!newMsg) return;
    const newMessage: ChatMessage = {
      id: newMsg.id,
      userName: newMsg.userName,
      message: newMsg.message,
      createdAt: newMsg.createdAt,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  }

  return (
    <Card className="flex min-h-[520px] flex-col space-y-4">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">
          Member chat
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">
          Only registered members can view and send messages here.
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-3xl bg-slate-50 p-4">
        {messages.map((item) => {
          const isMine = item.userName === currentUser.name;

          return (
            <div
              key={item.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-3xl px-4 py-3 ${
                  isMine
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-slate-900 shadow-sm"
                }`}
              >
                <div className="mb-1 flex items-center justify-between gap-3">
                  <p
                    className={`text-xs font-semibold ${
                      isMine ? "text-indigo-100" : "text-slate-500"
                    }`}
                  >
                    {isMine ? "You" : item.userName}
                  </p>
                  <p
                    className={`text-xs ${
                      isMine ? "text-indigo-100" : "text-slate-400"
                    }`}
                  >
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <p className="text-sm leading-6">{item.message}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder="Write a message..."
          className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        />

        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    </Card>
  );
}
