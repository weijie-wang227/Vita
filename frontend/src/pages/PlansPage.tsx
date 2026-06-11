import { useAppState } from "../state";
import { Badge, Button, Card, PageHeading } from "../components/ui";
import { fetchPlans } from "../api/plans";
import { useEffect, useState } from "react";

export function PlansPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const { currentUser, subscribePlan } = useAppState();

  useEffect(() => {
    async function loadPlans() {
      const { plans } = await fetchPlans();
      setPlans(plans);
    }
    loadPlans();
  }, []);

  return (
    <div className="container mx-auto px-6 py-10 lg:px-10">
      <PageHeading
        title="Membership plans"
        subtitle="Choose the right monthly credit plan for your schedule."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan._id}
            className={`space-y-5 ${
              currentUser?.currentPlan?._id === plan._id
                ? "border-indigo-500/30 border-2"
                : ""
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {plan.name}
                  </h2>
                  <p className="text-sm text-slate-500">{plan.description}</p>
                </div>
                <Badge>${plan.monthlyPrice}/mo</Badge>
              </div>
              <p className="text-3xl font-semibold text-slate-900">
                {plan.creditsPerMonth} credits
              </p>
            </div>
            <Button type="button" onClick={() => subscribePlan(plan)}>
              {currentUser?.currentPlan?._id === plan._id
                ? "Current plan"
                : "Select plan"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
import type { MembershipPlan } from "../lib/types";
