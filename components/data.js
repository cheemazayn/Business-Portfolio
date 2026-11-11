export const BRAND = "WebVision";
export const HERO_IMAGE = "hero-removebg-preview.png"; // replace with "/hero.png" (transparent cut-out) when ready

export const HEADLINES = [
  ["WEB TRANSFORMATION", "WITH AI & AUTOMATION"],
  ["FULL STACK WEBSITES", "BUILT TO PERFORM"],
];

export const NAV = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Services", "#services"],
  ["Contact", "#contact"],
];

/* Client logos. Order of use: /public/clients/<key>.png  ->  `logo` URL  ->  favicon + name.
   tile: "dark" or "light" = background of the logo card (use "dark" for white logos, "light" for dark logos).
   Without `tile`, local files are auto-detected and remote ones default to "light". */
export const CLIENTS = [
  { key: "page", name: "PAGE Foundation", domain: "page.org.pk", tile: "dark",
    logo: "https://page.org.pk/wp-content/uploads/2025/12/cropped-PAGE-Foundation_Logo_White-scaled-1.png",
    icon: "https://page.org.pk/wp-content/uploads/2025/12/cropped-PAGE-Foundation_Icon-270x270.png" },
  { key: "alight", name: "ALIGHT", domain: "wearealight.org",
    logo: "https://cdn.prod.website-files.com/662a334dd85033d581d0b33e/66587cb6d43bc546a515f7ba_Alight_Logo.svg" },
  { key: "afghanthrive", name: "Afghan Thrive", domain: "afghanthrive.org",
    logo: "https://afghanthrive.org/wp-content/uploads/2024/12/Afghan-Thrive-Logo-1.png",
    icon: "https://afghanthrive.org/wp-content/uploads/2024/12/cropped-Afghan-Logo-01-1-270x270.png" },
  { key: "sbg", name: "Southeast Business Group", domain: "sbgsite.com" },
  { key: "muslimfunders", name: "Muslim Funders", domain: "muslimfunders.org" },
  { key: "globaldonors", name: "Global Donors Forum", domain: "globaldonors.us" },
];

export const SERVICES = [
  { icon: "stack", img: "/services/fullstack.svg", title: "Full Stack Development", photo: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&h=1000&q=70", text: "End-to-end web applications, from database and API to a polished interface, shipped as one product." },
  { icon: "layout", img: "/services/frontend.svg", title: "Frontend Development", photo: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&h=1000&q=70", text: "Fast, responsive, pixel-accurate interfaces built with React and Next.js, designed mobile first." },
  { icon: "server", img: "/services/backend.svg", title: "Backend & APIs", photo: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&h=1000&q=70", text: "Secure Node.js services, REST APIs, authentication and databases that scale with your business." },
  { icon: "refresh", img: "/services/transform.svg", title: "Website Transformation", photo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=1000&q=70", text: "We turn outdated websites into modern, fast and user-friendly experiences without losing your brand." },
  { icon: "ai", img: "/services/ai.svg", title: "AI Integration & Automation", photo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&h=1000&q=70", text: "AI chatbots, LLM-powered features and workflow automation that save hours and engage visitors." },
  { icon: "wrench", img: "/services/maintenance.svg", title: "Website Maintenance", photo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&h=1000&q=70", text: "Updates, fixes, security, speed tuning and content changes so your site stays accurate and online." },
];

export const POINTS = [
  { icon: "ai", title: "AI-ready websites",
    short: "Chatbots and smart features added where they actually help your visitors.",
    heading: "AI-READY WEBSITES THAT WORK 24/7",
    text: "We add AI chatbots and smart features to your site so visitors get instant answers, leads are captured automatically and your team saves hours every week.",
    bullets: ["AI chatbots trained on your own content", "Automated lead capture and email follow-ups", "Workflow automation across your tools"] },
  { icon: "bolt", title: "Built for speed",
    short: "Clean code and optimized assets for top performance on every device.",
    heading: "BUILT FOR SPEED ON EVERY DEVICE",
    text: "Clean code, optimized images and modern frameworks like Next.js make your site load quickly, rank better and keep visitors from leaving.",
    bullets: ["Mobile-first, fully responsive builds", "Performance and Core Web Vitals tuning", "Basic SEO set up from day one"] },
  { icon: "layout", title: "Clean, modern design",
    short: "Minimal, professional interfaces that make your brand look its best.",
    heading: "CLEAN, MODERN DESIGN THAT BUILDS TRUST",
    text: "Minimal, professional interfaces that explain what you do in seconds and make your brand look as credible as it is.",
    bullets: ["Layouts matched to your brand guidelines", "Reusable, consistent components", "Clear calls to action that convert"] },
  { icon: "shield", title: "Ongoing support",
    short: "We stay after launch with maintenance, monitoring and improvements.",
    heading: "SUPPORT THAT CONTINUES AFTER LAUNCH",
    text: "We stay with you after the site goes live: content updates, fixes, security checks and improvements, so nothing slowly falls out of date.",
    bullets: ["Content and page updates on request", "Bug fixes, security and backups", "Monthly improvements and monitoring"] },
];

export const PROCESS = [
  { title: "Discover", text: "We learn your goals, your audience and what is holding your current site back." },
  { title: "Design", text: "Clean, minimal layouts that match your brand, planned mobile first." },
  { title: "Build", text: "Full stack development with Next.js, Node.js and AI features where they help." },
  { title: "Launch & Support", text: "Testing, launch, then maintenance and steady improvements." },
];

export const TECH = ["Next.js", "React", "Node.js", "Express", "MongoDB", "WordPress", "Tailwind CSS", "OpenAI", "Claude", "Automation"];

export const SUGGESTIONS = [
  "What services do you offer?",
  "Can you modernize my old website?",
  "How can AI help my website?",
  "Do you provide maintenance?",
];
