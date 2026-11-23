/** the one-page resume in public/, linked from the nav, hero and footer */
export const RESUME_URL = "/Ankit-Kumar-Pandey-Resume.pdf";

export const navItems = [
  { name: "About", link: "#about" },
  { name: "Projects", link: "#projects" },
  { name: "Tech", link: "#technologies" },
  { name: "Contact", link: "#contact" },
  { name: "Resume", link: RESUME_URL },
];

export const gridItems = [
  {
    id: 1,
    title: "Eager to turn ‘what if’ into ‘what’s next’!",
    description: "",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
    imgClassName: "w-full h-full",
    titleClassName: "justify-end",
    img: "",
    spareImg: "",
  },
  {
    id: 2,
    title: "I'm very flexible with time zone communications",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title: "My tech stack",
    description: "I constantly try to improve",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title: "Tech enthusiast with a passion for development.",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/grid.webp",
    spareImg: "/b4.svg",
  },

  {
    id: 5,
    title: "Currently contributing to open source and building on Solana",
    description: "The Inside Scoop",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "/b5.webp",
    spareImg: "/grid.webp",
  },
  {
    id: 6,
    title: "Do you want to start a project together?",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    img: "",
    spareImg: "",
  },
];

export const projects = [
  {
    id: 1,
    title: "WalletChat — every transaction, made transparent",
    des: "An agentic wallet and cross-chain transaction verifier for Solana, Ethereum, and Bitcoin. State an intent in plain English; the agent plans it, simulates it against live chain state, and prints a verification slip with the exact balance diff — nothing signs until the guardrails pass and you arm it.",
    img: "/walletchat.webp",
    iconLists: ["/next.svg", "/ts.svg", "/tail.svg"],
    link: "https://wallet-chat-x.vercel.app",
    github: "https://github.com/iota-x/wallet-chat",
  },
  {
    id: 2,
    title: "Heartbeat — Solana mainnet, live in 3D",
    des: "Every light is a real transaction streaming off Solana mainnet. A websocket ingest service classifies every block; whale transfers land as golden comets with camera shake and synthesized bass. 60fps, 9 draw calls, zero allocations per frame.",
    img: "/heartbeat.webp",
    video: "/heartbeat-demo.mp4",
    iconLists: ["/next.svg", "/ts.svg", "/tail.svg", "/three.svg"],
    link: "https://heartbeat-solana.vercel.app/",
    github: "https://github.com/iota-x/heartbeat",
  },
  {
    id: 3,
    title: "Naruto Botto Helper — Discord reminders, 24/7",
    des: "A companion bot for the Discord game Naruto Botto, running 24/7 for 44 players: 100,000+ cooldown reminders in its first eight weeks. A reminder only arms once the game confirms the command actually ran, so maintenance and errors never leave a ghost ping; timings correct themselves from the game's own replies through a three-tier authority model, where a time the game states overrides one the bot derived or guessed; and timers re-check the wall clock before firing, so a suspended process can never ping early. It also tracks XP, feed routines, dailies and the economy, with 94,000+ XP events logged.",
    img: "/nbhelper.webp",
    iconLists: ["/node.svg", "/mongo.svg", "/git.svg"],
    link: "https://discord.com/oauth2/authorize?client_id=972546929194061956",
    github: "https://github.com/iota-x/naruto-botto-helper",
  },
  {
    id: 4,
    title: "Pulsar — on-chain automation for Solana",
    des: "A web3 'Zapier' for Solana that automates both on-chain and off-chain workflows — IF this happens → THEN do that. Triggers range from wallet deposits, balance thresholds, token swaps and NFT transfers to scheduled times and plain API calls, while actions span webhooks, Discord/email alerts, on-chain SPL token ops, staking, Jupiter swaps, liquidity-pool creation and stop-loss orders. A smart delegation system keeps it running 24/7 without ever giving up custody of your keys.",
    img: "/pulsar.webp",
    iconLists: ["/next.svg", "/ts.svg", "/tail.svg", "/three.svg", "/fm.svg"],
    link: "https://pulsar-sol.vercel.app/",
    github: "https://github.com/iota-x/pulsar",
  },
  {
    id: 5,
    title: "Overshare — a menu-bar app that tells on you, lovingly",
    des: "A cross-platform desktop app that watches what you're doing — app, file, browser tab, the song behind it — turns it into a warm one-liner, and sends it to your partner over Discord or Telegram. Ships as a self-contained .dmg and .exe, built on separate macOS and Windows CI runners because PyInstaller can't cross-compile. The Qt settings window runs in its own process — Qt can't share an event loop with the menu-bar host — and the two talk through a config file the app re-reads live, so nothing needs restarting.",
    img: "/overshare.webp",
    iconLists: ["/py.svg", "/qt.svg", "/git.svg"],
    link: "https://iota-x.github.io/overshare/",
    github: "https://github.com/iota-x/overshare",
  },
  {
    id: 6,
    title: "Awake — keep your Mac awake, lid shut or open",
    des: "A native macOS menu-bar app, built because the paid one wanted $9. Timed, until-a-time or unlimited sessions over IOKit power assertions, plus a closed-lid mode that needs root: a one-time sudoers rule scoped to exactly two pmset commands, and a detached watchdog that puts sleep back if the app quits or crashes. Charger, battery and thermal safeguards, a SwiftUI popover that falls back to a window when the notch hides the icon, and a universal Apple-silicon + Intel build compiled straight with swiftc.",
    img: "/awake.webp",
    iconLists: ["/swift.svg", "/git.svg"],
    link: "https://github.com/iota-x/awake/releases/latest",
    github: "https://github.com/iota-x/awake",
  },
  {
    id: 7,
    title: "Us — native Android widgets + end-to-end encryption",
    des: "A private space for two, on Android and the web. Twelve home-screen widgets rendered as native RemoteViews — a live day counter, streaks, moods, a shared whiteboard — plus end-to-end encrypted journals with recovery keys and realtime sync over SSE. Built with React Native and Expo, including a patched native module so every widget lays out against the size the launcher actually draws rather than the larger one it reports.",
    img: "/app-local.webp",
    iconLists: ["/re.svg", "/ts.svg", "/next.svg", "/tail.svg"],
    link: "https://wearesocuteomg.vercel.app/",
    github: "https://github.com/iota-x/digital-library",
  },
  {
    id: 8,
    title: "NFT Library",
    des: "A full NFT marketplace on Solana showing NFTs owned by a user and trending collections. Connect a wallet or enter an address to explore the whole collection and past records, and even search an asset by its ID.",
    img: "/nft-library.webp",
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/fm.svg"],
    link: "https://nft-library-solana.vercel.app/",
    github: "https://github.com/iota-x/nft-library",
  },
];

