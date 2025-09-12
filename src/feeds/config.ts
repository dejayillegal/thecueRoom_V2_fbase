
import type { FeedSource } from "./types";

export const FEEDS: FeedSource[] = [
  // --- Music / India
  { name: "Wild City", url: "https://wildcity.in/feed", category: "Music", region: "India" },
  { name: "Rolling Stone India (Dance/Electronic)", url: "https://rollingstoneindia.com/music/feed/", category: "Music", region: "India" },
  { name: "Homegrown", url: "https://homegrown.co.in/feed", category: "Music", region: "India" },

  // --- Music / Global
  { name: "Resident Advisor (News)", url: "https://ra.co/news", category: "Global Underground", region: "Global" }, // HTML (no RSS)
  { name: "Mixmag", url: "https://mixmag.net/rss", category: "Music", region: "Global" },
  { name: "DJ Mag", url: "https://djmag.com/rss.xml", category: "Music", region: "Global" },
  { name: "FACT", url: "https://www.factmag.com/feed/", category: "Music", region: "Global" },
  { name: "XLR8R", url: "https://xlr8r.com/feed/", category: "Music", region: "Global" },
  { name: "Electronic Beats", url: "https://www.electronicbeats.net/feed/", category: "Music", region: "Global" },

  // --- Music / Europe
  { name: "Crack Magazine", url: "https://crackmagazine.net/feed/", category: "Music", region: "Europe" },
  { name: "Groove Magazine", url: "https://groove.de/feed/", category: "Music", region: "Europe" },

  // --- Industry / Global
  { name: "Attack Magazine", url: "https://www.attackmagazine.com/feed/", category: "Industry", region: "Global" },
  { name: "CDM", url: "https://cdm.link/feed/", category: "Industry", region: "Global" },
  { name: "MusicTech", url: "https://musictech.com/feed/", category: "Industry", region: "Global" },
  { name: "Magnetic Magazine", url: "https://www.magneticmag.com/feed/", category: "Industry", region: "Global" },
  { name: "Beatportal", url: "https://www.beatportal.com/feed/", category: "Industry", region: "Global" },

  // --- Guides / Global
  { name: "Ableton Blog", url: "https://www.ableton.com/en/blog/feed/", category: "Guides", region: "Global" },
  { name: "Native Instruments Blog", url: "https://blog.native-instruments.com/feed/", category: "Guides", region: "Global" },
  { name: "Bandcamp Daily", url: "https://daily.bandcamp.com/feed/", category: "Guides", region: "Global" },
];

export const MAX_PER_SOURCE = 10;           // per spec
export const FETCH_TIMEOUT_MS = 6000;       // keep it snappy
export const STALE_MS = 1000 * 60 * 30;     // 30 minutes cache
