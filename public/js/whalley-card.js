/* global AFRAME THREE whalley */
AFRAME.registerComponent('whalley-card', {
  init: function() {
    let self = this
    let host = self.el

    let lastPosition = new THREE.Vector3()
    let getPosition = () => host.object3D.position
    
    lastPosition.copy(getPosition())
    
    let isMoving = false
    
    host.addEventListener('movestart', () => {
      isMoving = true
    })
    
    host.addEventListener('moveend', () => {
      isMoving = false
    })
    
    self.tick = function() {
      if (!isMoving) {
        return
      }
      if (lastPosition.equals(getPosition())) {
        return
      }
      lastPosition.copy(getPosition())
      host.emit('move', { position: lastPosition })
    }
  }
});
