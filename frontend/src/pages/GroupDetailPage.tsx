import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAppState } from "../state";
import { Badge, Button, Card } from "../components/ui";
import type { GroupInfo } from "../lib/types";
import { useEffect, useState } from "react";
import { fetchGroupById } from "../api/groups";
import { joinGroup } from "../api/groups";
import { GroupChat } from "../components/GroupChat";

export function GroupDetailPage() {
  const { id } = useParams();
  const { currentUser } = useAppState();
  const navigate = useNavigate();
  const [groupInfo, setGroup] = useState<GroupInfo | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"details" | "chat">("details");

  useEffect(() => {
    async function loadGroup() {
      const classData = await fetchGroupById(id ?? "");
      setGroup(classData);
    }

    loadGroup();
  }, [currentUser?.id, id]);

  const handleJoinGroup = async () => {
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }

    if (groupInfo) {
      const success = await joinGroup(groupInfo._id);
      if (success) {
        setGroup({ ...groupInfo, joinedByMe: true });
      }
    }
  };
  const handleGoToLogin = () => {
    navigate("/auth", {
      state: {
        from: location.pathname + location.search,
      },
    });
  };

  return (
    <div className="flex flex-col">
      {/* Full-width hero image with overlay */}
      <div className="relative h-80 w-full overflow-hidden sm:h-96">
        <img
          src={groupInfo?.imageUrl}
          alt={groupInfo?.title}
          className="h-full w-full object-cover"
        />
        {/* Gradient fade overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Overlay content - just quick details */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-8 sm:px-10">
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Admin
              </p>
              <p className="mt-1 font-semibold text-white">
                {groupInfo?.admin?.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Below image content */}
      <div className="container mx-auto px-6 py-0 lg:px-10">
        {/* Title section */}
        <div className="mb-6">
          <h1 className="-ml-px mt-2 text-3xl font-bold tracking-tight text-slate-400 sm:text-4xl">
            {groupInfo?.title ?? ""}
          </h1>
        </div>
        <div className="flex w-fit rounded-full bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeTab === "details"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Group details
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeTab === "chat"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Member chat
          </button>
        </div>

        {activeTab === "details" ? (
          <>
            <div className="mb-6">
              {groupInfo?.description ? (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                  {groupInfo.description}
                </p>
              ) : null}
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="space-y-4">
                <Card className="grid gap-4">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Members
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {groupInfo?.joined} members
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-indigo-500">
                        Friends going
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {groupInfo?.friendsJoined?.length
                          ? groupInfo.friendsJoined
                              .map((item) => item.name)
                              .join(", ")
                          : "None yet"}
                      </p>
                    </div>
                    <Badge>{groupInfo?.friendsJoined?.length || 0}</Badge>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button
                      onClick={handleJoinGroup}
                      disabled={
                        !groupInfo || groupInfo.joinedByMe || currentUser
                      }
                    >
                      {groupInfo
                        ? groupInfo?.joinedByMe
                          ? "Already joined"
                          : "Confirm joining"
                        : "Not available"}
                    </Button>
                    <Button variant="secondary" as="a" href="/classes">
                      Back
                    </Button>
                  </div>
                  <p className="text-xs leading-5 text-slate-600">
                    {groupInfo?.joinedByMe
                      ? "You are signed up for this class."
                      : "Book now if you have enough credits."}
                  </p>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <GroupChat currentUser={currentUser} groupInfo={groupInfo} />
        )}

        {showLoginPrompt && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 px-6">
            <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-slate-900">
                Sign in to join this group
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                You need to sign in before joining. After signing in, you will
                be brought back to this group page.
              </p>

              <div className="mt-6 flex gap-3">
                <Button onClick={handleGoToLogin}>Sign in</Button>

                <Button
                  variant="secondary"
                  onClick={() => setShowLoginPrompt(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
