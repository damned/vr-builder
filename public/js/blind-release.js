/* global AFRAME THREE clog positionRelativeTo */

AFRAME.registerComponent('blind-release', {
  init: function() {
    let self = this
    let host = self.el
    host.addEventListener('release', function(event) {
      let released = event.target
      let releasedPositionRelativeToCamera = positionRelativeTo(event.target, host.sceneEl.camera)
      clog('blind-release', 'camera-relative position', releasedPositionRelativeToCamera)
      if (releasedPositionRelativeToCamera.z > 0) {
        clog('blind-release', 'was a blind release')
        host.emit('blind-release', event)
      }
      else {
        clog('blind-release', 'was not a blind release')
      }
    })
  }
})