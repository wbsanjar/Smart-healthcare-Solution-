# 🏥 NeuroCare Tech — Smart Healthcare Platform

An AI-powered smart healthcare platform built with **React, TypeScript, Vite and Supabase**. It provides real-time emergency support, hospital discovery, ambulance tracking, doctor booking, AI-based health tools, and dedicated dashboards for every stakeholder — patients, doctors, ambulance drivers, hospital admins, and community/ASHA health workers.

---

## ✨ Features

### 🚨 Emergency Services
- One-click **Emergency Request** with symptom selection, severity triage (Low / Medium / High / Critical) and live location capture
- Automatic nearest **hospital assignment** and **ambulance dispatch**
- Real-time **status tracking** (pending → dispatched → en-route) with ETA countdown and live notifications
- First-aid guidance while the patient waits

### 🤖 AI Health Tools
- **AI Assistant Chatbot** — interactive first-aid and health guidance
- **AI Injury Scan** — upload/select an injury and get an instant AI triage result
- **AI Symptom Checker** — step-by-step assessment with follow-up questions
- **AI Report Analyzer** — upload medical reports and get summarized analysis + recommendations

### 🗺️ Hospital & Ambulance
- **Hospital Finder** — interactive Leaflet map with nearby hospitals, specialties, bed availability and emergency capacity
- **Ambulance Tracker** — live map of the active request, driver info, destination hospital and fleet status
- **Doctor Booking** — browse doctors, view schedules and book appointments

### 📁 Personal Health
- **Profile / Health Vault** — medical conditions, allergies, current medications, emergency contact and uploaded health records
- **QR Medical Card** — share your emergency medical data instantly via a QR code
- **Family Alert** — manage emergency contacts and notify family instantly

### 👥 Role-Based Dashboards
| Role | Dashboard |
| --- | --- |
| Patient | Emergency, hospitals, ambulances, doctors, health vault, QR card, more |
| Doctor | Case review, patient vitals, consultations |
| Ambulance Driver | Dispatch alerts, GPS navigation, status updates |
| Hospital Admin | Resource management, ambulance fleet, analytics |
| ASHA / Community Worker | Villager registry, health camps, community tools |

### ⚡ Platform
- **Real-time notifications** (bell + toast) powered by Supabase `postgres_changes`
- **Dark / Light theme** toggle
- **Secure authentication** with Supabase (email/password)
- **Role-based access control** with protected routes
- Fully responsive UI with smooth animations

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, TypeScript, Vite 5 |
| Routing | React Router v7 |
| Styling | Tailwind CSS 3, lucide-react icons |
| Backend / Auth | Supabase (@supabase/supabase-js, @supabase/ssr) |
| Maps | Leaflet + @types/leaflet |
| Linting | ESLint 9, typescript-eslint |
| Language | TypeScript 5.5 |

---

## 📂 Project Structure

```
src/
├── components/          # All feature pages & UI components
│   ├── Dashboard.tsx        # Main app shell (sidebar, header, footer)
│   ├── RoleSelect.tsx       # Role selection screen
│   ├── Auth.tsx             # Sign in / Sign up
│   ├── EmergencyPage.tsx    # Emergency request
│   ├── ChatBot.tsx          # AI health assistant
│   ├── HospitalFinder.tsx   # Hospital discovery + map
│   ├── AmbulanceTracker.tsx # Live ambulance tracking
│   ├── DoctorBooking.tsx    # Doctor appointments
│   ├── InjuryScan.tsx       # AI injury triage
│   ├── SymptomChecker.tsx   # AI symptom assessment
│   ├── HealthVault.tsx      # Personal health records
│   ├── QRCard.tsx           # QR medical card
│   ├── FamilyAlert.tsx      # Emergency contacts + alerts
│   ├── ReportAnalyzer.tsx   # AI report analysis
│   ├── Profile.tsx          # Medical profile
│   ├── DoctorDashboard.tsx        # Doctor panel
│   ├── AdminDashboard.tsx         # Hospital admin panel
│   ├── AmbulanceDriverDashboard.tsx # Driver panel
│   ├── CommunityWorkerDashboard.tsx # ASHA worker panel
│   └── TriageBadge.tsx      # Shared triage UI
├── contexts/
│   ├── AuthContext.tsx       # Authentication state
│   ├── NotificationContext.tsx # In-app notifications & toasts
│   ├── RealtimeContext.tsx   # Supabase realtime subscriptions
│   └── ThemeContext.tsx      # Dark/light theme
├── config/supabase.ts    # Supabase client setup
├── types/database.ts     # Database type definitions
└── App.tsx               # Routing & role-based access control

supabase/migrations/      # Database schema SQL
```

---

## 🗄️ Database Schema

Tables managed by Supabase:
- **profiles** — patient medical profile (blood type, allergies, medications, emergency contact, location)
- **hospitals** — hospital info, specialties, bed & emergency capacity
- **ambulances** — vehicle, driver and live location/status
- **emergency_requests** — patient requests with severity, symptoms, assigned hospital/ambulance, ETA
- **chat_sessions / chat_messages** — AI assistant conversations
- **patient_vitals** — recorded vitals (heart rate, BP, temperature, oxygen)

Apply the migrations under `supabase/migrations/` in your Supabase project to set up the schema.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm
- A [Supabase](https://supabase.com) project (for DB, auth and realtime)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file at the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> ⚠️ Never commit real keys. Use your Supabase project's URL and public anon key.

### 3. Run the app locally

```bash
npm run dev
```

Open **http://localhost:5173** in your browser. You can pick a role and use the **demo sign-in** to explore the platform without an account.

### 4. Build for production

```bash
npm run build
npm run preview
```

---

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

---

## 🔐 Roles & Access

| Role | Allowed Routes |
| --- | --- |
| Patient | `/`, `/chat`, `/hospitals`, `/ambulance`, `/doctors`, `/profile`, `/injury-scan`, `/symptom-checker`, `/health-vault`, `/qr-card`, `/family-alert`, `/report-analyzer` |
| Doctor | `/`, `/doctor-dashboard`, `/hospitals`, `/profile` |
| Ambulance Driver | `/`, `/ambulance-driver`, `/hospitals`, `/profile` |
| Admin | `/`, `/admin-dashboard`, `/hospitals`, `/profile` |
| Community Worker | `/`, `/community-worker`, `/hospitals`, `/profile`, `/chat`, `/injury-scan`, `/symptom-checker`, `/doctors`, `/health-vault` |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

This project is for educational and demonstration purposes. All rights reserved © 2026 NeuroCare Tech.
