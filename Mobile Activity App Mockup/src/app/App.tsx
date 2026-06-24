import {
  Camera,
  MessageCircle,
  Mountain,
  type LucideIcon,
} from "lucide-react";
import { groupChats } from "../data/mockData";
import { ActivitiesPage, ChatPage, FeedPage, ProfilePage } from "../pages";
import { AppStateProvider, useAppState, type AppTab } from "../state";

type NavItem = {
  id: AppTab;
  label: string;
  Icon: LucideIcon;
};

const navItems: NavItem[] = [
  { id: "activities", label: "Activities", Icon: Mountain },
  { id: "feed", label: "Feed", Icon: Camera },
  { id: "chat", label: "Groups", Icon: MessageCircle },
];

function CurrentPage() {
  const { activeTab, showProfile } = useAppState();

  if (showProfile) {
    return <ProfilePage />;
  }

  switch (activeTab) {
    case "feed":
      return <FeedPage />;
    case "chat":
      return <ChatPage />;
    case "activities":
    default:
      return <ActivitiesPage />;
  }
}

function BottomNavigation() {
  const { activeTab, selectTab, showProfile } = useAppState();
  const totalUnread = groupChats.reduce((sum, chat) => sum + chat.unread, 0);

  if (showProfile) {
    return null;
  }

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-20 flex items-start pt-2 px-2"
      style={{
        background: "linear-gradient(to top, #0e0e0f 60%, transparent)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {navItems.map(({ id, label, Icon }) => {
        const active = activeTab === id;
        const badge = id === "chat" ? totalUnread : 0;

        return (
          <button
            key={id}
            onClick={() => selectTab(id)}
            className="flex-1 flex flex-col items-center gap-1 pt-1 active:scale-90 transition-transform"
          >
            <div className="relative">
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.5}
                style={{ color: active ? "#c9993a" : "#8a8880" }}
              />
              {badge > 0 && (
                <div className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-[8px] font-bold text-black">
                    {badge}
                  </span>
                </div>
              )}
            </div>
            <span
              className="text-[10px] font-semibold"
              style={{ color: active ? "#c9993a" : "#8a8880" }}
            >
              {label}
            </span>
            {active && <div className="w-1 h-1 rounded-full bg-accent" />}
          </button>
        );
      })}
    </div>
  );
}

function AppShell() {
  return (
    <div
      className="min-h-screen bg-background"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden bg-background">
        <div className="absolute inset-0 bottom-20 overflow-hidden">
          <CurrentPage />
        </div>

        <BottomNavigation />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <AppShell />
    </AppStateProvider>
  );
}
