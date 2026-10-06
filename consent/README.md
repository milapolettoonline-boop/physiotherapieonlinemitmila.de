# MILAPHYSIO consent management

The public static pages load the locally hosted Klaro! Open Source files in this directory. There is no shared server-side HTML include, so each public HTML page references the same config, vendor assets, and settings-button script. The patient and therapist portals are intentionally excluded.

## Services

- Necessary: local website functions and storage of the visitor's preference in `localStorage`.
- Analytics: Google Analytics 4 (`G-MCE6NQPKFB`), present on seven pages. Its scripts stay inert until Klaro grants `google-analytics` consent.
- Marketing: Meta Pixel (`1652315169843706`), centrally registered as an inert `text/plain` script with `data-name="meta-pixel"` before the locally loaded Klaro engine scans managed tags. Klaro activates it only when the Marketing service is accepted.

The Meta Pixel emits only `PageView`, without custom event parameters or advanced matching. Meta's automatic configuration is disabled to prevent automatic collection of page interactions and form data. A PageView still includes ordinary page context such as the visited URL and referrer; do not put patient details, addresses, symptoms, or other sensitive data in public URLs. No `noscript` pixel is included because its image request cannot be reliably gated by Klaro before a visitor has made a consent choice.

On marketing revocation, the config sends Meta's `fbq('consent', 'revoke')` signal when available, clears its local active marker, and reloads the document to discard the already-loaded Pixel runtime. Analytics remains a separate Klaro service.

## Updating Klaro or trackers

The vendored distribution is Klaro! Open Source v0.7.22 from the official `https://cdn.kiprotect.com/klaro/v0.7/` distribution. `klaro.js` is the no-CSS build; `klaro.min.css` supplies Klaro's default styles. Keep both assets local, update them together, and retain `LICENSE.txt` (BSD 3-Clause). No hosted Klaro service or paid plan is used.

When adding or changing a tracker later, update its visible service details and increment the Klaro config `version` so visitors are asked to review the new choice. Never pass address-form values, patient identity, symptoms, diagnoses, treatment details, or other patient information to a tracker.