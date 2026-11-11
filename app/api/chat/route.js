import { BRAND } from "../../../components/data";

export const runtime = "nodejs";

const SYSTEM = `You are the AI assistant on the website of ${BRAND}, a web development and website transformation business.
Answer questions about the business clearly, warmly and concisely (under 110 words unless asked for detail). Use plain text only: no markdown symbols, no headings, no asterisks. Short paragraphs or simple lines starting with "-" are fine.

Services offered:
1. Full Stack Development: complete web apps with Next.js, React, Node.js, Express and MongoDB, from database and API to interface.
2. Frontend Development: fast, responsive, mobile-first interfaces with React, Next.js, Tailwind CSS; pixel-accurate from design.
3. Backend & APIs: Node.js services, REST APIs, authentication, CRUD, databases and third-party API integrations.
4. Website Transformation: redesigning and modernizing outdated websites into fast, user-friendly, mobile-first ones while keeping the brand; includes migration from legacy sites and speed optimization.
5. AI Integration & Automation: AI chatbots, LLM API integration (OpenAI, Claude, Gemini), AI-powered website features, workflow and task automation, prompt engineering.
6. Website Maintenance: updates, content changes, bug fixes, security, backups, speed tuning and ongoing support. Also WordPress and Elementor work, custom themes and plugin configuration.

The business has worked with 10+ clients, including NGOs, foundations and businesses.
Rules: Do not invent prices, timelines or guarantees; say pricing depends on scope and invite the visitor to use the "Plan your project" tool or the "Start your project" contact form on this page. Do not share any personal phone numbers or email addresses. Stay on topic (the business, its services, web and AI topics related to them); politely steer other questions back. If unsure, say so and suggest the contact form.`;

const LOCAL = [
  [/(price|cost|quote|budget|rate|how much)/i, "Pricing depends on the scope of your project, so there is no fixed rate. Use the Plan Your Project tool or the contact form on this page and you will get a clear proposal."],
  [/(maintain|maintenance|support|update|fix|bug|security)/i, "Yes. Website maintenance covers content updates, bug fixes, security, backups, speed tuning and ongoing improvements, so your site stays accurate and online after launch."],
  [/(moderni|redesign|old|outdated|transform|revamp|migrat)/i, "Website Transformation turns an outdated site into a fast, clean, mobile-first one while keeping your brand. That includes redesign, migration from legacy platforms, speed optimization and, if you like, AI features and automation."],
  [/(ai|chatbot|bot|automat|llm|gpt|claude|gemini)/i, "AI Integration & Automation adds AI chatbots, LLM-powered features and workflow automation to your site. Visitors get instant answers and your team saves time on repetitive work."],
  [/(full.?stack|mern|web app|application)/i, "Full Stack Development covers everything: database, backend APIs and a polished frontend, built with Next.js, React, Node.js and MongoDB."],
  [/(front.?end|react|next|design|responsive|ui|ux)/i, "Frontend Development means fast, responsive, pixel-accurate interfaces built with React, Next.js and Tailwind CSS, designed mobile first."],
  [/(back.?end|api|database|node|server|auth)/i, "Backend & APIs: secure Node.js services, REST APIs, authentication, databases and third-party integrations that scale with your business."],
  [/(wordpress|elementor|cms|theme|plugin)/i, "We build and maintain WordPress sites too, including custom themes, Elementor pages and plugin setup."],
  [/(service|offer|do you|what can|help)/i, "We offer six services: Full Stack Development, Frontend Development, Backend & APIs, Website Transformation, AI Integration & Automation, and Website Maintenance. Ask about any of them for details."],
  [/(hi|hello|hey|salam)/i, "Hello! I can tell you about our services or how AI can improve your website. What would you like to know?"],
];

function local(text) {
  for (const [re, ans] of LOCAL) if (re.test(text)) return ans;
  return "I can help with questions about our services: full stack, frontend, backend, website transformation, AI integration and maintenance. For anything specific to your project, use the Plan Your Project tool or the contact form on this page.";
}

export async function POST(req) {
  let last = "";
  try {
    const { messages } = await req.json();
    let clean = (Array.isArray(messages) ? messages : [])
      .slice(-12)
      .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content || "").slice(0, 1500) }))
      .filter((m) => m.content.trim());
    while (clean.length && clean[0].role !== "user") clean.shift();
    if (!clean.length) return Response.json({ reply: "Ask me anything about our services." });
    last = clean[clean.length - 1].content;

    const key = process.env.GEMINI_API_KEY;
    if (!key) return Response.json({ reply: local(last), source: "local" });

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const body = {
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: clean.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      generationConfig: { maxOutputTokens: 700, temperature: 0.6 },
    };
    if (/flash/i.test(model) && /2\.5/.test(model)) body.generationConfig.thinkingConfig = { thinkingBudget: 0 };

    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      console.error("Gemini API error:", r.status, await r.text());
      return Response.json({ reply: local(last), source: "local" });
    }
    const j = await r.json();
    const reply = (j.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("").replace(/\*\*/g, "").trim();
    if (!reply) console.error("Gemini returned no text:", JSON.stringify(j).slice(0, 400));
    return Response.json({ reply: reply || local(last), source: reply ? "ai" : "local" });
  } catch (e) {
    console.error("Chat route error:", e);
    return Response.json({ reply: last ? local(last) : "I am having trouble right now. Please use the contact form on this page." });
  }
}
