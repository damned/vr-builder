/* global AFRAME THREE clog */
AFRAME.registerComponent('flick-cloner', {
  init: function() {
    let self = this
    let object3d = self.el.object3D
    const TIME_TO_STOP_MS = 200
    const MIN_PRE_FLICK_VELOCITY = 1
    const MAX_STOP_VELOCITY = 0.2
    let lastPos
    let nowPos = new THREE.Vector3()
    let moving = false
    let stopping = false
    let stopCountdownMs = null
    let flickHandlers= []
    let flick = () => flickHandlers.forEach((handler) => handler())
    
    self.tick = function(time, timeDelta) {
      object3d.getWorldPosition(nowPos)
      if (lastPos) {
        let velocity = 1000 * nowPos.distanceTo(lastPos) / timeDelta
        clog('flick-cloner velocity: ' + velocity.toFixed(3))
        if (velocity > MIN_PRE_FLICK_VELOCITY) {
          moving = true
        }
        else if (moving) {
          if (velocity < MAX_STOP_VELOCITY) {
            flick()
          }
          clog('moving, time remaining (ms): ' + stopCountdownMs)
        }
      }
      else {
        lastPos = new THREE.Vector3()
      }
      lastPos.copy(nowPos)
    }
    self.onFlick = handler => flickHandlers.push(handler)
  }
})
