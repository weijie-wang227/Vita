import { Search, Users } from "lucide-react";
import { useAppState } from "../state";

export function ChatPage() {
  const { groupChats, openGroup, openProfile, profile } = useAppState();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <h1 className="text-xl font-bold text-foreground">Groups</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={openProfile}
            className="w-8 h-8 rounded-full overflow-hidden border-2 flex-shrink-0"
            style={{ borderColor: "#c9993a" }}
            aria-label="Open profile"
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>

      <div className="px-4 mb-3">
        <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2">
          <Search size={13} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Search groups</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-minimal px-4">
        {groupChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => openGroup(chat.id)}
            className="w-full flex items-center gap-3 py-3 border-b border-border last:border-0 cursor-pointer text-left active:bg-secondary/40 transition-colors"
            aria-label={`Open ${chat.name}`}
          >
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-secondary">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-card border border-border flex items-center justify-center">
                <Users size={8} className="text-muted-foreground" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-foreground truncate pr-2">
                  {chat.name}
                </p>
                <span className="text-[10px] text-muted-foreground flex-shrink-0">
                  {chat.time}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] text-muted-foreground">
                  {chat.members} members
                </span>
                <span className="text-muted-foreground opacity-40">/</span>
                <p className="text-[11px] text-muted-foreground truncate">
                  {chat.lastMessage}
                </p>
              </div>
            </div>
            {chat.unread > 0 && (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ml-1"
                style={{ backgroundColor: "#c9993a" }}
              >
                <span className="text-[9px] font-bold text-black">
                  {chat.unread}
                </span>
              </div>
            )}
          </button>
        ))}
        <div className="h-4" />
      </div>
    </div>
  );
}
