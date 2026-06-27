import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  CheckCircle2,
  Edit3,
  LogOut,
  MessageCircle,
  QrCode,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import { BaseSearchBar } from "../components/BaseSearchBar";
import { useAppState } from "../state";

export function ProfilePage() {
  const {
    authUser,
    clearFriendInviteResult,
    friends,
    friendInviteFeedback,
    friendInviteFriend,
    profile,
    signOut,
    showProfileFriends,
    openSettings,
    setShowProfileFriends,
  } = useAppState();
  const [shareFeedback, setShareFeedback] = useState("");
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [debouncedFriendSearchQuery, setDebouncedFriendSearchQuery] =
    useState("");
  const inviteUrl =
    authUser?.id && typeof window !== "undefined"
      ? `${window.location.origin}/profile?friendId=${encodeURIComponent(
          authUser.id,
        )}`
      : "";
  const qrFeedback = shareFeedback || friendInviteFeedback;
  const activeFriendSearchQuery = debouncedFriendSearchQuery.toLowerCase();
  const filteredFriends = activeFriendSearchQuery
    ? friends.filter((friend) =>
        [
          friend.name,
          friend.handle,
          `${friend.mutual} mutual`,
          friend.joined.join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(activeFriendSearchQuery),
      )
    : friends;

  const handleShareProfileLink = async () => {
    if (!inviteUrl) {
      setShareFeedback("Sign in again to create your profile link.");
      return;
    }

    const shareData = {
      title: `${profile.name} on Vita`,
      text: `Add ${profile.name} as a friend on Vita.`,
      url: inviteUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareFeedback("Profile link shared.");
        return;
      }

      await navigator.clipboard.writeText(inviteUrl);
      setShareFeedback("Profile link copied.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      try {
        await navigator.clipboard.writeText(inviteUrl);
        setShareFeedback("Profile link copied.");
      } catch {
        setShareFeedback(inviteUrl);
      }
    }
  };

  return (
    <div className="relative flex flex-col h-full bg-background">
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <h2 className="text-base font-semibold text-foreground flex-1">
          My Profile
        </h2>
        <button
          type="button"
          onClick={openSettings}
          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
          aria-label="Open settings"
        >
          <Settings size={14} className="text-muted-foreground" />
        </button>
        <button
          type="button"
          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
          aria-label="Edit profile"
        >
          <Edit3 size={14} className="text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-minimal">
        <div className="flex flex-col items-center px-4 pb-5">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-accent flex items-center justify-center border-2 border-background">
              <Edit3 size={10} color="var(--accent-foreground)" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-foreground">{profile.name}</h2>
          <p className="text-xs text-accent font-medium mb-1">
            {profile.handle}
          </p>
          <p className="text-[12px] text-muted-foreground text-center leading-relaxed max-w-[260px]">
            {profile.bio}
          </p>

          <div className="flex gap-6 mt-4 py-3 border-y border-border w-full justify-center">
            {profile.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-base font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="flex bg-secondary rounded-xl p-1 mb-4">
            {[
              { id: false, icon: <QrCode size={13} />, label: "My QR Code" },
              { id: true, icon: <Users size={13} />, label: "Friends" },
            ].map((item) => (
              <button
                key={String(item.id)}
                onClick={() => setShowProfileFriends(item.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  showProfileFriends === item.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {!showProfileFriends ? (
            <div className="flex flex-col items-center bg-card rounded-2xl p-5 border border-border">
              <p className="text-xs text-muted-foreground mb-4 text-center">
                Scan to add {profile.name} as a friend
              </p>
              <div className="w-40 h-40 bg-white rounded-xl p-2.5 mb-4">
                {inviteUrl ? (
                  <QRCodeSVG
                    value={inviteUrl}
                    size={140}
                    level="M"
                    marginSize={2}
                    title={`${profile.name} Vita friend invite`}
                  />
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img
                    src={profile.avatar}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-semibold text-foreground">
                  {profile.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {profile.handle}
                </span>
              </div>
              <button
                type="button"
                onClick={handleShareProfileLink}
                className="mt-3 flex items-center gap-1.5 text-xs text-accent font-medium disabled:opacity-50"
                disabled={!inviteUrl}
              >
                <UserPlus size={12} />
                Share my profile link
              </button>
              {qrFeedback ? (
                <p
                  className="mt-2 max-w-full break-words text-center text-[11px] text-muted-foreground"
                  aria-live="polite"
                >
                  {qrFeedback}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {friendInviteFeedback ? (
                <p
                  className="border-b border-border px-3 py-2 text-center text-[11px] text-muted-foreground"
                  aria-live="polite"
                >
                  {friendInviteFeedback}
                </p>
              ) : null}
              <BaseSearchBar
                value={friendSearchQuery}
                onValueChange={setFriendSearchQuery}
                onDebouncedQueryChange={setDebouncedFriendSearchQuery}
                placeholder="Search friends"
                ariaLabel="Search friends"
                className="flex h-10 items-center gap-2 border-b border-border px-3"
                inputClassName="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                iconSize={17}
              />
              {filteredFriends.length === 0 && (
                <p className="px-3 py-5 text-center text-xs text-muted-foreground">
                  No friends match your search.
                </p>
              )}
              {filteredFriends.map((friend, index) => (
                <div
                  key={friend.id}
                  className={`flex items-center gap-3 px-3 py-2.5 ${
                    index < filteredFriends.length - 1
                      ? "border-b border-border"
                      : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-foreground">
                      {friend.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {friend.mutual} mutual / {friend.joined[0] ?? "Just connected"}
                    </p>
                  </div>
                  <button
                    className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center"
                    aria-label={`Message ${friend.name}`}
                  >
                    <MessageCircle size={12} className="text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={signOut}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-secondary py-3 text-sm font-semibold text-foreground"
          >
            <LogOut size={15} className="text-muted-foreground" />
            Sign out
          </button>
        </div>
      </div>

      {friendInviteFriend ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/70 px-5 backdrop-blur-sm">
          <div className="w-full max-w-[320px] rounded-3xl border border-border bg-card p-5 text-center shadow-2xl shadow-black/25">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15">
              <CheckCircle2 size={26} className="text-accent" />
            </div>
            <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-accent bg-secondary">
              <img
                src={friendInviteFriend.avatar}
                alt={friendInviteFriend.name}
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="mt-3 text-lg font-bold text-foreground">
              Friend added successfully
            </h2>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {friendInviteFriend.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {friendInviteFriend.handle}
            </p>
            <button
              type="button"
              onClick={clearFriendInviteResult}
              className="mt-5 h-11 w-full rounded-2xl bg-accent text-sm font-bold text-accent-foreground"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
