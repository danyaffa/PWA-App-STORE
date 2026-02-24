# Capacitor Build Guide — SafeLaunch PWA → Native App

This guide covers wrapping the SafeLaunch PWA with [Capacitor](https://capacitorjs.com/) to produce native Android (AAB) and iOS (IPA) builds for submission to Google Play and Apple App Store.

---

## Prerequisites

- Node.js 18+
- npm or yarn
- Android Studio (for Android builds)
- Xcode 15+ (for iOS builds, macOS only)
- An Apple Developer Account ($99/year) for App Store
- A Google Play Developer Account ($25 one-time) for Play Store

---

## 1. Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "SafeLaunch" "com.agentslock.safelaunch" --web-dir dist
```

This creates `capacitor.config.ts` in the project root.

## 2. Add Platforms

```bash
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

## 3. Build the Web App

```bash
npm run build
```

This outputs the production build to the `dist/` folder.

## 4. Sync Web Build to Native Projects

```bash
npx cap sync
```

Run this every time you rebuild the web app.

---

## Android — Google Play Store

### Build Signed AAB

1. Open the Android project:
   ```bash
   npx cap open android
   ```

2. In Android Studio:
   - Go to **Build → Generate Signed Bundle / APK**
   - Select **Android App Bundle (AAB)**
   - Create or select a **keystore** (save this securely — you need it for every update)
   - Set the key alias, passwords
   - Choose **release** build variant
   - Click **Finish**

3. The AAB file will be in:
   ```
   android/app/build/outputs/bundle/release/app-release.aab
   ```

### Upload to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Click **Create app**
3. Fill in:
   - App name: **SafeLaunch — Trusted PWA Store**
   - Default language: English
   - App type: Application
   - Free or Paid: Free
4. Go to **Production → Create new release**
5. Upload the `.aab` file
6. Add release notes
7. Complete the **Store listing** (see `STORE_LISTING_CHECKLIST.md`)
8. Complete **Content rating** questionnaire
9. Set **Target audience** and **Privacy policy URL**: `https://agentslock.com/privacy`
10. Submit for review

### App Signing

Google Play manages app signing by default. On first upload, Google will generate the final signing key. Keep your upload key secure.

---

## iOS — Apple App Store

### Configure in Xcode

1. Open the iOS project:
   ```bash
   npx cap open ios
   ```

2. In Xcode:
   - Select the **App** target
   - Set **Bundle Identifier**: `com.agentslock.safelaunch`
   - Set **Team**: Your Apple Developer Team
   - Set **Version**: `1.0.0`
   - Set **Build**: `1`
   - Under **Signing & Capabilities**, enable Automatic Signing

### Build Archive

1. Select **Any iOS Device** as the build target (not a simulator)
2. Go to **Product → Archive**
3. Wait for the archive to complete
4. In the **Organizer** window, click **Distribute App**
5. Select **App Store Connect**
6. Follow the prompts to upload

### App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Click **My Apps → +** to create a new app
3. Fill in:
   - Platform: iOS
   - Name: **SafeLaunch — Trusted PWA Store**
   - Primary Language: English
   - Bundle ID: `com.agentslock.safelaunch`
   - SKU: `safelaunch-pwa-store`
4. Complete the **App Information**:
   - Privacy Policy URL: `https://agentslock.com/privacy`
   - Support URL: `https://agentslock.com/support`
5. Upload **screenshots** for required device sizes
6. Write the **description** and **keywords** (see `STORE_LISTING_CHECKLIST.md`)
7. Select the build you uploaded from Xcode
8. Submit for review

---

## Capacitor Config Reference

```typescript
// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.agentslock.safelaunch',
  appName: 'SafeLaunch',
  webDir: 'dist',
  server: {
    // For production: remove or set to your domain
    // url: 'https://agentslock.com',
    // androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0a0a0f',
    },
  },
}

export default config
```

---

## Common Issues

- **White screen on Android**: Ensure `webDir` points to `dist` and you ran `npx cap sync`
- **iOS build fails**: Check that your Apple Developer account is active and provisioning profiles are valid
- **Service Worker issues**: Capacitor supports service workers out of the box, but test offline mode on a real device
- **Deep links**: Configure `App Links` (Android) and `Universal Links` (iOS) if needed

---

## Updating the App

1. Make changes to the web code
2. Run `npm run build`
3. Run `npx cap sync`
4. Build and upload a new version following the platform-specific steps above
5. Increment the version number in `capacitor.config.ts` and platform configs
