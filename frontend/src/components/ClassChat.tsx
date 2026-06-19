import { useState, useEffect } from "react";
import { Button, Card } from "./ui";
import type { ClassInfo, User, ChatMessage } from "../lib/types";
import { fetchChat, postMessage } from "../api/chat";

type ClassChatProps = {
  classInfo: ClassInfo | null;
  currentUser: User | null;
};

export function ClassChat({ classInfo, currentUser }: ClassChatProps) {
  const [message, setMessage] = useState("");

  // Temporary mock messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    async function loadChat() {
      const messageData = await fetchChat(classInfo?._id ?? "");
      console.log(messageData);
      setMessages(messageData);
    }
    loadChat();
  }, []);

  if (!classInfo) {
    return (
      <Card>
        <p className="text-slate-600">Class not found.</p>
      </Card>
    );
  }

  if (!currentUser) {
    return (
      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Member chat</h2>
        <p className="text-sm leading-6 text-slate-600">
          Please sign in to view the member chat for this class.
        </p>
      </Card>
    );
  }

  if (!classInfo.bookedByMe) {
    return (
      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Member chat</h2>
        <p className="text-sm leading-6 text-slate-600">
          This chat is only available to members who have registered for this
          class.
        </p>
      </Card>
    );
  }

  async function handleSendMessage() {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;
    const response = postMessage(classInfo?._id ?? "", trimmedMessage);
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
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          {classInfo.title}
        </h2>
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
