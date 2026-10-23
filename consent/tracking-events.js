/* Central GA4 event handling for the MILAPHYSIO static website.
 *
 * Events are sent only when GA4 is active, which happens after the visitor grants
 * the google-analytics consent in Klaro. Before that, window.gtag does not exist,
 * so nothing is queued or sent.
 *
 * Parameters are limited to coarse, non-personal values: page type, link location,
 * link domain and the public page slug. Full URLs, phone numbers, e-mail addresses,
 * form values and health-related search terms are never sent. */
(function () {
    'use strict';

    var PAGE_TYPES = [
        { pattern: /^\/$/, type: 'home' },
        { pattern: /^\/kontakt\.html$/, type: 'kontakt' },
        { pattern: /^\/blog\//, type: 'blog' },
        { pattern: /^\/ebook\//, type: 'ebook' },
        { pattern: /^\/danke/, type: 'agradecimento' },
        { pattern: /^\/(online-physiotherapie|hausbesuch)\//, type: 'landing' },
        { pattern: /^\/nackenschmerzen-ratgeber\.html$/, type: 'ratgeber' },
        { pattern: /^\/(impressum|datenschutz|agb)\.html$/, type: 'legal' },
        { pattern: /^\/(recommendations)\.html$/, type: 'empfehlungen' }
    ];

    function pageType() {
        var path = window.location.pathname;
        for (var i = 0; i < PAGE_TYPES.length; i++) {
            if (PAGE_TYPES[i].pattern.test(path)) return PAGE_TYPES[i].type;
        }
        return 'produkt';
    }

    function pageSlug() {
        var segments = window.location.pathname.split('/').filter(Boolean);
        if (!segments.length) return 'home';
        var last = segments[segments.length - 1] || segments[segments.length - 2] || 'home';
        return last.replace(/\.html$/, '');
    }

    function linkLocation(link) {
        var explicit = link.getAttribute('data-track-location');
        if (explicit) return explicit;
        if (link.closest('header')) return 'header';
        if (link.closest('nav')) return 'nav';
        if (link.closest('footer')) return 'footer';
        return 'content';
    }

    function track(name, params) {
        if (typeof window.gtag !== 'function') return false;
        window.gtag('event', name, params || {});
        return true;
    }

    function basePayload(link) {
        return { page_type: pageType(), link_location: linkLocation(link) };
    }

    function classifyLink(link) {
        var href = link.getAttribute('href') || '';

        if (href.indexOf('tel:') === 0) {
            track('contact_phone_click', basePayload(link));
            return;
        }
        if (href.indexOf('mailto:') === 0) {
            track('contact_email_click', basePayload(link));
            return;
        }

        var absolute;
        try {
            absolute = new URL(href, window.location.href);
        } catch (e) {
            return;
        }

        if (absolute.hostname === 'wa.me' || absolute.hostname === 'api.whatsapp.com') {
            track('contact_whatsapp_click', basePayload(link));
            return;
        }
        if (absolute.hostname === 'calendly.com' || absolute.hostname === 'www.calendly.com') {
            track('calendly_click', { page_type: pageType(), service_type: pageSlug() });
            return;
        }
        if (/(^|\.)amazon\.(de|com)$/.test(absolute.hostname)) {
            var amazonPayload = {
                link_domain: absolute.hostname.replace(/^www\./, ''),
                product_slug: pageSlug(),
                link_location: linkLocation(link)
            };
            if (pageType() === 'ebook') {
                track('ebook_buy_click', amazonPayload);
            } else {
                track('affiliate_outbound_click', amazonPayload);
            }
        }
    }

    document.addEventListener('click', function (event) {
        var target = event.target;
        if (!target || typeof target.closest !== 'function') return;
        var link = target.closest('a[href]');
        if (link) classifyLink(link);
    });

    /* Used by pages that run their own flow, such as the Hausbesuch address check.
     * Only the outcome is passed, never the address or any form value. */
    window.milaphysioTrack = track;
}());
