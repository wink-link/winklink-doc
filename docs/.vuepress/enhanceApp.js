export default ({ router }) => {
  if (typeof process === 'undefined' || process.env.VUE_ENV !== 'server') {
    router.onReady(() => {
      // hash scroll (existing behaviour) — run a few times for async render
      [100, 500].forEach((d) => setTimeout(hashScroll, d));
      // add copy buttons now + retries, and keep watching for SPA re-renders
      [100, 500, 1500].forEach((d) => setTimeout(addCopyButtons, d));
      if (typeof MutationObserver !== 'undefined') {
        let t;
        new MutationObserver(() => {
          clearTimeout(t);
          t = setTimeout(addCopyButtons, 200);
        }).observe(document.body, { childList: true, subtree: true });
      }
    });
    router.afterEach(() => {
      setTimeout(hashScroll, 300);
      setTimeout(addCopyButtons, 300);
    });
  }
};

function hashScroll() {
  if (typeof document === 'undefined') return;
  const { hash } = document.location;
  if (hash.length > 1) {
    const el = document.getElementById(decodeURIComponent(hash.substring(1)));
    if (el) el.scrollIntoView();
  }
}

const COPY_ICON =
  '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';

// Append a "copy address" button after each feed-address link. The address is
// taken from the href (.../contract/<addr>), so it copies the address only.
function addCopyButtons() {
  if (typeof document === 'undefined') return;
  injectStyle();
  document.querySelectorAll('a[href*="/contract/T"]').forEach((link) => {
    if (link.dataset.copyAttached) return;
    const m = (link.getAttribute('href') || '').match(/\/contract\/(T[1-9A-HJ-NP-Za-km-z]{33})/);
    if (!m) return;
    link.dataset.copyAttached = '1';
    const addr = m[1];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'addr-copy';
    btn.title = 'Copy address';
    btn.setAttribute('aria-label', 'Copy address');
    btn.innerHTML = COPY_ICON;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      copyText(addr, btn);
    });
    link.insertAdjacentElement('afterend', btn);
  });
}

function copyText(text, btn) {
  const ok = () => {
    btn.classList.add('copied');
    setTimeout(() => btn.classList.remove('copied'), 1200);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(ok).catch(() => legacyCopy(text, ok));
  } else {
    legacyCopy(text, ok);
  }
}

function legacyCopy(text, ok) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    ok();
  } catch (e) {
    /* noop */
  }
  document.body.removeChild(ta);
}

function injectStyle() {
  if (document.getElementById('addr-copy-style')) return;
  const s = document.createElement('style');
  s.id = 'addr-copy-style';
  s.textContent =
    '.addr-copy{display:inline-flex;align-items:center;justify-content:center;margin-left:6px;padding:1px;border:0;background:transparent;color:#9aa0a6;cursor:pointer;vertical-align:middle;line-height:1;position:relative}' +
    '.addr-copy:hover{color:#27aa6e}' +
    '.addr-copy.copied{color:#27aa6e}' +
    '.addr-copy.copied::after{content:"Copied";position:absolute;left:50%;transform:translateX(-50%);bottom:150%;background:#27aa6e;color:#fff;font-size:11px;line-height:1;padding:3px 6px;border-radius:4px;white-space:nowrap;pointer-events:none}';
  document.head.appendChild(s);
}
