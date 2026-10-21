export type FeatureVideo = {
  id: string;
  number: string;
  title: string;
  description: string;
  steps: readonly string[];
  href: string;
  action: string;
  mediaId: string;
};

export const featureVideos: readonly FeatureVideo[] = [
  {
    id: "build-your-campus", number: "01", title: "Build your own campus",
    description: "Follow an interest, find something that fits and make it part of your personal campus.",
    steps: ["Choose an interest for explained suggestions.", "Explore an opportunity and save it.", "Find it in your temporary campus shortlist."],
    href: "/my-campus?mode=student", action: "Make the campus yours", mediaId: "81e804ed-7d29-4c3f-9ac1-b391e4c04556",
  },
  {
    id: "explore-degrees", number: "02", title: "Explore degrees across Europe",
    description: "Look beyond your home campus. Explore programmes, their host universities and the information behind them.",
    steps: ["Filter the catalogue for programmes.", "Open a programme and check its status.", "Explore its host, credits and official evidence."],
    href: "/explore?mode=student&type=programme&view=list", action: "Explore programmes", mediaId: "7b480231-b2aa-4818-b792-2ebb9c84ef8d",
  },
  {
    id: "before-your-mobility", number: "03", title: "Socialise before your mobility",
    description: "See how a shared space could help you meet your group before the journey begins.",
    steps: ["Meet the sample conference participants.", "Open the group conversation.", "Introduce yourself in the local demo chat."],
    href: "/campus/oviedo-conference?mode=student&tab=people", action: "Meet the demo group", mediaId: "3dadc3eb-d7fe-4184-ae5e-4f04bb178f83",
  },
  {
    id: "find-your-people", number: "04", title: "Find your people",
    description: "Different campuses, something in common. Explore a community built around a shared interest.",
    steps: ["Enter the sample chess club workspace.", "Explore its people and their universities.", "Catch up with the simulated club conversation."],
    href: "/campus/chess-club?mode=student", action: "Explore the club demo", mediaId: "e0c0b0cf-4e9c-4419-86c9-9acc6410b052",
  },
  {
    id: "conference-day", number: "05", title: "Build your conference day",
    description: "Try a workshop plan, spot an overlap and make room for the experiences that matter.",
    steps: ["Choose a sample workshop.", "See the warning for an overlapping session.", "Add a compatible workshop to the demo plan."],
    href: "/campus/oviedo-conference?mode=student&tab=workshops", action: "Try the workshop planner", mediaId: "212555f3-3871-493e-8615-5fc5414397eb",
  },
  {
    id: "learn-across-borders", number: "06", title: "Learn across borders",
    description: "Step into a sample learning space, explore its modules and see a small step become visible progress.",
    steps: ["Open the CLARITY-AI demo learning space.", "Explore its modules and sample tasks.", "Complete a task and see sample progress change."],
    href: "/learn/clarity-ai-studio", action: "Open the learning demo", mediaId: "88f0971c-99ff-4744-841d-5679d57e270e",
  },
  {
    id: "follow-your-connections", number: "07", title: "Follow your connections",
    description: "Start with your direct connections, then see how the wider campus connects to your interests.",
    steps: ["Explore the demo persona’s direct connections.", "Switch to the second-degree view.", "See the wider network and its relationship context."],
    href: "/explore?mode=student&view=network&degree=1", action: "Explore the network", mediaId: "77909f35-f7f8-46a1-ac64-d9ccbbcfae6c",
  },
  {
    id: "shortlist-to-plan", number: "08", title: "Turn your shortlist into a plan",
    description: "Bring the opportunities that fit together, review the advisory credits and keep a copy of your next steps.",
    steps: ["Save another opportunity from the catalogue.", "Review the temporary shortlist and advisory ECTS.", "Export a copy before leaving the page."],
    href: "/my-campus?mode=student", action: "Build your temporary plan", mediaId: "776e1dd1-7d2d-4cf9-95aa-aef73ccde352",
  },
];

export function featureVideoSource(video: FeatureVideo) {
  return `https://d2ol7oe51mr4n9.cloudfront.net/user_3KpeKXCFZSV5L8806RpbyKMVPNG/${video.mediaId}.mp4`;
}

export function featureVideoPoster(video: FeatureVideo) {
  return `/assets/video-guides/${video.number}.jpg`;
}

export function findFeatureVideo(id?: string) {
  return featureVideos.find((video) => video.id === id) ?? featureVideos[0];
}
