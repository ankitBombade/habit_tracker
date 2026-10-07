# FocusForge 🚀

**FocusForge** is a premium, high-performance desktop habit tracker, daily routine planner, and study session monitor designed to boost productivity and build lasting habits.

---

## 📁 Project Structure

```text
habit_tracker/
├── 📁 frontend/           # Web UI application (React + Vite + Tailwind + SQLite)
│   ├── 📁 src/            # React source code (components, hooks, db, store, utils)
│   │   ├── 📁 components/ # Categorized UI components (analytics, dashboard, habits, timer, etc.)
│   │   ├── 📁 db/         # Local SQLite persistence repository & setup
│   │   ├── 📁 store/      # Global state management with Zustand
│   │   ├── 📁 types/      # TypeScript interfaces
│   │   └── 📁 utils/      # Helper utilities & export logic
│   ├── 📁 public/         # Static assets (favicons, icons)
│   └── 📄 index.html      # React application entry HTML
├── 📁 desktop/            # Electron Desktop Shell & Main Process
│   ├── 📄 main.cjs        # Main process & native window management
│   └── 📄 preload.js      # Secure IPC bridge
├── 📄 package.json        # Dependencies & build scripts
├── 📄 vite.config.ts      # Vite build configuration
├── 📄 tailwind.config.js  # Tailwind styling system
└── 📄 tsconfig.json       # TypeScript configuration
```

---

## ✨ Features

- 🎯 **Habit Tracking**: Track daily habits, view streaks, and analyze completion rates.
- 📅 **Routine & Schedule Planner**: Create custom daily routines and structured activity schedules.
- ⏱️ **Study & Focus Sessions**: Monitor focus sessions, track planned vs. actual minutes, and grade focus quality.
- 📊 **Daily Reviews & Analytics**: Gain insights into discipline scores, study accuracy, and habit consistency.
- 💾 **Local-First SQLite Storage**: Fast, offline-first data persistence powered by SQLite (`sql.js`).
- ⚡ **Desktop Native**: Built with Electron for a seamless desktop experience across platforms.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **State & Storage**: Zustand, SQLite (`sql.js`), `localStorage`
- **Animations & Visuals**: Framer Motion, Recharts, Canvas Confetti
- **Desktop Framework**: Electron, `electron-builder`

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ankitBombade/habit_tracker.git
   cd habit_tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run in Development Mode:**
   - Web preview:
     ```bash
     npm run dev
     ```
   - Electron desktop app:
     ```bash
     npm run electron:dev
     ```

4. **Build Desktop App (Installer):**
   ```bash
   npm run build:win
   ```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