/** merged upstream contributions — only add a PR once it is merged and verified on GitHub */
export const contributions = [
  {
    org: "Open Healthcare Network",
    project: "CARE",
    blurb: "an open-source hospital EMR",
    title: "Show “No data available” on empty observation charts in the Plots tab",
    des: "Found and reported the bug myself (#16966): empty observation charts rendered blank axes because the empty check only looked at the whole response. Fixed it per chart and added a Playwright test that covers mixed empty and filled charts.",
    pr: "ohcnetwork/care_fe #16967",
    link: "https://github.com/ohcnetwork/care_fe/pull/16967",
    merged: "Nov 2026",
    diff: "+193 −51",
    tech: ["React", "TypeScript", "Playwright"],
  },
];

/** my own projects released under an open-source licence */
export const maintained = [
  { name: "Awake", des: "macOS menu-bar keep-awake app", license: "MIT", link: "https://github.com/iota-x/awake" },
  { name: "Overshare", des: "cross-platform activity-sharing desktop app", license: "MIT", link: "https://github.com/iota-x/overshare" },
];

export const socialMedia = [
  {
    id: 1,
    img: "/git.svg",
    link: "https://github.com/iota-x",
  },
  {
    id: 2,
    img: "/twit.svg",
    link: "https://x.com/iota_xx",
  },
];
