/* global AFRAME */

AFRAME.registerComponent('fingertip', {
  init: function() {
    let self = this
    let host = self.el

    host.classList.add('touchable')
    
    host.setAttribute('aabb-collider', 'objects: .letterbox;' 
                         // + '; debug: true'
                         )
  }
})