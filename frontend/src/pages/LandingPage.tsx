import { Badge, Button, Card, SectionCard } from "../components/ui";
import { HeartHandshake, CircleDollarSign, LineChart } from "lucide-react";

export function LandingPage() {
  return (
    <div className="container mx-auto px-6 py-12 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
        <div className="space-y-8">
          <Badge>Discover wellness</Badge>
          <div className="space-y-5">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Book fitness classes, grow your wellness circle, and make every
              month count.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              A polished experience for members. Discover classes, manage
              memberships, and share what you love with friends.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button as="a" href="/auth" className="rounded-full">
              Get started
            </Button>
            <Button variant="secondary" as="a" href="/classes">
              Browse classes
            </Button>
          </div>
        </div>
        <Card className="border-slate-200/80 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-2xl shadow-indigo-500/20">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">
                  Monthly credits
                </p>
                <p className="mt-2 text-6xl font-semibold">24</p>
              </div>
              <div className="rounded-3xl bg-white/10 px-4 py-2 text-sm text-slate-200">
                Fitness Flow
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-sm text-slate-300">Next booked class</p>
                <p className="mt-2 text-base font-semibold">
                  Sunrise Flow Yoga, June 10
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-sm text-slate-300">Friends booked</p>
                  <p className="mt-2 text-base font-semibold">
                    Alex &amp; 3 others
                  </p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-sm text-slate-300">Most popular class</p>
                  <p className="mt-2 text-base font-semibold">
                    Hot Power Pilates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Social discovery"
          description="Share classes, see friends’ activity, and book together."
          icon={<HeartHandshake size={20} />}
        >
          <p className="text-sm leading-6 text-slate-600">
            Invite friends by ID, watch their posts, and discover classes
            through your community.
          </p>
        </SectionCard>
        <SectionCard
          title="Smart membership"
          description="Track credits, manage your plan, and maximize every month."
          icon={<CircleDollarSign size={20} />}
        >
          <p className="text-sm leading-6 text-slate-600">
            See allowance details, remaining credits, and membership benefits
            across every plan.
          </p>
        </SectionCard>
        <SectionCard
          title="Admin insights"
          description="Monitor occupancy, bookings, and plan adoption."
          icon={<LineChart size={20} />}
        >
          <p className="text-sm leading-6 text-slate-600">
            Analyze trends, highlight your most popular experiences, and keep
            classes full.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
