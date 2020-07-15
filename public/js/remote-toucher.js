/* global AFRAME THREE clog */

AFRAME.registerComponent('remote-toucher', {
  init: function() {
    let self = this
    let host = self.el
    
    let dottedLineMaterial = new THREE.LineDashedMaterial({
      color: 'blue',
      dashSize: 0.5,
      gapSize: 0.5
    })
    
    host.setAttribute('raycaster', 'showLine: true; far: 100; objects: .remote-touchable')
    host.components.line.getObject3D('mesh').material = dottedLineMaterial
  }
})
