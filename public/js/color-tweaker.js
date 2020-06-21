/* global AFRAME colorFromEntityRotation */

AFRAME.registerComponent('color-tweaker', {
  init: function() {
    this.el.setAttribute('follower', 'lock: position; leader: #left-hand')
  },
  tick: function() {
    this.el.setAttribute('color', colorFromEntityRotation(this.el))
  }
});

