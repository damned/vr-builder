/* global AFRAME clog inDegrees */

let Finger = function($hand, name, rotationCentre) {
  let finger = $hand.find('[finger="' + name + '"]').get(0)
  let startX
  let halfRotationRange = 12
  let extensionInX = 0.03
  let minRotation = rotationCentre - halfRotationRange
  let maxRotation = rotationCentre + halfRotationRange
  if (finger) {
    startX = finger.object3D.position.x
  }
  return {
    updateExtension: (zRotation) => {
      if (finger) {
        if (zRotation > minRotation && zRotation < maxRotation) {
          finger.object3D.position.x = startX - extensionInX
        }
        else {
          finger.object3D.position.x = startX
        }        
      }      
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
      Finger($host, 'left', 115),
      Finger($host, 'middle', 90),
      Finger($host, 'right', 65)
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
      fingers.forEach(finger => {
        finger.updateExtension(zRotation)
      })
    }
  }
})