# Demo recording checklist

The Android development app has been recorded. See the [full operation video and timestamp index](video/README.md) (3:45, Chinese chapter captions). The recording covers the checklist below except completed external-service handoffs and physical-device checks.

Original recording outline (actual timestamps are in the video index):

- [x] 0:00 — English, feature enabled, original 3 profiles. Show sheet movement and fixed service hours/buttons.
- [x] 0:30 — Scroll to hotline, email and privacy notice. Use the top-left back icon to return to setup and confirm the selections are preserved.
- [x] 0:50 — Disable the feature. Press entry twice quickly; dismiss. Press the synchronous two-call test button. The synchronous gate is documented in the implementation notes.
- [x] 1:15 — Switch to Traditional Chinese and re-enable. Verify translated page and error text.
- [x] 1:40 — Infinite scroll, 120 specialists. Scroll beyond the first page, then back up. O(K) retained data and virtualized rows are explained in the implementation notes.
- [x] 2:15 — First request failure and Retry. Next-page failure and Retry with existing cards preserved. Empty state.
- [ ] 3:00 — Open booking in the in-app browser and show the external browser option. Open a WhatsApp draft without sending; show correct number and localized text. Test phone/email on a suitable device.

Before submitting:

- [x] Replace the team banner placeholder with the supplied `assets/bgImage.png`.
- [ ] Verify native iOS and Android builds on a working toolchain.
- [ ] Test sheet gestures, safe areas, smaller screens and larger accessibility text on devices.
- [ ] Run `npm ci`, `npm run check`, `npx expo install --check`, and platform exports from a clean clone.
- [x] Push the feature branch, open a PR against the empty main baseline and attach the demo recording.
