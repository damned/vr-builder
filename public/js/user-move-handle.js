/* global AFRAME THREE clog */
AFRAME.registerComponent('user-move-handle', {
  init: function() {
    let self = this
    let host = self.el
    host.classList.add('touchable')
  }
})