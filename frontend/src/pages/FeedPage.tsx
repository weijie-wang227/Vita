import { Button, Card, PageHeading } from "../components/ui";
import type { Post } from "../lib/types";
import { fetchPosts, createPost } from "../api/feed";
import { useEffect, useState } from "react";
import { formatDate } from "./helpers";
import { uploadImageToR2 } from "../api/uploads";

export function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  const [showPostForm, setShowPostForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      const postData = await fetchPosts();
      setPosts(postData);
    };

    loadPosts();
  }, []);

  async function handleCreatePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !description.trim()) return;

    try {
      setIsPosting(true);

      let uploadedImageUrl: string | undefined;

      if (imageFile) {
        uploadedImageUrl = await uploadImageToR2(imageFile, "posts");
      }

      const newPost = await createPost({
        title: title.trim(),
        description: description.trim(),
        imageUrl: uploadedImageUrl ?? "",
        classId: classId.trim() || "",
      });

      setPosts((currentPosts) => [newPost, ...currentPosts]);

      setTitle("");
      setDescription("");
      setImageFile(null);
      setClassId("");
      setShowPostForm(false);
    } catch (error) {
      console.error("Failed to create post", error);
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <div className="container mx-auto px-6 py-10 lg:px-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeading
          title="Social feed"
          subtitle="See the latest wellness posts from your friends."
        />

        <Button onClick={() => setShowPostForm((current) => !current)}>
          {showPostForm ? "Cancel" : "Create post"}
        </Button>
      </div>

      {showPostForm && (
        <Card className="mb-8 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Share something with your friends
            </h2>
            <p className="text-sm text-slate-500">
              Post about a class, activity, or experience you enjoyed.
            </p>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Great calligraphy session today"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Share what you enjoyed..."
                rows={4}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Image File
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => {
                  setImageFile(event.target.files?.[0] ?? null);
                }}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Class ID
              </label>
              <input
                value={classId}
                onChange={(event) => setClassId(event.target.value)}
                placeholder="Optional class ID"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowPostForm(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isPosting}>
                {isPosting ? "Posting..." : "Post"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-6">
        {posts.map((post: Post) => (
          <Card key={post._id} className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={post.userId?.avatarUrl}
                alt={post.userId?.name}
                className="h-14 w-14 rounded-3xl object-cover"
              />
              <div>
                <p className="font-semibold text-slate-900">
                  {post.userId?.name}
                </p>
                <p className="text-sm text-slate-500">Shared a class post</p>
              </div>
            </div>

            <div>
              <p className="text-lg font-semibold text-slate-900">
                {post.title}
              </p>
              <p className="mt-1 text-slate-700">“{post.description}”</p>
            </div>

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="max-h-96 w-full rounded-3xl object-cover"
              />
            )}

            {post.class && (
              <div className="grid gap-4 rounded-3xl bg-slate-50 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">
                    Class
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {post.class.title}
                  </p>
                  <p className="text-sm text-slate-600">
                    {formatDate(post?.class?.date, post?.class?.time)}
                  </p>
                </div>

                <Button
                  variant="secondary"
                  as="a"
                  href={`/classes/${post.class._id}`}
                >
                  View class
                </Button>
              </div>
            )}
          </Card>
        ))}

        {posts.length === 0 && (
          <Card className="text-center">
            <p className="font-semibold text-slate-900">No posts yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Create the first post or add friends to see their activity here.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
