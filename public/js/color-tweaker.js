/* global AFRAME rotationToColor */

AFRAME.registerComponent('color-tweaker', {
  init: function() {
    this.el.setAttribute('follower', 'lock: position; leader: #left-hand')
  },
  update: function(oldData) {
    // console.log('this.data', this.data)
    // this.textEl.setAttribute('value', this.data)  
  },
  tick: function() {
    this.el.setAttribute('color', rotationToColor(this.el.getAttribute('rotation')))
  }
});

