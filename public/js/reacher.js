/* global AFRAME THREE clog catching */

AFRAME.registerComponent('reacher', {
  schema: {
    componentsToPlay: {type: 'array'},
    distance: {type: 'number', default: 0.8 },
    fromPointHeight: {type: 'number', default: 1 }
  },

  init: function() {
    let self = this
    let host = self.el
    let host3d = host.object3D
    let fromPointHeight
    let fromElement3d = host.sceneEl.camera
    
    let componentsToPlay
    let reachDistance
    let reaching = false
    
    self.update(() => {
      componentsToPlay = self.data.componentsToPlay
      reachDistance = self.data.distance
       
      fromPointHeight = self.data.fromPointHeight
    })
    let tickHandler = () => {
      catching(() => {
        let fromPoint = fromElement3d.position
        let distance = fromPoint.distanceTo(host3d.position)
        clog('reacher', distance)
        if (!reaching && distance > reachDistance) {
          clog('reacher', 'reach!!!!!')
          reaching = true
        }
        if (reaching && distance < reachDistance) {
          clog('reacher', 'unreach!!!!!')
          reaching = false
        }        
      })
    }
    self.tick = AFRAME.utils.throttleTick(tickHandler, 1000, self)
  }
})
