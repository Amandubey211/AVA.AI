// lib/avatars.ts
export interface AvatarConfig {
  id: string;
  name: string; // The "Practice speaking English" part
  character: string; // The "Alex" in "with Alex"
  modelUrl: string;
  imageUrl: string; // High-quality image of the character
  bgImageUrl?: string; // Optional background for featured cards
  tags: string[];
  shortDescription: string;
  longDescription: string;
  systemPrompt: string;
  featured: boolean; // Is it in the top carousel?
  action: 'Talk' | 'Subscribe'; // To control the button text
}

export const avatars: AvatarConfig[] = [
  {
    id: 'alex-english-tutor',
    name: 'Practice speaking English',
    character: 'Alex',
    modelUrl: '/models/Alexa.glb', // Replace with Alex's model
    imageUrl: '/images/Alexa.png', // Transparent character image
    bgImageUrl: '/images/bg-library.png', // Background for the featured card
    tags: ['LANGUAGE', 'CONVERSATION', 'PRACTICE'],
    shortDescription: "I can help you practice all kinds of English-speaking scenarios.",
    longDescription: "Need help navigating a delicate conversation or practice asking for a promotion? Let's role-play.",
    systemPrompt: `You are Alex, an expert English tutor...`,
    featured: true,
    action: 'Talk',
  },
  {
    id: 'mia-work-conversations',
    name: 'Master work conversations',
    character: 'Mia',
    modelUrl: '/models/banker-lisa.glb', // Replace with Mia's model
   imageUrl: '/images/david.png', // Transparent character image
    bgImageUrl: '/images/bg-library.png', // Background for the featured card
    tags: ['CAREER', 'COMMUNICATION'],
    shortDescription: "Practice difficult work conversations with me.",
    longDescription: "From asking for a raise to giving feedback, we can practice any professional scenario you need to master.",
    systemPrompt: `You are Mia, a career coach specializing in work communication...`,
    featured: true,
    action: 'Talk',
  },
  {
    id: 'isobel-study-help',
    name: 'Get study & homework help',
    character: 'Isobel',
    modelUrl: '/models/banker-lisa.glb', // Replace
    imageUrl: '/images/david.png', // Transparent character image
    bgImageUrl: '/images/bg-library.png', // Background for the featured card
    tags: ['HOMEWORK HELP', 'VOICE CHANGE', 'SUPPORT'],
    shortDescription: 'Stuck on a problem? I can help you think it through.',
    longDescription: '',
    systemPrompt: `You are Isobel, a friendly and patient study buddy...`,
    featured: false,
    action: 'Subscribe',
  },
  // Add more avatars, making some featured: false
];