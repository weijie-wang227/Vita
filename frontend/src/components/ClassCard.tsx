import { Badge, Card } from "./ui";
import { formatClassDate } from "../pages/helpers";
import type { ClassInfo } from "../lib/types";

type ClassCardProps = {
  classItem: ClassInfo;
};

export function ClassCard({ classItem }: ClassCardProps) {
  const spotsLeft = classItem.capacity - classItem.registered;
  const isFull = spotsLeft <= 0;

  return (
    <a
      href={`/classes/${classItem._id}`}
      className="group block focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-4"
    >
      <Card
        noPadding
        className="relative h-80 overflow-hidden rounded-[1.75rem] border-0 transition duration-300 group-hover:shadow-xl"
      >
        <img
          src={classItem.imageUrl}
          alt={classItem.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

        {/* Top right badge */}
        <div className="absolute right-4 top-4">
          <Badge>{classItem.requiredCredits} credits</Badge>
        </div>

        {/* Bottom left details */}
        <div className="absolute bottom-0 left-0 right-0 space-y-2 p-5 text-white">
          <div>
            <h2 className="text-xl font-semibold drop-shadow-sm">
              {classItem.title}
            </h2>

            <p className="mt-1 line-clamp-1 text-sm text-white/80">
              {classItem.instructor} · {classItem.location}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-white/80">
            <span>{formatClassDate(classItem.dateTime)}</span>
            <span>{isFull ? "Full" : `${spotsLeft} spots left`}</span>

            {classItem.friendsGoing?.length > 0 && (
              <span>{classItem.friendsGoing.length} friends going</span>
            )}
          </div>

          {classItem.bookedByMe && (
            <div className="pt-1">
              <Badge>Booked</Badge>
            </div>
          )}
        </div>
      </Card>
    </a>
  );
}
