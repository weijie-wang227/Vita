import { lazy, Suspense, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import type { VitaLogoLevels } from "../components/VitaProgressLogo";
import { BottomNavigation } from "./BottomNavigation";
import { emptyLogoLevels, logoPortionOrder } from "./logoState";
import { VitaLogoOverlay } from "./VitaLogoOverlay";

const ActivitiesPage = lazy(() =>
  import("../pages/ActivitiesPage").then((module) => ({
    default: module.ActivitiesPage,
  })),
);
const ActivityDetailPage = lazy(() =>
  import("../pages/ActivityDetailPage").then((module) => ({
    default: module.ActivityDetailPage,
  })),
);
const ChatPage = lazy(() =>
  import("../pages/ChatPage").then((module) => ({
    default: module.ChatPage,
  })),
);
const FeedPage = lazy(() =>
  import("../pages/FeedPage").then((module) => ({
    default: module.FeedPage,
  })),
);
const GroupDetailPage = lazy(() =>
  import("../pages/GroupDetailPage").then((module) => ({
    default: module.GroupDetailPage,
  })),
);
const ProfilePage = lazy(() =>
  import("../pages/ProfilePage").then((module) => ({
    default: module.ProfilePage,
  })),
);
const SettingsPage = lazy(() =>
  import("../pages/SettingsPage").then((module) => ({
    default: module.SettingsPage,
  })),
);

export function AppShell() {
  const location = useLocation();
  const [logoLevels, setLogoLevels] = useState<VitaLogoLevels>(emptyLogoLevels);
  const [isLogoExpanded, setIsLogoExpanded] = useState(false);
  const [nextPortionIndex, setNextPortionIndex] = useState(0);
  const hasFullScreenView =
    /^\/activities\/[^/]+$/.test(location.pathname) ||
    /^\/groups\/[^/]+$/.test(location.pathname) ||
    location.pathname === "/settings";

  const advanceLogoFill = () => {
    const portion = logoPortionOrder[nextPortionIndex];

    setLogoLevels((currentLevels) => ({
      ...currentLevels,
      [portion]:
        currentLevels[portion] >= 100
          ? 0
          : Math.min(100, currentLevels[portion] + 10),
    }));
    setNextPortionIndex(
      (currentIndex) => (currentIndex + 1) % logoPortionOrder.length,
    );
  };

  return (
    <div
      className="min-h-screen bg-background"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="vita-phone-shell relative mx-auto min-h-screen w-full max-w-md overflow-hidden">
        <div
          className={`absolute inset-0 overflow-hidden ${
            hasFullScreenView ? "bottom-0" : "bottom-20"
          }`}
        >
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Navigate to="/activities" replace />} />
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/activities/:activityId" element={<ActivityDetailPage />} />
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/groups" element={<ChatPage />} />
              <Route path="/groups/:groupId" element={<GroupDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/activities" replace />} />
            </Routes>
          </Suspense>
        </div>

        {!hasFullScreenView && isLogoExpanded && (
          <VitaLogoOverlay
            levels={logoLevels}
            onAdvance={advanceLogoFill}
            onClose={() => setIsLogoExpanded(false)}
          />
        )}

        <BottomNavigation
          levels={logoLevels}
          onLogoClick={() => setIsLogoExpanded(true)}
        />
      </div>
    </div>
  );
}
