export type ActivityType =
  | "wellness"
  | "food"
  | "photo"
  | "hiking"
  | "chess"
  | "fishing"
  | "social"
  | "bike";

export type FriendSeed = {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  mutual: number;
  joined: string[];
};

type ActivityBase = {
  id: number;
  title: string;
  host: string;
  type: ActivityType;
  date: string;
  time: string;
  location: string;
  spots: number;
  price: string;
  rating: number;
  joiningFriends: FriendSeed[];
};

export type PremiumActivitySeed = ActivityBase & {
  cover: string;
  tags: string[];
};

export type StandardActivitySeed = ActivityBase;
export type ActivitySeed = PremiumActivitySeed | StandardActivitySeed;

export const friends: FriendSeed[] = [
  {
    id: 1,
    name: "Linda Tan",
    handle: "@lindatan",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&auto=format",
    mutual: 8,
    joined: ["Tai Chi", "Book Club"],
  },
  {
    id: 2,
    name: "Raymond Koh",
    handle: "@raymondkoh",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&auto=format",
    mutual: 5,
    joined: ["Morning Walk", "Photography"],
  },
  {
    id: 3,
    name: "Susan Lim",
    handle: "@susanlim",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=64&h=64&fit=crop&auto=format",
    mutual: 11,
    joined: ["Tai Chi", "Cooking Class"],
  },
  {
    id: 4,
    name: "David Ng",
    handle: "@davidng",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&auto=format",
    mutual: 3,
    joined: ["Morning Walk", "Chess Club"],
  },
  {
    id: 5,
    name: "Mei Ling",
    handle: "@meiling",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&auto=format",
    mutual: 7,
    joined: ["Cooking Class", "Photography"],
  },
  {
    id: 6,
    name: "James Ho",
    handle: "@jamesho",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&auto=format",
    mutual: 4,
    joined: ["Chess Club"],
  },
  {
    id: 7,
    name: "Grace Wong",
    handle: "@gracewong",
    avatar:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=64&h=64&fit=crop&auto=format",
    mutual: 9,
    joined: ["Book Club", "Tai Chi"],
  },
  {
    id: 8,
    name: "Peter Chia",
    handle: "@peterchia",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&auto=format",
    mutual: 2,
    joined: ["Morning Walk"],
  },
];

export const profile = {
  name: "Linda Tan",
  handle: "@lindatan",
  avatar:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&auto=format",
  bio: "Retired teacher. Love Tai Chi, hiking, and cooking. Always looking for good company to explore Singapore with.",
  stats: [
    { value: "12", label: "Activities" },
    { value: "8", label: "Friends" },
    { value: "34", label: "Posts" },
  ],
};

export const premiumActivities: PremiumActivitySeed[] = [
  {
    id: 1,
    title: "Tai Chi at Fort Canning",
    host: "Master Chen Wei",
    cover:
      "https://images.unsplash.com/photo-1548957175-84f0f9af659e?w=400&h=220&fit=crop&auto=format",
    type: "wellness",
    date: "Sat, Jun 28",
    time: "7:00 AM",
    location: "Fort Canning Park",
    spots: 6,
    price: "$18",
    rating: 4.9,
    tags: ["Guided", "All levels"],
    joiningFriends: [friends[0], friends[2], friends[6]],
  },
  {
    id: 2,
    title: "Hawker Heritage Food Walk",
    host: "Chef Mdm Siti",
    cover:
      "https://images.unsplash.com/photo-1562593028-1fe2d15bde36?w=400&h=220&fit=crop&auto=format",
    type: "food",
    date: "Sun, Jun 29",
    time: "9:00 AM",
    location: "Chinatown Complex",
    spots: 4,
    price: "$35",
    rating: 5,
    tags: ["Tasting included", "Small group"],
    joiningFriends: [friends[4], friends[1]],
  },
  {
    id: 3,
    title: "Botanic Gardens Photography",
    host: "Raymond Koh",
    cover:
      "https://images.unsplash.com/photo-1501554728187-ce583db33af7?w=400&h=220&fit=crop&auto=format",
    type: "photo",
    date: "Mon, Jun 30",
    time: "7:30 AM",
    location: "Singapore Botanic Gardens",
    spots: 8,
    price: "$25",
    rating: 4.8,
    tags: ["Camera tips", "Print included"],
    joiningFriends: [friends[1], friends[4], friends[0]],
  },
];

