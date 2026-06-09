# RETREIVE 🚀 — AI-Powered Active Reading Platform for MCAT

**RETREIVE** is a gamified, active learning web application designed to help medical students master MCAT science concepts. Instead of passive reading or highlighting, RETREIVE leverages the **production effect** (vocalizing study material) to dramatically increase long-term memory encoding and recall.

---

## ✨ Features

- 🎤 **Karaoke Reader**: Speech-to-text integration (via Deepgram) highlights text in real-time as you read aloud, keeping you actively engaged.
- 🧠 **Adaptive Quizzes**: AI-generated MCQs pause you at critical study junctures to test active retention of what you spoke.
- 🏆 **Gamified Progress**: Earn XP, level up (from Rookie to Elite), maintain streaks, and climb the Med-School Leaderboard.
- 3D Mascot Interactions: Interactive animated mascot showing emotions based on study performance.
- 🔒 **Secure Authentication**: Next.js middleware-protected route architecture powered by Firebase Auth, supporting email/password, phone, and Google OAuth.
- 💳 **Stripe Subscription Tier**: Unlock unlimited uploads and features with Stripe checkout.

---

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS & Vanilla CSS (Duolingo-style 3D buttons)
- **Language**: TypeScript
- **Database & Auth**: Firebase + Firestore
- **State Management**: Zustand & React Context
- **APIs**: Deepgram (Speech Recognition), Stripe (Billing/Subscription)
- **Animations**: Framer Motion

---

## 🚀 Getting Started

### 1. Install Dependencies
Navigate to the `retrieve` subdirectory and install the required npm packages:
```bash
cd retrieve
npm install
```

### 2. Configure Environment Variables
Copy `.env.local.example` to create your local environment file:
```bash
cp .env.local.example .env.local
```
Configure your credentials in `.env.local`:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# APIs
DEEPGRAM_API_KEY=your_deepgram_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Run the Development Server
Start the local Next.js dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment to Vercel

RETREIVE is optimized for Vercel serverless environment:

1. Import the repository in your **[Vercel Dashboard](https://vercel.com/new)**.
2. Set the **Root Directory** to `retrieve`.
3. Add the environment variables from your `.env.local` file under **Settings** -> **Environment Variables**.
4. Click **Deploy**.

---

## 📄 Repository Structure

```
.
├── retrieve/                # Next.js Application Core
│   ├── public/              # Media assets & static files
│   ├── src/
│   │   ├── app/            # App Router routes (API & Pages)
│   │   │   ├── auth/       # Signin/Signup client flows
│   │   │   ├── dashboard/  # Main study workspace
│   │   │   └── api/        # Serverless API endpoints
│   │   ├── components/     # Reusable UI & Mascot components
│   │   ├── lib/            # Auth & Firestore adapters
│   │   └── types/          # TypeScript definitions
│   └── package.json
├── docs/                    # Technical spec & business rules
└── README.md                # Project entry point documentation
```
