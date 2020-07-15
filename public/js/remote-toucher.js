/* global AFRAME THREE clog */

AFRAME.registerComponent('remote-toucher', {
  init: function() {
    let self = this
    let host = self.el
    
    let dottedLineMaterial = new THREE.LineDashedMaterial({
      color: '#4444ff',
      dashSize: 1,
      gapSize: 0.8,
      linewidth: 4
    })
    
    host.setAttribute('raycaster', 'showLine: true; far: 100; objects: .remote-touchable')
    let line3d = host.getObject3D('line')
    line3d.material = dottedLineMaterial
    line3d.material.needsUpdate = true
    line3d.computeLineDistances()
  }
})
