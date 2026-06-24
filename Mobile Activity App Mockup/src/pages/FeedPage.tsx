import {
  Bell,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { feedPosts } from "../data/mockData";
import { useAppState } from "../state";

export function FeedPage() {
  const { likedPostIds, togglePostLike } = useAppState();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <h1 className="text-xl font-bold text-foreground">Feed</h1>
        <button
          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center relative"
          aria-label="Notifications"
        >
          <Bell size={15} className="text-muted-foreground" />
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-minimal">
        {feedPosts.map((post) => {
          const liked = Boolean(likedPostIds[post.id]);

          return (
            <div key={post.id} className="mb-1">
              <div className="flex items-center gap-2.5 px-4 py-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                  <img
                    src={post.avatar}
                    alt={post.user}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-foreground">
                    {post.user}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">
                      {post.time}
                    </span>
                    <span className="text-muted-foreground opacity-40">/</span>
                    <span className="text-[10px] text-accent truncate">
                      {post.activity}
                    </span>
                  </div>
                </div>
                <button className="text-muted-foreground" aria-label="Post menu">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="aspect-[4/3] bg-secondary overflow-hidden">
                <img src={post.image} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="px-4 pt-2.5 pb-1">
                <div className="flex items-center gap-4 mb-2">
                  <button
                    onClick={() => togglePostLike(post.id)}
                    className="flex items-center gap-1.5"
                    aria-label={liked ? "Unlike post" : "Like post"}
                  >
                    <Heart
                      size={19}
                      fill={liked ? "#f87171" : "none"}
                      stroke={liked ? "#f87171" : "#8a8880"}
                      strokeWidth={1.5}
                    />
                    <span className="text-xs text-muted-foreground">
                      {post.likes + (liked ? 1 : 0)}
                    </span>
                  </button>
                  <button className="flex items-center gap-1.5">
                    <MessageCircle size={19} stroke="#8a8880" strokeWidth={1.5} />
                    <span className="text-xs text-muted-foreground">
                      {post.comments}
                    </span>
                  </button>
                  <button className="ml-auto" aria-label="Share post">
                    <Share2 size={17} stroke="#8a8880" strokeWidth={1.5} />
                  </button>
                </div>
                <p className="text-[12px] text-foreground leading-snug">
                  <span className="font-semibold">{post.user} </span>
                  {post.caption}
                </p>
              </div>
              <div className="h-px bg-border mx-4 mt-3" />
            </div>
          );
        })}
        <div className="h-6" />
      </div>
    </div>
  );
}
