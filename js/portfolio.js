// Portfolio screen state machine — G-01 through G-04
(function () {

  // ── 1. Wormhole observer (preserved) ───────────────────────────────────
  var wrapper = document.getElementById('portfolio-wrapper');
  var canvas  = document.querySelector('canvas.experience');

  if (wrapper && canvas) {
    function hidePhase1Text() {
      var introText   = document.getElementById('intro-text');
      var tunnelTexts = document.querySelectorAll('.tunnel-text');
      if (introText) {
        introText.style.opacity       = '0';
        introText.style.visibility    = 'hidden';
        introText.style.pointerEvents = 'none';
      }
      tunnelTexts.forEach(function (el) {
        el.style.opacity       = '0';
        el.style.visibility    = 'hidden';
        el.style.pointerEvents = 'none';
      });
    }

    if (canvas.style.display === 'none') {
      hidePhase1Text();
      wrapper.style.display = 'block';
      initPortfolio();
    } else {
      new MutationObserver(function (mutations, obs) {
        if (canvas.style.display === 'none') {
          hidePhase1Text();
          wrapper.style.display = 'block';
          obs.disconnect();
          initPortfolio();
        }
      }).observe(canvas, { attributes: true, attributeFilter: ['style'] });
    }
  }

  // ── 2. Project data ────────────────────────────────────────────────────
  var PROJECTS = [
    {
      id: 1,
      title: 'Zomo',
      tagline: "Rethinking India’s busiest food-order experience",
      tint: 'rgba(120,80,200,0.40)',
      meta: [
        { label: 'YEAR',     value: '2025' },
        { label: 'TYPE',     value: 'UX Research · Mobile App' },
        { label: 'DURATION', value: '12-week project' },
        { label: 'ROLE',     value: 'Lead UX Designer' },
      ],
      overview: "Zomo is a redesign of India’s most-used food delivery experience. The project involved deep field research with delivery partners and customers, a complete audit of the existing flow, and an end-to-end prototype of the checkout and order-tracking journey.",
      behance: '#',
    },
    {
      id: 2,
      title: 'Artha',
      tagline: "Simplifying personal finance for India’s new investors",
      tint: 'rgba(40,120,160,0.40)',
      meta: [
        { label: 'YEAR',     value: '2024' },
        { label: 'TYPE',     value: 'Fintech · Product Design' },
        { label: 'DURATION', value: '8-week project' },
        { label: 'ROLE',     value: 'Product Designer' },
      ],
      overview: "Artha is a personal finance app designed for first-time investors in India. The design system was built from scratch with a focus on clarity, trust, and progressive disclosure of complex financial concepts.",
      behance: '#',
    },
    {
      id: 3,
      title: 'Noise Audio',
      tagline: 'Audio app redesign — playful, haptic-first interactions',
      tint: 'rgba(140,40,60,0.40)',
      meta: [
        { label: 'YEAR',     value: '2024' },
        { label: 'TYPE',     value: 'Audio App · Redesign' },
        { label: 'DURATION', value: '6-week project' },
        { label: 'ROLE',     value: 'UX + Motion Designer' },
      ],
      overview: "A full redesign of the Noise companion app, with a focus on tactile feedback, spatial audio controls, and a radically simplified equaliser interface. Prototyped in Origami Studio.",
      behance: '#',
    },
    {
      id: 4,
      title: 'Noise Watch OS',
      tagline: 'WearOS design system for Noise smartwatches',
      tint: 'rgba(40,120,80,0.40)',
      meta: [
        { label: 'YEAR',     value: '2022' },
        { label: 'TYPE',     value: 'WearOS · Design System' },
        { label: 'DURATION', value: 'Internship · 1 year' },
        { label: 'ROLE',     value: 'Design Intern' },
      ],
      overview: "During my internship at Noise, I contributed to the WearOS design system — creating a token-based component library for the new smartwatch lineup, with a focus on glanceability and one-hand navigation.",
      behance: '#',
    },
  ];

  // ── 3. Chat keyword → reply map ────────────────────────────────────────
  var CHAT_REPLIES = [
    { kw: ['process','how','approach','method','workflow'],
      reply: "My process is research-first — I spend a lot of time with users before touching Figma. Discovery → synthesis → ideation → prototype → test → iterate. I care a lot about the ‘why’ before the ‘what’." },
    { kw: ['tool','figma','framer','stack','software','origami','cursor'],
      reply: "Figma for design + prototyping, Framer for production-ready web prototypes, Origami for haptic/gesture-heavy flows, After Effects for motion, Cursor for front-end experiments. I prototype in code more than most designers." },
    { kw: ['available','hire','freelance','job','opportunit','open','looking'],
      reply: "Yes! Open to select freelance projects and full-time roles. Best reached at hello@aaradhya.in — or book a 30-min call at cal.com/aaradhya." },
    { kw: ['contact','reach','email','call','book','meeting'],
      reply: "Best way: hello@aaradhya.in. Also on Behance and LinkedIn. For a proper intro call, cal.com/aaradhya." },
    { kw: ['resume','cv','download'],
      reply: "Download my resume using the ‘View Resume ↗’ button in the left panel — opens as a PDF." },
    { kw: ['zomo','food','delivery'],
      reply: "Zomo was a 12-week UX research + design project rethinking India’s busiest food-order experience. Tap the hero card to read the full case study." },
    { kw: ['artha','finance','fintech','invest'],
      reply: "Artha is a personal finance app designed for India’s new investors — lots of progressive disclosure and trust-building UX patterns." },
    { kw: ['noise','audio','watch','wear'],
      reply: "I did two Noise projects: the Audio app redesign (haptic-first, Origami-prototyped) and the WearOS design system from my internship." },
    { kw: ['education','study','college','nid','degree'],
      reply: "B.Des in Communication Design from NID Ahmedabad (2018–2022). NID is where I fell in love with systems thinking." },
    { kw: ['location','delhi','india','remote','relocat'],
      reply: "Based in Delhi, India (GMT+5:30). Remote-first — I’ve collaborated with teams across 3 time zones." },
    { kw: ['work','project','case','show'],
      reply: "I have 4 case studies — Zomo, Artha, Noise Audio, and Noise Watch OS. Tap any project card to explore them." },
  ];
  var FALLBACK = "Hmm, I didn’t quite catch that — try asking about my process, tools, projects, or availability. Or reach me at hello@aaradhya.in!";

  // -- 3b. Sanity live-data loader
  var TINTS = [
    'rgba(120,80,200,0.40)',
    'rgba(40,120,160,0.40)',
    'rgba(140,40,60,0.40)',
    'rgba(40,120,80,0.40)',
  ];

  function applyOrbitFigures(figures) {
    var orbitEl = document.getElementById('screen-orbit');
    if (!orbitEl) return;
    var map = {};
    figures.forEach(function (f) {
      if (f.figureId && f.url) map[f.figureId] = f;
    });
    orbitEl.querySelectorAll('[data-figure-id]').forEach(function (placeholder) {
      var id  = placeholder.getAttribute('data-figure-id');
      var fig = map[id];
      if (!fig) return;
      placeholder.innerHTML = '';
      placeholder.classList.add('has-image');
      var img = document.createElement('img');
      img.src = fig.url;
      img.alt = 'Figure ' + id;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;border-radius:4px;';
      placeholder.appendChild(img);
      if (fig.caption) {
        var caption = placeholder.nextElementSibling;
        if (caption && caption.classList.contains('doc-asset-caption')) {
          caption.textContent = fig.caption;
        }
      }
    });
  }

  // Warm the browser cache for a set of image URLs so they appear instantly
  // when the user navigates. Resolves once all settle or after a safety cap,
  // reporting progress to the preloader along the way.
  function preloadImages(urls) {
    return new Promise(function (resolve) {
      var list = (urls || []).filter(Boolean);
      var total = list.length;
      if (!total) { resolve(); return; }
      var loaded  = 0;
      var settled = false;
      function finish() { if (!settled) { settled = true; resolve(); } }
      function bump() {
        loaded++;
        if (window.Preloader) window.Preloader.setAssetProgress(loaded / total);
        if (loaded >= total) finish();
      }
      // A single broken/slow image must not stall the reveal.
      setTimeout(finish, 6000);
      list.forEach(function (url) {
        var img = new Image();
        img.onload = bump;
        img.onerror = bump;
        img.src = url;
      });
    });
  }

  function signalSanityDone() {
    if (window.Preloader) window.Preloader.pass('sanity');
  }
  function signalAssetsDone() {
    if (window.Preloader) window.Preloader.pass('assets');
  }

  function fetchSanityData() {
    var base = 'https://svn8kxqj.apicdn.sanity.io/v2021-10-21/data/query/production?query=';
    var projectQuery = encodeURIComponent('*[_type == "project"] | order(order asc) {title, order, tagline, role, industry, platform, duration, year, overview, behance, nda, "images": images[].asset->url}');
    var chatQuery    = encodeURIComponent('*[_type == "chatbotResponse"] {keyword, response}');
    var profileQuery = encodeURIComponent('*[_type == "profile"][0] {statusText, progressValue}');
    var orbitQuery   = encodeURIComponent('*[_type == "orbitCaseStudy"].figures[]{ figureId, "url": image.asset->url, caption }');
    try {
      Promise.all([
        fetch(base + projectQuery).then(function (r) { return r.json(); }),
        fetch(base + chatQuery).then(function (r) { return r.json(); }),
        fetch(base + profileQuery).then(function (r) { return r.json(); }),
        fetch(base + orbitQuery).then(function (r) { return r.json(); }),
      ]).then(function (results) {
        var sanityProjects = results[0].result;
        var sanityChat     = results[1].result;
        var sanityProfile  = results[2].result;
        var sanityOrbit    = results[3].result;
        if (sanityProjects && sanityProjects.length) {
          PROJECTS = sanityProjects.map(function (p) {
            var type = [p.industry, p.platform].filter(Boolean).join(' / ');
            var meta = [];
            if (p.year)     meta.push({ label: 'YEAR',     value: p.year });
            if (type)       meta.push({ label: 'TYPE',     value: type });
            if (p.duration) meta.push({ label: 'DURATION', value: p.duration });
            if (p.role)     meta.push({ label: 'ROLE',     value: p.role });
            return {
              id:       p.order,
              title:    p.title,
              tagline:  p.tagline  || '',
              tint:     TINTS[(p.order - 1) % TINTS.length],
              meta:     meta,
              overview: p.overview || '',
              behance:  p.behance  || '#',
              nda:      p.nda      || false,
              images:   p.images   || [],
            };
          });
        }
        if (sanityChat && sanityChat.length) {
          CHAT_REPLIES = sanityChat.map(function (c) {
            return { kw: [c.keyword], reply: c.response };
          });
        }
        if (sanityProfile) {
          var statusEl = document.getElementById('profile-status-text');
          var valEl    = document.getElementById('profile-progress-val');
          var fillEl   = document.getElementById('profile-progress-fill');
          if (statusEl && sanityProfile.statusText)   statusEl.textContent = sanityProfile.statusText;
          if (valEl    && sanityProfile.progressValue != null) valEl.textContent  = sanityProfile.progressValue + '%';
          if (fillEl   && sanityProfile.progressValue != null) fillEl.style.width = sanityProfile.progressValue + '%';
        }
        if (sanityOrbit && sanityOrbit.length) {
          applyOrbitFigures(sanityOrbit);
        }

        // Content is in — release the sanity gate, then warm EVERY image that
        // a screen can show (all orbit figures + every project's full carousel)
        // so navigation is instant on first visit, not just the second.
        signalSanityDone();
        var preloadUrls = [];
        if (sanityOrbit && sanityOrbit.length) {
          sanityOrbit.forEach(function (f) { if (f && f.url) preloadUrls.push(f.url); });
        }
        if (typeof PROJECTS !== 'undefined' && PROJECTS.forEach) {
          PROJECTS.forEach(function (p) {
            if (p.images && p.images.length) {
              p.images.forEach(function (u) { if (u) preloadUrls.push(u); });
            }
          });
        }
        preloadImages(preloadUrls).then(signalAssetsDone);
      }).catch(function () {
        // Network/Sanity failure must not strand the preloader.
        signalSanityDone();
        signalAssetsDone();
      });
    } catch (e) {
      signalSanityDone();
      signalAssetsDone();
    }
  }


  // ── 4. State ───────────────────────────────────────────────────────────
  var state = { screen: 'home', project: 1 };

  // ── 5. Screen transition ───────────────────────────────────────────────
  function goTo(screenName, projectIdx) {
    var prev = document.getElementById('screen-' + state.screen);
    var next = document.getElementById('screen-' + screenName);
    if (!next) return;

    if (state.screen === 'project' && screenName !== 'project') stopCarouselTimer();

    if (prev && prev !== next) {
      prev.style.opacity       = '0';
      prev.style.pointerEvents = 'none';
    }

    state.screen = screenName;
    if (projectIdx !== undefined) state.project = projectIdx;

    if (screenName === 'project') populateProject(state.project);

    setTimeout(function () {
      next.style.opacity       = '1';
      next.style.pointerEvents = 'auto';
    }, 180);
  }

  // ── 6. Populate G-02 ──────────────────────────────────────────────────
  var carouselIdx   = 0;
  var carouselTimer = null;
  var autoScrollEnabled = true;

  function stopCarouselTimer() {
    if (carouselTimer) { clearInterval(carouselTimer); carouselTimer = null; }
  }

  function startCarouselTimer() {
    stopCarouselTimer();
    carouselTimer = setInterval(nextSlide, 5000);
  }

  function populateProject(idx) {
    var p = PROJECTS[idx - 1];
    if (!p) return;

    // Counter (Project Orbit has its own page, so carousel is 3 projects)
    var counterEl = document.getElementById('g2-counter');
    if (counterEl) counterEl.textContent = '0' + p.id + ' / 03';

    // Meta rows — clear and rebuild from data
    var metaPanel = document.getElementById('meta-panel');
    if (metaPanel) {
      var oldRows = metaPanel.querySelectorAll('.meta-row');
      oldRows.forEach(function (row) { row.parentNode.removeChild(row); });
      p.meta.forEach(function (item) {
        var row = document.createElement('div');
        row.className = 'meta-row';
        row.innerHTML = '<span class="meta-key">' + item.label + '</span><span class="meta-val">' + item.value + '</span>';
        metaPanel.appendChild(row);
      });
    }

    // Overview text
    var overviewEl = document.querySelector('#overview-panel .overview-text');
    if (overviewEl) overviewEl.textContent = p.overview || '';

    // Carousel images
    carouselIdx = 0;
    var carousel = document.querySelector('.hero-carousel');
    if (carousel) {
      carousel.innerHTML = '';
      var imgs = (p.images && p.images.length) ? p.images : [null];
      imgs.forEach(function (url, i) {
        var slide = document.createElement('div');
        slide.className = 'carousel-slide';
        if (url) {
          var img = document.createElement('img');
          img.src = url;
          img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
          slide.appendChild(img);
        }
        slide.style.transform = (i === 0) ? 'translateX(0)' : 'translateX(100%)';
        carousel.appendChild(slide);
      });
      if (imgs.length > 1 && autoScrollEnabled) startCarouselTimer();
    }
  }

  function prevSlide() {
    var slides = document.querySelectorAll('.hero-carousel .carousel-slide');
    if (slides.length <= 1) return;
    var outgoing = slides[carouselIdx];
    carouselIdx = (carouselIdx - 1 + slides.length) % slides.length;
    var incoming = slides[carouselIdx];
    incoming.style.transition = 'none';
    incoming.style.transform  = 'translateX(-100%)';
    incoming.offsetHeight;
    incoming.style.transition = '';
    outgoing.style.transform  = 'translateX(100%)';
    incoming.style.transform  = 'translateX(0)';
  }

  function nextSlide() {
    var slides = document.querySelectorAll('.hero-carousel .carousel-slide');
    if (slides.length <= 1) return;
    var outgoing = slides[carouselIdx];
    carouselIdx = (carouselIdx + 1) % slides.length;
    var incoming = slides[carouselIdx];
    incoming.style.transition = 'none';
    incoming.style.transform  = 'translateX(100%)';
    incoming.offsetHeight;
    incoming.style.transition = '';
    outgoing.style.transform  = 'translateX(-100%)';
    incoming.style.transform  = 'translateX(0)';
  }

  // ── 7. Chat helpers ────────────────────────────────────────────────────
  function getReply(text) {
    var lower = text.toLowerCase();
    for (var i = 0; i < CHAT_REPLIES.length; i++) {
      var entry = CHAT_REPLIES[i];
      for (var j = 0; j < entry.kw.length; j++) {
        if (lower.indexOf(entry.kw[j]) !== -1) return entry.reply;
      }
    }
    return FALLBACK;
  }

  function appendBubble(container, text, who) {
    var b = document.createElement('div');
    b.className = 'chat-bubble chat-bubble--' + who;
    b.textContent = text;
    container.appendChild(b);
    container.scrollTop = container.scrollHeight;
    return b;
  }

  async function fetchAIReply(message) {
    try {
      var res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message }),
      });
      if (!res.ok) return null;
      var data = await res.json();
      return (data && typeof data.reply === 'string' && data.reply.trim())
        ? data.reply.trim()
        : null;
    } catch (_) {
      return null;
    }
  }

  var chatMsgCount = 0;
  var CHAT_LIMIT_TEXT = "You've reached the chat limit for this session — thanks for chatting! For anything else, reach out directly at aaradhyagautam2017@gmail.com."; // PLACEHOLDER TEXT - confirm final wording

  function lockChatInputs() {
    ['home-input', 'chat-input', 'chat-active-input'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) { el.disabled = true; el.placeholder = 'Chat limit reached'; }
    });
    ['home-send', 'chat-send', 'chat-active-send'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.disabled = true;
    });
  }

  function sendHomeChat(text) {
    if (!text.trim()) return;
    var msg = text.trim();
    showChatOverlay();
    setTimeout(function () {
      var conv = document.getElementById('g3-conversation');
      if (!conv) return;
      appendBubble(conv, msg, 'user');
      chatMsgCount++;
      if (chatMsgCount > 10) {
        appendBubble(conv, CHAT_LIMIT_TEXT, 'bot');
        lockChatInputs();
        return;
      }
      var thinking = appendBubble(conv, '…', 'bot');
      fetchAIReply(msg).then(function (reply) {
        thinking.textContent = reply !== null ? reply : getReply(msg);
        conv.scrollTop = conv.scrollHeight;
      });
    }, 120);
  }

  function sendActiveChat(text) {
    if (!text.trim()) return;
    var msg = text.trim();
    var conv = document.getElementById('chat-conversation');
    if (!conv) return;
    appendBubble(conv, msg, 'user');
    chatMsgCount++;
    if (chatMsgCount > 10) {
      appendBubble(conv, CHAT_LIMIT_TEXT, 'bot');
      lockChatInputs();
      return;
    }
    var thinking = appendBubble(conv, '…', 'bot');
    fetchAIReply(msg).then(function (reply) {
      thinking.textContent = reply !== null ? reply : getReply(msg);
      conv.scrollTop = conv.scrollHeight;
    });
  }

  // ── 8. Event bindings ─────────────────────────────────────────────────
  function bindEvents() {

    // G-01 · project cards → G-02 (or orbit for card 4)
    document.querySelectorAll('.project-card[data-project]').forEach(function (card) {
      card.addEventListener('click', function () {
        var idx = parseInt(card.getAttribute('data-project'), 10);
        if (idx === 4) {
          var orbitEl = document.getElementById('screen-orbit');
          if (orbitEl) orbitEl.scrollTop = 0;
          goTo('orbit');
        } else {
          goTo('project', idx);
        }
      });
    });

    // Orbit · back buttons → home
    var orbitBackBtn  = document.getElementById('orbit-back-btn');
    var orbitLogoBtn  = document.getElementById('orbit-logo-btn');
    function leaveOrbit() {
      var orbitEl = document.getElementById('screen-orbit');
      if (orbitEl) orbitEl.scrollTop = 0;
      goTo('home');
    }
    if (orbitBackBtn) orbitBackBtn.addEventListener('click', leaveOrbit);
    if (orbitLogoBtn) orbitLogoBtn.addEventListener('click', leaveOrbit);

    // G-01 · About Me → G-04
    var btnAbout = document.getElementById('btn-about');
    if (btnAbout) btnAbout.addEventListener('click', function () { goTo('about'); });

    // G-01 · home chips → G-03
    document.querySelectorAll('#home-chips .chat-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        sendHomeChat(chip.getAttribute('data-prompt'));
      });
    });

    // G-01 · home input → G-03
    var homeInput = document.getElementById('home-input');
    var homeSend  = document.getElementById('home-send');
    if (homeInput) {
      homeInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { sendHomeChat(homeInput.value); homeInput.value = ''; }
      });
      homeInput.addEventListener('focus', function () { showChatOverlay(); });
    }
    if (homeSend) {
      homeSend.addEventListener('click', function () {
        var v = homeInput ? homeInput.value : '';
        sendHomeChat(v);
        if (homeInput) homeInput.value = '';
      });
    }

    var chatInput = document.getElementById('chat-input');
    var chatSend  = document.getElementById('chat-send');
    if (chatInput) {
      chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { sendHomeChat(chatInput.value); chatInput.value = ''; }
      });
    }
    if (chatSend) {
      chatSend.addEventListener('click', function() { sendHomeChat(chatInput.value); chatInput.value = ''; });
    }

    // G-02 · back / prev / next
    var projBack = document.getElementById('project-back');
    if (projBack) projBack.addEventListener('click', function () { goTo('home'); });

    var projPrev = document.getElementById('project-prev');
    if (projPrev) projPrev.addEventListener('click', function () {
      var n = ((state.project - 2 + 3) % 3) + 1;
      goTo('project', n);
    });

    var projNext = document.getElementById('project-next');
    if (projNext) projNext.addEventListener('click', function () {
      var n = (state.project % 3) + 1;
      goTo('project', n);
    });

    // G-02 · carousel auto-scroll toggle
    var autoscrollToggle = document.getElementById('autoscroll-toggle');
    if (autoscrollToggle) autoscrollToggle.addEventListener('click', function () {
      autoScrollEnabled = !autoScrollEnabled;
      var dot   = document.getElementById('autoscroll-dot');
      var label = document.getElementById('autoscroll-label');
      if (autoScrollEnabled) {
        autoscrollToggle.style.border = '1px solid rgba(147,197,253,0.35)';
        if (dot)   dot.style.background = 'rgba(147,197,253,0.9)';
        if (label) label.style.color    = 'rgba(147,197,253,0.85)';
        startCarouselTimer();
      } else {
        autoscrollToggle.style.border = '1px solid rgba(255,255,255,0.1)';
        if (dot)   dot.style.background = 'rgba(255,255,255,0.15)';
        if (label) label.style.color    = 'rgba(255,255,255,0.3)';
        stopCarouselTimer();
      }
    });

    // G-03 · back / close
    var chatBackLink = document.getElementById('chat-back-link');
    var chatClose    = document.getElementById('chat-close');
    if (chatBackLink) chatBackLink.addEventListener('click', function () { hideChatOverlay(); });
    if (chatClose)    chatClose.addEventListener('click',    function () { hideChatOverlay(); });

    // G-03 · suggestion chips
    document.querySelectorAll('#chat-suggestions .chat-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        sendActiveChat(chip.getAttribute('data-prompt'));
      });
    });

    // G-03 · active input
    var activeInput = document.getElementById('chat-active-input');
    var activeSend  = document.getElementById('chat-active-send');
    if (activeInput) {
      activeInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { sendActiveChat(activeInput.value); activeInput.value = ''; }
      });
    }
    if (activeSend) {
      activeSend.addEventListener('click', function () {
        var v = activeInput ? activeInput.value : '';
        sendActiveChat(v);
        if (activeInput) activeInput.value = '';
      });
    }

    // G-04 · back / close
    var aboutBack  = document.getElementById('about-back');
    var aboutClose = document.getElementById('about-close');
    if (aboutBack)  aboutBack.addEventListener('click',  function () { goTo('home'); });
    if (aboutClose) aboutClose.addEventListener('click', function () { goTo('home'); });

    // Esc key → home
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && state.screen !== 'home') goTo('home');
    });
  }

  // ── 10. Viewport scaling ──────────────────────────────────────────────
  function scaleLayout() {
    var el = document.getElementById('portfolio-layout');
    if (!el) return;
    var baseFit = Math.min(window.innerWidth / 1440, window.innerHeight / 900);
    var contentFit = Math.min(window.innerWidth / 1160, window.innerHeight / 730);
    var s = Math.min(baseFit * 1.25, contentFit);
    el.style.transform = 'translate(-50%, calc(-50% + 35px)) scale(' + s + ')';
  }

  function showChatOverlay() {
    var g3 = document.getElementById('g3-container');
    var cards = ['hero-card', 'support-1', 'support-2', 'support-3'];
    cards.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.classList.add('g3-hidden');
    });
    if (g3) {
      g3.style.opacity = '1';
      g3.style.pointerEvents = 'auto';
    }
    var chatInput = document.getElementById('chat-input');
    if (chatInput) setTimeout(function() { chatInput.focus(); }, 50);
  }

  function hideChatOverlay() {
    var g3 = document.getElementById('g3-container');
    var cards = ['hero-card', 'support-1', 'support-2', 'support-3'];
    cards.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.classList.remove('g3-hidden');
    });
    if (g3) {
      g3.style.opacity = '0';
      g3.style.pointerEvents = 'none';
    }
  }

  // ── 9. Bootstrap ───────────────────────────────────────────────────────
  function initPortfolio() {
    fetchSanityData();
    document.querySelectorAll('.portfolio-screen').forEach(function (s) {
      s.style.display       = 'flex';
      s.style.opacity       = '0';
      s.style.pointerEvents = 'none';
      s.style.transition    = 'opacity 0.35s ease';
    });
    scaleLayout();
    window.addEventListener('resize', scaleLayout);
    bindEvents();
    window.prevSlide = prevSlide;
    window.nextSlide = nextSlide;
    goTo('home');
  }

}());
