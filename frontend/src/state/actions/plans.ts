import type { MembershipPlan } from "../../lib/types";
import type { StateSetters, StateValues } from "../types";
import { subscribe } from '../../api/plans'

export function createPlanActions(state: StateValues, setters: StateSetters) {
  const { currentUser } = state;
  const { setCurrentUser} = setters;

  const subscribePlan = async (newPlan: MembershipPlan) => {
    if (!currentUser) return;

    const result = await subscribe(newPlan._id)
    if(!result) {
      return
    }
    const updatedUser = {
      ...currentUser,
      currentPlan: newPlan,
      creditsRemaining: newPlan.creditsPerMonth,
    };

    setCurrentUser(updatedUser);
    localStorage.setItem("vita-current-user", JSON.stringify(updatedUser));
  };

  return { subscribePlan };
}
