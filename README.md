# Weather App

A small React + Vite weather app for learning. It fetches current weather and a 5-day forecast from OpenWeatherMap.

## Features
- Search a city and get current weather (temp, description, icon)
- Additional details: feels-like, humidity, wind, sunrise/sunset
- 5-day forecast (grouped from the 3-hour forecast)
- Unit toggle: °C / °F
- Simple tests for utilities (Vitest)

## Setup (local development)

1. Clone the repo and install dependencies:

```powershell
npm install
```

2. Create a local `.env` file in the project root with your OpenWeatherMap API key. Do NOT commit this file.

```text
# .env (project root)
VITE_OPENWEATHER_KEY=your_openweathermap_api_key_here
```

3. Start the dev server:

```powershell
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173 or another port if 5173 is in use).

## Tests

Run unit tests with Vitest:

```powershell
npm test
```

## Deployment

This app is a static frontend and can be deployed to Netlify, Vercel, or similar. Important: do not expose your OpenWeatherMap key in client-side code for production if you need it to be private. For quick deployments you can set the environment variable in the hosting dashboard (Netlify/Vercel) under site settings.

Netlify (quick steps):

1. Push this repository to GitHub.
2. In Netlify, click "New site from Git" and connect your repo.
3. In Site settings → Build & deploy → Environment, add `VITE_OPENWEATHER_KEY` with your key.
4. Build command: `npm run build` and Publish directory: `dist`.

Vercel (quick steps):

1. Import the project in Vercel from GitHub.
2. In Project Settings → Environment Variables, add `VITE_OPENWEATHER_KEY`.
3. Vercel will run the build automatically (build command `npm run build`).

Security note
- For learning and demos, using a client-side key is acceptable, but remember that any key included in frontend code or environment variables for static hosts can be visible to end users. For production where the key must be kept secret, implement a simple server-side proxy or serverless function that stores the API key securely and forwards requests.

## Next steps / ideas
- Add server-side proxy (Express or serverless) so the API key is never exposed to the client.
- Add more tests (component tests with Testing Library).
- Improve UI, animations, and accessibility.

If you want, I can add deployment config files (Netlify `netlify.toml` or Vercel settings) and a tiny serverless proxy example.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
