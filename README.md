# Web Studio – Next.js Business Site

## Run
npm install
cp .env.example .env.local   # then fill SMTP_USER / SMTP_PASS (Gmail App Password)
npm run dev                  # http://localhost:3000

## Customize
- Brand name, services, process cards, headlines, stats: `components/data.js`
- Replace the hero image: put a transparent PNG cut-out at `public/hero.png` and change `HERO_IMAGE` in `components/data.js`
- Replace dummy logos: edit `Logo` in `components/ui.js` (or swap in `<img>`)
- Colors / fonts / spacing: `app/globals.css` (CSS variables at the top)
- Form emails are sent server-side by `app/api/contact/route.js` to CONTACT_TO. The address is never shown on the site.
- Stats such as "20+" are placeholders; edit them to your real numbers.

## Deploy
Vercel: import the repo, add the 3 env vars, deploy.

## Notes
- AI chatbot uses Google Gemini: `app/api/chat/route.js`. Put `GEMINI_API_KEY` in `.env.local` (key from aistudio.google.com/apikey) and restart `npm run dev`. If the API fails, the bot falls back to built-in answers and the real error prints in the terminal.
- Client logos: put PNGs in `public/clients/<key>.png` (see README.txt there). Logo card colors: set `tile: "dark"` or `"light"` per client in `components/data.js`.
- Service card images: `public/services/*.svg` (replace with your own using the same names).
- Contact form emails go to CONTACT_TO via Gmail (server side only).
- Animations use GSAP (`lib/gsap.js`, `components/motion.js`, and `Reveal` in `components/ui.js`). They respect "reduce motion" settings.
- Service photos are Unsplash links in `components/data.js` (`photo:`). If a link fails, the card falls back to the local SVG in `public/services/`. To change a photo, replace the URL.
- Hero image: `HERO_IMAGE` in `components/data.js`. The hero image box has a fixed size so the layout never jumps.
