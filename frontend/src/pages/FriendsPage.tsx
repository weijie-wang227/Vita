import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useAppState } from "../state";
import { Badge, Button, Card, Input, PageHeading } from "../components/ui";
import { fetchFriends } from "../api/friends";
import type { User } from "../lib/types";
import { addFriend } from "../api/friends";

export function FriendsPage() {
  const { currentUser } = useAppState();
  const [searchParams] = useSearchParams();

  const [friends, setFriends] = useState<User[]>([]);
  const [friendCode, setFriendCode] = useState("");
  const [feedback, setFeedback] = useState("");

  const inviteUrl = currentUser?.id
    ? `${window.location.origin}/friends?friendId=${encodeURIComponent(
        currentUser.id,
      )}`
    : "";

  useEffect(() => {
    async function loadFriends() {
      if (currentUser?.id) {
        const friendsData = await fetchFriends();
        setFriends(friendsData);
      }
    }

    loadFriends();
  }, [currentUser]);

  useEffect(() => {
    const friendIdFromQr = searchParams.get("friendId");

    if (friendIdFromQr) {
      setFriendCode(friendIdFromQr);
      setFeedback("Friend ID filled from QR code. Tap Add friend to connect.");
    }
  }, [searchParams]);

  const handleAddFriend = async () => {
    if (!friendCode.trim()) {
      setFeedback("Please enter a friend ID.");
      return;
    }

    const friend = await addFriend(friendCode.trim());

    if (friend == null) {
      setFeedback("Friend not found or already connected.");
      return;
    }

    setFeedback("Friend added successfully.");
    setFriends((prev) => [...prev, friend]);
    setFriendCode("");
  };

  return (
    <div className="container mx-auto px-6 py-10 lg:px-10">
      <PageHeading
        title="Friends"
        subtitle="Build your wellness community and share classes with people you trust."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">
                Invite a friend
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Add friends by their Friend ID
              </h2>
            </div>
            <Badge>{friends.length} connected</Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <Input
              placeholder="Enter friend ID"
              value={friendCode}
              onChange={(event) => setFriendCode(event.target.value)}
            />
            <Button type="button" onClick={handleAddFriend}>
              Add friend
            </Button>
          </div>

          {feedback ? (
            <p className="text-sm text-slate-600">{feedback}</p>
          ) : null}
        </Card>

        <Card className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">
            Your code
          </p>

          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="break-all text-xl font-semibold text-slate-900">
              {currentUser?.id}
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Share this code with classmates and friends.
            </p>
          </div>

          {inviteUrl ? (
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex justify-center">
                <QRCodeSVG value={inviteUrl} size={180} />
              </div>

              <p className="mt-4 text-center text-sm text-slate-600">
                Ask your friend to scan this QR code. It will open their Friends
                page and fill in your Friend ID automatically.
              </p>

              <p className="mt-3 break-all text-xs text-slate-400">
                {inviteUrl}
              </p>
            </div>
          ) : null}
        </Card>
      </div>

      <div className="mt-6 grid gap-4">
        {friends.map((friend) => (
          <Card key={friend?.id} className="flex flex-wrap items-center gap-4">
            <img
              src={friend?.avatarUrl}
              alt={friend?.name}
              className="h-16 w-16 rounded-3xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-lg font-semibold text-slate-900">
                {friend?.name}
              </p>
              <p className="text-sm text-slate-600">{friend?.bio}</p>
            </div>
            <Badge>{friend?.id}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
