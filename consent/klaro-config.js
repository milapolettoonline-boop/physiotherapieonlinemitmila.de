/* Klaro! Open Source configuration for the MILAPHYSIO static website. */
window.klaroConfig = {
    version: 2,
    elementID: 'klaro',
    storageMethod: 'localStorage',
    storageName: 'milaphysio-consent',
    htmlTexts: false,
    default: false,
    mustConsent: true,
    acceptAll: true,
    hideDeclineAll: false,
    hideLearnMore: false,
    lang: 'de',
    translations: {
        de: {
            privacyPolicyUrl: '/datenschutz.html',
            consentNotice: {
                title: 'Datenschutzeinstellungen',
                description: 'Google Analytics wird nur mit Ihrer Zustimmung geladen. Sie koennen Ihre Auswahl jederzeit aendern oder widerrufen.',
                learnMore: 'Einstellungen ansehen'
            },
            consentModal: {
                title: 'Datenschutzeinstellungen',
                description: 'Statistik bleibt ausgeschaltet, bis Sie zustimmen. Weitere Informationen stehen in unserer Datenschutzerklaerung.',
                privacyPolicy: {
                    name: 'Datenschutzerklaerung',
                    text: 'Details finden Sie in unserer {privacyPolicy}.'
                }
            },
            acceptAll: 'Alle erlauben',
            acceptSelected: 'Auswahl speichern',
            decline: 'Alle optionalen ablehnen',
            ok: 'Auswahl speichern',
            save: 'Auswahl speichern',
            purposes: {
                necessary: {
                    title: 'Notwendig',
                    description: 'Speichert Ihre Datenschutzauswahl und ermoeglicht grundlegende Website-Funktionen.'
                },
                analytics: {
                    title: 'Statistik/Analytics',
                    description: 'Google Analytics erstellt Nutzungsstatistiken und wird nur nach Zustimmung geladen.'
                }
            },
            services: {
                'necessary-functions': {
                    title: 'Notwendige Website-Funktionen',
                    description: 'Lokale Navigation, Formulare und Speicherung Ihrer Datenschutzauswahl. Kein Tracking.'
                },
                'google-analytics': {
                    title: 'Google Analytics (GA4)',
                    description: 'Erstellt Nutzungsstatistiken. Wird erst nach Ihrer Zustimmung geladen.'
                }
            }
        }
    },
    services: [
        {
            name: 'necessary-functions',
            title: 'Notwendige Website-Funktionen',
            purposes: ['necessary'],
            required: true,
            default: true,
            optOut: false,
            onlyOnce: true
        },
        {
            name: 'google-analytics',
            title: 'Google Analytics (GA4)',
            purposes: ['analytics'],
            required: false,
            default: false,
            optOut: false,
            onlyOnce: true,
            cookies: [/^_ga/, '_gid', '_gat', /^_gcl_/]
        }
    ],
    callback: function (consent, service) {
        if (service.name === 'google-analytics') {
            var analyticsMarker = 'milaphysio-google-analytics-was-enabled';
            if (consent) {
                window.localStorage.setItem(analyticsMarker, '1');
            } else if (window.localStorage.getItem(analyticsMarker) === '1') {
                window.localStorage.removeItem(analyticsMarker);
                window.localStorage.removeItem('_gcl_ls');
                window.location.reload();
            }
            return;
        }
    }
};

/* Tracking scope per page.
 *   analytics - GA4 is registered (consent still required).
 *   none      - nothing is registered. Used for legal pages.
 * Klaro still loads on every page so the visitor can review or change choices. */
var MILAPHYSIO_GA4_ID = 'G-MCE6NQPKFB';

window.milaphysioTrackingMode = (function getTrackingMode() {
    var path = window.location.pathname;
    if (/^\/(impressum|datenschutz|agb)\.html$/.test(path)) return 'none';
    return 'analytics';
}());

/* Register the blocked GA4 scripts once, centrally, so every covered page shares one setup. */
(function registerGoogleAnalyticsForKlaro() {
    if (window.milaphysioTrackingMode === 'none') return;
    if (document.querySelector('script[data-name="google-analytics"]')) return;

    var gtagLoader = document.createElement('script');
    gtagLoader.type = 'text/plain';
    gtagLoader.setAttribute('data-type', 'application/javascript');
    gtagLoader.setAttribute('data-name', 'google-analytics');
    gtagLoader.setAttribute('data-src', 'https://www.googletagmanager.com/gtag/js?id=' + MILAPHYSIO_GA4_ID);
    document.head.appendChild(gtagLoader);

    var gtagConfig = document.createElement('script');
    gtagConfig.type = 'text/plain';
    gtagConfig.setAttribute('data-type', 'application/javascript');
    gtagConfig.setAttribute('data-name', 'google-analytics');
    gtagConfig.textContent = [
        'window.dataLayer = window.dataLayer || [];',
        'function gtag() { dataLayer.push(arguments); }',
        'gtag("js", new Date());',
        'gtag("config", "' + MILAPHYSIO_GA4_ID + '", {',
        '  allow_google_signals: false,',
        '  allow_ad_personalization_signals: false',
        '});'
    ].join('\n');
    document.head.appendChild(gtagConfig);
}());

/* The Meta Pixel was removed from the site. Clear the marker it left in localStorage
 * and expire any _fbp/_fbc cookies that an earlier visit may have stored. */
(function removeLegacyMetaPixelState() {
    try { window.localStorage.removeItem('milaphysio-meta-pixel-was-enabled'); } catch (e) { /* storage unavailable */ }
    document.cookie = '_fbp=; Max-Age=0; path=/';
    document.cookie = '_fbc=; Max-Age=0; path=/';
}());
