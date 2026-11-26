# Nexora

Frontend-only social networking app. React + Vite + Tailwind CSS + React Router + Lucide. All data lives in LocalStorage (key `nexora_v1`).

## Run

    npm install
    npm run dev

Open the URL Vite prints (usually http://localhost:5173).

## Demo account

    Email:    demo@nexora.app
    Password: Demo@1234

You can also register a new account. Settings > Session and data > Restore demo data resets everything.

## Notes

- Avatars and sample photos load from i.pravatar.cc and picsum.photos. Offline, they fall back to initials and neutral placeholders. Photos you upload yourself are stored locally.
- Tailwind v3 is used (see tailwind.config.js and postcss.config.js).
