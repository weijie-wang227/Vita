import { useState } from "react";
import {
  Edit3,
  LogOut,
  MessageCircle,
  QrCode,
  UserPlus,
  Users,
} from "lucide-react";
import { BaseSearchBar } from "../components/BaseSearchBar";
import { useAppState } from "../state";
import { qrModules } from "./profileQrModules";

export function ProfilePage() {
  const {
    friends,
    profile,
    signOut,
    showProfileFriends,
    setShowProfileFriends,
  } = useAppState();
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [debouncedFriendSearchQuery, setDebouncedFriendSearchQuery] =
    useState("");
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

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <h2 className="text-base font-semibold text-foreground flex-1">
          My Profile
        </h2>
        <button
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
                Scan to add Linda as a friend
              </p>
              <div className="w-40 h-40 bg-white rounded-xl p-2.5 mb-4">
                <svg
                  viewBox="0 0 29 29"
                  className="w-full h-full"
                  style={{ imageRendering: "pixelated" }}
                >
                  <rect x="0" y="0" width="7" height="7" fill="#000" />
                  <rect x="1" y="1" width="5" height="5" fill="#fff" />
                  <rect x="2" y="2" width="3" height="3" fill="#000" />
                  <rect x="22" y="0" width="7" height="7" fill="#000" />
                  <rect x="23" y="1" width="5" height="5" fill="#fff" />
                  <rect x="24" y="2" width="3" height="3" fill="#000" />
                  <rect x="0" y="22" width="7" height="7" fill="#000" />
                  <rect x="1" y="23" width="5" height="5" fill="#fff" />
                  <rect x="2" y="24" width="3" height="3" fill="#000" />
                  {qrModules.map(([x, y], index) => (
                    <rect
                      key={index}
                      x={x}
                      y={y}
                      width="1"
                      height="1"
                      fill="#000"
                    />
                  ))}
                </svg>
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
              <button className="mt-3 flex items-center gap-1.5 text-xs text-accent font-medium">
                <UserPlus size={12} />
                Share my profile link
              </button>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
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
                      {friend.mutual} mutual / {friend.joined[0]}
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
    </div>
  );
}
