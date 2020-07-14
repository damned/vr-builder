/* global AFRAME THREE */
AFRAME.registerComponent('user-mover', {
  init: function() {
    let self = this
    let host = self.el
    let host3d = host.object3D
    
    let user = document.getElementById('user')
    
    let moving = false
    let worldAnchorPoint = new THREE.Vector3()
    let worldOffset = new THREE.Vector3()
    
    host.addEventListener('grasp', () => {
      host3d.getWorldPosition(worldAnchorPoint)
      moving = true
    })
    
    host.addEventListener('release',  () => {
      moving = false
    })
    
    self.tick = () => {
      
    }
  }
})