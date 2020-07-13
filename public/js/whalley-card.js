/* global AFRAME THREE whalley */
AFRAME.registerComponent('whalley-card', {
  init: function() {
    let self = this
    let host = self.el

    let lastPosition = new THREE.Vector3()
    let getPosition = () => host.object3D.position
    
    lastPosition.copy(getPosition())
    
//     host.addEventListener('movestart', () => {
//       self.tick = tick
//     })
    
//     host.addEventListener('moveend', () => {
//       self.tick = null
//     })
    
//     let tick = function() {
//       if (lastPosition.equals(getPosition())) {
//         return
//       }
//       lastPosition.copy(getPosition())
//       host.emit('move', { position: lastPosition })
//     }
  }
});
