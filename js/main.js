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

  // Trigger at end of wormhole scroll
  if (scrollTarget) {
    window.addEventListener('scroll', function () {
      if (transitionFired) return;
      var maxScroll = scrollTarget.offsetHeight - window.innerHeight;
      if (window.scrollY >= maxScroll) {
        triggerTransition();
      }
    }, { passive: true });
  }

  // Skip button triggers the same sequence
  if (skipBtn) {
    skipBtn.addEventListener('click', triggerTransition);
  }

}());
