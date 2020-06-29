/* global AFRAME THREE clog positionRelativeTo */

AFRAME.registerComponent('blind-release', {
  init: function() {
    let self = this
    let host = self.el
    host.addEventListener('release', function(event) {
      let released = event.detail.released
      let releasedPositionRelativeToCamera = positionRelativeTo(released, host.sceneEl.camera)
      clog('blind-release', 'release handler, event.target === host?', (event.target === host))
      clog('blind-release', 'release handler, released === host?', (released === host))
      clog('blind-release', 'camera-relative position', releasedPositionRelativeToCamera)
      if (releasedPositionRelativeToCamera.z > 0) {
        clog('blind-release', 'was a blind release')
        host.emit('blind-release', event.detail)
      }
      else {
        clog('blind-release', 'was not a blind release')
      }
    })
  }
})