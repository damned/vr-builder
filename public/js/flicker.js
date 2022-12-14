/* global AFRAME THREE clog */
AFRAME.registerComponent('flicker', {
  init: function() {
    let self = this
    let object3d = self.el.object3D
    const TIME_TO_STOP_MS = 300
    const MIN_PRE_FLICK_VELOCITY = 1.8
    const MAX_REAL_VELOCITY = 7
    const MAX_STOP_VELOCITY = 0.3
    let lastPos
    let nowPos = new THREE.Vector3()
    let moving = false
    let stopping = false
    let stopCountdownMs = null
    let flickHandlers= []

    let cancelFlick = () => {
      stopCountdownMs = null
      moving = false
      stopping = false
    }
    let flick = () => {
      flickHandlers.forEach((handler) => handler())
      cancelFlick()
    }
    
    self.tick = function(time, timeDelta) {
      object3d.getWorldPosition(nowPos)
      
      if (lastPos) {
        let velocity = 1000 * nowPos.distanceTo(lastPos) / timeDelta
        if (velocity > MIN_PRE_FLICK_VELOCITY && velocity < MAX_REAL_VELOCITY) {
          // clog('flicker velocity: ' + velocity.toFixed(3))
          moving = true
          stopping = false
          stopCountdownMs = null
        }
        else if (moving) {
          if (velocity < MIN_PRE_FLICK_VELOCITY) {
            stopping = true
            moving = false
            stopCountdownMs = TIME_TO_STOP_MS
          }
        }
        if (stopping) {
          // clog('flicker', 'velocity: ' + velocity.toFixed(3))
          if (velocity < MAX_STOP_VELOCITY) {
            flick()
          }
          stopCountdownMs -= timeDelta
          if (stopCountdownMs < 0) {
            cancelFlick()
          }
        }
      }
      else {
        lastPos = new THREE.Vector3()
      }
      lastPos.copy(nowPos)
    }
    self.onFlick = function(handler) {
      flickHandlers.push(handler)
    }
  }
})
