/* global AFRAME */

let addPrimitives = function($parent, color) {
  $parent.append($(`<a-sphere class="stock touchable" cloneable position="0 0.1 0" scale="0.03 0.03 0.03" color="${color}">`))
  $parent.append($(`<a-box class="stock touchable" cloneable position="0 0 0" scale="0.06 0.06 0.06" color="${color}">`))
  $parent.append($(`<a-cylinder class="stock touchable" cloneable position="0 -0.1 0" scale="0.03 0.06 0.03" rotation="90 0 0" color="${color}">`))  
}

let addColor = function($parent, color, x, y) {
  let $container = $(`<a-entity position="${x} ${y} -0.06" scale="0.5 0.5 0.5">`).appendTo($parent)
  addPrimitives($container, color)
}

AFRAME.registerComponent('stock-home', {
  schema: {type: 'string', default: 'x'},
  init: function() {
  },
  update: function(oldData) {
    let side = this.data
    console.log('this.data (side)', side)
    let direction = (side == 'left') ? -1 : 1
    let $self = $(this.el)
    addColor($self, 'green', 0, -0.1)
    addColor($self, 'red', 0, 0.05)
    addColor($self, 'white', 0, 0.2)
    addColor($self, 'blue', 0.06 * direction, -0.1)
    addColor($self, 'brown', 0.06 * direction, 0.05)
    addColor($self, 'black', 0.06 * direction, 0.2)
  }

});
