/* global AFRAME THREE clog */
AFRAME.registerComponent('flick-cloner', {
  init: function() {
    let self = this
    let object3d = self.el.object3D
    const TIME_TO_STOP_MS = 100
    const MIN_PRE_FLICK_VELOCITY = 1
    const MAX_STOP_VELOCITY = 0.1
    let lastPos
    let nowPos
    self.tick = function(time, timeDelta) {
      object3d.getWorldPosition(nowPos)
      if (lastPos) {
        let velocity = 1000 * nowPos.distanceTo(lastPos) / timeDelta
      clog('flick-cloner', 'i am watching')        
      }
      else {
        lastPos = new THREE.Vector3()
      }
      lastPos.copy(nowPos)
    }
  }
})
