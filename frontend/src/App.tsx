import { Routes, Route, Navigate, Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  LayoutGrid,
  Sparkles,
  ShieldCheck,
  Users,
  HeartHandshake,
  Menu,
  X,
} from "lucide-react";
import { AppStateProvider } from "./state/provider";
import { useAppState } from "./state/context";
import {
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
  { label: "Home", to: "/dashboard", icon: Home, needlogin: true },
  { label: "Classes", to: "/classes", icon: LayoutGrid, needlogin: false },
  { label: "Plan", to: "/plans", icon: Sparkles, needlogin: true },
  { label: "Feed", to: "/feed", icon: HeartHandshake, needlogin: true },
  { label: "Friends", to: "/friends", icon: Users, needlogin: true },
  { label: "Profile", to: "/profile", icon: ShieldCheck, needlogin: true },
];

function AppRoutes() {
  const { currentUser, logout } = useAppState();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visibleNavItems = navItems.filter(
    (item) => currentUser || !item.needlogin
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex items-center justify-between gap-4 px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="grid h-12 w-12 place-items-center rounded-3xl bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 transition"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
                Vita
              </p>
              <p className="text-sm text-slate-200">Wellness club</p>
            </div>
          </div>
          <div>
            {currentUser ? (
              <Button variant="secondary" onClick={logout}>
                Sign out
              </Button>
            ) : (
              <Button variant="secondary" as="a" href="/auth">
                Sign in
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside
          className={`fixed left-0 top-0 z-40 h-full w-48 bg-slate-950 border-r border-slate-800/80 transform transition-transform duration-300 ease-in-out pt-24 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="space-y-2 px-4">
            {visibleNavItems.map((item) => (
              <RouterLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-900 hover:text-white transition"
              >
                <item.icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </RouterLink>
            ))}
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ClassesPage />} />
            <Route path="/auth" element={<AuthPage />} />

            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/classes/:id" element={<ClassDetailPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/plans" element={<PlansPage />} />
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
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <div className="bg-slate-950 text-slate-900">
        <AppRoutes />
      </div>
    </AppStateProvider>
  );
}
