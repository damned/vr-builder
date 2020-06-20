/* global AFRAME */

AFRAME.registerComponent('resizing', {
  init: function() {
    let self = this
    let host = self.el
    self.updateInfo = function(info) {
      host.setAttribute('data-monitor-info', info)
    }
  },
  update: function(oldData) {
    // console.log('this.data', this.data)
    // this.textEl.setAttribute('value', this.data)  
  }
});