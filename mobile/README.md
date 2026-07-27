# Dog Breed Classifier - Mobile App

This README covers only the `mobile/` folder (the React Native + Expo app).
For overall project context, see `CLAUDE.md` and `docs/plan.md` at the repo root.

## Overview

Built with React Native + Expo (TypeScript), using Expo Router for file-based
navigation. Currently a single screen: take or pick a photo of a dog and get a
breed prediction from the backend.

## Project Structure

```
mobile/
├── src/
│   └── app/
│       ├── _layout.tsx   # Root navigation stack
│       └── index.tsx     # Scan screen: camera/gallery picker + prediction results
├── assets/                # Icons, splash screen
├── package.json
├── app.json               # Expo config (name, icons, permissions)
└── README.md
```

Only screens/layout files go in `src/app/` (Expo Router convention); everything else
(components, hooks, utils) should go elsewhere under `src/` as the app grows.

## Getting Started

```bash
cd mobile
npm install
```

### Point the app at the backend

The backend needs to be reachable from your phone over the LAN — `localhost` won't
work from a physical device in Expo Go. Find your dev machine's LAN IP
(`hostname -I` on Linux) and create `mobile/.env`:

```
EXPO_PUBLIC_API_URL=http://<your-lan-ip>:8000
```

See [`../backend/README.md`](../backend/README.md) for how to start the backend with
`--host 0.0.0.0` so it's reachable on the LAN.

**If your dev machine is WSL2**: WSL2's default NAT networking gives it an IP
(`hostname -I`, e.g. `172.x.x.x`) that's only reachable from Windows, not from other
devices on your LAN like your phone — using it in `EXPO_PUBLIC_API_URL` will fail
with "Failed to fetch" from a physical device even though the backend works fine on
`localhost` from the same PC. Fix: enable WSL2 **mirrored networking** — add to
`C:\Users\<you>\.wslconfig`:
```ini
[wsl2]
networkingMode=mirrored
```
then run `wsl --shutdown` from PowerShell (not from inside WSL) and reopen your WSL
terminal. After that, `hostname -I` inside WSL returns an IP reachable from your LAN
— use that in `.env`. Requires Windows 11 22H2+ / WSL 2.0+. If your phone still can't
connect after this, check Windows Firewall isn't blocking inbound port 8000.

### Run

```bash
npx expo start
```

Open with Expo Go on a physical device (scan the QR code), an iOS simulator, an
Android emulator, or a web browser.

## Current screen

`src/app/index.tsx` — "Take Photo" / "Choose from Gallery" buttons (via
`expo-image-picker`), uploads the picked image to the backend's `POST /predict`, and
lists the top-3 breed predictions with their match score. No manual crop step yet,
no styling beyond plain React Native components — see `docs/roadmap.md` for what's
next.

## Backend Communication

The mobile app talks to the FastAPI backend (`/backend`) over plain HTTP — see
[`../backend/README.md`](../backend/README.md) for the API contract.
