import { notFound } from "next/navigation";
import { Metadata } from "next";
import { avatars } from "@/app/lib/avatars";
import ChatClient from "./ChatClient";

type Props = {
  params: Promise<{ avatarId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const avatar = avatars.find((a) => a.id === resolvedParams.avatarId);

  if (!avatar) {
    return {
      title: "Avatar Not Found | AVA.AI",
    };
  }

  return {
    title: `Chat with ${avatar.character} | AVA.AI Platform`,
    description: avatar.shortDescription,
    metadataBase: new URL("https://ava-ai-five.vercel.app/"),

    openGraph: {
      title: `Chat with ${avatar.character} | AVA.AI Platform`,
      description: `Engage in an interactive conversation with ${
        avatar.character
      }, the ${avatar.name.toLowerCase()}.`,
      url: `/chat/${avatar.id}`,
      images: [
        {
          url: "/og/chat-og.png",
          width: 1200,
          height: 630,
          alt: `An interactive chat session with ${avatar.character}`,
        },
      ],
      type: "website",
    },

    // Twitter-specific metadata for sharing on X
    twitter: {
      card: "summary_large_image",
      title: `Chat with ${avatar.character} | AVA.AI Platform`,
      description: avatar.shortDescription,
      images: ["/og/chat-og.png"],
    },
  };
}

// --- THE NEW SERVER COMPONENT PAGE ---
export default async function ChatPage({ params }: Props) {
  // KEY FIX: Await the params object here as well.
  const resolvedParams = await params;
  const avatar = avatars.find((a) => a.id === resolvedParams.avatarId);

  // If the avatar ID from the URL is invalid, render the 404 page
  if (!avatar) {
    notFound();
  }

  // Determine the mode on the server
  const isDevelopment = process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === "true";

  // Render the Client Component and pass the server-fetched data down as props
  return <ChatClient avatar={avatar} isDevelopment={isDevelopment} />;
}
