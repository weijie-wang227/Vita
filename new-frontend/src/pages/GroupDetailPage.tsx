import { ChevronLeft, Info, Send, Users } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useAppState } from "../state";

export function GroupDetailPage() {
  const {
    authUser,
    chatMessages,
    closeGroup,
    groupChats,
    loadGroupMessages,
    profile,
    selectedGroupId,
    sendGroupMessage,
  } = useAppState();
  const [draft, setDraft] = useState("");
  const [messageError, setMessageError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const group = groupChats.find((chat) => chat.id === selectedGroupId);
  const messages = selectedGroupId ? chatMessages[selectedGroupId] ?? [] : [];

  useEffect(() => {
    if (selectedGroupId === null) {
      return;
    }

    loadGroupMessages(selectedGroupId).catch((error) => {
      setMessageError(
        error instanceof Error ? error.message : "Unable to load messages.",
      );
    });
  }, [loadGroupMessages, selectedGroupId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedGroupId === null) {
      return;
    }

    const body = draft.trim();

    if (!body) {
      return;
    }

    setMessageError(null);
    setIsSending(true);

    try {
      await sendGroupMessage(selectedGroupId, body);
      setDraft("");
    } catch (error) {
      setMessageError(
        error instanceof Error ? error.message : "Unable to send message.",
      );
    } finally {
      setIsSending(false);
    }
  };

  if (!group) {
    return null;
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center gap-3 px-4 pt-5 pb-3 border-b border-border">
        <button
          onClick={closeGroup}
          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
          aria-label="Back to groups"
        >
          <ChevronLeft size={17} className="text-foreground" />
        </button>
        <div className="h-9 w-9 overflow-hidden rounded-full bg-secondary">
          <img
            src={group.avatar}
            alt={group.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-bold text-foreground">
            {group.name}
          </h1>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Users size={10} />
            <span>{group.members} members</span>
          </div>
        </div>
        <button
          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
          aria-label="Group info"
        >
          <Info size={14} className="text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-minimal px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <p className="max-w-[220px] text-sm leading-relaxed text-muted-foreground">
              No messages yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => {
              const isMine =
                message.sender.id === authUser?.id ||
                message.sender.handle === profile.handle;
              const senderAvatar = (
                <div
                  className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full bg-secondary"
                  title={message.sender.name}
                >
                  {message.sender.avatar ? (
                    <img
                      src={message.sender.avatar}
                      alt={message.sender.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[10px] font-bold text-muted-foreground">
                      {message.sender.name[0] ?? "?"}
                    </span>
                  )}
                </div>
              );

              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${
                    isMine ? "justify-end" : ""
                  }`}
                >
                  {!isMine && senderAvatar}
                  <div
                    className={`max-w-[78%] rounded-2xl px-3 py-2 ${
                      isMine
                        ? "rounded-br-md bg-accent text-accent-foreground"
                        : "rounded-bl-md bg-card text-foreground border border-border"
                    }`}
                  >
                    {isMine && message.sender.isAdmin && (
                      <div className="mb-1 flex justify-end">
                        <span className="rounded-full border border-accent-foreground/20 bg-accent-foreground/10 px-1.5 py-0.5 text-[9px] font-medium text-accent-foreground/75">
                          Admin
                        </span>
                      </div>
                    )}
                    {!isMine && (
                      <div className="mb-1 flex items-center gap-1.5">
                        <p className="text-[10px] font-semibold text-accent">
                          {message.sender.name}
                        </p>
                        {message.sender.isAdmin && (
                          <span className="rounded-full border border-accent/25 bg-accent/10 px-1.5 py-0.5 text-[9px] font-medium text-accent">
                            Admin
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-[12px] leading-snug">{message.body}</p>
                    <p
                      className={`mt-1 text-[9px] ${
                        isMine
                          ? "text-accent-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                  {isMine && senderAvatar}
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background px-4 py-3">
        {messageError && (
          <p className="mb-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
            {messageError}
          </p>
        )}
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 rounded-2xl bg-secondary px-3 py-2"
        >
          <img
            src={profile.avatar}
            alt=""
            className="h-7 w-7 rounded-full object-cover"
          />
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Message group"
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={!draft.trim() || isSending}
            className="h-8 w-8 rounded-full bg-accent flex items-center justify-center"
            aria-label="Send message"
          >
            <Send size={14} className="text-accent-foreground" />
          </button>
        </form>
      </div>
    </div>
  );
}
