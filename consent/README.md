# MILAPHYSIO consent management

The public static pages load the locally hosted Klaro! Open Source files in this directory. There is no shared server-side HTML include, so each public HTML page references the same config, vendor assets, and settings-button script. The patient and therapist portals are intentionally excluded.

## Services

- Necessary: local website functions and storage of the visitor's preference in `localStorage`.
- Analytics: Google Analytics 4 (`G-MCE6NQPKFB`). `klaro-config.js` registers its scripts centrally, once per page, as inert `text/plain` tags with `data-name="google-analytics"`. They run only after Klaro grants `google-analytics` consent. The declared cookies are `_ga*`, `_gid`, `_gat` and `_gcl_*`, so Klaro removes them on withdrawal. The GA callback also removes the `_gcl_ls` localStorage entry on withdrawal. Consent-mode flags disable Google signals and ad personalization.
- Marketing: Meta Pixel (`1652315169843706`), centrally registered as an inert `text/plain` script with `data-name="meta-pixel"` before the locally loaded Klaro engine scans managed tags. Klaro activates it only when the Marketing service is accepted.

## Tracking scope per page

`window.milaphysioTrackingMode` in `klaro-config.js` is chosen from the URL path:

- `full`: GA4 and Meta Pixel are registered. This is the default.
- `analytics-only`: GA4 only. Used for the blog and `nackenschmerzen-ratgeber.html`, because their URLs reveal health topics. No Meta PageView is sent from them.
- `none`: nothing is registered. Used for `impressum`, `datenschutz` and `agb`. Klaro still loads there so visitors can change their choices.

Klaro is loaded on every public page, including the three e-book pages. Those pages had no Klaro before.

`consent/tracking-events.js` sends custom GA4 events once GA4 consent is active. Before consent, `window.gtag` does not exist, so nothing is sent. Events are `contact_phone_click`, `contact_email_click`, `contact_whatsapp_click`, `calendly_click`, `affiliate_outbound_click`, `ebook_buy_click` and, from the Hausbesuch address check, `hausbesuch_check_result` with `approved`, `outside_area` or `error`. Parameters are limited to `page_type`, `link_location`, `link_domain`, `product_slug` and `service_type`. Full URLs, phone numbers, e-mail addresses, address values and form content are never sent.

A `danke*.html` page view is not a confirmed purchase. The e-book is sold on Amazon, so purchases are only visible in the affiliate reports.

The Meta Pixel emits only `PageView`, without custom event parameters or advanced matching. Meta's automatic configuration is disabled to prevent automatic collection of page interactions and form data. A PageView still includes ordinary page context such as the visited URL and referrer; do not put patient details, addresses, symptoms, or other sensitive data in public URLs. No `noscript` pixel is included because its image request cannot be reliably gated by Klaro before a visitor has made a consent choice.

On marketing revocation, the config sends Meta's `fbq('consent', 'revoke')` signal when available, clears its local active marker, and reloads the document to discard the already-loaded Pixel runtime. Analytics remains a separate Klaro service.

## Updating Klaro or trackers

The vendored distribution is Klaro! Open Source v0.7.22 from the official `https://cdn.kiprotect.com/klaro/v0.7/` distribution. `klaro.js` is the no-CSS build; `klaro.min.css` supplies Klaro's default styles. Keep both assets local, update them together, and retain `LICENSE.txt` (BSD 3-Clause). No hosted Klaro service or paid plan is used.

When adding or changing a tracker later, update its visible service details and increment the Klaro config `version` so visitors are asked to review the new choice. Never pass address-form values, patient identity, symptoms, diagnoses, treatment details, or other patient information to a tracker.