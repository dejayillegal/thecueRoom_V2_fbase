# **App Name**: thecueRoom v2

## Core Features:

- Realtime Feed: Display posts, comments, and reactions in realtime.
- Creative Meme Generator: Generate memes from a text prompt, entirely on-device, based on deterministic algorithms. Adapters to BYOK environments provided via env.
- Gig Radar: Display Bangalore-only gigs on a map and list, with filtering capabilities.
- Curated News Feed: Display curated news ingested from external sources using an Edge Function; duplicates are eliminated and content is categorized by region.
- Heuristic User Verification Tool: LLM that utilizes input such as provided links + content patterns for user approval, setting 'verification_status' to 'verified' or pending depending on the findings.
- Admin Console: Provides admin functionalities to approve/ban/report queues, verify artists and manage playlists/news.
- Personalized Newsletter: Sends personalized newsletters to users, incorporating jobs and templates with an opt-in mechanism.

## Style Guidelines:

- Primary color: Lime (#D1FF3D) for high contrast and to align with the brand.
- Background color: Dark gray (#0B0B0B) to provide a dark mode aesthetic.
- Accent color: Purple (#873BBF) as an analogous color to the primary to offer a distinct but complementary highlight.
- Body and headline font: 'Inter' (sans-serif) for a modern, neutral look, suitable for both headlines and body text. Note: currently only Google Fonts are supported.
- Code font: 'Source Code Pro' (monospace) for displaying code snippets, as needed. Note: currently only Google Fonts are supported.
- Use minimalistic icons that follow the lime and purple color scheme for a consistent visual experience.
- Subtle transitions and animations to enhance user experience; adheres to prefers-reduced-motion for accessibility.