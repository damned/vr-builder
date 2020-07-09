/* global AFRAME clog THREE */
const __yPositionVector = new THREE.Vector3()

function yPosition(entity) {
  return entity.object3D.getWorldPosition(__yPositionVector).y
}

AFRAME.registerComponent('keyboard', {
  init: function() {
    let self = this
    let host = self.el
    let startY = yPosition(host)
    let activeKey = null
    let keyDownY = null
    
    let setOffsetInY = (offset) => {
      host.object3D.position.y = startY + offset
    }
    
    host.addEventListener('keydown', (event) => {
      
      clog('keyboard', 'keydown event target', event.target)
      activeKey = event.target
      keyDownY = yPosition(activeKey)
    })
    host.addEventListener('keyup', (event) => {
      clog('keyboard', 'keyup event target', event.target)
      keyDownY = null
      activeKey = null
      setOffsetInY(0)
    })
    self.tick = function() {
      if (activeKey && keyDownY) {
        clog('keyboard', 'setting offset')
        setOffsetInY(keyDownY - yPosition(activeKey))
      }
    }
  }
})