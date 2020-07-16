/* global AFRAME THREE clog */
AFRAME.registerComponent('remote-touchable', {
  init: function() {
    let self = this
    let host = self.el
    host.classList.add('remote-touchable')    
  }
})

AFRAME.registerComponent('remote-toucher', {
  init: function() {
    let self = this
    let host = self.el
    let raycaster
    
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
      let touched = event.detail.els[0]
      host.emit('remotetouchstart', { touched: touched })
      touched.emit('remotetouched', { toucher: self, toucherHost: host })
    });

    self.play = () => {
      clog('remote-toucher', 'play')
      host.components.raycaster.play()
      line3d.visible = true
      if ()
    }
    
    self.pause = () => {
      clog('remote-toucher', 'pause')
      host.components.raycaster.pause()
      line3d.visible = false
    }
    setTimeout(() => {
      raycaster = host.components.raycaster
      self.pause()
    }, 1000)
  }
})
