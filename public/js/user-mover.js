/* global AFRAME THREE */
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
    
    host.addEventListener('grasp', () => {
      host3d.getWorldPosition(worldAnchorPoint)
      moving = true
    })
    
    host.addEventListener('release',  () => {
      moving = false
    })
    
    self.tick = () => {
      if (moving) {
        worldOffsetFromAnchor.subVectors(worldAnchorPoint, host3d.getWorldPosition(vector3))
        user3d.translateX(worldOffsetFromAnchor.x)
        user3d.translateZ(worldOffsetFromAnchor.z)
      }
    }
  }
})