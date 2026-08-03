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
    loadJournalArchive();
  }

  // ------------------------------------------------------------
  // Journal archive loader — fires only on the /journal/ page
  // which contains a #lav-journal-grid container.
  // Pure DOM API: no innerHTML, no string-concatenated HTML.
  // ------------------------------------------------------------
  function decodeEntities(s) {
    // WP REST returns titles/excerpts with HTML entities like &#8217; and &amp;
    // Convert them to plain characters for use with textContent.
    var t = document.createElement('textarea');
    t.innerHTML = s;
    return t.value;
  }
  function fmtDate(iso) {
    try {
      var d = new Date(iso);
      var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return m[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    } catch (e) { return ''; }
  }
  function stripTags(html) {
    // Extract text from HTML by parsing and reading textContent — safe, no eval
    var doc = new DOMParser().parseFromString(html || '', 'text/html');
    return doc.body.textContent || '';
  }
  function emptyMsg(grid, msg) {
    while (grid.firstChild) grid.removeChild(grid.firstChild);
    var div = document.createElement('div');
    div.style.gridColumn = '1/-1';
    div.style.textAlign = 'center';
    div.style.color = '#8b7a9c';
    div.style.fontFamily = 'Manrope,sans-serif';
    div.style.padding = '3rem 0';
    div.textContent = msg;
    grid.appendChild(div);
  }
  function buildCard(p) {
    var media = (p._embedded && p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'][0]) || null;
    var imgUrl = (media && media.source_url) ? media.source_url : 'https://lavandenailscafe.com/wp-content/uploads/2026/07/lavande-wisteria-interior-v2-scaled.jpg';
    var alt = (media && media.alt_text) ? decodeEntities(media.alt_text) : decodeEntities(p.title.rendered || 'Journal entry');
    var title = decodeEntities(p.title.rendered || '');
    var link = p.link;
    var date = fmtDate(p.date);
    var excerpt = stripTags(p.excerpt && p.excerpt.rendered).trim();
    if (excerpt.length > 180) excerpt = excerpt.slice(0, 177).trim() + '…';

    var a = document.createElement('a');
    a.href = link;
    a.className = 'journal-card';

    var imgWrap = document.createElement('div');
    imgWrap.className = 'card-image';
    var img = document.createElement('img');
    img.src = imgUrl;
    img.alt = alt;
    img.loading = 'lazy';
    imgWrap.appendChild(img);
    a.appendChild(imgWrap);

    var meta = document.createElement('div');
    meta.className = 'card-meta';
    meta.textContent = date + '  ·  Lavande Editorial';
    a.appendChild(meta);

    var h2 = document.createElement('h2');
    h2.textContent = title;
    a.appendChild(h2);

    var p2 = document.createElement('p');
    p2.className = 'card-excerpt';
    p2.textContent = excerpt;
    a.appendChild(p2);

    var read = document.createElement('span');
    read.className = 'card-read-more';
    read.textContent = 'Read the entry';
    a.appendChild(read);

    return a;
  }
  function loadJournalArchive() {
    var grid = document.getElementById('lav-journal-grid');
    if (!grid) return;
    fetch('/wp-json/wp/v2/posts?categories=4&per_page=20&_embed=wp:featuredmedia&orderby=date&order=desc')
      .then(function (r) { return r.json(); })
      .then(function (posts) {
        if (!Array.isArray(posts) || !posts.length) {
          emptyMsg(grid, 'New editorial entries coming soon.');
          return;
        }
        while (grid.firstChild) grid.removeChild(grid.firstChild);
        posts.forEach(function (p) { grid.appendChild(buildCard(p)); });
      })
      .catch(function () {
        emptyMsg(grid, 'Journal entries could not be loaded. Please refresh.');
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
