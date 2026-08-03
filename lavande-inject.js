/* ============================================================
   Lavande · Branded header + footer injector
   For any WordPress page or post that doesn't have them baked in.
   Homepage (body.home / body.page-id-20) is skipped.
   No inline HTML assignment — uses DOMParser for XSS safety.
   Mobile: hamburger toggle → full-height drawer.
   ============================================================ */
(function () {
  var HOME = "https://lavandenailscafe.com/";
  var JOURNAL = "https://lavandenailscafe.com/journal/";
  var FRESHA = "https://www.fresha.com/a/lavande-nails-cafe-makati-the-manila-bankers-prosperity-tower-yw8rrfav/booking";
  var IG = "https://www.instagram.com/lavande.ph/";
  var FB = "https://www.facebook.com/profile.php?id=61590822413373";

  var HEADER_HTML = [
    '<a href="#lav-main" class="lavande-skip-link">Skip to content</a>',
    '<nav class="lavande-nav" aria-label="Primary navigation">',
      '<div class="container">',
        '<a href="', HOME, '" class="brand" aria-label="Lavande Nails and Cafe home"><img src="https://lavandenailscafe.com/wp-content/uploads/2026/07/lavande-logo-primary-mauve.png" alt="Lavande Nails and Cafe" /></a>',
        '<ul class="lavande-nav-links">',
          '<li><a href="', HOME, '#rituals">Rituals</a></li>',
          '<li><a href="', HOME, '#cafe">Cafe</a></li>',
          '<li><a href="', HOME, '#founder">About</a></li>',
          '<li><a href="', JOURNAL, '">Journal</a></li>',
          '<li><a href="', HOME, '#visit">Visit</a></li>',
        '</ul>',
        '<a class="reserve" href="', FRESHA, '" target="_blank" rel="noopener" aria-label="Reserve a nail ritual on Fresha (opens in new tab)">Reserve</a>',
        '<button class="lavande-hamburger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="lavande-drawer">',
          '<span></span><span></span><span></span>',
        '</button>',
      '</div>',
      '<div class="lavande-drawer" id="lavande-drawer" aria-hidden="true">',
        '<ul>',
          '<li><a href="', HOME, '#rituals">Rituals</a></li>',
          '<li><a href="', HOME, '#cafe">Cafe</a></li>',
          '<li><a href="', HOME, '#founder">About</a></li>',
          '<li><a href="', JOURNAL, '">Journal</a></li>',
          '<li><a href="', HOME, '#visit">Visit</a></li>',
          '<li class="drawer-cta"><a href="', FRESHA, '" target="_blank" rel="noopener">Reserve on Fresha</a></li>',
        '</ul>',
      '</div>',
    '</nav>'
  ].join('');

  var FOOTER_HTML = [
    '<footer class="lavande-footer">',
      '<div class="container">',
        '<div class="brand-block">',
          '<img src="https://lavandenailscafe.com/wp-content/uploads/2026/07/lavande-logo-primary-white.png" alt="Lavande Nails and Cafe" class="footer-logo" />',
          '<p>A sanctuary between moments.</p>',
        '</div>',
        '<div><h4>Visit</h4><p>110 Legaspi Street<br>Legaspi Village<br>Makati 1229<br>Philippines</p></div>',
        '<div><h4>Hours</h4><p>Tuesday to Sunday<br>10:00 AM to 8:00 PM<br>Closed Mondays</p>',
        '<p style="margin-top:1.25rem"><a href="', IG, '" target="_blank" rel="noopener">Instagram . @lavande.ph</a><br><a href="', FB, '" target="_blank" rel="noopener">Facebook . Lavande</a></p></div>',
      '</div>',
      '<div class="bottom"><span>&copy; 2026 Lavande Nails and Cafe</span><span>Built by Bots at Work</span></div>',
    '</footer>'
  ].join('');

  function parse(str) {
    var doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.body.firstChild;
  }

  function wireHamburger() {
    var btn = document.querySelector('.lavande-hamburger');
    var drawer = document.getElementById('lavande-drawer');
    if (!btn || !drawer) return;
    function close() {
      document.body.classList.remove('lav-menu-open');
      btn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    }
    function open() {
      document.body.classList.add('lav-menu-open');
      btn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
    }
    btn.addEventListener('click', function () {
      if (document.body.classList.contains('lav-menu-open')) close();
      else open();
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('lav-menu-open')) close();
    });
  }

  function inject() {
    var b = document.body;
    if (!b) return;
    if (b.classList.contains('home') || b.classList.contains('page-id-20')) return;
    if (document.querySelector('.lavande-nav')) return;

    var themeHeaders = document.querySelectorAll('header.wp-block-template-part');
    themeHeaders.forEach(function (el) { el.style.setProperty('display', 'none', 'important'); });
    var themeFooters = document.querySelectorAll('footer.wp-block-template-part');
    themeFooters.forEach(function (el) { el.style.setProperty('display', 'none', 'important'); });

    // Hoist any SEO meta tags from post content into <head> (same trick as homepage)
    var root = document.querySelector('.lavande-article-root, .lavande-page');
    if (root) {
      var sels = ['meta[name="description"]','meta[name="keywords"]','meta[property^="og:"]','meta[name^="twitter:"]','meta[name^="geo."]','meta[name="ICBM"]','meta[name="robots"]','meta[name="author"]','link[rel="icon"]','link[rel="apple-touch-icon"]','link[rel="canonical"]'];
      sels.forEach(function (s) {
        root.querySelectorAll(s).forEach(function (t) { document.head.appendChild(t); });
      });
    }

    // Insert skip link + nav nodes at the top of body
    var doc = new DOMParser().parseFromString(HEADER_HTML, 'text/html');
    var nodes = Array.prototype.slice.call(doc.body.childNodes);
    for (var i = nodes.length - 1; i >= 0; i--) {
      b.insertBefore(nodes[i], b.firstChild);
    }
    // Tag main content wrapper so skip-link works
    var main = document.querySelector('main, .wp-site-blocks > .wp-block-group, .lavande-article-root, article');
    if (main && !main.id) main.id = 'lav-main';
    var foot = parse(FOOTER_HTML);
    if (foot) b.appendChild(foot);

    // Editorial title split — if the post title contains ?, :, or "—",
    // split it into a display "main" line + smaller "sub" line
    var titleEl = document.querySelector('.wp-block-post-title, .entry-title, h1.entry-title');
    if (titleEl && !titleEl.querySelector('.lav-title-main')) {
      var raw = titleEl.textContent.trim();
      var splitIdx = -1;
      var qIdx = raw.indexOf('?');
      var cIdx = raw.indexOf(':');
      var eIdx = raw.indexOf(' — ');
      if (qIdx > 0 && qIdx < raw.length - 3) splitIdx = qIdx + 1;
      else if (cIdx > 0 && cIdx < raw.length - 3) splitIdx = cIdx + 1;
      else if (eIdx > 0) splitIdx = eIdx;
      if (splitIdx > 0) {
        var mainText = raw.slice(0, splitIdx).trim();
        var subText = raw.slice(splitIdx).trim();
        if (subText.length > 0) {
          while (titleEl.firstChild) titleEl.removeChild(titleEl.firstChild);
          var mainSpan = document.createElement('span');
          mainSpan.className = 'lav-title-main';
          mainSpan.textContent = mainText;
          var subSpan = document.createElement('span');
          subSpan.className = 'lav-title-sub';
          subSpan.textContent = subText;
          titleEl.appendChild(mainSpan);
          titleEl.appendChild(subSpan);
        }
      }
    }

    wireHamburger();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
