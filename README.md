# Pulse — MERN Fitness Tracker

A full MERN-stack fitness tracker with:
- **Auth**: Email/password (JWT) + **Google Sign-In**
- **Database**: MongoDB Atlas (cloud cluster)
- **UI**: React + Material UI (MUI), custom theme
- **AI Coach**: Free-tier **Google Gemini API** for personalized tips
- Dashboard with charts, workout logging, goals & profile

```
fitness-tracker/
├── backend/     Express + Mongoose API
└── frontend/    React + MUI app
```

---

## 1. Prerequisites
- Node.js 18+ and npm
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account
- A [Google Cloud](https://console.cloud.google.com/) account (for Google Sign-In)
- A free [Google AI Studio](https://aistudio.google.com/app/apikey) API key (for the AI Coach)

> **Important — about credentials:** I can't generate API keys or OAuth credentials for you (they're tied to your own Google/MongoDB accounts and billing). The steps below show exactly where to create each one yourself using **harshkumarsingh994@gmail.com** (or whichever account you prefer) — it only takes a few minutes and everything on the free tier.

---

## 2. Set up MongoDB Atlas (your database cluster)
1. Go to https://www.mongodb.com/cloud/atlas/register and sign up/log in.
2. Create a **free M0 cluster** (any provider/region close to you).
3. Under **Database Access**, create a database user with a username/password.
4. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) for development.
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Add a database name before the `?`, e.g. `.../fitness-tracker?retryWrites=...`
7. Paste this into `backend/.env` as `MONGO_URI`.

## 3. Set up Google Sign-In
1. Go to https://console.cloud.google.com/apis/credentials (log in with harshkumarsingh994@gmail.com).
2. Create a new project (e.g. "Pulse Fitness Tracker").
3. Click **Create Credentials → OAuth client ID**.
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: not required for this flow
4. Copy the **Client ID**.
5. Put it in:
   - `backend/.env` → `GOOGLE_CLIENT_ID`
   - `frontend/.env` → `REACT_APP_GOOGLE_CLIENT_ID`
6. You may also need to configure the **OAuth consent screen** (External, add your email as a test user) before it works.

## 4. Set up the free AI Coach (Gemini)
1. Go to https://aistudio.google.com/app/apikey (log in with your Google account).
2. Click **Create API key** — it's free with generous daily limits.
3. Put it in `backend/.env` → `GEMINI_API_KEY`.
   - If you skip this, the app still works — the coach will just show a setup reminder instead of tips.

## 5. Run the backend
```bash
cd backend
cp .env.example .env      # then fill in the values from steps 2-4
npm install
npm run dev                # starts on http://localhost:5000
```

## 6. Run the frontend
```bash
cd frontend
cp .env.example .env       # fill in REACT_APP_GOOGLE_CLIENT_ID
npm install
npm start                  # starts on http://localhost:3000
```

Open http://localhost:3000 — sign up with email or Google, then start logging workouts.

---

## Features included
- **Signup / Login** with hashed passwords (bcrypt) + JWT sessions
- **Google Sign-In** (One Tap / button) — verified server-side with `google-auth-library`
- **Dashboard**: today's calories/steps/water/active-time vs. your goals, 7-day chart, AI tip of the day
- **Workouts**: log runs, cycling, strength, yoga, etc. with duration/calories/distance/steps/water; delete anytime
- **AI Coach**: chat with an AI that knows your profile and recent workouts (Gemini free tier)
- **Profile**: edit personal details and daily goals (steps, calories, water)

## Notes on going to production
- Swap `MONGO_URI` network access `0.0.0.0/0` for specific IPs.
- Set a strong random `JWT_SECRET`.
- Set `CLIENT_URL` (backend) and `REACT_APP_API_URL` (frontend) to your deployed URLs.
- Add your production domain to the Google OAuth "Authorized JavaScript origins".
