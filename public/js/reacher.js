/* global AFRAME THREE clog catching */

AFRAME.registerComponent('reacher', {
  schema: {
    componentsToPlay: {type: 'array'},
    distance: {type: 'number', default: 0.8 }
  },

  init: function() {
    let self = this
    let host = self.el
    let host3d = host.object3D
    let fromPoint = new THREE.Vector3()
    
    let componentsToPlay
    let reachDistance
    let reaching = false
    
    self.update(() => {
      componentsToPlay = self.data.componentsToPlay
      reachDistance = self.data.distance
    })
    let tickHandler = () => {
      catching(() => {
        let distance = fromPoint.distanceTo(host3d.position)
        clog('reacher', distance)
        if (!reaching && distance > reachDistance) {
          clog('reach!!!!!')
          reaching = true
        }
        if (reaching && distance < reachDistance) {
          clog('unreach!!!!!')
          reaching = false
        }        
      })
    }
    self.tick = AFRAME.utils.throttleTick(tickHandler, 1000, self)
  }
})