export const standardActivities: StandardActivitySeed[] = [
  {
    id: 4,
    title: "Morning Walk - East Coast Park",
    host: "David Ng",
    type: "hiking",
    date: "Sat, Jun 28",
    time: "7:00 AM",
    location: "East Coast Park",
    spots: 15,
    price: "Free",
    rating: 4.7,
    joiningFriends: [friends[3], friends[7], friends[1]],
  },
  {
    id: 5,
    title: "Senior Chess Club",
    host: "James Ho",
    type: "chess",
    date: "Fri, Jun 27",
    time: "2:00 PM",
    location: "Bishan Community Club",
    spots: 12,
    price: "Free",
    rating: 4.6,
    joiningFriends: [friends[5], friends[3]],
  },
  {
    id: 6,
    title: "Cantonese Cooking Class",
    host: "Mdm Grace Wong",
    type: "food",
    date: "Sun, Jun 29",
    time: "10:00 AM",
    location: "Toa Payoh CC Kitchen",
    spots: 10,
    price: "$22",
    rating: 4.9,
    joiningFriends: [friends[6], friends[2], friends[4]],
  },
  {
    id: 7,
    title: "Kelong Fishing Day Trip",
    host: "Uncle Ravi",
    type: "fishing",
    date: "Sat, Jun 28",
    time: "6:00 AM",
    location: "Pulau Ubin Jetty",
    spots: 6,
    price: "$45",
    rating: 4.8,
    joiningFriends: [friends[0], friends[3]],
  },
  {
    id: 8,
    title: "Book Club - Cafe Meeting",
    host: "Linda Tan",
    type: "social",
    date: "Thu, Jun 26",
    time: "3:30 PM",
    location: "Tiong Bahru Bakery",
    spots: 10,
    price: "Free",
    rating: 4.7,
    joiningFriends: [friends[0], friends[6], friends[2]],
  },
];

export const groupChats = [
  {
    id: 1,
    name: "Tai Chi at Fort Canning",
    members: 14,
    avatar:
      "https://images.unsplash.com/photo-1548957175-84f0f9af659e?w=64&h=64&fit=crop&auto=format",
    lastMessage: "Master Chen: Remember to wear comfortable shoes on Saturday",
    time: "5m",
    unread: 4,
  },
  {
    id: 2,
    name: "East Coast Morning Walkers",
    members: 28,
    avatar:
      "https://images.unsplash.com/photo-1501554728187-ce583db33af7?w=64&h=64&fit=crop&auto=format",
    lastMessage: "David: Meeting at Car Park C entrance as usual",
    time: "32m",
    unread: 2,
  },
  {
    id: 3,
    name: "Botanic Gardens Photo Club",
    members: 11,
    avatar:
      "https://images.unsplash.com/photo-1629185752152-fe65698ddee4?w=64&h=64&fit=crop&auto=format",
    lastMessage: "Raymond: I shared Monday's photos in the Drive folder!",
    time: "1h",
    unread: 0,
  },
  {
    id: 4,
    name: "Cantonese Cooking Class",
    members: 9,
    avatar:
      "https://images.unsplash.com/photo-1659882751335-43e664461e6d?w=64&h=64&fit=crop&auto=format",
    lastMessage: "Grace: Next week we're doing chicken rice",
    time: "3h",
    unread: 1,
  },
  {
    id: 5,
    name: "Chinatown Hawker Walk",
    members: 16,
    avatar:
      "https://images.unsplash.com/photo-1562593028-1fe2d15bde36?w=64&h=64&fit=crop&auto=format",
    lastMessage: "Mdm Siti: Stall recommendations pinned above",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: 6,
    name: "Senior Chess Club SG",
    members: 34,
    avatar:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=64&h=64&fit=crop&auto=format",
    lastMessage: "James: Tournament bracket posted. Check pinned message",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: 7,
    name: "Kelong Fishing Kakis",
    members: 8,
    avatar:
      "https://images.unsplash.com/photo-1502294624983-4ba589803a55?w=64&h=64&fit=crop&auto=format",
    lastMessage: "Uncle Ravi: Tide looks good for Saturday. Bring sunscreen!",
    time: "2 days ago",
    unread: 0,
  },
];

