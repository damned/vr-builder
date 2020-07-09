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

    let leftFinger 
    let leftFingerStartY
    host.addEventListener('loaded', 90 => {
      
    })
    leftFinger = $(host).find('[finger="left"]').get(0)
    leftFingerStartY = leftFinger.object3D.position.y
    
    $keyboardSpace.on('typestart', () => {
      host.setAttribute('follower', `leader: ${handSpec}`)
      hand.emit('handtoolstart')
      // clog('handtoolstart', 'emitted on hand from typist-hand')
    })
    // $keyboardSpace.on('typeend', () => {
    //   host.removeAttribute('follower')
    // })
    self.tick = function() {
      let zRotation = inDegrees(host.object3D.rotation.y)
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