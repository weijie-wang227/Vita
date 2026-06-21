import { Card } from "./ui";
import type { GroupInfo, User } from "../lib/types";
import { fetchGroupChat, postGroupMessage } from "../api/groupChat";
import { Chat } from "./Chat";

type GroupChatProps = {
  groupInfo: GroupInfo | null;
  currentUser: User | null;
};

export function GroupChat({ groupInfo, currentUser }: GroupChatProps) {
  if (!groupInfo) {
    return (
      <Card>
        <p className="text-slate-600">Group not found.</p>
      </Card>
    );
  }

  if (!currentUser) {
    return (
      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Member chat</h2>
        <p className="text-sm leading-6 text-slate-600">
          Please sign in to view the member chat for this class.
        </p>
      </Card>
    );
  }

  if (!groupInfo.joinedByMe) {
    return (
      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Member chat</h2>
        <p className="text-sm leading-6 text-slate-600">
          This chat is only available to members who have registered for this
          class.
        </p>
      </Card>
    );
  }

  return (
    <Chat
      currentUser={currentUser}
      id={groupInfo._id}
      title={groupInfo.title}
      fetchMessages={fetchGroupChat}
      sendMessage={postGroupMessage}
    />
  );
}
