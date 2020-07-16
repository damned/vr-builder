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
    let touchedEl = null
    
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
    
    let touchStart = (touched) => {
      touchedEl = touched
      host.emit('remotetouchstart', { touched: touched })
      touched.emit('remotetouched', { toucher: self, toucherHost: host })
    }
    
    host.addEventListener('raycaster-intersection', function (event) {
      touchStart(event.detail.els[0])
    });

    host.addEventListener('raycaster-intersection-cleared', function (event) {
      touchedEl.emit('remoteuntouched', { toucher: self, toucherHost: host })
      touchedEl = null
      clog('cleared')
    });

    self.play = () => {
      if (!raycaster) return
      clog('remote-toucher', 'play')
      raycaster.play()
      line3d.visible = true
    }
    
    self.pause = () => {
      if (!raycaster) return
      clog('remote-toucher', 'pause')
      raycaster.pause()
      line3d.visible = false
    }
    
    let tickHandler = () => {
      if (touchedEl) {
      
      }
    }
    
    self.tick = AFRAME.utils.throttleTick(tickHandler, 200, self)
    setTimeout(() => {
      raycaster = host.components.raycaster
      self.pause()
    }, 1000)
  }
})
