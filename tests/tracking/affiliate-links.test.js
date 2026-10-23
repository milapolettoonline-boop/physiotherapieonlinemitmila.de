// Classification tests for consent/tracking-events.js.
// Run with: node --test tests/tracking/
// No dependencies. The real script runs in a vm context with a minimal window and document,
// and no network is used. The test only reads the gtag calls the script would make.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const SCRIPT = path.join(__dirname, '..', '..', 'consent', 'tracking-events.js');
const SOURCE = fs.readFileSync(SCRIPT, 'utf8');

function loadPage(pathname) {
  const clickHandlers = [];
  const calls = [];
  const context = {
    console,
    URL,
    window: {
      location: { pathname, href: 'https://milaphysio.de' + pathname },
      gtag: (...args) => calls.push(args),
    },
    document: {
      addEventListener: (type, fn) => { if (type === 'click') clickHandlers.push(fn); },
    },
  };
  vm.createContext(context);
  vm.runInContext(SOURCE, context);
  return {
    click(href, attrs = {}) {
      const link = {
        getAttribute: (name) => (name === 'href' ? href : (attrs[name] ?? null)),
        hasAttribute: (name) => name === 'href' || Object.prototype.hasOwnProperty.call(attrs, name),
        closest: (selector) => (selector === 'a[href]' ? link : null),
      };
      clickHandlers.forEach((fn) => fn({ target: link }));
      return calls.filter((c) => c[0] === 'event').map((c) => ({ name: c[1], params: c[2] }));
    },
  };
}

const PRODUCT = '/beurer-em49.html';
const EBOOK = '/ebook/camila-poletto/index.html';

test('recognized affiliate hosts produce affiliate_outbound_click with the normalized domain', () => {
  const cases = [
    ['https://link.amazon/B0eR4SGiV', 'link.amazon'],
    ['https://amzn.to/4zeu9AC', 'amzn.to'],
    ['https://www.amazon.de/dp/B000TEST', 'amazon.de'],
    ['https://amazon.com/dp/B000TEST', 'amazon.com'],
    ['https://amzn.eu/x', 'amzn.eu'],
    ['https://a.co/x', 'a.co'],
  ];
  for (const [href, domain] of cases) {
    const events = loadPage(PRODUCT).click(href);
    assert.equal(events.length, 1, href);
    assert.equal(events[0].name, 'affiliate_outbound_click', href);
    assert.equal(events[0].params.link_domain, domain, href);
  }
});

test('recognized hosts on an e-book page produce ebook_buy_click and keep book attributes', () => {
  const events = loadPage(EBOOK).click('https://link.amazon/B05ca6jzw', {
    'data-book-title': 'Schluss mit Nackenschmerzen im Büro',
    'data-book-language': 'de',
  });
  assert.equal(events.length, 1);
  assert.equal(events[0].name, 'ebook_buy_click');
  assert.equal(events[0].params.link_domain, 'link.amazon');
  assert.equal(events[0].params.book_title, 'Schluss mit Nackenschmerzen im Büro');
  assert.equal(events[0].params.book_language, 'de');
});

test('amazon.de author store on an e-book page is ebook_buy_click', () => {
  const events = loadPage(EBOOK).click('https://www.amazon.de/stores/Camila-Poletto/author/B0HNHSWWSG/allbooks');
  assert.deepEqual(events.map((e) => e.name), ['ebook_buy_click']);
  assert.equal(events[0].params.link_domain, 'amazon.de');
});

test('look-alike and unrelated hosts are rejected', () => {
  const rejected = [
    'https://link.amazon.evil.example/x',
    'https://amazon.de.evil.example/x',
    'https://amzn.to.evil.example/x',
    'https://notamazon.de/x',
    'https://evil-amzn.to/x',
    'https://xa.co/x',
    'https://a.co.evil.example/x',
    'https://amazonaws.com/x',
    'https://link.amazonaws.com/x',
    'https://amazon.de@evil.example/x',
    'https://www.instagram.com/x',
    'https://amazon/x',
  ];
  for (const href of rejected) {
    assert.deepEqual(loadPage(PRODUCT).click(href), [], href);
  }
});

test('event parameters never carry the URL, its query or a tag', () => {
  const events = loadPage(PRODUCT).click('https://link.amazon/B0eR4SGiV?tag=secret-tag-123&ref=abc');
  assert.equal(events.length, 1);
  const serialized = JSON.stringify(events[0].params);
  assert.ok(!serialized.includes('https://'), serialized);
  assert.ok(!serialized.includes('secret-tag-123'), serialized);
  assert.ok(!serialized.includes('?'), serialized);
  assert.ok(!serialized.includes('B0eR4SGiV'), serialized);
});

test('Hausbesuch package buttons (data-package) do not produce calendly_click', () => {
  const events = loadPage(PRODUCT).click('https://calendly.com/milapoletto-online/hausbesuch-kg-30-min', {
    'data-package': 'KG',
  });
  assert.deepEqual(events, []);
});
