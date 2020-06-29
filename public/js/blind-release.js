/* global AFRAME THREE clog positionRelativeTo */

AFRAME.registerComponent('blind-release', {
  init: function() {
    let self = this
    let host = self.el
    host.addEventListener('release', function(event) {
      clog('blind-release', 'got release')
      clog('blind-release', 'host position', this.object3D.getWorldPosition(new THREE.Vector3()))
      clog('blind-release', 'relative position', positionRelativeTo(event.target, host.sceneEl.camera))
    })
  }
})