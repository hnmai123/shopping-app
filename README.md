# Shopping App

An Expo + Firebase shopping app built using React Native / Expo Router.  
Includes authentication, Firestore, storage, and environment-based configuration.

---

## 📦 Features

- Firebase authentication
- Firestore for product/cart data
- Storage for uploads/images
- Environment-based config (using Expo‑public env vars)
- File-based routing with **expo-router**
- TypeScript support
- Cross-platform: iOS / Android / Web

---

## 🚀 Getting Started

These steps will get you a copy of the project up and running on your local machine.

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase project & credentials
- Expo Go: SDK 53

### Setup

1. Clone this repo  
   ```bash
   git clone https://github.com/hnmai123/shopping-app.git
   cd shopping-app
   ```

2. Install dependencies  
   ```bash
   npm install
   ```

3. Create an `.env.local` file in the project root with your Firebase configuration. It should look like:

   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_FULL_API_KEY_HERE
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
   EXPO_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
   ```

4. Start the app  
   ```bash
   npx expo start --clear
   ```

5. Open in simulator / device / web  
   - Press `i` for iOS simulator  
   - Press `a` for Android emulator  
   - Scan QR code with Expo Go  
   - Press `w` for web preview

---

## 🧰 Folder Structure

Here’s a quick overview of important directories:

```
/
├ firebase/           # Firebase initialization and config
├ app/                # Expo Router routes
├ components/         # Reusable UI components
├ hooks/              # Custom React hooks
├ utils/              # Utility functions
├ styles/             # Styles/themes
├ assets/             # Images, icons, splash etc.
├ tsconfig.json       # TypeScript configuration
├ babel.config.js     # Babel settings & aliasing
└ app.json            # Project and Expo configuration
```

---

## ✔ Common Tasks

| Task | Command |
|------|---------|
| Run app (dev) | `npx expo start --clear` |
| Build web version | `npm run web` or `expo export:web` |
| Build production native apps | Use Expo EAS or appropriate build workflow |
| Lint & format | Add your `lint` or `prettier` scripts if configured |

---

## 🔑 Environment variables

Make sure all required `EXPO_PUBLIC_FIREBASE_*` vars are set. If any are missing or invalid, Firebase initialization will fail (e.g., “Invalid API key”).

---

## 🤝 Contributing

1. Fork the repository  
2. Create your feature branch (`git checkout -b feature/your-feature`)  
3. Commit your changes (`git commit -m "feat: add XYZ"`)  
4. Push to your fork (`git push origin feature/your-feature`)  
5. Open a Pull Request

---

## 📜 License & Acknowledgments

- This project is developed as a demo / student project.  
- Firebase and Expo are used under their respective licenses.
