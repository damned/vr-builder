/* global AFRAME */
AFRAME.registerComponent('stockist', {
  init: function() {
    let $self = $(this.el)
    $self.append($('<a-sphere class="stock touchable" cloneable position="0 0.1 -0.1" scale="0.03 0.03 0.03" color="green">'))
    $self.append($('<a-box class="stock touchable" cloneable position="0 0 -0.1" scale="0.06 0.06 0.06" color="green">'))
    $self.append($('<a-cylinder class="stock touchable" cloneable position="0 -0.1 -0.1" scale="0.03 0.06 0.03" rotation="90 0 0" color="green">'))
    $self.append($('<a-box monitor cloneable position="0 0 0.2" rotation="0 -90 90" scale="0.2 0.2 0.02" color="white">'))
  }
});
