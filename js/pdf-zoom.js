'use strict';

// The PDF remains rendered at its source resolution; zoom only changes its display size.
function setupPdfZoom(scroller, sheet, toolbar) {
  const events = new AbortController();
  const options = { signal:events.signal };
  const minus = toolbar.querySelector('[data-zoom="out"]');
  const plus = toolbar.querySelector('[data-zoom="in"]');
  const reset = toolbar.querySelector('[data-zoom="reset"]');
  let zoom = 1;
  let gesture = null;
  let suppressClickUntil = 0;
  const limit = value => Math.max(1, Math.min(6, value));

  function setZoom(value, point = { x:scroller.clientWidth/2, y:scroller.clientHeight/2 }, anchor) {
    const content = anchor || { x:(scroller.scrollLeft+point.x)/zoom, y:(scroller.scrollTop+point.y)/zoom };
    zoom = limit(value);
    sheet.style.width = `${zoom*100}%`;
    scroller.scrollLeft = content.x*zoom-point.x;
    scroller.scrollTop = content.y*zoom-point.y;
    scroller.dataset.zoom = String(zoom);
    minus.disabled = zoom <= 1;
    plus.disabled = zoom >= 6;
    reset.disabled = false;
    reset.textContent = `${Math.round(zoom*100)}%`;
    reset.setAttribute('aria-label', `Zoom ${Math.round(zoom*100)}%. Restablecer tamaño inicial`);
  }
  minus.addEventListener('click', () => setZoom(zoom-.5), options);
  plus.addEventListener('click', () => setZoom(zoom+.5), options);
  reset.addEventListener('click', () => setZoom(1), options);

  function touchInfo(touches) {
    const rect = scroller.getBoundingClientRect();
    return {
      distance:Math.hypot(touches[0].clientX-touches[1].clientX, touches[0].clientY-touches[1].clientY),
      point:{ x:(touches[0].clientX+touches[1].clientX)/2-rect.left, y:(touches[0].clientY+touches[1].clientY)/2-rect.top }
    };
  }
  scroller.addEventListener('touchstart', event => {
    if (event.touches.length !== 2) return;
    event.preventDefault();
    const { distance, point } = touchInfo(event.touches);
    gesture = { distance, zoom, anchor:{ x:(scroller.scrollLeft+point.x)/zoom, y:(scroller.scrollTop+point.y)/zoom } };
  }, { ...options, passive:false });
  scroller.addEventListener('touchmove', event => {
    if (!gesture || event.touches.length !== 2) return;
    event.preventDefault();
    const { distance, point } = touchInfo(event.touches);
    setZoom(gesture.zoom*distance/Math.max(gesture.distance,1), point, gesture.anchor);
  }, { ...options, passive:false });
  function endGesture() {
    if (gesture) suppressClickUntil = performance.now()+350;
    gesture = null;
  }
  scroller.addEventListener('touchend', endGesture, options);
  scroller.addEventListener('touchcancel', endGesture, options);
  scroller.addEventListener('click', event => {
    if (performance.now() < suppressClickUntil) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, { ...options, capture:true });
  scroller.addEventListener('keydown', event => {
    if (event.target !== scroller) return;
    if (event.key === '+' || event.key === '=') { event.preventDefault(); setZoom(zoom+.5); }
    if (event.key === '-') { event.preventDefault(); setZoom(zoom-.5); }
    if (event.key === '0') { event.preventDefault(); setZoom(1); }
  }, options);
  setZoom(1);
  return () => events.abort();
}
