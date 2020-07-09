/* global AFRAME clog inDegrees */

AFRAME.registerComponent('typist-hand', {
  init: function() {
    let self = this
    let host = self.el
    
    let side = host.getAttribute('hand-side')
    let handSpec = `#${side}-hand`
    let hand = $(handSpec).get(0)
    let $keyboardSpace = $(host).closest('[keyboard-space]')
    
    host.setAttribute('data-aabb-collider-dynamic', '')

    let leftFinger = $(host).find('[finger="left"]').get(0)
    let leftFingerStartY
    if (leftFinger) {
      leftFingerStartY = leftFinger.object3D.position.y
    }
    
    $keyboardSpace.on('typestart', () => {
      host.setAttribute('follower', `leader: ${handSpec}`)
      hand.emit('handtoolstart')
      // clog('handtoolstart', 'emitted on hand from typist-hand')
    })
    // $keyboardSpace.on('typeend', () => {
    //   host.removeAttribute('follower')
    // })
    
    let tickCount = 0
    self.tick = function() {
      if (tickCount++ % 20 != 0) {
        return
      }
      let zRotation = inDegrees(host.object3D.rotation.y)
      clog('typist-hand', 'zRotation', zRotation)
      if (leftFinger) {
        if (zRotation < -5 && zRotation > -45) {
          leftFinger.object3D.position.y = leftFingerStartY + 0.05
        }
        else {
          leftFinger.object3D.position.y = leftFingerStartY
        }        
      }
    }
  }
})