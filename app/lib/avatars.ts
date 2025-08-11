// lib/avatars.ts

// Define the theme properties for each card
export interface CardTheme {
  textColor?: string; // e.g., '#FFFFFF'
  themeColor?: string; // e.g., '#8A2BE2' for buttons/accents
  fontFamily?: string; // e.g., "'Roboto', sans-serif"
}

export interface AvatarConfig {
  id: string;
  name: string;
  character: string;
  modelUrl: string;
  imageUrl: string;
  bgImageUrl?: string;
  tags: string[];
  shortDescription: string;
  longDescription: string;
  systemPrompt: string;
  featured: boolean;
  action: "Talk" | "Subscribe";
  theme?: CardTheme; // Add the optional theme object
}

export const avatars: AvatarConfig[] = [
  {
    id: "alex-english-tutor",
    name: "Practice speaking English",
    character: "Alex",
    modelUrl: "/models/Alexa.glb",
    imageUrl: "/images/Alexa.png",
    bgImageUrl: "/images/bg-library.png",
    tags: ["LANGUAGE", "CONVERSATION", "PRACTICE"],
    shortDescription:
      "I can help you practice all kinds of English-speaking scenarios.",
    longDescription: "...",
    systemPrompt: `...`,
    featured: true,
    action: "Talk",
    theme: {
      // Dynamic theme for Alex
      textColor: "#FFFFFF",
      themeColor: "#4A90E2", // A calming blue
      fontFamily: "'Inter', sans-serif",
    },
  },
  {
    id: "mia-work-conversations",
    name: "Master work conversations",
    character: "Mia",
    modelUrl: "/models/banker-lisa.glb",
    imageUrl: "/images/david.png", // Replace with Mia's image
    bgImageUrl: "/images/bg-office.png",
    tags: ["CAREER", "COMMUNICATION"],
    shortDescription: "Practice difficult work conversations with me.",
    longDescription: "...",
    systemPrompt: `...`,
    featured: true,
    action: "Talk",
    theme: {
      // Dynamic theme for Mia
      textColor: "#F5F5F5",
      themeColor: "#50E3C2", // A professional teal
      fontFamily: "'Montserrat', sans-serif",
    },
  },
  {
    id: "isobel-study-help",
    name: "Get study & homework help",
    character: "Isobel",
    modelUrl: "/models/banker-lisa.glb",
    imageUrl: "/images/Isobel.png", // Replace with Isobel's image
    bgImageUrl: "/images/bg-office.png",
    tags: ["HOMEWORK HELP", "VOICE CHANGE", "SUPPORT"],
    shortDescription: "Stuck on a problem? I can help you think it through.",
    longDescription: "",
    systemPrompt: `...`,
    featured: false,
    action: "Subscribe",
    theme: {
      // Subscribe button will be green by default, but text can change
      textColor: "#00c951",
    },
  },
];
