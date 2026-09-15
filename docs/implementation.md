# Implementation decisions

## Structure and CMS replacement

`src/app` composes navigation and providers; its demo entry screen owns the feature flag and demo settings. `features/consultation` owns the specialist repository contract, query hooks and consultation UI. `shared` owns translations and the single dialog host.

The screen receives a `SpecialistRepository` through `SpecialistProvider`. Hooks only depend on `getAll`, `getPage` and `cacheKey`. To integrate a CMS, implement this interface, map its DTOs to `Specialist`, preserve the CMS ordering and stable IDs, pass AbortSignal to fetch, and inject that implementation at the consultation composition point. Cursor strings are opaque to hooks. The local adapter alone interprets them as offsets. `portraitUrl` already supports remote portraits with a placeholder on failure.

The demo assigns a fresh cache key to each entry so error scenarios can be replayed deterministically. A production CMS adapter should use a stable source identifier, including tenant/filter/locale when those change returned data. Plain and infinite modes have distinct query keys. Returning to demo unmounts queries; abort signals cancel pending work and inactive cache is collected after one minute.

## Feature flag and duplicate dialogs

`DemoEntryScreen` keeps the feature flag in local state alongside its other demo settings because it is the only consumer. Enabled navigates to consultation; disabled calls the shared dialog host. Returning from consultation preserves the setting because the demo screen remains mounted; remounting the demo screen resets it to enabled. The setting is in memory for this exercise; production could hydrate it from remote configuration with a documented default. This flag is a rollout control, not an authorization mechanism.

`createDialogManager.acquire` reserves the active slot synchronously before `setState`. Both entry buttons use the same provider and gate. Two calls in the same JavaScript turn cannot acquire two slots, even before React renders. The demo has a button that deliberately calls the entry handler twice synchronously.

Only one dialog of any key can be visible. Repeated or different keys while one is open are ignored, rather than queued. Close releases only the matching key. The declarative Modal uses `animationType="none"`, so this implementation has no close-animation interval to guard. If animations or an imperative native host are introduced, release the slot after the host confirms dismissal, not when close is requested. For multiple independently visible dialogs, replace the single slot with a keyed registry and explicitly choose a stacking/queue policy.

## Plain loading and infinite scrolling

The infinite-mode demo accepts a user-entered total from 0 to 10,000. Input stays as text during editing and is validated on blur or entry, with a translated red inline error. Only decimal digits are accepted after trimming whitespace; empty strings, fractions, signs, exponent notation, separators and out-of-range values are rejected. The 10,000-row cap is a demo guardrail, not a CMS restriction. The repository still generates only the requested page. Plain mode keeps its 3/120 presets. Next-page failure requires more than the shared 12-item page size and resets to Success when it becomes unavailable. The explicit empty scenario continues to override the total.

| Aspect      | Plain                                     | Infinite                                                                                            |
| ----------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Fetch       | One `getAll` request                      | `getPage` with 12 items per page                                                                    |
| Rendering   | Virtualized BottomSheetFlatList           | Same virtualized list                                                                               |
| Scrolling   | All data immediately available after load | `onEndReached` requests the next cursor; loaded rows remain available above                         |
| Failure     | Inline message with Retry                 | Initial failure uses inline message; next-page failure keeps prior rows and retries the same cursor |
| Data memory | O(N)                                      | O(K), where K is the retained loaded item count; eventually O(N)                                    |

The fixture generates requested rows on demand. It does not allocate all 120 objects and slice them for each page. This demonstrates the retrieval contract, not a claim about real network bandwidth. Both modes virtualize row components. Query data, flattened item references and image caches still consume memory. Pages are retained so upward scrolling does not require refetching or jump when old rows disappear.

Automatic loading checks `hasNextPage`, `isFetching` and next-page error state. A synchronous ref also prevents multiple same-turn `onEndReached` events. `cancelRefetch: false` avoids cancelling an active fetch. After a page error, only explicit Retry resumes requests, preventing a scroll/error loop. A Load more button provides an accessible fallback. No `maxPages` eviction is configured.

## PRD interpretation

Sources read on 2026-09-10:

- [PRD](https://gmproject.atlassian.net/wiki/external/MWVhMGE0ZjY5ZTA3NDZmMWE1OTBhMDkzMzM0MjQxYjU)
- [Figma](https://www.figma.com/design/fOi0NPZ47o56ILJ4cnpgcn/Premium-consultation-UI?node-id=0-1)
- Interview assignment shared in the preparation task.

The demo configuration screen follows the existing project plan and satisfies the additional feature-entry requirement. Consultation keeps the white sheet, static specialist cards, fixed service hours and two black actions. Per the updated interaction request, the top-left chevron returns to setup and preserves its selections. There is no top-right Demo settings action.

The PRD contains two WhatsApp message examples: a source-identifying URL and later localized MPF text. This implementation uses the later localized text and adds a localized GUM App source sentence. Messages are percent-encoded and target +852 6030 0900; the app opens a draft and never sends it automatically.

Booking uses Expo WebBrowser (SFSafariViewController / Android Custom Tabs). A booking screen also offers an explicit external-browser action. Web is a convenience preview and opens a browser window instead of a native in-app browser. Telephone and email use the exact PRD destinations. Link-open failures show the shared translated dialog.

English and Hong Kong Traditional Chinese are supported. Initial language follows the device; unsupported languages fall back to English. The demo allows an explicit override. UI strings remain separate from specialist identity data. Generated rows after Kan Chung, Alisa Mak and Justin Liu are visibly named Demo Specialist; they are not claims about real staff.

## Known limitations

- `ConsultationHero.tsx` displays the supplied local `assets/bgImage.png` as a full-width square with a warm gradient overlay. The sheet overlaps the image at 59% of the screen width, with a higher snap point for reading the list. Profile placeholders match the gray placeholders in Figma.
- The demo is not a CMS, a booking backend or an appointment availability API. Booking remains on the PRD's external service.
- Real phone, mail and WhatsApp handoff must be checked on devices with compatible apps. No booking or message was submitted during verification.
- Native iOS compilation remains blocked: local Xcode aborts while loading its own CoreDevice/Mercury libraries (`Symbol not found: _XPCTypeBool`), before compiling project source. The Android app runs on the Pixel 9 Pro XL emulator. JavaScript export succeeds on iOS, Android and Web.

## Official references

- [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/)
- [Expo Reanimated setup](https://docs.expo.dev/versions/v54.0.0/sdk/reanimated/)
- [Bottom Sheet installation](https://gorhom.dev/react-native-bottom-sheet/)
- [TanStack infinite queries](https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries)
