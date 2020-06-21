/* global AFRAME */

let addPrimitives = function($parent, color) {
  $parent.append($(`<a-sphere class="stock touchable" cloneable position="0 0.1 0" scale="0.03 0.03 0.03" color="${color}">`))
  $parent.append($(`<a-box class="stock touchable" cloneable position="0 0 0" scale="0.06 0.06 0.06" color="${color}">`))
  $parent.append($(`<a-cylinder class="stock touchable" cloneable position="0 -0.1 0" scale="0.03 0.06 0.03" rotation="90 0 0" color="${color}">`))  
}

AFRAME.registerComponent('stockist', {
  init: function() {
    let $self = $(this.el)
    let $greens = $('<a-entity position="0 0 -0.2" scale="0.4 0.4 0.4">').appendTo($self)
    addPrimitives($greens, 'green')
    $self.append($('<a-box monitor cloneable position="0 0 0.2" rotation="0 -90 90" scale="0.2 0.2 0.02" color="white">'))
  }
});
