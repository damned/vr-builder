/* global AFRAME THREE clog catching */
let __yPositionVector = new THREE.Vector3()

function yPosition(entity) {
  entity.object3D.updateWorldMatrix()
  return entity.object3D.getWorldPosition(__yPositionVector).y
}

AFRAME.registerComponent('keyboard', {
  init: function() {
    let self = this
    let host = self.el
    let startY = host.object3D.position.y
    let activeKeyPresser = null
    let keyDownPresserY = null
    
    let __vector = new THREE.Vector3() //
    
    const trackingScaleFactor = 2.5
    
    let trackPresserByOffsetInY = (presserOffsetInY) => {
      let newY = startY + presserOffsetInY * trackingScaleFactor
      host.object3D.position.y = Math.min(startY, newY)
    }
    
    host.addEventListener('keydown', (event) => {
      clog('keyboard', 'YYY keydown event target', event.target)
      clog('keyboard', 'YYY keydown event detail presser', event.detail.presser)
      activeKeyPresser = event.detail.presser
      keyDownPresserY = yPosition(activeKeyPresser)
    })
    host.addEventListener('keyup', (event) => {
      clog('keyboard', 'XXXXXXXXXXXX keyup event target', event.target)
      keyDownPresserY = null
      activeKeyPresser = null
      trackPresserByOffsetInY(0)
    })
    self.tick = function() {
      catching(() => {
        if (activeKeyPresser && keyDownPresserY) {
          let presserCurrentY = yPosition(activeKeyPresser)
          // clog('keyboard', 'keyDownPresserY', keyDownPresserY, 'presserCurrentY', presserCurrentY)
          let newOffset = presserCurrentY - keyDownPresserY
          // clog('keyboard', 'setting offset', newOffset)
          trackPresserByOffsetInY(newOffset)
        }        
      })
    }
  }
})