import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAppState } from "../state";
import { Badge, Button, Card, PageHeading } from "../components/ui";
import { CalendarDays } from "lucide-react";
import { formatClassDate } from "./helpers";
import type { ClassInfo } from "../lib/types";
import { useEffect, useState } from "react";
import { fetchClassById } from "../api/classes";
import { bookClass } from "../api/classes";

export function ClassDetailPage() {
  const { id } = useParams();
  const { currentUser } = useAppState();
  const navigate = useNavigate();
  const [classInfo, setClass] = useState<ClassInfo | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function loadClass() {
      const classData = await fetchClassById(id ?? "");
      setClass(classData);
    }

    loadClass();
  }, [currentUser?.id, id]);

  const handleBookClass = async () => {
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }

    if (classInfo?._id && currentUser.creditsRemaining >= classInfo.price) {
      const success = await bookClass(classInfo._id);

      if (success) {
        navigate("/booking-confirmation");
      }
    }
  };
  const handleGoToLogin = () => {
    navigate("/auth", {
      state: {
        from: location.pathname + location.search,
      },
    });
  };

  return (
    <div className="container mx-auto px-6 py-10 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <div className="space-y-3">
            <PageHeading
              title={classInfo?.title ?? ""}
              subtitle={classInfo?.description}
            />
          </div>
          <img
            src={classInfo?.imageUrl}
            alt={classInfo?.title}
            className="w-full rounded-[2rem] object-cover"
          />
          <Card className="grid gap-6">
            <div className="grid gap-2">
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">
                Instructor
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {classInfo?.instructor}
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  Date & time
                </p>
                <p className="mt-1 text-slate-900">
                  {classInfo
                    ? formatClassDate(classInfo?.date, classInfo?.time)
                    : null}
                </p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  Location
                </p>
                <p className="mt-1 text-slate-900">{classInfo?.location}</p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  Credits required
                </p>
                <p className="mt-1 text-slate-900">{classInfo?.price}</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  Remaining slots
                </p>
                <p className="mt-1 text-slate-900">
                  {classInfo
                    ? Math.max(classInfo.capacity - classInfo.registered, 0)
                    : null}
                </p>
              </div>
            </div>
          </Card>
          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">
                  Friends going
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {classInfo?.friendsGoing?.length
                    ? classInfo.friendsGoing.map((item) => item.name).join(", ")
                    : "None of your friends have signed up for this class yet."}
                </p>
              </div>
              <Badge>{classInfo?.friendsGoing?.length || 0} friends</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                onClick={handleBookClass}
                disabled={
                  !classInfo ||
                  classInfo.bookedByMe ||
                  (currentUser &&
                    currentUser.creditsRemaining < classInfo.price) ||
                  classInfo.capacity - classInfo.registered <= 0
                }
              >
                {classInfo
                  ? classInfo?.bookedByMe
                    ? "Already booked"
                    : currentUser &&
                        currentUser.creditsRemaining < classInfo.price
                      ? "Not enough credits"
                      : classInfo?.capacity - classInfo?.registered <= 0
                        ? "Fully booked"
                        : "Confirm booking"
                  : "Not available"}
              </Button>
              <Button variant="secondary" as="a" href="/classes">
                Back to discovery
              </Button>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              {classInfo?.bookedByMe
                ? "You are already signed up for this class."
                : "Book now if you have enough credits and spots are still available."}
            </p>
          </Card>
        </div>
        <aside className="space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="grid h-12 w-12 place-items-center rounded-3xl bg-indigo-500/10 text-indigo-600">
                <CalendarDays />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">
                  Your current balance
                </p>
                <p className="mt-1 text-2xl font-semibold">
                  {currentUser?.creditsRemaining ?? 0} credits
                </p>
              </div>
            </div>
            <div className="grid gap-3 rounded-3xl bg-slate-50 p-4">
              <div className="flex items-center justify-between text-slate-600">
                <span>Required credits</span>
                <span>{classInfo?.price}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Free capacity</span>
                <span>
                  {classInfo
                    ? Math.max(classInfo.capacity - classInfo.registered, 0)
                    : null}
                </span>
              </div>
            </div>
          </Card>
        </aside>
      </div>
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 px-6">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900">
              Sign in to book this class
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              You need to sign in before booking. After signing in, you will be
              brought back to this class page.
            </p>

            <div className="mt-6 flex gap-3">
              <Button onClick={handleGoToLogin}>Sign in</Button>

              <Button
                variant="secondary"
                onClick={() => setShowLoginPrompt(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
