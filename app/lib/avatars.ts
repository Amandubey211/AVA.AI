// lib/avatars.ts

export interface CardTheme {
  textColor?: string;
  themeColor?: string;
  fontFamily?: string;
}

export type ExpressionMapping = {
  [emotion: string]: { morphTargets: string[]; intensity: number };
};

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
  theme?: CardTheme;
  expressions: ExpressionMapping;
  ttsVoiceId: string;
  idleAnimationUrl: string;
  status: "Published" | "Unpublished";
}

// --- Placeholder assets for unpublished avatars to prevent crashes ---
const placeholderExpressions: ExpressionMapping = {
  neutral: { morphTargets: [], intensity: 0 },
  happy: { morphTargets: ["mouthSmile"], intensity: 0.8 },
};

export const avatars: AvatarConfig[] = [
  // =================================================================================
  // === PUBLISHED AVATARS (2 total) =================================================
  // =================================================================================
  {
    id: "alex-english-tutor",
    name: "Practice speaking English",
    character: "Alex",
    modelUrl: "/models/Teacher_Nanami.glb",
    imageUrl: "/images/Nanami.png",
    bgImageUrl: "/images/bg-library.png",
    idleAnimationUrl: "/models/animations_Nanami.glb",
    tags: ["LANGUAGE", "CONVERSATION", "PRACTICE"],
    shortDescription:
      "I can help you practice all kinds of English-speaking scenarios.",
    longDescription:
      "Whether you're preparing for a job interview, ordering at a coffee shop, or just want to improve your fluency, I'm here to help you practice in a friendly, no-pressure environment.",
    systemPrompt: `You are Alex, a friendly, patient, and encouraging English language tutor. Your primary goal is to help the user practice their conversational English. Your responses MUST be concise and under 300 characters. At the end of EVERY response, you MUST provide a sentiment tag in square brackets. Choose from: [happy], [neutral], [curious], [encouraging]. Example: "That's a great question! [curious]"`,
    featured: true,
    action: "Talk",
    theme: {
      textColor: "#FFFFFF",
      themeColor: "#4A90E2",
      fontFamily: "'Inter', sans-serif",
    },
    expressions: {
      happy: {
        morphTargets: ["mouthSmile", "browOuterUpRight", "browOuterUpLeft"],
        intensity: 0.8,
      },
      neutral: { morphTargets: [], intensity: 0 },
      curious: { morphTargets: ["browInnerUp"], intensity: 0.7 },
      encouraging: { morphTargets: ["mouthSmile"], intensity: 0.9 },
    },
    ttsVoiceId: "21m00Tcm4TlvDq8ikWAM",
    status: "Published",
  },
  {
    id: "mia-work-conversations",
    name: "Master work conversations",
    character: "Mia",
    modelUrl: "/models/Teacher_Naoki.glb", // Assumes you have this model
    imageUrl: "/images/david.png", // Replace with Mia's image
    bgImageUrl: "/images/bg-office.png",
    idleAnimationUrl: "/models/animations_Naoki.glb", // Use a valid animation file
    tags: ["CAREER", "COMMUNICATION", "NEGOTIATION"],
    shortDescription: "Practice difficult work conversations with me.",
    longDescription:
      "From asking for a raise to giving difficult feedback, we can role-play any professional scenario you need to master.",
    systemPrompt: `You are Mia, a highly experienced and empathetic career coach. Your responses MUST be concise and under 500 characters. At the end of EVERY response, you MUST provide a sentiment tag in square brackets. Choose from: [neutral], [professional], [supportive], [thoughtful]. Example: "Excellent point. [professional]"`,
    featured: true,
    action: "Talk",
    theme: {
      textColor: "#F5F5F5",
      themeColor: "#50E3C2",
      fontFamily: "'Montserrat', sans-serif",
    },
    expressions: {
      professional: { morphTargets: ["browInnerUp"], intensity: 0.3 },
      supportive: { morphTargets: ["mouthSmile"], intensity: 0.7 },
      neutral: { morphTargets: [], intensity: 0 },
      thoughtful: {
        morphTargets: ["eyeLookDownRight", "eyeLookDownLeft"],
        intensity: 0.5,
      },
    },
    ttsVoiceId: "21m00Tcm4TlvDq8ikWAM",
    status: "Published",
  },

  // =================================================================================
  // === UNPUBLISHED AVATARS (All use placeholder assets for stability) ==============
  // =================================================================================
  {
    id: "atlas-fitness-coach",
    name: "Achieve Your Fitness Goals",
    character: "Atlas",
    modelUrl: "/models/Alexa.glb", // Placeholder
    imageUrl: "/images/david.png", // Replace
    bgImageUrl: "/images/bg/bg-gym.png",
    idleAnimationUrl: "/models/animations_Nanami.glb", // Placeholder
    tags: ["FITNESS", "WORKOUTS", "NUTRITION"],
    shortDescription:
      "Your personal AI trainer for workout plans and motivation.",
    longDescription: "...",
    systemPrompt: `You are Atlas, an energetic AI fitness coach...`,
    featured: true,
    action: "Talk",
    theme: {
      textColor: "#FFFFFF",
      themeColor: "#FF6B6B",
      fontFamily: "'Bebas Neue', sans-serif",
    },
    expressions: placeholderExpressions,
    ttsVoiceId: "21m00Tcm4TlvDq8ikWAM",
    status: "Unpublished",
  },
  {
    id: "luna-mindfulness-guide",
    name: "Find Your Calm",
    character: "Luna",
    modelUrl: "/models/Alexa.glb", // Placeholder
    imageUrl: "/images/david.png", // Replace
    bgImageUrl: "/images/bg/bg-dream.png",
    idleAnimationUrl: "/models/animations_Nanami.glb", // Placeholder
    tags: ["WELLNESS", "MEDITATION", "STRESS RELIEF"],
    shortDescription: "A guide for mindfulness and guided meditation sessions.",
    longDescription: "...",
    systemPrompt: `You are Luna, a calm mindfulness guide...`,
    featured: true,
    action: "Talk",
    theme: {
      textColor: "#E0E7FF",
      themeColor: "#A78BFA",
      fontFamily: "'Cormorant Garamond', serif",
    },
    expressions: placeholderExpressions,
    ttsVoiceId: "21m00Tcm4TlvDq8ikWAM",
    status: "Unpublished",
  },
  {
    id: "kai-coding-buddy",
    name: "Solve Coding Problems",
    character: "Kai",
    modelUrl: "/models/Alexa.glb", // Placeholder
    imageUrl: "/images/david.png", // Replace
    bgImageUrl: "/images/bg/bg-code.png",
    idleAnimationUrl: "/models/animations_Nanami.glb", // Placeholder
    tags: ["TECH", "CODE", "DEBUGGING"],
    shortDescription: "Your AI pair programmer for debugging and learning.",
    longDescription: "...",
    systemPrompt: `You are Kai, a logical AI coding assistant...`,
    featured: true,
    action: "Talk",
    theme: {
      textColor: "#FFFFFF",
      themeColor: "#34D399",
      fontFamily: "'Fira Code', monospace",
    },
    expressions: placeholderExpressions,
    ttsVoiceId: "21m00Tcm4TlvDq8ikWAM",
    status: "Unpublished",
  },
  {
    id: "isobel-study-help",
    name: "Get study & homework help",
    character: "Isobel",
    modelUrl: "/models/Alexa.glb", // Placeholder
    imageUrl: "/images/Isobel.png",
    bgImageUrl: "/images/Isobel.png",
    idleAnimationUrl: "/models/animations_Nanami.glb", // Placeholder
    tags: ["HOMEWORK HELP", "CRITICAL THINKING"],
    shortDescription: "Stuck on a problem? I can help you think it through.",
    longDescription: "...",
    systemPrompt: `You are Isobel, a patient study buddy...`,
    featured: false,
    action: "Subscribe",
    theme: { textColor: "#00c951" },
    expressions: placeholderExpressions,
    ttsVoiceId: "21m00Tcm4TlvDq8ikWAM",
    status: "Unpublished",
  },
  {
    id: "vesper-travel-planner",
    name: "Plan Your Next Trip",
    character: "Vesper",
    modelUrl: "/models/Alexa.glb", // Placeholder
    imageUrl: "/images/vesper.png",
    bgImageUrl: "/images/bg/bg-travel.png",
    idleAnimationUrl: "/models/animations_Nanami.glb", // Placeholder
    tags: ["TRAVEL", "PLANNING", "ITINERARY"],
    shortDescription: "Your AI travel agent for itineraries and local tips.",
    longDescription: "...",
    systemPrompt: `You are Vesper, an enthusiastic AI travel planner...`,
    featured: false,
    action: "Subscribe",
    expressions: placeholderExpressions,
    ttsVoiceId: "21m00Tcm4TlvDq8ikWAM",
    status: "Unpublished",
  },
  {
    id: "remy-culinary-assistant",
    name: "Become a Better Cook",
    character: "Remy",
    modelUrl: "/models/Alexa.glb", // Placeholder
    imageUrl: "/images/remy.png",
    bgImageUrl: "/images/bg/bg-kitchen.png",
    idleAnimationUrl: "/models/animations_Nanami.glb", // Placeholder
    tags: ["COOKING", "RECIPES", "FOODIE"],
    shortDescription: "Discover recipes and master new cooking techniques.",
    longDescription: "...",
    systemPrompt: `You are Remy, a passionate AI chef...`,
    featured: false,
    action: "Talk",
    expressions: placeholderExpressions,
    ttsVoiceId: "21m00Tcm4TlvDq8ikWAM",
    status: "Unpublished",
  },
  {
    id: "elara-story-collaborator",
    name: "Create Worlds with Words",
    character: "Elara",
    modelUrl: "/models/Alexa.glb", // Placeholder
    imageUrl: "/images/elara.png",
    bgImageUrl: "/images/bg/bg-writing.png",
    idleAnimationUrl: "/models/animations_Nanami.glb", // Placeholder
    tags: ["CREATIVE", "WRITING", "STORYTELLING"],
    shortDescription: "Your creative partner for brainstorming stories.",
    longDescription: "...",
    systemPrompt: `You are Elara, a creative AI writing partner...`,
    featured: false,
    action: "Subscribe",
    expressions: placeholderExpressions,
    ttsVoiceId: "21m00Tcm4TlvDq8ikWAM",
    status: "Unpublished",
  },
  {
    id: "julian-investment-analyst",
    name: "Understand the Market",
    character: "Julian",
    modelUrl: "/models/Alexa.glb", // Placeholder
    imageUrl: "/images/julian.png",
    bgImageUrl: "/images/bg/bg-finance.png",
    idleAnimationUrl: "/models/animations_Nanami.glb", // Placeholder
    tags: ["FINANCE", "INVESTING", "STOCKS"],
    shortDescription: "Explains complex investment concepts in simple terms.",
    longDescription: "...",
    systemPrompt: `You are Julian, an analytical AI investment analyst...`,
    featured: false,
    action: "Talk",
    expressions: placeholderExpressions,
    ttsVoiceId: "21m00Tcm4TlvDq8ikWAM",
    status: "Unpublished",
  },
  {
    id: "cleo-history-expert",
    name: "Explore Ancient Civilizations",
    character: "Cleo",
    modelUrl: "/models/Alexa.glb", // Placeholder
    imageUrl: "/images/cleo.png",
    bgImageUrl: "/images/bg/bg-ancient.png",
    idleAnimationUrl: "/models/animations_Nanami.glb", // Placeholder
    tags: ["HISTORY", "ANCIENT", "ARCHAEOLOGY"],
    shortDescription:
      "Your personal guide to the wonders of the ancient world.",
    longDescription: "...",
    systemPrompt: `You are Cleo, an AI historian...`,
    featured: false,
    action: "Talk",
    expressions: placeholderExpressions,
    ttsVoiceId: "21m00Tcm4TlvDq8ikWAM",
    status: "Unpublished",
  },
  {
    id: "hugh-british-tutor",
    name: "Practice British English",
    character: "Hugh",
    modelUrl: "/models/Alexa.glb", // Placeholder
    imageUrl: "/images/hugh.png",
    bgImageUrl: "/images/bg/bg-london.png",
    idleAnimationUrl: "/models/animations_Nanami.glb", // Placeholder
    tags: ["LANGUAGE", "BRITISH", "DIALECT"],
    shortDescription: "Learn British slang and practice a perfect accent.",
    longDescription: "...",
    systemPrompt: `You are Hugh, a charming English tutor from London...`,
    featured: false,
    action: "Subscribe",
    expressions: placeholderExpressions,
    ttsVoiceId: "21m00Tcm4TlvDq8ikWAM",
    status: "Unpublished",
  },
  {
    id: "willow-gardening-expert",
    name: "Cultivate Your Green Thumb",
    character: "Willow",
    modelUrl: "/models/Alexa.glb", // Placeholder
    imageUrl: "/images/willow.png",
    bgImageUrl: "/images/bg/bg-garden.png",
    idleAnimationUrl: "/models/animations_Nanami.glb", // Placeholder
    tags: ["GARDENING", "PLANTS", "DIY"],
    shortDescription: "Your guide to gardening and plant care.",
    longDescription: "...",
    systemPrompt: `You are Willow, a nurturing AI gardening expert...`,
    featured: false,
    action: "Talk",
    expressions: placeholderExpressions,
    ttsVoiceId: "21m00Tcm4TlvDq8ikWAM",
    status: "Unpublished",
  },
  {
    id: "portia-legal-explainer",
    name: "Understand Legal Concepts",
    character: "Portia",
    modelUrl: "/models/Alexa.glb", // Placeholder
    imageUrl: "/images/portia.png",
    bgImageUrl: "/images/bg/bg-law.png",
    idleAnimationUrl: "/models/animations_Nanami.glb", // Placeholder
    tags: ["LAW", "CONCEPTS", "EDUCATION"],
    shortDescription: "Breaks down complex legal terms and ideas.",
    longDescription: "...",
    systemPrompt: `You are Portia, a precise AI assistant that explains legal concepts...`,
    featured: false,
    action: "Subscribe",
    expressions: placeholderExpressions,
    ttsVoiceId: "21m00Tcm4TlvDq8ikWAM",
    status: "Unpublished",
  },
];
