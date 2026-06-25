import type { FeedPost, GroupChat } from "../lib/types";

export const feedPosts: FeedPost[] = [
  {
    id: 1,
    user: "Linda Tan",
    handle: "@lindatan",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&auto=format",
    time: "2h ago",
    caption:
      "Beautiful morning at Fort Canning with the Tai Chi group. The energy was just wonderful. See you all next Saturday!",
    image:
      "https://images.unsplash.com/photo-1548957175-84f0f9af659e?w=600&h=400&fit=crop&auto=format",
    likes: 47,
    comments: 9,
    activity: "Tai Chi at Fort Canning",
    durationMinutes: 60,
    categories: ["physical", "cognitive"],
  },
  {
    id: 2,
    user: "Raymond Koh",
    handle: "@raymondkoh",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&auto=format",
    time: "Yesterday",
    caption:
      "Caught the golden hour at the Botanic Gardens this morning. Who knew we had such beauty right here in Singapore.",
    image:
      "https://images.unsplash.com/photo-1629185752152-fe65698ddee4?w=600&h=400&fit=crop&auto=format",
    likes: 93,
    comments: 18,
    activity: "Botanic Gardens Photography",
    durationMinutes: 90,
    categories: ["physical", "cognitive", "creative"],
  },
  {
    id: 3,
    user: "Grace Wong",
    handle: "@gracewong",
    avatar:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=64&h=64&fit=crop&auto=format",
    time: "2 days ago",
    caption:
      "Our cooking class made the most amazing char kway teow from scratch. Everyone left with full stomachs and happy hearts.",
    image:
      "https://images.unsplash.com/photo-1659882751335-43e664461e6d?w=600&h=400&fit=crop&auto=format",
    likes: 128,
    comments: 32,
    activity: "Cantonese Cooking Class",
    durationMinutes: 120,
    categories: ["social", "cognitive", "creative"],
  },
  {
    id: 4,
    user: "David Ng",
    handle: "@davidng",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&auto=format",
    time: "3 days ago",
    caption:
      "6km along East Coast Park. Perfect way to start the weekend. Who's joining us next Saturday? Drop your name below!",
    image:
      "https://images.unsplash.com/photo-1501554728187-ce583db33af7?w=600&h=400&fit=crop&auto=format",
    likes: 61,
    comments: 14,
    activity: "Morning Walk - East Coast Park",
    durationMinutes: 75,
    categories: ["physical", "social"],
  },
];

export const groupChats: GroupChat[] = [
  {
    id: 1,
    name: "Tai Chi at Fort Canning",
    members: 14,
    avatar:
      "https://images.unsplash.com/photo-1548957175-84f0f9af659e?w=64&h=64&fit=crop&auto=format",
    lastMessage: "",
    time: "",
    unread: 0,
  },
  {
    id: 2,
    name: "East Coast Morning Walkers",
    members: 28,
    avatar:
      "https://images.unsplash.com/photo-1501554728187-ce583db33af7?w=64&h=64&fit=crop&auto=format",
    lastMessage: "",
    time: "",
    unread: 0,
  },
  {
    id: 3,
    name: "Botanic Gardens Photo Club",
    members: 11,
    avatar:
      "https://images.unsplash.com/photo-1629185752152-fe65698ddee4?w=64&h=64&fit=crop&auto=format",
    lastMessage: "",
    time: "",
    unread: 0,
  },
  {
    id: 4,
    name: "Cantonese Cooking Class",
    members: 9,
    avatar:
      "https://images.unsplash.com/photo-1659882751335-43e664461e6d?w=64&h=64&fit=crop&auto=format",
    lastMessage: "",
    time: "",
    unread: 0,
  },
  {
    id: 5,
    name: "Chinatown Hawker Walk",
    members: 16,
    avatar:
      "https://images.unsplash.com/photo-1562593028-1fe2d15bde36?w=64&h=64&fit=crop&auto=format",
    lastMessage: "",
    time: "",
    unread: 0,
  },
  {
    id: 6,
    name: "Senior Chess Club SG",
    members: 34,
    avatar:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=64&h=64&fit=crop&auto=format",
    lastMessage: "",
    time: "",
    unread: 0,
  },
  {
    id: 7,
    name: "Kelong Fishing Kakis",
    members: 8,
    avatar:
      "https://images.unsplash.com/photo-1502294624983-4ba589803a55?w=64&h=64&fit=crop&auto=format",
    lastMessage: "",
    time: "",
    unread: 0,
  },
];