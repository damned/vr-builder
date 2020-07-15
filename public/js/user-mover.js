/* global AFRAME THREE clog */
AFRAME.registerComponent('user-mover', {
  init: function() {
    let self = this
    let host = self.el
    let host3d = host.object3D
    
    let userRig3d = document.getElementById('user-rig').object3D
    
    let moving = false
    let vector3 = new THREE.Vector3()
    let userGoalPoint = new THREE.Vector3()
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
      userGoalPoint.addVectors(userRig3d.position, worldOffsetFromAnchor)
      // clog('user-mover', 'translating', worldOffsetFromAnchor)
      userRig3d.position.lerp(userGoalPoint, 0.5)
    }
    
    self.tickHandler = () => {
      if (moving) {
        translateHorizontallyToMatchAnchor()
      }
    }
    self.tick = self.tickHandler
  }
})