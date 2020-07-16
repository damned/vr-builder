/* global AFRAME THREE clog */
AFRAME.registerComponent('remote-touchable', {
  init: function() {
    let self = this
    let host = self.el
    
    let remoteToucher = null
    
    host.classList.add('remote-touchable')
    
    host.addEventListener('remotetouched', (event) => {
      remoteToucher = event.detail.toucher
    })
    host.addEventListener('remoteuntouched', () => {
      remoteToucher = null
    })
    
    function tickHandler() {
      if (remoteToucher) {
        host.emit('remotetouchmove', { toucher: remoteToucher, position: {}})
      }
    }
    
    self.tick = AFRAME.utils.throttleTick(tickHandler, 50, self)
  }
})

AFRAME.registerComponent('remote-toucher', {
  init: function() {
    let self = this
    let host = self.el
    let grabberElement = $(host).find('[grabber]').get(0)
    let grabber
    
    if (grabberElement) {
      grabber = grabberElement.components.grabber
    }
    
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
      let intersection = raycaster.getIntersection(touched)
      touched.emit('remotetouched', { toucher: self, toucherHost: host, toucherGrabber: grabber, worldPosition: intersection.point })
    }
    
    host.addEventListener('raycaster-intersection', function (event) {
      touchStart(event.detail.els[0])
    });

    host.addEventListener('raycaster-intersection-cleared', function (event) {
      if (!touchedEl) return
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
    
    setTimeout(() => {
      raycaster = host.components.raycaster
      self.pause()
    }, 1000)
  }
})
