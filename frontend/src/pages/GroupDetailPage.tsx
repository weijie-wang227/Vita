import {
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  Clock,
  Info,
  MapPin,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../app/components/ui/sheet";
import { useAppState } from "../state";

export function GroupDetailPage() {
  const {
    authUser,
    chatMessages,
    groupChats,
    isLoading,
    loadGroupMessages,
    profile,
    sendGroupMessage,
  } = useAppState();
  const navigate = useNavigate();
  const { groupId: groupIdParam } = useParams();
  const groupId = Number(groupIdParam);
  const [draft, setDraft] = useState("");
  const [messageError, setMessageError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isMemberSheetOpen, setIsMemberSheetOpen] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const group = groupChats.find((chat) => chat.id === groupId);
  const messages = Number.isFinite(groupId) ? chatMessages[groupId] ?? [] : [];
  const groupMembers = [...(group?.memberList ?? [])].sort((left, right) => {
    if (left.isAdmin !== right.isAdmin) {
      return left.isAdmin ? -1 : 1;
    }

    return left.name.localeCompare(right.name);
  });

  useEffect(() => {
    if (!Number.isFinite(groupId)) {
      return;
    }

    loadGroupMessages(groupId).catch((error) => {
      setMessageError(
        error instanceof Error ? error.message : "Unable to load messages.",
      );
    });
  }, [groupId, loadGroupMessages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!Number.isFinite(groupId)) {
      return;
    }

    const body = draft.trim();

    if (!body) {
      return;
    }

    setMessageError(null);
    setIsSending(true);

    try {
      await sendGroupMessage(groupId, body);
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
    return (
      <div className="flex h-full flex-col bg-background">
        <div className="flex items-center gap-3 px-4 pt-5 pb-3 border-b border-border">
          <button
            onClick={() => navigate("/groups")}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
            aria-label="Back to groups"
          >
            <ChevronLeft size={17} className="text-foreground" />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-sm font-bold text-foreground">
            Group
          </h1>
        </div>
        <div className="flex flex-1 items-center justify-center px-8 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {isLoading ? "Loading group..." : "Group not found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center gap-3 px-4 pt-5 pb-3 border-b border-border">
        <button
          onClick={() => navigate("/groups")}
          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
          aria-label="Back to groups"
        >
          <ChevronLeft size={17} className="text-foreground" />
        </button>
        <button
          type="button"
          onClick={() => setIsMemberSheetOpen(true)}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl py-1 text-left transition-colors active:bg-secondary/60"
          aria-label={`View ${group.name} members`}
        >
          <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-secondary">
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
            <div className="flex min-w-0 items-center gap-1 text-[10px] text-muted-foreground">
              <Users size={10} className="flex-shrink-0" />
              <span>{group.members} members</span>
              {group.isAdmin && (
                <span className="ml-1 inline-flex flex-shrink-0 items-center gap-1 rounded-full border border-accent/25 bg-accent/10 px-1.5 py-0.5 text-[9px] font-medium text-accent">
                  <ShieldCheck size={9} />
                  Admin
                </span>
              )}
            </div>
          </div>
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
            <Info size={14} className="text-muted-foreground" />
          </span>
        </button>
      </div>

      <Sheet open={isMemberSheetOpen} onOpenChange={setIsMemberSheetOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[82vh] gap-0 rounded-t-3xl border-border p-0 sm:mx-auto sm:max-w-md"
        >
          <SheetHeader className="border-b border-border px-4 pb-3 pr-12 pt-5 text-left">
            <SheetTitle className="truncate text-base">
              {group.name}
            </SheetTitle>
            <SheetDescription>
              {group.members} current members
            </SheetDescription>
          </SheetHeader>
          <div className="max-h-[calc(82vh-96px)] overflow-y-auto px-4 py-2 scrollbar-minimal">
            {groupMembers.length > 0 ? (
              groupMembers.map((member) => {
                const isCurrentUser =
                  member.id === authUser?.id || member.handle === profile.handle;

                return (
                  <div
                    key={member.id || member.handle}
                    className="flex items-center gap-3 border-b border-border py-3 last:border-0"
                  >
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-secondary">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
                          {member.name[0] ?? "?"}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {member.name}
                        </p>
                        {isCurrentUser && (
                          <span className="flex-shrink-0 rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                            You
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {member.handle}
                      </p>
                    </div>
                    {member.isAdmin && (
                      <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full border border-accent/25 bg-accent/10 px-2 py-1 text-[10px] font-medium text-accent">
                        <ShieldCheck size={11} />
                        Admin
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Member details are unavailable right now.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>

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
              const invite = message.activityInvite;
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

              if (message.type === "activity_invite" && invite) {
                const joinedFriends = invite.joiningFriends;
                const visibleJoinedFriends = joinedFriends.slice(0, 4);
                const extraJoinedFriends =
                  joinedFriends.length - visibleJoinedFriends.length;
                const joinedNames = visibleJoinedFriends
                  .map((friend) => friend.name.split(" ")[0])
                  .join(", ");

                return (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2 ${
                      isMine ? "justify-end" : ""
                    }`}
                  >
                    {!isMine && senderAvatar}
                    <button
                      type="button"
                      onClick={() => navigate(`/activities/${invite.activity.id}`)}
                      className={`max-w-[86%] rounded-2xl border px-3 py-3 text-left shadow-sm transition-transform active:scale-[0.99] ${
                        isMine
                          ? "rounded-br-md border-accent/25 bg-accent/10"
                          : "rounded-bl-md border-border bg-card"
                      }`}
                      aria-label={`Open ${invite.activity.title}`}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate text-[10px] font-semibold text-accent">
                              {message.sender.name}
                            </p>
                            {message.sender.isAdmin && (
                              <span className="rounded-full border border-accent/25 bg-accent/10 px-1.5 py-0.5 text-[9px] font-medium text-accent">
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] text-muted-foreground">
                            {message.time}
                          </p>
                        </div>
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                          <ArrowUpRight size={13} />
                        </div>
                      </div>

                      <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                        Activity Invite
                      </p>
                      <h3 className="mt-1 text-sm font-bold leading-tight text-foreground">
                        {invite.activity.title}
                      </h3>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <Calendar size={11} className="flex-shrink-0 text-accent" />
                          <span className="truncate">
                            {invite.activity.date}
                          </span>
                        </div>
                        <div className="flex min-w-0 items-center gap-1.5">
                          <Clock size={11} className="flex-shrink-0 text-accent" />
                          <span className="truncate">
                            {invite.activity.time}
                          </span>
                        </div>
                        <div className="col-span-2 flex min-w-0 items-center gap-1.5">
                          <MapPin size={11} className="flex-shrink-0 text-accent" />
                          <span className="truncate">
                            {invite.activity.location}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 border-t border-border pt-2">
                        {joinedFriends.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1.5">
                              {visibleJoinedFriends.map((friend) => (
                                <img
                                  key={friend.id}
                                  src={friend.avatar}
                                  alt={friend.name}
                                  className="h-5 w-5 rounded-full border border-card object-cover"
                                />
                              ))}
                              {extraJoinedFriends > 0 && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-card bg-secondary text-[8px] font-bold text-muted-foreground">
                                  +{extraJoinedFriends}
                                </span>
                              )}
                            </div>
                            <span className="min-w-0 truncate text-[10px] text-muted-foreground">
                              {joinedNames}
                              {extraJoinedFriends > 0
                                ? ` + ${extraJoinedFriends}`
                                : ""}{" "}
                              joined
                            </span>
                          </div>
                        ) : (
                          <p className="text-[10px] text-muted-foreground">
                            No one has joined yet.
                          </p>
                        )}
                      </div>
                    </button>
                    {isMine && senderAvatar}
                  </div>
                );
              }

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
