import { useEffect, useMemo, useState } from "react";
import { AppStateContext } from "./context";
import type { AppState, StateValues } from "./types";
import { createAuthActions } from "./actions/auth";
import { createPlanActions } from "./actions/plans";
import type { MembershipPlan, User } from "../lib/types";

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPlan, setCurrentPlan] = useState<MembershipPlan | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Check for existing auth token on mount
  useEffect(() => {
    const token = localStorage.getItem("vita-auth-token");
    if (token) {
      const userStr = localStorage.getItem("vita-current-user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
          setCurrentUserId(user.id);
        } catch {
          localStorage.removeItem("vita-current-user");
          localStorage.removeItem("vita-auth-token");
        }
      }
    }
    setIsAuthLoading(false);
  }, []);

  const state: StateValues = {
    currentUser,
    currentUserId,
    currentPlan,
    isAuthLoading,
  };

  const setters = {
    setCurrentUser,
    setCurrentUserId,
    setCurrentPlan,
    setIsAuthLoading,
  };

  // Create all action handlers
  const authActions = createAuthActions(state, setters);
  const planActions = createPlanActions(state, setters);

  // Combine all state and actions
  const appState = useMemo<AppState>(
    () => ({
      currentUser,
      currentPlan,
      isAuthLoading,
      ...authActions,
      ...planActions,
    }),
    [currentUser, currentPlan, authActions, planActions],
  );

  return (
    <AppStateContext.Provider value={appState}>
      {children}
    </AppStateContext.Provider>
  );
}
