import type {
  MembershipPlan,
  User,
} from "../lib/types";

export type AppState = {
  currentUser: User | null;
  currentPlan: MembershipPlan | null;
  isAuthLoading: boolean
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  subscribePlan:(newPlan: MembershipPlan) => void;
  updateUser: (user: User) => void;
};

export type StateSetters = {
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  setCurrentUserId: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentPlan: React.Dispatch<React.SetStateAction<MembershipPlan | null>>;
  setIsAuthLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export type StateValues = {
  currentUser: User | null;
  currentUserId: string | null;
  currentPlan: MembershipPlan | null;
  isAuthLoading: boolean
};
