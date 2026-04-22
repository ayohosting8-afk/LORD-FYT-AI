# LORD-FYT AI

A fancy web AI chat app powered by **Groq**. Built with Node.js + Express and a single-page vanilla JS frontend.

## Deploy to Render (via GitHub)

1. Create a new GitHub repository and upload **all files** from this zip into the **root** of the repo (no parent folder).
2. Go to [render.com](https://render.com) → **New +** → **Web Service** → connect your GitHub repo.
3. Configure the service:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. (Optional) Override the built-in API key by adding env var `GROQ_API_KEY`.
5. (Optional) Add `MODEL` env var (default: `llama-3.1-8b-instant`).
6. Click **Create Web Service**. Done — your LORD-FYT AI is live!

## Run Locally

```bash
npm install
GROQ_API_KEY=your_key_here npm start
```

Then open http://localhost:3000

## Files

- `server.js` — Express server + Groq API proxy
- `index.html` — chat UI
- `style.css` — fancy glassmorphism theme
- `script.js` — frontend chat logic
- `package.json` — dependencies
