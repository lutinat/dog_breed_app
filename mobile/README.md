# Dog Breed Classifier - Mobile App

This README covers only the `mobile/` folder (the React Native + Expo app).
For overall project context, see `CLAUDE.md` and `docs/plan.md` at the repo root.

## Overview

Built with React Native + Expo (TypeScript), using Expo Router for file-based
navigation. Current flow: Scan → Crop → Result (take/pick a photo, drag a bounding
box over the dog, get a breed prediction from the backend).

Pinned to **Expo SDK 54** to match the Expo Go app version installed on the test
device (54.0.8) — don't bump the Expo SDK without checking Expo Go supports it first,
mismatched versions block the QR code from opening the project at all.

## Project Structure

```
mobile/
├── src/
│   └── app/
│       ├── _layout.tsx   # Root navigation stack (wraps GestureHandlerRootView)
│       ├── index.tsx     # Scan screen: camera/gallery picker
│       ├── crop.tsx      # Crop screen: draggable/resizable bounding box
│       └── result.tsx    # Result screen: uploads cropped image, shows predictions
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
work from a physical device in Expo Go. Create `mobile/.env`:

```
EXPO_PUBLIC_API_URL=http://<your-lan-ip>:8000
```

See [`../backend/README.md`](../backend/README.md) for how to start the backend with
`--host 0.0.0.0` so it's reachable on the LAN.

**Dev machine is WSL2 (current setup)**: we tried WSL2 mirrored networking first, but
it caused routing issues, so we went back to the default NAT mode instead. What
actually works:

- Backend and Expo both run inside WSL as normal.
- Find the **Windows** host's LAN IP (`ipconfig` on Windows, the Wi-Fi/Ethernet
  adapter's IPv4 — in this setup it's `192.168.1.18`), not WSL's own `hostname -I`
  address.
- Start Expo with that IP forced as the packager hostname, so the QR code advertises
  the Windows IP instead of WSL's internal one:
  ```bash
  REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.18 npx expo start --host lan
  ```
- Set `mobile/.env` to `EXPO_PUBLIC_API_URL=http://192.168.1.18:8000`.
- The phone reaches both Metro (`:8081`) and the backend (`:8000`) through that same
  Windows IP.

If the LAN IP changes (different network, router reassigns it), update both the
`REACT_NATIVE_PACKAGER_HOSTNAME` value and `mobile/.env` to match.

### Run

```bash
npx expo start
```

Open with Expo Go on a physical device (scan the QR code), an iOS simulator, an
Android emulator, or a web browser.

## Current screens

- `src/app/index.tsx` — "Take Photo" / "Choose from Gallery" (via `expo-image-picker`),
  then pushes to `/crop` with the picked image URI.
- `src/app/crop.tsx` — drag the box to move it, drag a corner to resize it, then
  "Confirm Crop" runs `expo-image-manipulator` and pushes to `/result` with the
  cropped URI.
- `src/app/result.tsx` — uploads the cropped image to the backend's `POST /predict`
  automatically on mount, lists the top-3 breed predictions with their match score.

No styling beyond plain React Native components yet — see `docs/roadmap.md` for
what's next.

## Backend Communication

The mobile app talks to the FastAPI backend (`/backend`) over plain HTTP — see
[`../backend/README.md`](../backend/README.md) for the API contract.