export const mapPins = [
  {
    id: 1,
    activityId: 1,
    latitude: 1.295,
    longitude: 103.8465,
    type: "wellness",
    label: "Tai Chi - Fort Canning",
    premium: true,
  },
  {
    id: 2,
    activityId: 2,
    latitude: 1.2823,
    longitude: 103.8433,
    type: "food",
    label: "Hawker Walk - Chinatown",
    premium: true,
  },
  {
    id: 3,
    activityId: 3,
    latitude: 1.3138,
    longitude: 103.8159,
    type: "photo",
    label: "Botanic Gardens",
    premium: true,
  },
  {
    id: 4,
    activityId: 4,
    latitude: 1.3008,
    longitude: 103.9122,
    type: "hiking",
    label: "East Coast Park Walk",
  },
  {
    id: 5,
    activityId: 5,
    latitude: 1.3508,
    longitude: 103.8485,
    type: "chess",
    label: "Chess Club - Bishan CC",
  },
  {
    id: 6,
    activityId: 6,
    latitude: 1.3343,
    longitude: 103.8563,
    type: "food",
    label: "Cooking Class - Toa Payoh",
  },
  {
    id: 7,
    activityId: 7,
    latitude: 1.4022,
    longitude: 103.9605,
    type: "fishing",
    label: "Kelong Day Trip",
  },
  {
    id: 8,
    activityId: 8,
    latitude: 1.2848,
    longitude: 103.8329,
    type: "social",
    label: "Book Club - Tiong Bahru",
  },
];

export const feedPosts = [
  {
    id: 1,
    user: "Linda Tan",
    handle: "@lindatan",
    time: "2h ago",
    caption:
      "Beautiful morning at Fort Canning with the Tai Chi group. The energy was just wonderful. See you all next Saturday!",
    image:
      "https://images.unsplash.com/photo-1548957175-84f0f9af659e?w=600&h=400&fit=crop&auto=format",
    likes: 47,
    comments: 9,
    activity: "Tai Chi at Fort Canning",
  },
  {
    id: 2,
    user: "Raymond Koh",
    handle: "@raymondkoh",
    time: "Yesterday",
    caption:
      "Caught the golden hour at the Botanic Gardens this morning. Who knew we had such beauty right here in Singapore.",
    image:
      "https://images.unsplash.com/photo-1629185752152-fe65698ddee4?w=600&h=400&fit=crop&auto=format",
    likes: 93,
    comments: 18,
    activity: "Botanic Gardens Photography",
  },
  {
    id: 3,
    user: "Grace Wong",
    handle: "@gracewong",
    time: "2 days ago",
    caption:
      "Our cooking class made the most amazing char kway teow from scratch. Everyone left with full stomachs and happy hearts.",
    image:
      "https://images.unsplash.com/photo-1659882751335-43e664461e6d?w=600&h=400&fit=crop&auto=format",
    likes: 128,
    comments: 32,
    activity: "Cantonese Cooking Class",
  },
  {
    id: 4,
    user: "David Ng",
    handle: "@davidng",
    time: "3 days ago",
    caption:
      "6km along East Coast Park. Perfect way to start the weekend. Who's joining us next Saturday? Drop your name below!",
    image:
      "https://images.unsplash.com/photo-1501554728187-ce583db33af7?w=600&h=400&fit=crop&auto=format",
    likes: 61,
    comments: 14,
    activity: "Morning Walk - East Coast Park",
  },
];
