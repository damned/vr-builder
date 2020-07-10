/* global AFRAME clog inDegrees */

let Finger = function($hand, name, rotationCentre, halfRotationRange, sidedFactor) {
  let finger = $hand.find('[finger="' + name + '"]').get(0)
  let startX
  let extensionInX = 0.064
  let minRotation = rotationCentre - halfRotationRange
  let maxRotation = rotationCentre + halfRotationRange
  if (finger) {
    startX = finger.object3D.position.x
  }
  return {
    updateExtension: (zRotation, direction) => {
      if (finger) {
        if (zRotation > minRotation && zRotation < maxRotation) {
          let fullExtension = extensionInX * direction
          let rotationFromCentre = rotationCentre - zRotation
          let extension
          if (sidedFactor * rotationFromCentre > 0) {
            extension = fullExtension
          }
          else {
            let fractionFromCentre = Math.abs(rotationFromCentre) / halfRotationRange
            extension = fullExtension * (1 - fractionFromCentre)            
          }
          finger.object3D.position.x = startX - extension
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
      Finger($host, 'left',         120, 20, -1),
      Finger($host, 'middle-left',  100, 16, 0),
      Finger($host, 'middle',        90, 20, 0),
      Finger($host, 'middle-right',  80, 16, 0),
      Finger($host, 'right',         60, 20, 1)
    ]
    
    $keyboardSpace.on('typestart', () => {
      host.setAttribute('follower', `leader: ${handSpec}`)
      hand.emit('handtoolstart')
      host.setAttribute('opacity', '0.2')
      // clog('handtoolstart', 'emitted on hand from typist-hand')
    })
    // $keyboardSpace.on('typeend', () => {
    //   host.removeAttribute('follower')
    // })
    
    let tickCount = 0
    self.tick = function() {
      // if (tickCount++ % 4 != 0) {
      //   return
      // }
      let zRotation = inDegrees(host.object3D.rotation.z)
      let direction = 1
      if (side == 'left') {
        zRotation += 180
        direction = -1
      }
      // clog('typist-hand', 'zRotation', zRotation)
      fingers.forEach(finger => {
        finger.updateExtension(zRotation, direction)
      })
    }
  }
})