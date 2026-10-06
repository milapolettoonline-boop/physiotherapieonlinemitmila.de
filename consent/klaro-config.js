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
                description: 'Google Analytics und der Meta Pixel werden nur mit Ihrer jeweiligen Zustimmung geladen. Sie koennen Ihre Auswahl jederzeit aendern oder widerrufen.',
                learnMore: 'Einstellungen ansehen'
            },
            consentModal: {
                title: 'Datenschutzeinstellungen',
                description: 'Statistik und Marketing bleiben ausgeschaltet, bis Sie jeweils zustimmen. Weitere Informationen stehen in unserer Datenschutzerklaerung.',
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
                },
                marketing: {
                    title: 'Marketing',
                    description: 'Der Meta Pixel sendet ausschliesslich PageView und wird nur nach Zustimmung geladen.'
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
                },
                'meta-pixel': {
                    title: 'Meta Pixel',
                    description: 'Misst Seitenaufrufe mit PageView. Es werden keine Formularwerte oder benutzerdefinierten Event-Parameter uebermittelt.'
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
            onlyOnce: true
        },
        {
            name: 'meta-pixel',
            title: 'Meta Pixel',
            purposes: ['marketing'],
            required: false,
            default: false,
            optOut: false,
            onlyOnce: true,
            cookies: ['_fbp', '_fbc']
        }
    ],
    callback: function (consent, service) {
        if (service.name === 'google-analytics') {
            var analyticsMarker = 'milaphysio-google-analytics-was-enabled';
            if (consent) {
                window.localStorage.setItem(analyticsMarker, '1');
            } else if (window.localStorage.getItem(analyticsMarker) === '1') {
                window.localStorage.removeItem(analyticsMarker);
                window.location.reload();
            }
            return;
        }

        if (service.name === 'meta-pixel') {
            var metaMarker = 'milaphysio-meta-pixel-was-enabled';
            if (consent) {
                window.localStorage.setItem(metaMarker, '1');
            } else if (window.localStorage.getItem(metaMarker) === '1') {
                if (typeof window.fbq === 'function') {
                    window.fbq('consent', 'revoke');
                }
                window.localStorage.removeItem(metaMarker);
                window.location.reload();
            }
        }
    }
};

/* Register the blocked Pixel script before Klaro starts scanning managed tags. */
(function registerMetaPixelForKlaro() {
    if (document.querySelector('script[data-name="meta-pixel"]')) return;

    var metaPixelId = '2926372417718226';
    var blockedPixelScript = document.createElement('script');
    blockedPixelScript.type = 'text/plain';
    blockedPixelScript.setAttribute('data-type', 'application/javascript');
    blockedPixelScript.setAttribute('data-name', 'meta-pixel');
    blockedPixelScript.textContent = [
        '!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?',
        'n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;',
        'n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;',
        't.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,',
        '"script","https://connect.facebook.net/en_US/fbevents.js");',
        'fbq("set","autoConfig",false,"' + metaPixelId + '");',
        'fbq("init","' + metaPixelId + '");',
        'fbq("track","PageView");'
    ].join('\n');
    document.head.appendChild(blockedPixelScript);
}());
