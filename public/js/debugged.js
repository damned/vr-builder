/* global AFRAME */

// use follower by default, but _allow_ to be added as child to debugee
// (moved to follower because of a-text bounding box problems)
AFRAME.registerComponent('debugged', {
  schema: {type: 'string', default: 'x'},
  init: function() {
    let $self = $(this.el)
    let $scene = $('a-scene')
    let $text = $(`<a-text follower scale="0.2 0.2 0.2" value="x y z">`)
    $scene.append($text)
    this.textEl = $text.get(0)
    this.textEl.followComponentLeader = this.el
    // child
    // let $text = $(`<a-text position="0 0 0.06" color="black" value="x">`)
    // $self.append($text)

  },
  update: function(oldData) {
    console.log('this.data', this.data)
    this.textEl.setAttribute('value', this.data)  
  }
});

