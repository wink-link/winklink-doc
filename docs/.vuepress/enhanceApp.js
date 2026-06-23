export default ({ router }) => {
  if (typeof process === 'undefined' || process.env.VUE_ENV !== 'server') {
    router.onReady(() => {
      const { app } = router;
      // original behaviour: scroll to hash once on first mount (direct URL loads)
      app.$once('hook:mounted', () => setTimeout(hashScroll, 500));
      // enhancements: initial render + retries, then observe SPA re-renders.
      // NOTE: deliberately NO router.afterEach hash-scroll — active-header-links
      // does router.replace(hash) on every scroll, and re-scrolling there makes
      // the page jump.
      [100, 500, 1500].forEach((d) => setTimeout(applyEnhancements, d));
      if (typeof MutationObserver !== 'undefined') {
        let t;
        new MutationObserver(() => {
          clearTimeout(t);
          t = setTimeout(applyEnhancements, 200);
        }).observe(document.body, { childList: true, subtree: true });
      }
    });
  }
};

function applyEnhancements() {
  if (typeof document === 'undefined') return;
  injectStyle();
  addAddressCopyButtons();
  addCodeCopyButtons();
}

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

// A "copy address" button after each feed-address link. The address is taken
// from the href (.../contract/<addr>), so it copies the address only.
function addAddressCopyButtons() {
  document.querySelectorAll('a[href*="/contract/T"]').forEach((link) => {
    if (link.dataset.copyAttached) return;
    const m = (link.getAttribute('href') || '').match(/\/contract\/(T[1-9A-HJ-NP-Za-km-z]{33})/);
    if (!m) return;
    link.dataset.copyAttached = '1';
    const addr = m[1];
    const btn = makeButton('addr-copy', 'Copy address');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      copyText(addr, btn);
    });
    link.insertAdjacentElement('afterend', btn);
  });
}

// A "copy code" button on each fenced code block.
function addCodeCopyButtons() {
  document.querySelectorAll('div[class*="language-"]').forEach((block) => {
    if (block.dataset.codeCopy) return;
    const code = block.querySelector('pre code') || block.querySelector('pre');
    if (!code) return;
    block.dataset.codeCopy = '1';
    const btn = makeButton('code-copy', 'Copy code');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      copyText((code.textContent || '').replace(/\n+$/, ''), btn);
    });
    block.appendChild(btn);
  });
}

function makeButton(cls, label) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = cls;
  btn.title = label;
  btn.setAttribute('aria-label', label);
  btn.innerHTML = COPY_ICON;
  return btn;
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
    // address copy button (inline, after the address link)
    '.addr-copy{display:inline-flex;align-items:center;justify-content:center;margin-left:6px;padding:1px;border:0;background:transparent;color:#9aa0a6;cursor:pointer;vertical-align:middle;line-height:1;position:relative}' +
    '.addr-copy:hover{color:#27aa6e}' +
    '.addr-copy.copied{color:#27aa6e}' +
    '.addr-copy.copied::after{content:"Copied";position:absolute;left:50%;transform:translateX(-50%);bottom:150%;background:#27aa6e;color:#fff;font-size:11px;line-height:1;padding:3px 6px;border-radius:4px;white-space:nowrap;pointer-events:none}' +
    // code-block copy button (top-right of the block, shown on hover)
    'div[class*="language-"]{position:relative}' +
    '.code-copy{position:absolute;top:8px;right:8px;z-index:3;display:inline-flex;align-items:center;justify-content:center;padding:5px;border:0;border-radius:5px;background:rgba(255,255,255,.12);color:#cfd2d6;cursor:pointer;opacity:0;transition:opacity .15s}' +
    'div[class*="language-"]:hover .code-copy{opacity:1}' +
    '.code-copy:hover{color:#fff;background:rgba(255,255,255,.22)}' +
    '.code-copy.copied{color:#27aa6e;opacity:1}' +
    '.code-copy.copied::after{content:"Copied";position:absolute;top:118%;right:0;background:#27aa6e;color:#fff;font-size:11px;line-height:1;padding:3px 6px;border-radius:4px;white-space:nowrap;pointer-events:none}';
  document.head.appendChild(s);
}
