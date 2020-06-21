/* global AFRAME */
AFRAME.registerComponent('tweaker-home', {
  schema: {type: 'string', default: 'x'},
  init: function() {
  },
  update: function(oldData) {
    let side = this.data
    console.log('this.data (side)', side)
    let direction = (side == 'left') ? -1 : 1
    let $self = $(this.el)
    let $colorTweaker = ($(`<a-box color-tweaker cloneable position="${-0.1 * direction} -0.1 0" scale="0.02 0.02 0.02" color="white">`)).appendTo($self)
  }
});
