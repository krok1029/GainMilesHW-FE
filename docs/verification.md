# Verification — 2026-09-10

## Passed

- Node 22.17.1; npm 10.9.2.
- Full `npm ci` from the committed lockfile, including installation scripts.
- `npm run check`: TypeScript, ESLint, 5 suites / 20 tests.
- `npx expo install --check`: dependencies up to date.
- `npx expo export --platform all`: iOS and Android Hermes bundles, Web bundle and assets.
- `npx expo prebuild --platform ios --no-install` and `pod install`: 81 Pods installed.

## Browser interaction checks

Tested the exported Web app at a 390 × 844 viewport:

- Language changes between English and Traditional Chinese.
- Disabled feature stays on setup and presents one Coming soon dialog for two synchronous calls.
- Enabled feature opens the consultation page; fixed service hours and actions remain outside the scrolling list.
- A 120-row infinite list loads 12 rows; the simulated next-page error keeps those rows visible. Retry adds rows 13–24 without replacing rows 1–12.
- First-request failure displays inline text and Retry. Retry restores Kan Chung, Alisa Mak and Justin Liu.
- Specialist text and contact links appear individually in the accessibility tree after removing the content container's slider role.

The user's Chrome Dark Reader extension changes preview colors. App styles specify the white sheet and black buttons from the design. Browser settings were not changed.

## Banner and navigation update

- TypeScript, ESLint and Web export pass after replacing the placeholder with `assets/bgImage.png`.
- Browser verification confirms the team image loads, the top-right settings button is absent, and the top-left back icon returns to setup. English and the 120-specialist selection remain selected after returning.
- Compared the supplied Figma screenshot with the in-app browser at 375 px wide: the square banner fills the width, the sheet begins at 59% of that width, and the heading has the reference spacing and divider. The background gradient and hidden handle indicator are included in the Web export.
- TypeScript and ESLint pass after the layout changes. The heading fits on one line at 375 px, and the back icon returns to setup.

## Not verified / blocked

- Native iOS binary: Xcode aborts before source compilation while loading CoreDevice/Mercury with `Symbol not found: _XPCTypeBool`. Fix or reinstall the local Xcode/OS tooling before repeating `npm run ios`.
- Physical-device gestures/hand-offs have not been tested. Android emulator checks are recorded below.
- No appointment was booked, email sent, phone call placed or WhatsApp message sent.
- The team-banner asset has since been supplied and integrated. The demo video has now been recorded; see the video verification entry below.

## Android development render regression

- On the Pixel 9 Pro XL emulator, entering consultation threw an invariant because `@gorhom/bottom-sheet` rejects the deprecated `containerHeight` prop in development. Production Web export did not execute that validator.
- Removed the prop passed to the library so it measures its container internally. The screen's measured height still determines the two snap points.
- Added a regression test that renders the real Bottom Sheet in both list modes, mocking native animation machinery and list content only. Both cases reproduced the exact invariant before the fix and pass afterward.
- TypeScript, ESLint and all 6 Jest suites / 22 tests pass.
- Verified on Android: the plain list opens with all three specialists; Back returns to setup; the 120-specialist infinite mode opens; dragging the handle moves the sheet from its initial position to its expanded position without a render error.

## PR screenshots and final checks — 2026-09-10

- Re-ran `npm run check`: Prettier, TypeScript, ESLint and 6 Jest suites / 22 tests pass.
- `npx expo install --check`: dependencies are up to date.
- `npx expo export --platform all`: iOS, Android and Web JavaScript/assets export passes.
- Restarted Metro from source commit `7a1436c` and reloaded the Android development app before capture.
- Captured seven unmodified 1080 × 2400 screenshots: setup, English consultation, expanded sheet, Traditional Chinese consultation, duplicate-entry dialog, next-page error and successful retry.
- Android interaction confirms the disabled feature's synchronous double-entry test shows one dialog. In infinite mode with 120 rows, next-page failure retains existing rows; Retry appends rows 13 onward at the same scroll position.
- See [screenshot index](screenshots/README.md). These checks do not change the native iOS or physical-device limitations recorded above.

## Full Android operation video — 2026-09-10

- Added [3:45 operation video with Chinese chapter captions](video/README.md), recorded from source commit `2674063`.
- Recorded English and Traditional Chinese, sheet expansion, contact information, disabled-feature rapid/synchronous entry, first-request failure and Retry, empty state, 120-row pagination, next-page failure and recovery, and upward scrolling through retained rows.
- Clicked the booking, external-browser and WhatsApp entries. All external destinations stopped at the emulator's Chrome first-run screen; website loading and a WhatsApp draft remain unverified. No agreement was accepted and no booking/message/call/email was submitted.
- The final MP4 preserves operation order and removes only long static waits. Added chapter captions above the App frame. Verified H.264, 720 × 1712, 24 fps, 225 seconds; full decoding succeeds.
- Returning from the browser shows a development warning banner in the recording; this documentation-only task did not diagnose that warning.
