# SANDHYā — Official Production Release Guide

This document outlines the complete steps to publish **SANDHYā** to the **Google Play Store** or distribute it directly to users.

---

## 📦 1. Production Artifacts in `release/` Folder

| File Name | Format | Purpose | Where to Use |
|---|---|---|---|
| `SANDHYa-v1.0.0-release.aab` | Android App Bundle | **Google Play Store Publishing** (Google's required format) | Upload under Google Play Console > Production (or Internal / Closed testing) |
| `SANDHYa-v1.0.0-release.apk` | Signed Release APK | **Direct Device Installation** / Sideloading / Website download | Direct download for beta testers or users |
| `playstore-icon-512x512.png` | 512x512 32-bit PNG | **Play Store App Icon** | Store Listing > App Icon |
| `feature-graphic-1024x500.png` | 1024x500 PNG | **Play Store Feature Graphic Banner** | Store Listing > Feature Graphic |
| `KEYSTORE_INFO.txt` | Credentials Record | **Release signing passwords and SHA fingerprints** | Store securely and add SHA keys to Firebase Console |

---

## 🔑 2. Certificate Fingerprints for Firebase

If you use Google Sign-In, Firebase Auth, or Cloud Firestore rules:
1. Open [Firebase Console](https://console.firebase.google.com).
2. Select your Firebase project.
3. Go to **Project Settings** > **General** > **Your apps** > **Android (`com.sandhya.app`)**.
4. Click **Add fingerprint** and add both:
   - **SHA-1**: `05:A0:BA:02:78:4F:EA:0B:A4:B1:4B:E3:F9:FB:C9:25:9B:37:64:E9`
   - **SHA-256**: `C3:33:62:2C:40:B8:38:FC:65:02:11:42:05:C9:69:DB:39:50:DC:44:00:FE:7B:5D:F2:F7:EA:D5:D9:58:C8:E7`

---

## 🚀 3. Publishing to Google Play Store

### Step 1: Create App in Google Play Console
1. Log in to [Google Play Console](https://play.google.com/console).
2. Click **Create app**:
   - **App name**: `SANDHYā`
   - **Default language**: English (United States) or Tamil
   - **App or game**: App
   - **Free or paid**: Free
   - Accept the Developer Program Policies and US export laws.

### Step 2: Set Up Main Store Listing
Under **Grow** > **Store presence** > **Main store listing**:
- **App Name**: `SANDHYā`
- **Short description** (Up to 80 chars):
  > *Daily Vedic Sandhyāvandanam practice companion with rituals, mantras, and streak tracking.*
- **Full description**:
  > *SANDHYā is a sacred daily Vedic companion dedicated to the practice of Sandhyāvandanam (Prātaḥ, Mādhyānhikam, and Sāyam Sandhyā).*
  > 
  > *Features:*
  > • Step-by-step guidance for morning, noon, and evening rituals.
  > • Authentic Vedic mantras and slokas with audio guidance and multi-language support (Tamil, Sanskrit, English).
  > • Daily streak tracking and monthly journey visualization.
  > • Sandhyā Circle to encourage and motivate fellow practitioners.
  > • Clean, serene mobile interface designed for daily sacred discipline.
- **App Icon**: Upload `release/playstore-icon-512x512.png`
- **Feature Graphic**: Upload `release/feature-graphic-1024x500.png`
- **Phone Screenshots**: Take 2-4 screenshots of the app from your phone or mobile browser.

### Step 3: Complete App Content Declarations
Under **Policy and programs** > **App content**:
- **Privacy Policy**: Provide a valid URL for your privacy policy.
- **Ads**: Declare *No, my app does not contain ads*.
- **App access**: Declare *All functionality is available without special access* (or provide demo credentials if authentication is required).
- **Content ratings**: Fill the questionnaire (Category: Reference / Lifestyle / Utility -> rated Everyone / 3+).
- **Target audience**: Select age groups (e.g., 13+ or 18+).
- **Data safety**: Complete the standard form (uses Firebase Auth for account login and Firestore for practice logs).

### Step 4: Create a Release
1. In the left menu, select **Release** > **Testing** > **Internal testing** (recommended first) or **Production**.
2. Click **Create new release**.
3. Under **App bundles**, upload:
   👉 `release/SANDHYa-v1.0.0-release.aab`
4. Enter **Release name**: `1.0.0 (Initial Release)`
5. Enter **Release notes**:
   ```
   • Initial official release of SANDHYā.
   • Complete daily Sandhyāvandanam rituals (Prātaḥ, Mādhyānhikam, Sāyam).
   • Interactive mantra guidance, streak tracker, and Sandhyā Circle.
   ```
6. Click **Next** > **Save** > **Review release** > **Start rollout**!

---

## 📲 4. Direct Distribution (Without Play Store)
To share the app directly with testers or friends:
- Share `release/SANDHYa-v1.0.0-release.apk`
- The file is cryptographically signed and installs on any Android 8.0+ (API 26+) phone.
