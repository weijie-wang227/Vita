import { Badge, Card } from "./ui";
import type { GroupInfo } from "../lib/types";

type GroupCardProps = {
  groupItem: GroupInfo;
};

export function GroupCard({ groupItem }: GroupCardProps) {
  const isEmpty = groupItem.joined == 0;

  return (
    <a
      href={`/groups/${groupItem._id}`}
      className="group block focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-4"
    >
      <Card
        noPadding
        className="relative h-80 overflow-hidden rounded-[1.75rem] border-0 transition duration-300 group-hover:shadow-xl"
      >
        <img
          src={groupItem.imageUrl}
          alt={groupItem.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

        {/* Bottom left details */}
        <div className="absolute bottom-0 left-0 right-0 space-y-2 p-5 text-white">
          <div>
            <h2 className="text-xl font-semibold drop-shadow-sm">
              {groupItem.title}
            </h2>

            <p className="mt-1 line-clamp-1 text-sm text-white/80">
              {groupItem.admin?.name}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-white/80">
            <span>
              {isEmpty
                ? "No members yet"
                : `${groupItem.joined} members joined`}
            </span>

            {groupItem.friendsJoined?.length > 0 && (
              <span>{groupItem.friendsJoined.length} friends joined</span>
            )}
          </div>

          {groupItem.joinedByMe && (
            <div className="pt-1">
              <Badge>Booked</Badge>
            </div>
          )}
        </div>
      </Card>
    </a>
  );
}
