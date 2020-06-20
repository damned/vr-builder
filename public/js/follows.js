/* global AFRAME */

AFRAME.registerComponent('follows', {
  schema: {type: 'string', default: ''},
  init: function() {
    this.leader = this.el.followComponentLeader || null
    // this.el.setAttribute('debugged', 'follows: init')
    this.updateCount = 0
    this.tickCount = 0
  },
  update: function(oldData) {
    this.updateCount++
    console.log('this.data', this.data)
    // this.el.setAttribute('debugged', 'follows: update ' + this.updateCount)
    if (this.data == '' || Object.keys(this.data).length == 0) {
      return
    }
    if (this.leader != null) {
      return
    }
    let leaderSpec = this.data
    // this.el.setAttribute('debugged', `follows: leaderSpec = ${leaderSpec}`)
    console.log(leaderSpec)
    this.leader = $(leaderSpec).get(0)
    // this.el.setAttribute('debugged', 'follows: leader = ' + leaderSpec)
  },
  follow: function(leader) {
    this.leader = leader
  },
  tick: function() {
    this.tickCount++
    if (this.leader == null || this.leader == undefined) {
      return;
    }
    try {
      let leaderPos = this.leader.getAttribute('position')
      let leaderRot = this.leader.object3D.rotation
      // this.el.setAttribute('debugged', 'follows: tick')
      // this.el.setAttribute('debugged', this.leader.tagName)
      // this.el.setAttribute('debugged', 'follows: position: ' + leaderPos)
      this.el.object3D.position.set(leaderPos.x, leaderPos.y, leaderPos.z)          
      this.el.object3D.rotation.copy(leaderRot)
    }
    catch (e) {
      // this.el.setAttribute('debugged', 'oops - error')
      this.el.setAttribute('color', 'red')
      // this.el.setAttribute('debugged', e.toString())
    }
  }
});
