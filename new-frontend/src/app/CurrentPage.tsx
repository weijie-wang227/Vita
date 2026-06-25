import {
  ActivitiesPage,
  ActivityDetailPage,
  ChatPage,
  FeedPage,
  GroupDetailPage,
  ProfilePage,
} from "../pages";
import { useAppState } from "../state";

export function CurrentPage() {
  const { activeTab, selectedActivityId, selectedGroupId } = useAppState();

  if (selectedActivityId !== null) {
    return <ActivityDetailPage />;
  }

  if (selectedGroupId !== null) {
    return <GroupDetailPage />;
  }

  switch (activeTab) {
    case "feed":
      return <FeedPage />;
    case "chat":
      return <ChatPage />;
    case "profile":
      return <ProfilePage />;
    case "activities":
    default:
      return <ActivitiesPage />;
  }
}
