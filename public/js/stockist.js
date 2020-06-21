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

AFRAME.registerComponent('stockist', {
  schema: {type: 'string', default: 'x'},
  init: function() {
    let $self = $(this.el)
    addColor($self, 'green', 0, -0.1)
    addColor($self, 'red', 0, 0.1)
    addColor($self, 'blue', 0.1, -0.1)
    $self.append($('<a-box monitor cloneable position="0 0 0.2" rotation="0 -90 90" scale="0.2 0.2 0.02" color="white">'))
  },
  update: function(oldData) {
    console.log('this.data ()', this.data)
    this.textEl.setAttribute('value', this.data)  
  }

});
