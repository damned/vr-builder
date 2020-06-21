/* global AFRAME colorFromEntityRotation */

AFRAME.registerComponent('color-tweaker', {
  init: function() {
    this.el.setAttribute('follower', 'lock: position; leader: #left-hand')
    let $self = $(this.el)
    $self.append(`<a-cylinder position="1.2 0 0" rotation="0 0 90" radius="0.5" height="0.3" color="red">`)
    $self.append(`<a-cylinder position="0 1.2 0" rotation="0 0 0" radius="0.5" height="0.3" color="green">`)
    $self.append(`<a-cylinder position="0 0 1.2" rotation="90 0 0" radius="0.5" height="0.3" color="blue">`)
  },
  tick: function() {
    this.el.setAttribute('color', colorFromEntityRotation(this.el))
  }
});

