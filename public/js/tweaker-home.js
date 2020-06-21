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
    $self.append($(`<a-box tweaker cloneable position="${0.2 * direction} 0 0" scale="0.2 0.2 0.02" color="white">`))
  }

});
