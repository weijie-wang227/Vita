import type { Friend, Profile } from "../lib/types";

export const friends: Friend[] = [
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

export const profile: Profile = {
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