import {
  Bell,
  Heart,
  ImagePlus,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Send,
  Share2,
  Users,
  X,
} from "lucide-react";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ActivityCategoryIndicators } from "../components/ActivityCategoryIndicators";
import { FloatingActionButton } from "../components/FloatingActionButton";
import type { FeedPostGroupReference } from "../lib/types";
import { useAppState } from "../state";

const maxImageBytes = 3 * 1024 * 1024;

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read image."));
    reader.readAsDataURL(file);
  });
}

export function FeedPage() {
  const {
    createFeedPost,
    feedPosts,
    groupChats,
    joinGroup,
    likedPostIds,
    openGroup,
    profile,
    togglePostLike,
  } = useAppState();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const [composerError, setComposerError] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [joinPromptGroup, setJoinPromptGroup] =
    useState<FeedPostGroupReference | null>(null);
  const [joinPromptError, setJoinPromptError] = useState<string | null>(null);
  const [joiningGroupId, setJoiningGroupId] = useState<number | null>(null);

  const resetComposer = () => {
    setCaption("");
    setSelectedGroupId("");
    setImageDataUrl("");
    setImageName("");
    setComposerError(null);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setComposerError(null);

    if (!file.type.startsWith("image/")) {
      setComposerError("Choose a PNG, JPEG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > maxImageBytes) {
      setComposerError("Choose an image under 3 MB.");
      event.target.value = "";
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);

      setImageDataUrl(dataUrl);
      setImageName(file.name);
    } catch (error) {
      setComposerError(
        error instanceof Error ? error.message : "Unable to read image.",
      );
    }
  };

  const handleRemoveImage = () => {
    setImageDataUrl("");
    setImageName("");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleCreatePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedCaption = caption.trim();

    if (!trimmedCaption) {
      setComposerError("Write something before posting.");
      return;
    }

    setComposerError(null);
    setIsPosting(true);

    try {
      await createFeedPost({
        caption: trimmedCaption,
        image: imageDataUrl || undefined,
        groupId: selectedGroupId ? Number(selectedGroupId) : undefined,
      });
      resetComposer();
      setIsComposerOpen(false);
    } catch (error) {
      setComposerError(
        error instanceof Error ? error.message : "Unable to create post.",
      );
    } finally {
      setIsPosting(false);
    }
  };

  const handleGroupButton = (group: FeedPostGroupReference) => {
    const currentGroup = groupChats.find((item) => item.id === group.id);

    if (currentGroup) {
      openGroup(currentGroup.id);
      return;
    }

    setJoinPromptError(null);
    setJoinPromptGroup(group);
  };

  const handleJoinGroup = async () => {
    if (!joinPromptGroup) {
      return;
    }

    setJoiningGroupId(joinPromptGroup.id);
    setJoinPromptError(null);

    try {
      await joinGroup(joinPromptGroup.id);
      setJoinPromptGroup(null);
    } catch (error) {
      setJoinPromptError(
        error instanceof Error ? error.message : "Unable to join group.",
      );
    } finally {
      setJoiningGroupId(null);
    }
  };

  return (
    <div className="relative flex h-full flex-col">
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

      {isComposerOpen && (
        <div className="px-4 pb-3">
          <form
            onSubmit={handleCreatePost}
            className="rounded-2xl border border-border bg-card p-3 shadow-lg shadow-black/10"
          >
            <div className="flex gap-2.5">
              <img
                src={profile.avatar}
                alt=""
                className="h-9 w-9 rounded-full object-cover"
              />
              <textarea
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                className="min-h-[82px] min-w-0 flex-1 resize-none bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="Share something with your friends"
                maxLength={1200}
              />
            </div>

            {imageDataUrl && (
              <div className="relative mt-3 overflow-hidden rounded-xl bg-secondary">
                <img
                  src={imageDataUrl}
                  alt=""
                  className="max-h-64 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur"
                  aria-label="Remove selected image"
                >
                  <X size={15} />
                </button>
                {imageName && (
                  <p className="absolute bottom-2 left-2 max-w-[82%] truncate rounded-full bg-background/80 px-2.5 py-1 text-[10px] text-muted-foreground backdrop-blur">
                    {imageName}
                  </p>
                )}
              </div>
            )}

            <div className="mt-3 grid gap-2">
              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                  Reference group
                </span>
                <select
                  value={selectedGroupId}
                  onChange={(event) => setSelectedGroupId(event.target.value)}
                  disabled={groupChats.length === 0}
                  className="h-10 w-full rounded-xl border border-border bg-input-background px-3 text-xs text-foreground outline-none disabled:opacity-60"
                >
                  <option value="">No group</option>
                  {groupChats.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {composerError && (
              <p className="mt-3 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
                {composerError}
              </p>
            )}

            <div className="mt-3 flex items-center gap-2">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground"
                aria-label="Upload image"
              >
                <ImagePlus size={16} />
              </button>
              <span className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground">
                {selectedGroupId
                  ? groupChats.find((group) => String(group.id) === selectedGroupId)
                      ?.name
                  : "No group referenced"}
              </span>
              <button
                type="submit"
                disabled={isPosting || !caption.trim()}
                className="flex h-9 items-center gap-1.5 rounded-full bg-accent px-3 text-xs font-bold text-accent-foreground disabled:opacity-60"
              >
                {isPosting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                Post
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-minimal">
        {feedPosts.map((post) => {
          const liked = Boolean(likedPostIds[post.id]);
          const contextLabel = post.group?.name ?? post.activity;
          const hasCategorySummary =
            post.categories.length > 0 && post.durationMinutes !== undefined;
          const joinedReferencedGroup = post.group
            ? groupChats.some((group) => group.id === post.group?.id)
            : false;

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
                    {contextLabel && (
                      <>
                        <span className="text-muted-foreground opacity-40">
                          /
                        </span>
                        <span className="text-[10px] text-accent truncate">
                          {contextLabel}
                        </span>
                      </>
                    )}
                  </div>
                  {hasCategorySummary && (
                    <div className="mt-1">
                      <ActivityCategoryIndicators
                        categories={post.categories}
                        durationMinutes={post.durationMinutes ?? 0}
                        variant="pills"
                      />
                    </div>
                  )}
                </div>
                <button className="text-muted-foreground" aria-label="Post menu">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              {post.image && (
                <div className="aspect-[4/3] bg-secondary overflow-hidden">
                  <img
                    src={post.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="px-4 pt-2.5 pb-1">
                {post.group && (
                  <button
                    onClick={() => handleGroupButton(post.group)}
                    className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2.5 text-left active:bg-secondary/60"
                  >
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-secondary">
                      <img
                        src={post.group.avatar}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-foreground">
                        {post.group.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Users size={10} />
                        <span>{post.group.members} members</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-accent px-3 py-1.5 text-[11px] font-bold text-accent-foreground">
                      {joinedReferencedGroup ? "Open" : "Join"}
                    </span>
                  </button>
                )}

                <p className="text-[12px] text-foreground leading-snug">
                  <span className="font-semibold">{post.user} </span>
                  {post.caption}
                </p>

                <div className="mt-3 flex items-center gap-4">
                  <button
                    onClick={() => togglePostLike(post.id)}
                    className="flex items-center gap-1.5"
                    aria-label={liked ? "Unlike post" : "Like post"}
                  >
                    <Heart
                      size={19}
                      fill={liked ? "var(--brand-pink)" : "none"}
                      stroke={
                        liked ? "var(--brand-pink)" : "var(--muted-foreground)"
                      }
                      strokeWidth={1.5}
                    />
                    <span className="text-xs text-muted-foreground">
                      {post.likes + (liked ? 1 : 0)}
                    </span>
                  </button>
                  <button className="flex items-center gap-1.5">
                    <MessageCircle
                      size={19}
                      stroke="var(--muted-foreground)"
                      strokeWidth={1.5}
                    />
                    <span className="text-xs text-muted-foreground">
                      {post.comments}
                    </span>
                  </button>
                  <button className="ml-auto" aria-label="Share post">
                    <Share2
                      size={17}
                      stroke="var(--muted-foreground)"
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
              </div>
              <div className="h-px bg-border mx-4 mt-3" />
            </div>
          );
        })}
        <div className="h-6" />
      </div>

      <FloatingActionButton
        onClick={() => {
          setIsComposerOpen((current) => !current);
          setComposerError(null);
        }}
        aria-label={isComposerOpen ? "Close post composer" : "Add post"}
      >
        {isComposerOpen ? (
          <X size={21} color="var(--accent-foreground)" strokeWidth={2.5} />
        ) : (
          <Plus size={22} color="var(--accent-foreground)" strokeWidth={2.5} />
        )}
      </FloatingActionButton>

      {joinPromptGroup && (
        <div className="absolute inset-0 z-50 flex items-end bg-background/70 p-4 backdrop-blur-sm">
          <div className="w-full rounded-2xl border border-border bg-card p-4 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-secondary">
                <img
                  src={joinPromptGroup.avatar}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-bold text-foreground">
                  {joinPromptGroup.name}
                </h2>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <Users size={12} />
                  <span>{joinPromptGroup.members} members</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Join this group to open the chat and keep up with future plans.
            </p>

            {joinPromptError && (
              <p className="mt-3 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
                {joinPromptError}
              </p>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setJoinPromptGroup(null);
                  setJoinPromptError(null);
                }}
                className="h-11 rounded-2xl bg-secondary text-sm font-bold text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleJoinGroup}
                disabled={joiningGroupId === joinPromptGroup.id}
                className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-accent text-sm font-bold text-accent-foreground disabled:opacity-70"
              >
                {joiningGroupId === joinPromptGroup.id && (
                  <Loader2 size={15} className="animate-spin" />
                )}
                Join group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
