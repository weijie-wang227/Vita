import { Button } from "../components/ui";
import { Sparkles } from "lucide-react";

export function BookingConfirmationPage() {
  return (
    <div className="container mx-auto px-6 py-10 lg:px-10">
      <div className="max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl">
        <div className="mb-6 flex items-center gap-3 text-indigo-600">
          <Sparkles size={24} />
          <p className="text-sm uppercase tracking-[0.3em]">
            Booking confirmed
          </p>
        </div>
        <h1 className="text-4xl font-semibold text-slate-900">
          You’re on the list.
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Your class booking is confirmed and your credits have been updated.
          Head to your dashboard to see your schedule and keep discovering new
          experiences.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button as="a" href="/dashboard">
            Go to dashboard
          </Button>
          <Button variant="secondary" as="a" href="/classes">
            Browse more classes
          </Button>
        </div>
      </div>
    </div>
  );
}
