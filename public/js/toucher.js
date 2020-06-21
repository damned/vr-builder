/* global AFRAME clog */

// TODO this thing is separate to touch-source because of the hand-model-parent-child thing
// should really be merged - and of course this taken out of grabber
AFRAME.registerComponent('toucher', {
  init: function() {
    let self = this
    let host = self.el

    host.setAttribute('aabb-collider', 'objects: .touchable; collideNonVisible: true' 
                         // + '; debug: true'
                         )
    let collider = collider(host)
    clog('collider on toucher: ' + collider)
    let touchSourceHost = host.parentNode
    touchSourceHost.setAttribute('touch-source', '')
    let touchSource
    setTimeout(() => {
      touchSource = touchSourceHost.components['touch-source']
    }, 0)
    $(host).on('hitstart', function() {
      touchSource.touchStart(self.closest())
    })
    self.isTouching = function() {
      return collider.intersectedEls.length > 0
    }
    self.closest = function() {
      return collider.closesIntersectedEl
    }
  }
});
