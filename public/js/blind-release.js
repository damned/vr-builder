/* global AFRAME clog */

AFRAME.registerComponent('blind-release', {
  init: function() {
    let self = this
    let host = self.el
    host.addEventListener('release', function(event) {
      clog('blind-release', 'got release')
      clog('blind-release', 'host position', this.getAttribute('position'))
    })
  }
})