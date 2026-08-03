/* ============================================================
   Lavande · Branded header + footer injector
   For any WordPress page or post that doesn't have them baked in.
   Homepage (body.home / body.page-id-20) is skipped.
   No inline HTML assignment — uses DOMParser for XSS safety.
   ============================================================ */
(function () {
  var HOME = "https://lavandenailscafe.com/";
  var FRESHA = "https://www.fresha.com/a/lavande-nails-cafe-makati-the-manila-bankers-prosperity-tower-yw8rrfav/booking";
  var IG = "https://www.instagram.com/lavande.ph/";
  var FB = "https://www.facebook.com/profile.php?id=61590822413373";

  var HEADER_HTML = [
    '<a href="#lav-main" class="lavande-skip-link">Skip to content</a>',
    '<nav class="lavande-nav" aria-label="Primary navigation">',
      '<div class="container">',
        '<a href="', HOME, '" class="brand" aria-label="Lavande Nails and Cafe home"><img src="https://lavandenailscafe.com/wp-content/uploads/2026/07/lavande-logo-primary-mauve.png" alt="Lavande Nails and Cafe" /></a>',
        '<ul>',
          '<li><a href="', HOME, '#rituals">Rituals</a></li>',
          '<li><a href="', HOME, '#cafe">Cafe</a></li>',
          '<li><a href="', HOME, '#founder">About</a></li>',
          '<li><a href="', HOME, '#visit">Visit</a></li>',
        '</ul>',
        '<a class="reserve" href="', FRESHA, '" target="_blank" rel="noopener" aria-label="Reserve a nail ritual on Fresha (opens in new tab)">Reserve</a>',
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

    // Insert skip link + nav as two nodes at the top of body
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
