/* global AFRAME clog */

// TODO this thing is separate to toucher because of the hand-model-parent-child thing
// should really merge back together
AFRAME.registerComponent('touch-source', {
  init: function() {
    let self = this
    let touchStartHandlers = []
    self.touchStart = function(touched) {
      clog('touch', 'i am a toucher and i touched a: ' + touched.tagName)
      if (touched.hasAttribute())
      touchStartHandlers.forEach((handler) => {
        handler(touched)
      })
    }
    self.onTouchStart = function(handler) {
      touchStartHandlers.push(handler)
    }
  }
});
