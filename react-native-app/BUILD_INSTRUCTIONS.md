# 🚀 Multi-Room Platform - React Native Build Guide

## Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Xcode 14+ (for iOS)
- Android Studio & Android SDK (for Android)

### Installation

```bash
cd react-native-app
npm install
```

### Run on Android

```bash
npm run android
# OR
react-native run-android
```

### Run on iOS

```bash
npm run ios
# OR
react-native run-ios
```

### Build for Release

**Android APK:**
```bash
npm run build-android
# Output: android/app/build/outputs/apk/release/app-release.apk
```

**iOS IPA:**
```bash
npm run build-ios
# Output: ios/build/Release-iphoneos/MultiRoom.ipa
```

## Distribution

### Google Play Store
1. Create release APK: `npm run build-android`
2. Sign APK with your keystore
3. Upload to Google Play Console

### Apple App Store
1. Create release IPA: `npm run build-ios`
2. Sign with your Apple Developer certificate
3. Upload to App Store Connect

## Features Included
- ✅ Multi-room management
- ✅ Real-time execution tracking
- ✅ Email relay system
- ✅ Token monitoring
- ✅ Offline mode support
- ✅ Push notifications ready

## Support
For issues or questions, check the official documentation.
