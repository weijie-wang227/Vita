import { useAppState } from "../state";
import { Card, PageHeading } from "../components/ui";
import { useRef, useState } from "react";
import { uploadImageToR2 } from "../api/uploads";
import { updateMyProfile } from "../api/user";

export function ProfilePage() {
  const { currentUser, updateUser } = useAppState();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  async function handleAvatarClick() {
    fileInputRef.current?.click();
  }

  async function handleAvatarChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    try {
      setIsUploadingAvatar(true);

      const avatarUrl = await uploadImageToR2(file, "profiles");

      const updatedUser = await updateMyProfile({
        avatarUrl,
      });
      const newUser = currentUser
        ? {
            ...currentUser,
            avatarUrl,
          }
        : updatedUser;
      updateUser(newUser);
    } catch (error) {
      console.error("Failed to update avatar", error);
      alert("Failed to update profile picture.");
    } finally {
      setIsUploadingAvatar(false);

      // Allows choosing the same file again later
      event.target.value = "";
    }
  }

  return (
    <div className="container mx-auto px-6 py-10 lg:px-10">
      <PageHeading
        title="My profile"
        subtitle="Manage your account, friend code, and membership details."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <Card className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
                className="group relative block rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-200"
                aria-label="Change profile picture"
              >
                <img
                  src={currentUser?.avatarUrl}
                  alt={currentUser?.name}
                  className="h-24 w-24 rounded-3xl object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/40 text-sm font-medium text-white opacity-0 transition group-hover:opacity-100">
                  {isUploadingAvatar ? "Uploading..." : "Change"}
                </div>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                {currentUser?.name}
              </h2>
              <p className="text-sm text-slate-600">{currentUser?.email}</p>
              <p className="mt-1 text-xs text-slate-400">
                Click your profile picture to update it.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">
              Bio
            </p>
            <p className="text-base leading-7 text-slate-600">
              {currentUser?.bio}
            </p>
          </div>

          <div className="space-y-2 rounded-3xl bg-slate-50 p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">
              Friend ID
            </p>
            <p className="text-lg font-semibold text-slate-900">
              {currentUser?.id}
            </p>
          </div>
        </Card>

        <Card className="space-y-5">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">
              Membership
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-900">
              {currentUser?.currentPlan?.name}
            </p>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">
              Credits remaining
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {currentUser?.creditsRemaining}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
