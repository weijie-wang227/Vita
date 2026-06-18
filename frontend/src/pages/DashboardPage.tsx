import { useAppState } from "../state";
import { Badge, Button, Card, PageHeading } from "../components/ui";
import { formatClassDate } from "./helpers";
import { useState, useEffect } from "react";
import type { ClassInfo, User } from "../lib/types";
import { fetchClasses } from "../api/classes";
import { fetchFriends } from "../api/friends";

export function DashboardPage() {
  const { currentUser } = useAppState();
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [trending, setTrending] = useState<ClassInfo>();
  const [friends, setFriends] = useState<User[]>([]);
  const [bookings, setBookings] = useState<ClassInfo[]>([]);

  useEffect(() => {
    async function loadClasses() {
      if (currentUser?.id) {
        const classesData = await fetchClasses();
        const friendsData = await fetchFriends();
        setFriends(friendsData);
        setClasses(classesData.filter((classData) => !classData.bookedByMe));
        setBookings(classesData.filter((classData) => classData.bookedByMe));
        setTrending(
          classesData.reduce((best, item) =>
            best.friendsGoing
              ? best.friendsGoing.length > item.friendsGoing.length
                ? best
                : item
              : best,
          ),
        );
      }
    }

    loadClasses();
  }, [currentUser?.id]);

  return (
    <div className="container mx-auto px-6 py-10 lg:px-10">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <PageHeading
          title="Your wellness dashboard"
          subtitle="Track membership credits, bookings, and the classes your friends are loving."
        />
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" as="a" href="/classes">
            Discover classes
          </Button>
          <Button variant="secondary" as="a" href="/feed">
            Social feed
          </Button>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <div className="space-y-6">
          <Card className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Current plan</p>
              <p className="text-xl font-semibold text-slate-900">
                {currentUser?.currentPlan?.name ?? "No plan selected"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Monthly allowance</p>
              <p className="text-xl font-semibold text-slate-900">
                {currentUser?.currentPlan?.creditsPerMonth ?? 0} credits
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Remaining credits</p>
              <p className="text-xl font-semibold text-slate-900">
                {currentUser?.creditsRemaining ?? 0}
              </p>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">
                  Upcoming classes
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                  Ready to book your next session?
                </h2>
              </div>
              <Badge>{classes.length} classes available</Badge>
            </div>
            <div className="mt-6 grid gap-4">
              {classes.slice(0, 3).map((item) => (
                <div
                  key={item._id}
                  className="rounded-3xl border border-slate-200/80 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-sm text-slate-600">
                        {formatClassDate(item.date, item.time)} ·{" "}
                        {item.location}
                      </p>
                    </div>
                    <Badge>{item.price} credits</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          {trending ? (
            <Card className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">
                    Friends going
                  </p>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {trending.friendsGoing?.length ?? 0} friend
                    {trending.friendsGoing?.length === 1 ? "" : "s"} are going
                  </h2>
                </div>
                <Badge>Discover</Badge>
              </div>
              <p className="text-sm leading-6 text-slate-600">
                {trending.title} is trending with your circle. Tap through the
                class page to join them.
              </p>
              <Button
                variant="secondary"
                as="a"
                href={`/classes/${trending._id}`}
              >
                View class
              </Button>
            </Card>
          ) : null}
        </div>
        <div className="space-y-6">
          <Card>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">
              Booking history
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              Your recent activity
            </h2>
            <div className="mt-6 space-y-3">
              {bookings.slice(-3).map((booking) => {
                return (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between rounded-3xl bg-slate-50 p-4"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {booking?.title}
                      </p>
                      <p className="text-sm text-slate-600">
                        {booking
                          ? formatClassDate(booking.date, booking.time)
                          : "Pending"}
                      </p>
                    </div>
                    <span className="text-sm text-slate-500">Booked</span>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">
                  Community
                </p>
                <h2 className="text-xl font-semibold text-slate-900">
                  Keep your wellness circle close.
                </h2>
              </div>
              <Button variant="secondary" as="a" href="/friends">
                Friends
              </Button>
            </div>
            <div className="grid gap-3">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm"
                >
                  <img
                    src={friend.avatarUrl}
                    alt={friend.name}
                    className="h-12 w-12 rounded-2xl object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">
                      {friend.name}
                    </p>
                    <p className="text-sm text-slate-600">
                      Friend ID: {friend.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
