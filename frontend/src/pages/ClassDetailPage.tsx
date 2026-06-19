import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAppState } from "../state";
import { Badge, Button, Card } from "../components/ui";
import { CalendarDays } from "lucide-react";
import { formatClassDate } from "./helpers";
import type { ClassInfo } from "../lib/types";
import { useEffect, useState } from "react";
import { fetchClassById } from "../api/classes";
import { bookClass } from "../api/classes";
import { ClassChat } from "../components/ClassChat";

export function ClassDetailPage() {
  const { id } = useParams();
  const { currentUser } = useAppState();
  const navigate = useNavigate();
  const [classInfo, setClass] = useState<ClassInfo | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"details" | "chat">("details");

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

    if (classInfo && currentUser.creditsRemaining >= classInfo.price) {
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
    <div className="flex flex-col">
      {/* Full-width hero image with overlay */}
      <div className="relative h-80 w-full overflow-hidden sm:h-96">
        <img
          src={classInfo?.imageUrl}
          alt={classInfo?.title}
          className="h-full w-full object-cover"
        />
        {/* Gradient fade overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Overlay content - just quick details */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-8 sm:px-10">
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Instructor
              </p>
              <p className="mt-1 font-semibold text-white">
                {classInfo?.instructor}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Location
              </p>
              <p className="mt-1 font-semibold text-white">
                {classInfo?.location}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Credits
              </p>
              <p className="mt-1 font-semibold text-white">
                {classInfo?.price}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Below image content */}
      <div className="container mx-auto px-6 py-0 lg:px-10">
        {/* Title section */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
            Vita wellness
          </p>
          <h1 className="-ml-px mt-2 text-3xl font-bold tracking-tight text-slate-400 sm:text-4xl">
            {classInfo?.title ?? ""}
          </h1>
        </div>
        <div className="flex w-fit rounded-full bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeTab === "details"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Class details
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeTab === "chat"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Member chat
          </button>
        </div>

        {activeTab === "details" ? (
          <>
            <div className="mb-6">
              {classInfo?.description ? (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                  {classInfo.description}
                </p>
              ) : null}
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="space-y-4">
                <Card className="grid gap-4">
                  <div className="grid gap-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Date & time
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {classInfo
                        ? formatClassDate(classInfo?.date, classInfo?.time)
                        : null}
                    </p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Capacity
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {classInfo
                          ? Math.max(
                              classInfo.capacity - classInfo.registered,
                              0,
                            )
                          : null}{" "}
                        spots left
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-indigo-500">
                        Friends going
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {classInfo?.friendsGoing?.length
                          ? classInfo.friendsGoing
                              .map((item) => item.name)
                              .join(", ")
                          : "None yet"}
                      </p>
                    </div>
                    <Badge>{classInfo?.friendsGoing?.length || 0}</Badge>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
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
                      Back
                    </Button>
                  </div>
                  <p className="text-xs leading-5 text-slate-600">
                    {classInfo?.bookedByMe
                      ? "You are signed up for this class."
                      : "Book now if you have enough credits."}
                  </p>
                </Card>
              </div>
              <aside className="space-y-4">
                <Card className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-900">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-600">
                      <CalendarDays size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-indigo-500">
                        Balance
                      </p>
                      <p className="mt-0.5 text-lg font-semibold">
                        {currentUser?.creditsRemaining ?? 0}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-2 rounded-2xl bg-slate-50 p-3">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Required</span>
                      <span>{classInfo?.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Available</span>
                      <span>
                        {classInfo
                          ? Math.max(
                              classInfo.capacity - classInfo.registered,
                              0,
                            )
                          : null}
                      </span>
                    </div>
                  </div>
                </Card>
              </aside>
            </div>
          </>
        ) : (
          <ClassChat currentUser={currentUser} classInfo={classInfo} />
        )}

        {showLoginPrompt && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 px-6">
            <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-slate-900">
                Sign in to book this class
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                You need to sign in before booking. After signing in, you will
                be brought back to this class page.
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
    </div>
  );
}
