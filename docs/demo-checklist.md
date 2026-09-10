# Demo recording checklist

Record the mobile app after native build is available. No video has been recorded yet.

- [ ] 0:00 — English, feature enabled, original 3 profiles. Show sheet movement and fixed service hours/buttons.
- [ ] 0:30 — Scroll to hotline, email and privacy notice. Show the inert reference chevron and use Demo settings to return.
- [ ] 0:50 — Disable the feature. Press entry twice quickly; dismiss. Press the synchronous two-call test button. Explain the shared synchronous gate.
- [ ] 1:15 — Switch to Traditional Chinese and re-enable. Verify translated page and error text.
- [ ] 1:40 — Infinite scroll, 120 specialists. Scroll beyond the first page, then back up. Explain O(K) retained data and virtualized rows.
- [ ] 2:15 — First request failure and Retry. Next-page failure and Retry with existing cards preserved. Empty state.
- [ ] 3:00 — Open booking in the in-app browser and show the external browser option. Open a WhatsApp draft without sending; show correct number and localized text. Test phone/email on a suitable device.

Before submitting:

- [ ] Replace the team banner placeholder with the original design asset.
- [ ] Verify native iOS and Android builds on a working toolchain.
- [ ] Test sheet gestures, safe areas, smaller screens and larger accessibility text on devices.
- [ ] Run `npm ci`, `npm run check`, `npx expo install --check`, and platform exports from a clean clone.
- [ ] Push the feature branch, open a PR against the empty main baseline and attach the demo recording.
