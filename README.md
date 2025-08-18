<div align="center">
  <img src="https://ava-ai-five.vercel.app/og/landing.png" alt="AVA.AI Hero Section" width="850"/>
  <h1>AVA.AI - AI Avatar Platform</h1>
  <p>
    <b>
      A cutting-edge platform for creating and interacting with intelligent, real-time 3D AI assistants,<br />
      brought to life in the browser with Next.js, React Three Fiber, and Google Gemini.
    </b>
  </p>
  <br />
  <a href="https://ava-ai-five.vercel.app/"><strong>View Live Demo »</strong></a>
  <br /><br />
  <a href="#-about-the-project">About</a>
  ·
  <a href="#-key-features">Features</a>
  ·
  <a href="#-architecture-and-data-flow">Architecture</a>
  ·
  <a href="#-tech-stack">Tech Stack</a>
  ·
  <a href="#-getting-started">Getting Started</a>
  ·
  <a href="#-future-scope">Roadmap</a>
</div>

---

## 🚀 About The Project

AVA.AI is an ambitious, scalable, and immersive platform for interacting with specialized 3D AI assistants. Inspired by industry leaders like Soul Machines, our mission transcends text-based chatbots and aims to create emotionally resonant, interactive digital humans.

This project is a comprehensive full-stack showcase, merging modern 3D rendering, advanced state management, real-time AI/TTS integration, and sophisticated, responsive UI/UX. With a cost-free "Demo Mode" (pre-scripted interactions and pre-recorded voice) to showcase its capabilities, AVA.AI redefines interactive digital assistants for a wide range of use cases and platforms.

### Showcase

<table width="100%">
  <tr>
    <td width="50%" align="center">
      <b>Dynamic & Responsive Galleries</b>
      <br /><br />
      <img src="[YOUR_GALLERY_GIF_URL]" alt="Avatar Gallery Showcase" />
    </td>
    <td width="50%" align="center">
      <b>Dual-Mode Chat Experience</b>
      <br /><br />
      <img src="https://ava-ai-five.vercel.app/chat/alex-english-tutor" alt="Live Chat Showcase" />
    </td>
  </tr>
</table>

## ✨ Key Features

- **Real-time Conversational AI:** Live, streaming chat powered by Google Gemini API, orchestrated by a custom `useAvatarChat` hook on top of the Vercel AI SDK.
- **Advanced 3D Animation System:**
  - Full Body Animations with robust state machine: seamless transitions between Idle, Thinking, and randomized Talking.
  - Procedural, natural blinking makes avatars feel alive.
  - AI-Driven Expressions: Emotional signals parsed from the AI's response drive morph-target facial animation.
- **Full-Duplex Voice Interaction:**
  - Text-to-Speech: High-quality, sequential voice output by ElevenLabs API.
  - Audio-Driven Lip-Sync: Real-time lip movement synchronized to streamed TTS audio.
  - Speech-to-Text: Voice input via Web Speech API, intelligently managing state, mute/unmute, and maintaining transcript context.
- **Interactive 3D Hero:** A multi-character, full-screen 3D hero section in React Three Fiber, featuring parallax, neon lighting, and post-processing.
- **Dynamic Avatar Galleries:** Configurable carousels ("Featured"), grid layouts ("Popular"), and modal 3D previews.
- **Sophisticated & Responsive Architecture:**
  - Dual-mode chat: Professional 2-column chat on desktop, fullscreen voice-first experience on mobile.
  - Fast Next.js App Router with performant Server Components and rich, interactive Client Components.
- **Cost-Free "Demo Mode":** Showcases full animation and speech capabilities without live API usage, using pre-recorded content.
- **Polished UX:** 60fps animations, smooth page transitions (Lenis), interactive UI elements (Framer Motion).

## 🏗️ Architecture and Data Flow

The platform leverages a decoupled, modern architecture separating data-fetching/SEO (Server Components) from rich client-side interaction (Client Components). State is centrally managed with Zustand, ensuring reliable coordination between AI responses, audio playback, 3D animation, and UI.

