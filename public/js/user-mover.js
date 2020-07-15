/* global AFRAME THREE clog */
AFRAME.registerComponent('user-mover', {
  init: function() {
    let self = this
    let host = self.el
    let host3d = host.object3D
    
    let user3d = document.getElementById('user').object3D
    
    let moving = false
    let vector3 = new THREE.Vector3()
    let worldAnchorPoint = new THREE.Vector3()
    let worldOffsetFromAnchor = new THREE.Vector3()
    
    host.addEventListener('grab', () => {
      clog('user-mover', 'grab')      
      host3d.getWorldPosition(worldAnchorPoint)
      moving = true
    })
    
    host.addEventListener('ungrasp',  () => {
      clog('user-mover', 'ungrasp')      
      moving = false
    })
    
    let translateHorizontallyToMatchAnchor = () => {
      worldOffsetFromAnchor.subVectors(worldAnchorPoint, host3d.getWorldPosition(vector3))
      worldOffsetFromAnchor.y = 0
      // clog('user-mover', 'translating', worldOffsetFromAnchor)
      user3d.position.add(worldOffsetFromAnchor)
    }
    
    self.tickHandler = () => {
      if (moving) {
        translateHorizontallyToMatchAnchor()
      }
    }
    self.tick = AFRAME.utils.throttleTick(self.tickHandler, 50, self);
  }
})