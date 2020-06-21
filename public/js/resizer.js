/* global AFRAME clog collider */

AFRAME.registerComponent('resizer', {
  init: function() {
    let self = this
    let host = self.el
    setTimeout(() => {
      let toucher = host.components.toucher
      if (!toucher) {
        clog('')
        return
      }
      let toucher = host.components.toucher
      $touchSourceAncestor.get(0).components['touch-source'].onTouchStart((touched) => {
        clog('touch', 'in monitor i got a touch start for: ' + touched.tagName)
        self.monitor(touched)
      })      
    }, 0)
  }
});