### System Diagram
graph TD
subgraph Browser (Client-Side)
A[UI Components: ChatExperience / DemoExperience] -->|1. User Action| B{useAvatarChat Hook / Local State};
B -->|2. Send Message| C[Backend: /api/chat];
B -->|3. Set "Thinking" State| D[Global State: Zustand];
D -->|4. Update Animation| E[3D Canvas: AvatarCanvas];
C --streams text--> B;
B -->|5. AI Response Finished| D;
D -->|6. Queue Audio| F[Backend: /api/tts];
F --streams audio--> D;
D -->|7. Play Audio & Animate| E;
end
subgraph Server (Vercel Edge)
C --sends prompt--> G[Google Gemini API];
F --sends text--> H[ElevenLabs API];
end


## 🛠️ Tech Stack

| Category             | Technology / Library                                   |
|----------------------|--------------------------------------------------------|
| Framework            | [Next.js](https://nextjs.org/) 14 (App Router)         |
| Language             | [TypeScript](https://www.typescriptlang.org/)          |
| Styling              | [Tailwind CSS](https://tailwindcss.com/)               |
| AI                   | [Google Gemini](https://ai.google.dev/) <br/>via [Vercel AI SDK](https://sdk.vercel.ai/)  |
| Text-to-Speech       | [ElevenLabs](https://elevenlabs.io/)                   |
| 3D Rendering         | [Three.js](https://threejs.org/), [React Three Fiber](https://docs.pmnd.rs/react-three-fiber), [React Drei](https://github.com/pmndrs/drei) |
| 3D Effects           | [@react-three/postprocessing](https://github.com/pmndrs/postprocessing)    |
| Animation            | [Framer Motion](https://www.framer.com/motion/), [Lenis](https://lenis.darkroom.engineering/) |
| State Management     | [Zustand](https://zustand-demo.pmnd.rs/)               |
| Voice Input          | Web Speech API                                         |
| Deployment           | [Vercel](https://vercel.com/)                          |

## 🏁 Getting Started

To get a local copy up and running:

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm**, **yarn**, _or_ **pnpm**

### Installation

1. **Clone the repository:**
    ```
    git clone https://github.com/[YOUR_GITHUB_USERNAME]/ai-avatar-platform.git
    ```
2. **Navigate to the project directory:**
    ```
    cd ai-avatar-platform
    ```
3. **Install dependencies:**
    ```
    npm install
    ```
4. **Set up environment variables:**
    - Create a `.env.local` file at the root.
    - Obtain a free API key from [Google AI Studio](https://aistudio.google.com/) and, optionally, from ElevenLabs for voice.
    - Add keys:
    ```
    GOOGLE_GENERATIVE_AI_API_KEY=YOUR_SECRET_GEMINI_KEY
    ELEVENLABS_API_KEY=YOUR_ELEVENLABS_KEY   # Optional, for voice
    ```
5. **Run the development server:**
    ```
    npm run dev
    ```
6. **Open your browser:**  
   Visit [http://localhost:3000](http://localhost:3000).

## 🔮 Future Scope (Roadmap)

- **Enhanced Speech & Animation:**
  - [ ] Integrate advanced TTS service (e.g., ElevenLabs) for real-time voice in production.
  - [ ] Refine lip-sync by driving animations with precise audio phonemes.
  - [ ] Expand facial and body emotional expression (AI-driven animations).
- **User & Database Integration:**
  - [ ] Add NextAuth.js for authentication.
  - [ ] Connect Vercel Postgres (or similar) to store conversation history.
- **Platform Features:**
  - [ ] Build advanced search and filtering for the avatar gallery.
  - [ ] Develop a "Studio" for avatar personalization (appearance, system prompt, etc.).
- **Voice Input:**
  - [ ] Full Speech-to-Text integration with browser and/or OpenAI Whisper for hands-free chat.

## 👤 Author

[YOUR_NAME]  
- Portfolio: https://amandubey.vercel.app/
- LinkedIn: https://www.linkedin.com/in/profile-amandubey/ 
- GitHub: https://github.com/Amandubey211

---

