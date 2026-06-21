(function () {
  'use strict';

  var transitionFired = false;

  var flash        = document.getElementById('flash-overlay');
  var skipBtn      = document.getElementById('skip-btn');
  var scrollTarget = document.querySelector('.scrollTarget');

  function triggerTransition() {
    if (transitionFired) return;
    transitionFired = true;

    if (skipBtn) skipBtn.style.display = 'none';

    // Step 1: fade flash in over 0.4s
    flash.style.transition    = 'opacity 0.4s ease';
    flash.style.opacity       = '1';
    flash.style.pointerEvents = 'auto';

    setTimeout(function () {
      // Step 2: hide all wormhole elements
      var canvas   = document.querySelector('canvas.experience');
      var vignette = document.querySelector('.vignette-radial');
      if (canvas)       canvas.style.display       = 'none';
      if (scrollTarget) scrollTarget.style.display = 'none';
      if (vignette)     vignette.style.display      = 'none';

      // Stop the Three.js render loop. Hiding the canvas alone leaves the tunnel
      // drawing 15k particles + bloom every frame behind the portfolio — the
      // single biggest source of in-portfolio lag.
      if (window.stopWormhole) window.stopWormhole();

      // Step 3: snap scroll to top of portfolio
      window.scrollTo(0, 0);

      // Step 4: fade flash out over 0.6s
      flash.style.transition = 'opacity 0.6s ease';
      flash.style.opacity    = '0';

      setTimeout(function () {
        flash.style.pointerEvents = 'none';
      }, 600);
    }, 400);
  }

  // Trigger at end of wormhole scroll.
  //
  // We fire within a small pixel tolerance of the bottom instead of requiring
  // window.scrollY to hit maxScroll exactly. On Retina / high-DPI displays (most
  // Macs) the browser snaps the scroll offset to physical pixel boundaries, so
  // window.scrollY tops out a fraction of a pixel BELOW maxScroll and a strict
  // `>=` never becomes true — the white flash + portfolio transition would never
  // fire (the user just stalls at the end of the tunnel). On Windows @1x scrollY
  // reaches the integer max exactly, which is why this only broke on Mac. The
  // tolerance makes "reached the end" reliable regardless of devicePixelRatio.
  if (scrollTarget) {
    window.addEventListener('scroll', function () {
      if (transitionFired) return;
      var maxScroll = scrollTarget.offsetHeight - window.innerHeight;
      if (window.scrollY >= maxScroll - 2) {
        triggerTransition();
      }
    }, { passive: true });
  }

  // Skip button triggers the same sequence
  if (skipBtn) {
    skipBtn.addEventListener('click', triggerTransition);
  }

}());
