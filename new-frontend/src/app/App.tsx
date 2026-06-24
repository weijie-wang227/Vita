import { useState, type FormEvent } from "react";
import {
  AtSign,
  Camera,
  Loader2,
  Lock,
  LogIn,
  MessageCircle,
  Mountain,
  UserRound,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import {
  ActivitiesPage,
  ActivityDetailPage,
  ChatPage,
  FeedPage,
  GroupDetailPage,
  ProfilePage,
} from "../pages";
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
  const { activeTab, selectedActivityId, selectedGroupId, showProfile } =
    useAppState();

  if (showProfile) {
    return <ProfilePage />;
  }

  if (selectedActivityId !== null) {
    return <ActivityDetailPage />;
  }

  if (selectedGroupId !== null) {
    return <GroupDetailPage />;
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
  const {
    activeTab,
    selectTab,
    groupChats,
    selectedActivityId,
    selectedGroupId,
    showProfile,
  } = useAppState();
  const totalUnread = groupChats.reduce((sum, chat) => sum + chat.unread, 0);

  if (showProfile || selectedActivityId !== null || selectedGroupId !== null) {
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

function AuthLoadingScreen() {
  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 size={16} className="animate-spin text-accent" />
        Opening Vita
      </div>
    </div>
  );
}

function AuthScreen() {
  const { signIn, signUp } = useAppState();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignup = mode === "signup";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);

    try {
      if (isSignup) {
        await signUp({
          name,
          handle: handle || undefined,
          email,
          password,
        });
      } else {
        await signIn({ email, password });
      }
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-background"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden bg-background px-5 py-6">
        <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_50%_0%,rgba(201,153,58,0.22),transparent_68%)]" />
        <div className="relative flex min-h-[calc(100vh-3rem)] flex-col justify-center">
          <div className="mb-7">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-black/20">
              <Mountain size={22} strokeWidth={2.5} />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
              Vita
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-foreground">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-2 max-w-[310px] text-sm leading-relaxed text-muted-foreground">
              {isSignup
                ? "Join activities, groups, and friends around Singapore."
                : "Sign in to continue planning your next activity."}
            </p>
          </div>

          <div className="mb-4 grid grid-cols-2 rounded-2xl bg-secondary p-1">
            {[
              { id: "signin", label: "Sign in", Icon: LogIn },
              { id: "signup", label: "Sign up", Icon: UserPlus },
            ].map(({ id, label, Icon }) => {
              const active = mode === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setMode(id as "signin" | "signup");
                    setLocalError(null);
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignup && (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                    Name
                  </span>
                  <div className="flex items-center gap-2 rounded-2xl border border-border bg-input-background px-3">
                    <UserRound size={16} className="text-muted-foreground" />
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                      placeholder="Linda Tan"
                      autoComplete="name"
                      required
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                    Handle
                  </span>
                  <div className="flex items-center gap-2 rounded-2xl border border-border bg-input-background px-3">
                    <AtSign size={16} className="text-muted-foreground" />
                    <input
                      value={handle}
                      onChange={(event) => setHandle(event.target.value)}
                      className="h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                      placeholder="lindatan"
                      autoComplete="username"
                    />
                  </div>
                </label>
              </>
            )}

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Email
              </span>
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-input-background px-3">
                <AtSign size={16} className="text-muted-foreground" />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Password
              </span>
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-input-background px-3">
                <Lock size={16} className="text-muted-foreground" />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="At least 8 characters"
                  type="password"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  minLength={8}
                  required
                />
              </div>
            </label>

            {localError && (
              <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
                {localError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-accent px-4 text-sm font-bold text-accent-foreground transition-transform active:scale-[0.98] disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isSignup ? (
                <UserPlus size={16} />
              ) : (
                <LogIn size={16} />
              )}
              {isSignup ? "Create account" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function AppShell() {
  const { selectedActivityId, selectedGroupId, showProfile } = useAppState();
  const hasFullScreenView =
    showProfile || selectedActivityId !== null || selectedGroupId !== null;

  return (
    <div
      className="min-h-screen bg-background"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden bg-background">
        <div
          className={`absolute inset-0 overflow-hidden ${
            hasFullScreenView ? "bottom-0" : "bottom-20"
          }`}
        >
          <CurrentPage />
        </div>

        <BottomNavigation />
      </div>
    </div>
  );
}

function AuthGate() {
  const { isAuthReady, isAuthenticated } = useAppState();

  if (!isAuthReady) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <AppShell />;
}

export default function App() {
  return (
    <AppStateProvider>
      <AuthGate />
    </AppStateProvider>
  );
}
