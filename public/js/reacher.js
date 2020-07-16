/* global AFRAME THREE clog catching */

AFRAME.registerComponent('reacher', {
  schema: {
    componentsToPlay: {type: 'array', default: []},
    distance: {type: 'number', default: 0.75 },
    fromPointHeight: {type: 'number', default: 1 }
  },

  init: function() {
    let self = this
    let host = self.el
    let host3d = host.object3D
    let fromPointHeight
    let fromElement3d = $('a-camera').get(0).object3D
    let fromPoint = new THREE.Vector3()
    
    let componentsToPlay
    let reachDistance
    let reaching = false
    
    self.update = () => {
      componentsToPlay = self.data.componentsToPlay
      reachDistance = self.data.distance
      fromPointHeight = self.data.fromPointHeight
    }
    
    let playComponents = (play) => {
      componentsToPlay.forEach((name) => {
        let component = host.components[name]
        if (play) {
          component.play()
        }
        else {
          component.pause()
        }
      })
    }
    
    let tickHandler = () => {
      catching(() => {
        let from = fromElement3d.position
        fromPoint.set(from.x, fromPointHeight, from.z)
        let distance = fromPoint.distanceTo(host3d.position)
        clog('reacher', 'distance', distance)
        if (!reaching && distance > reachDistance) {
          clog('reacher', 'reach!!!!!')
          reaching = true
          playComponents(true)
        }
        if (reaching && distance < reachDistance) {
          clog('reacher', 'unreach!!!!!')
          reaching = false
          playComponents(false)
        }        
      })
    }
    self.tick = AFRAME.utils.throttleTick(tickHandler, 1000, self)
  }
})
