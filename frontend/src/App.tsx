import { Routes, Route, Navigate } from "react-router-dom";
import {
  Home,
  LayoutGrid,
  Sparkles,
  ShieldCheck,
  Users,
  HeartHandshake,
} from "lucide-react";
import { AppStateProvider } from "./state/provider";
import { useAppState } from "./state/context";
import {
  LandingPage,
  AuthPage,
  DashboardPage,
  PlansPage,
  ClassesPage,
  ClassDetailPage,
  BookingConfirmationPage,
  FriendsPage,
  FeedPage,
  ProfilePage,
} from "./pages";
import { Button, NavLink } from "./components/ui";
import { ProtectedRoute } from "./pages/ProtectedRoutes";

const navItems = [
  { label: "Home", to: "/dashboard", icon: Home },
  { label: "Classes", to: "/classes", icon: LayoutGrid },
  { label: "Plan", to: "/plans", icon: Sparkles },
  { label: "Feed", to: "/feed", icon: HeartHandshake },
  { label: "Friends", to: "/friends", icon: Users },
  { label: "Profile", to: "/profile", icon: ShieldCheck },
];

function AppRoutes() {
  const { currentUser, logout } = useAppState();

  return (
    <>
      <header className="border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-3xl bg-indigo-500/15 text-indigo-300">
              V
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
                Vita
              </p>
              <p className="text-sm text-slate-200">Wellness club</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-4">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="hover:text-white">
                <item.icon size={18} className="inline-block mr-2" />
                {item.label}
              </NavLink>
            ))}
            {currentUser ? (
              <Button variant="secondary" onClick={logout}>
                Sign out
              </Button>
            ) : (
              <Button variant="secondary" as="a" href="/auth">
                Sign in
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/classes/:id" element={<ClassDetailPage />} />
            <Route
              path="/booking-confirmation"
              element={<BookingConfirmationPage />}
            />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <div className="min-h-screen bg-slate-950 text-slate-900">
        <AppRoutes />
      </div>
    </AppStateProvider>
  );
}
