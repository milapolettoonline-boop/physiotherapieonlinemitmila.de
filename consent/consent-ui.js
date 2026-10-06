/* Persistent entry point for reopening or withdrawing consent choices. */
(function () {
    function addSettingsButton() {
        if (!document.body || document.getElementById('milaphysio-consent-settings')) return;

        var button = document.createElement('button');
        button.id = 'milaphysio-consent-settings';
        button.type = 'button';
        button.className = 'milaphysio-consent-settings';
        button.textContent = 'Cookie-Einstellungen';
        button.setAttribute('aria-label', 'Cookie-Einstellungen ändern oder widerrufen');
        button.addEventListener('click', function () {
            if (window.klaro && typeof window.klaro.show === 'function') {
                window.klaro.show();
            }
        });
        document.body.appendChild(button);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addSettingsButton, { once: true });
    } else {
        addSettingsButton();
    }
}());
