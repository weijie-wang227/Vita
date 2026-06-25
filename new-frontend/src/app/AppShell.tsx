import { useState } from "react";
import type { VitaLogoLevels } from "../components/VitaProgressLogo";
import { useAppState } from "../state";
import { BottomNavigation } from "./BottomNavigation";
import { CurrentPage } from "./CurrentPage";
import { emptyLogoLevels, logoPortionOrder } from "./logoState";
import { VitaLogoOverlay } from "./VitaLogoOverlay";

export function AppShell() {
  const { selectedActivityId, selectedGroupId } = useAppState();
  const [logoLevels, setLogoLevels] = useState<VitaLogoLevels>(emptyLogoLevels);
  const [isLogoExpanded, setIsLogoExpanded] = useState(false);
  const [nextPortionIndex, setNextPortionIndex] = useState(0);
  const hasFullScreenView = selectedActivityId !== null || selectedGroupId !== null;

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
          <CurrentPage />
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
