import { ChevronLeft, Info, Send, Users } from "lucide-react";
import { useAppState } from "../state";

const sampleReplies = [
  "Sounds good. I can make it.",
  "Anyone taking the MRT there?",
  "I will bring some extra water.",
];

export function GroupDetailPage() {
  const { closeGroup, groupChats, profile, selectedGroupId } = useAppState();
  const group = groupChats.find((chat) => chat.id === selectedGroupId);

  if (!group) {
    return null;
  }

  const hostName = group.lastMessage.split(":")[0] || group.name;

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
        <div className="mx-auto mb-4 w-fit rounded-full bg-secondary px-3 py-1">
          <span className="text-[10px] text-muted-foreground">Today</span>
        </div>

        <div className="mb-3 flex items-end gap-2">
          <div className="h-7 w-7 overflow-hidden rounded-full bg-secondary">
            <img
              src={group.avatar}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="max-w-[78%] rounded-2xl rounded-bl-md bg-card px-3 py-2 border border-border">
            <p className="mb-1 text-[10px] font-semibold text-accent">
              {hostName}
            </p>
            <p className="text-[12px] leading-snug text-foreground">
              {group.lastMessage.replace(`${hostName}: `, "")}
            </p>
          </div>
        </div>

        {sampleReplies.map((reply, index) => (
          <div
            key={reply}
            className={`mb-3 flex items-end gap-2 ${
              index === 1 ? "justify-end" : ""
            }`}
          >
            {index !== 1 && (
              <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-[10px] font-bold text-muted-foreground">
                  {reply[0]}
                </span>
              </div>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-3 py-2 ${
                index === 1
                  ? "rounded-br-md bg-accent text-accent-foreground"
                  : "rounded-bl-md bg-card text-foreground border border-border"
              }`}
            >
              <p className="text-[12px] leading-snug">{reply}</p>
            </div>
          </div>
        ))}

        <div className="mb-3 flex justify-end">
          <div className="max-w-[78%] rounded-2xl rounded-br-md bg-accent px-3 py-2 text-accent-foreground">
            <p className="text-[12px] leading-snug">
              Thanks, I will see everyone there.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-background px-4 py-3">
        <div className="flex items-center gap-2 rounded-2xl bg-secondary px-3 py-2">
          <img
            src={profile.avatar}
            alt=""
            className="h-7 w-7 rounded-full object-cover"
          />
          <span className="flex-1 text-sm text-muted-foreground">
            Message group
          </span>
          <button
            className="h-8 w-8 rounded-full bg-accent flex items-center justify-center"
            aria-label="Send message"
          >
            <Send size={14} className="text-accent-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
