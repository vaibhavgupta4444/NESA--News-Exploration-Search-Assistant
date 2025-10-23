## NESA: News & Exploration Search Assistant

NESA is a Next.js app powering a Chrome extension that shows the latest news by category and includes an AI search bar powered by Google Gemini 2.5. The UI is built with Tailwind CSS and lightweight UI primitives. The AI answers are rendered as Markdown for better readability.

### Key features
- AI search bar backed by Gemini 2.5 (text responses rendered as Markdown)
- News feed UI with skeleton loading states
- Dark theme via CSS variables and a `.dark` class
- Next.js App Router APIs for search and news

### Tech stack
- Next.js 16 (App Router) + React 19
- Tailwind CSS v4 (+ optional Typography)
- Google GenAI SDK: `@google/genai`
- UI primitives (button, card, textarea, skeleton) and `lucide-react`

---

## Project structure (high level)

```
app/
	components/
		NEWS.tsx           # News list UI consuming /api/news
		SearchSection.tsx  # AI search bar UI consuming /api/search
	api/
		news/route.ts      # GET: returns 10 news items (AI-generated JSON)
		search/route.ts    # POST: returns Markdown answer for a prompt
	layout.tsx           # App shell
	globals.css          # Tailwind + CSS variables for light/dark themes
```

---

## Getting started

1) Install dependencies
```bash
npm install
```

2) Create environment file
Create `.env.local` in the project root:
```bash
NESA_API_KEY=YOUR_GOOGLE_API_KEY
```

3) Run the dev server
```bash
npm run dev
```
Open http://localhost:3000

---

## Environment variables

- `NESA_API_KEY` — Google GenAI API key used on the server (never expose on the client or in a Chrome extension bundle).

---

## API endpoints

### GET `/api/news`
Returns a JSON payload containing an array of news items.

Response shape:
```ts
type News = {
	url: string;
	headline: string;
	content: string;
	author: string;
	date: string; // ISO string
}

// { news: News[] }
```

Notes:
- The current implementation uses Gemini to generate structured JSON. It does not fetch real-time news from the web. For live news, replace the model call with a news API (e.g., NewsAPI, GNews) and keep the same response shape.

### POST `/api/search`
Body:
```json
{ "prompt": "your question here" }
```

Response:
```json
{ "data": "markdown string" }
```

Notes:
- Responses are Markdown. The UI renders them using `react-markdown` + `remark-gfm`.

---

## Dark theme

This project defines light variables in `:root` and dark overrides under `.dark` in `app/globals.css`.

Use it by toggling the `.dark` class on the root element (recommended on `<html>`):

```tsx
// app/layout.tsx (example)
<html lang="en" className="dark">
	<body>...</body>
</html>
```

Or set it at runtime and persist the preference:

```html
<script>
	const stored = localStorage.getItem('theme');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	if (stored === 'dark' || (!stored && prefersDark)) {
		document.documentElement.classList.add('dark');
	}
	// else leave light
</script>
```

Tailwind dark styles are applied via the custom variant defined in CSS.

---

## Chrome extension usage (high level)

This app can back a Chrome extension popup or options page:
- Keep `NESA_API_KEY` only on the server. Your extension calls these API routes; do not ship secrets in the extension.
- If your extension calls a deployed domain, add that domain under `host_permissions` in your `manifest.json`.
- Consider rate limiting and basic validation on the API routes.

Example client call from the extension to your deployed API:
```ts
const res = await fetch('https://your-domain.com/api/search', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ prompt: 'Summarize today\'s AI news' })
});
const data = await res.json();
```

---

## Notes and limitations
- Gemini cannot browse the web; generated news are examples unless you integrate a real news API.
- Always validate and sanitize user input sent to the model.
- Avoid exposing sensitive data to the client or extension bundle.

---

## Scripts
- `npm run dev` — start the development server
- `npm run build` — production build
- `npm run start` — run the production server
- `npm run lint` — run ESLint

---

## Contributing
Issues and suggestions are welcome. Feel free to open an issue or a PR.

