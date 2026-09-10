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

## Not verified / blocked

- Native iOS binary: Xcode aborts before source compilation while loading CoreDevice/Mercury with `Symbol not found: _XPCTypeBool`. Fix or reinstall the local Xcode/OS tooling before repeating `npm run ios`.
- Android binary compilation and physical-device gestures/hand-offs have not been tested.
- No appointment was booked, email sent, phone call placed or WhatsApp message sent.
- Original team-banner asset and demo video remain outstanding. See the demo checklist.
