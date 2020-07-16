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
    
    host.addEventListener('raycaster-intersection', function (event) {
      clog('remote-toucher', 'got an intersection')
      host.emit('remotetouchstart', { touched: event.detail.els[0] })
    });

    self.play = () => {
      clog('remote-toucher', 'play')
      host.components.raycaster.play()
      line3d.visible = true
    }
    
    self.pause = () => {
      clog('remote-toucher', 'pause')
      host.components.raycaster.pause()
      line3d.visible = false
    }
    setTimeout(() => {
      self.pause()
    }, 1000)
  }
})
