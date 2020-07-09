/* global AFRAME clog inDegrees */

let Finger = function($hand, name) {
  let finger = $hand.find('[finger="' + name + '"]').get(0)
  let startX
  if (finger) {
    startX = finger.object3D.position.x
  }
  return {
    tick: () => {
      
    }
  }
}

AFRAME.registerComponent('typist-hand', {
  init: function() {
    let self = this
    let host = self.el
    
    let side = host.getAttribute('hand-side')
    let handSpec = `#${side}-hand`
    let hand = $(handSpec).get(0)
    let $keyboardSpace = $(host).closest('[keyboard-space]')
    
    host.setAttribute('data-aabb-collider-dynamic', '')

    let $host = $(host)
    let fingers = [
      Finger($host, 'left')
    ]
    
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
      let zRotation = inDegrees(host.object3D.rotation.z)
      clog('typist-hand', 'zRotation', zRotation)
      
      if (leftFinger) {
        if (zRotation > 95 && zRotation < 135) {
          leftFinger.object3D.position.x = leftFingerStartX - 0.05
        }
        else {
          leftFinger.object3D.position.x = leftFingerStartX
        }        
      }
    }
  }
})