import type { Friend } from "../lib/types";

type FriendAvatarsProps = {
  friends: Friend[];
  max?: number;
};

export function FriendAvatars({ friends, max = 3 }: FriendAvatarsProps) {
  const shown = friends.slice(0, max);
  const extra = friends.length - max;

  return (
    <div className="flex items-center gap-1 mt-2">
      <div className="flex -space-x-1.5">
        {shown.map((friend) => (
          <img
            key={friend.id}
            src={friend.avatar}
            alt={friend.name}
            className="w-5 h-5 rounded-full border border-card object-cover"
          />
        ))}
        {extra > 0 && (
          <div className="w-5 h-5 rounded-full border border-card bg-secondary flex items-center justify-center">
            <span className="text-[8px] text-muted-foreground font-semibold">
              +{extra}
            </span>
          </div>
        )}
      </div>
      <span className="text-[10px] text-muted-foreground">
        {shown[0]?.name.split(" ")[0]}
        {shown.length > 1
          ? ` & ${friends.length - 1} friend${
              friends.length - 1 > 1 ? "s" : ""
            } joining`
          : " is joining"}
      </span>
    </div>
  );
}
