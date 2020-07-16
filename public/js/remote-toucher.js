/* global AFRAME THREE clog */

AFRAME.registerComponent('remote-toucher', {
  init: function() {
    let self = this
    let host = self.el
    
    let dottedLineMaterial = new THREE.LineDashedMaterial({
      color: '#6666ff',
      dashSize: 1,
      gapSize: 0.8,
      linewidth: 4,
      scale: 5
    })
    
    host.setAttribute('raycaster', 'showLine: true; far: 10; objects: .remote-touchable')
    let line3d = host.getObject3D('line')
    line3d.material = dottedLineMaterial
    line3d.material.needsUpdate = true
    line3d.computeLineDistances()
  }
})
