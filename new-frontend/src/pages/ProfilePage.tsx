import {
  ChevronLeft,
  Edit3,
  LogOut,
  MessageCircle,
  QrCode,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import { useAppState } from "../state";

const qrModules = [
  [9, 0],
  [11, 0],
  [13, 0],
  [15, 0],
  [17, 0],
  [19, 0],
  [8, 1],
  [10, 1],
  [14, 1],
  [16, 1],
  [20, 1],
  [9, 2],
  [12, 2],
  [15, 2],
  [18, 2],
  [20, 2],
  [8, 3],
  [10, 3],
  [13, 3],
  [17, 3],
  [19, 3],
  [9, 4],
  [11, 4],
  [14, 4],
  [16, 4],
  [20, 4],
  [8, 5],
  [12, 5],
  [15, 5],
  [18, 5],
  [20, 5],
  [9, 6],
  [11, 6],
  [13, 6],
  [17, 6],
  [19, 6],
  [0, 8],
  [2, 8],
  [4, 8],
  [6, 8],
  [8, 8],
  [11, 8],
  [14, 8],
  [17, 8],
  [20, 8],
  [22, 8],
  [24, 8],
  [26, 8],
  [28, 8],
  [1, 9],
  [3, 9],
  [5, 9],
  [9, 9],
  [12, 9],
  [15, 9],
  [18, 9],
  [21, 9],
  [23, 9],
  [25, 9],
  [27, 9],
  [0, 10],
  [4, 10],
  [7, 10],
  [10, 10],
  [13, 10],
  [16, 10],
  [20, 10],
  [22, 10],
  [25, 10],
  [28, 10],
  [2, 11],
  [5, 11],
  [8, 11],
  [11, 11],
  [14, 11],
  [17, 11],
  [21, 11],
  [23, 11],
  [26, 11],
  [0, 12],
  [3, 12],
  [6, 12],
  [9, 12],
  [12, 12],
  [15, 12],
  [19, 12],
  [22, 12],
  [24, 12],
  [27, 12],
  [1, 13],
  [4, 13],
  [7, 13],
  [10, 13],
  [13, 13],
  [16, 13],
  [20, 13],
  [23, 13],
  [25, 13],
  [28, 13],
  [0, 14],
  [2, 14],
  [5, 14],
  [8, 14],
  [11, 14],
  [15, 14],
  [18, 14],
  [21, 14],
  [24, 14],
  [26, 14],
  [3, 15],
  [6, 15],
  [9, 15],
  [12, 15],
  [16, 15],
  [19, 15],
  [22, 15],
  [25, 15],
  [27, 15],
  [0, 16],
  [4, 16],
  [7, 16],
  [10, 16],
  [13, 16],
  [17, 16],
  [20, 16],
  [23, 16],
  [26, 16],
  [28, 16],
  [1, 17],
  [5, 17],
  [8, 17],
  [11, 17],
  [14, 17],
  [18, 17],
  [21, 17],
  [24, 17],
  [27, 17],
  [0, 18],
  [3, 18],
  [6, 18],
  [9, 18],
  [12, 18],
  [15, 18],
  [19, 18],
  [22, 18],
  [25, 18],
  [28, 18],
  [0, 20],
  [2, 20],
  [5, 20],
  [8, 20],
  [11, 20],
  [14, 20],
  [17, 20],
  [21, 20],
  [1, 21],
  [3, 21],
  [6, 21],
  [9, 21],
  [12, 21],
  [15, 21],
  [18, 21],
  [22, 21],
  [24, 21],
  [26, 21],
  [28, 21],
  [8, 22],
  [10, 22],
  [13, 22],
  [16, 22],
  [19, 22],
  [23, 22],
  [25, 22],
  [27, 22],
  [9, 23],
  [11, 23],
  [14, 23],
  [17, 23],
  [20, 23],
  [22, 23],
  [24, 23],
  [26, 23],
  [28, 23],
  [8, 24],
  [12, 24],
  [15, 24],
  [18, 24],
  [21, 24],
  [23, 24],
  [25, 24],
  [27, 24],
  [9, 25],
  [11, 25],
  [13, 25],
  [16, 25],
  [19, 25],
  [22, 25],
  [24, 25],
  [26, 25],
  [28, 25],
  [8, 26],
  [10, 26],
  [14, 26],
  [17, 26],
  [20, 26],
  [23, 26],
  [25, 26],
  [27, 26],
  [9, 27],
  [12, 27],
  [15, 27],
  [18, 27],
  [21, 27],
  [22, 27],
  [24, 27],
  [26, 27],
  [28, 27],
  [8, 28],
  [11, 28],
  [13, 28],
  [16, 28],
  [19, 28],
  [23, 28],
  [25, 28],
  [27, 28],
];

export function ProfilePage() {
  const {
    closeProfile,
    friends,
    profile,
    signOut,
    showProfileFriends,
    setShowProfileFriends,
  } = useAppState();

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <button
          onClick={closeProfile}
          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
          aria-label="Back"
        >
          <ChevronLeft size={17} className="text-foreground" />
        </button>
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
              <Edit3 size={10} color="#0e0e0f" />
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
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
                <Search size={13} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Search friends
                </span>
              </div>
              {friends.map((friend, index) => (
                <div
                  key={friend.id}
                  className={`flex items-center gap-3 px-3 py-2.5 ${
                    index < friends.length - 1 ? "border-b border-border" : ""
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
