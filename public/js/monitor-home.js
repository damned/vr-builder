/* global AFRAME */
AFRAME.registerComponent('monitor-home', {
  schema: {type: 'string', default: 'x'},
  init: function() {
  },
  update: function(oldData) {
    let side = this.data
    console.log('this.data (side)', side)
    let direction = (side == 'left') ? -1 : 1
    let $self = $(this.el)
    let createMonitor = (dynamic, sc) => {
      $(`<a-box monitor cloneable position="0 0 0.2" rotation="0 ${-90 * direction} ${90 * direction}" scale="0.2 0.2 0.02" color="white">`)
    }
    $self.append()
  }

});
