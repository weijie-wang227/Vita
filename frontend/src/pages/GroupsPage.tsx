import { useAppState } from "../state";
import type { GroupInfo } from "../lib/types";
import { useEffect, useState } from "react";
import { fetchGroups, createGroup, joinGroup } from "../api/groups";
import { GroupCard } from "../components/GroupCard";
import { PageHeading } from "../components/ui";
import { uploadImageToR2 } from "../api/uploads";
import { Button, Card } from "../components/ui";

export function GroupsPage() {
  const { currentUser } = useAppState();
  const [groups, setGroups] = useState<GroupInfo[]>([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    async function loadGroups() {
      try {
        const groupsData = await fetchGroups();
        console.log(groupsData);
        setGroups(groupsData);
      } catch (error) {
        console.error("Failed to load groups:", error);
      }
    }

    loadGroups();
  }, [currentUser?.id]);

  async function handleCreateGroup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !description.trim()) return;

    try {
      setIsCreating(true);

      let uploadedImageUrl: string | undefined;

      if (imageFile) {
        uploadedImageUrl = await uploadImageToR2(imageFile, "groups");
      }

      const newGroup = await createGroup({
        title: title.trim(),
        description: description.trim(),
        imageUrl: uploadedImageUrl ?? "",
      });

      await joinGroup(newGroup._id);

      setGroups((currentGroups) => [newGroup, ...currentGroups]);

      setTitle("");
      setDescription("");
      setImageFile(null);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create post", error);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="container mx-auto px-6 py-10 lg:px-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeading
          title="Interest Groups"
          subtitle="A Place to meet like-minded friends."
        />

        <Button onClick={() => setShowCreateForm((current) => !current)}>
          {showCreateForm ? "Cancel" : "Create group"}
        </Button>
      </div>

      {showCreateForm && (
        <Card className="mb-8 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Create a new group
            </h2>
            <p className="text-sm text-slate-500">
              Create a group for like minded friends.
            </p>
          </div>

          <form onSubmit={handleCreateGroup} className="space-y-4">
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
                Image URL
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => {
                  setImageFile(event.target.files?.[0] ?? null);
                }}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Grouping..." : "Group"}
              </Button>
            </div>
          </form>
        </Card>
      )}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((groupItem) => (
          <GroupCard key={groupItem._id} groupItem={groupItem} />
        ))}
      </div>
    </div>
  );
}
