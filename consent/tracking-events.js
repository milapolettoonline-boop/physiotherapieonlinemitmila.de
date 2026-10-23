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

    /* Stable page identifier from the path. "index.html" takes its directory name,
     * so /ebook/index.html gives "ebook" and not "index". Root gives "home". */
    function pageSlug() {
        var segments = window.location.pathname.split('/').filter(Boolean).map(function (s) {
            try { return decodeURIComponent(s); } catch (e) { return s; }
        });
        if (!segments.length) return 'home';
        var last = segments[segments.length - 1];
        if (/\.html$/i.test(last)) {
            if (last === 'index.html') return segments.length === 1 ? 'home' : segments[segments.length - 2];
            return last.replace(/\.html$/i, '');
        }
        return last;
    }

    /* Affiliate and book-shop domains. Exact host or subdomain match only,
     * so "notamazon.de" and "amazonaws.com" are not classified as Amazon. */
    var AFFILIATE_DOMAINS = ['amazon.de', 'amazon.com', 'amzn.to', 'amzn.eu', 'a.co'];

    function affiliateDomain(hostname) {
        var host = hostname.toLowerCase().replace(/^www\./, '');
        for (var i = 0; i < AFFILIATE_DOMAINS.length; i++) {
            var domain = AFFILIATE_DOMAINS[i];
            if (host === domain || host.slice(-(domain.length + 1)) === '.' + domain) return domain;
        }
        return null;
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
            // Hausbesuch package buttons open the address form instead of Calendly.
            // Their events are sent by the Hausbesuch page itself.
            if (link.hasAttribute('data-package')) return;
            track('calendly_click', { page_type: pageType(), service_type: pageSlug() });
            return;
        }
        var domain = affiliateDomain(absolute.hostname);
        if (domain) {
            var amazonPayload = {
                link_domain: domain,
                product_slug: pageSlug(),
                link_location: linkLocation(link)
            };
            if (pageType() === 'ebook') {
                var bookTitle = link.getAttribute('data-book-title');
                var bookLanguage = link.getAttribute('data-book-language');
                if (bookTitle) amazonPayload.book_title = bookTitle;
                if (bookLanguage) amazonPayload.book_language = bookLanguage;
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
