# GUM Premium Consultation

React Native / TypeScript interview exercise, built with Expo SDK 54, TanStack Query and `@gorhom/bottom-sheet` v5. Supports English and Hong Kong Traditional Chinese, feature gating, a shared dialog host, and both plain and paginated specialist loading.

## Run

Use Node **22.17.1** and npm **10.9.2**. The committed lockfile is authoritative.

```sh
nvm install
nvm use
npm ci
npm run web
```

Web is a quick preview. For mobile, install the Android SDK / JDK 17 or Xcode with an iOS Simulator, then:

```sh
npm run android
# macOS, with CocoaPods installed:
npm run ios
```

These commands generate native projects and compile development builds. Generated `ios/` and `android/` folders are not committed. Expo Go must match SDK 54; the latest store version may not support this SDK. A development build avoids that requirement. No API keys, backend or Expo account are needed for local builds.

For Metro only: `npm start`. To export JavaScript/assets for all targets: `npx expo export --platform all`. Export is not a native binary build.

## Demo

1. Open setup, choose language, list mode, dataset size and loading scenario.
2. Disable Premium Consultation. Press the entry button or **Test two synchronous presses**: one Coming soon dialog appears. Close it and try again.
3. Enable the feature and enter. Drag the sheet upward and scroll through the list. Service hours and contact actions remain fixed.
4. Select **Infinite scroll → 120 specialists**. Scroll to load additional pages; scroll back up to revisit loaded rows.
5. Select **First request fails** and press Retry. Select **Next page fails** to show that existing rows survive a later error. Failure scenarios fail once per entry; returning to setup and re-entering resets them.
6. Check the empty scenario, both languages, booking browser, WhatsApp draft, phone and email links.

The next-page failure option is available only with infinite mode and 120 rows. The original three names are from the design; additional rows are explicitly labeled demo data.

## Validate

Run `npm run format` to format source and configuration files, including blank lines between logical blocks. `npm run format:check` checks Prettier formatting without editing files; ESLint checks the blank-line rules as part of `npm run check`.

```sh
npm run check
npx expo install --check
npx expo export --platform all
```

Tests cover duplicate dialogs across entry points, close/reopen, repository ordering and pagination boundaries, cancellation, localized WhatsApp links and Query recovery after next-page failure. GitHub Actions runs checks and exports on pushes and PRs.

Current verification: TypeScript, ESLint and 22 tests pass; iOS/Android/Web JavaScript export passes; iOS prebuild and CocoaPods installation pass. The Android app runs on the Pixel 9 Pro XL emulator, with both list modes, return navigation and sheet expansion verified. Native iOS compilation is blocked by a local Xcode loader error (`_XPCTypeBool` in CoreDevice/Mercury), before project compilation.

The consultation banner uses the supplied `assets/bgImage.png`. Use the top-left back icon to return to setup; your demo selections are preserved.

See [implementation notes](docs/implementation.md) for repository replacement, query memory tradeoffs, duplicate-dialog policy and PRD interpretations. See [demo checklist](docs/demo-checklist.md) for a recording script.

Work lives on `feat/premium-consultation`; `main` contains only an empty baseline commit for a clean PR diff.
