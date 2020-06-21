/* global AFRAME clog */

AFRAME.registerComponent('follower', {
  schema: {
    leader: {type: 'string', default: ''},
    lock: {type: 'string', default: ''}
  },
  init: function() {
    this.leader = this.el.followComponentLeader || null
    this.lock = ''
    // this.el.setAttribute('debugged', 'follower: init')
    this.updateCount = 0
    this.tickCount = 0
  },
  update: function(oldData) {
    this.updateCount++
    clog('follower update', this.data)
    // this.el.setAttribute('debugged', 'follower: update ' + this.updateCount)
    if (this.data == '' || Object.keys(this.data).length == 0) {
      return
    }
    if (this.leader != null) {
      return
    }
    let leaderSpec = this.data.leader
    // this.el.setAttribute('debugged', `follower: leaderSpec = ${leaderSpec}`)
    clog('follower update', leaderSpec)
    this.leader = $(leaderSpec).get(0)
    // this.el.setAttribute('debugged', 'follower: leader = ' + leaderSpec)
  },
  follow: function(leader, lock='') {
    this.leader = leader
    this.lock = lock
  },
  tick: function() {
    this.tickCount++
    if (this.leader == null || this.leader == undefined) {
      return;
    }
    try {
      let leaderPos = this.leader.getAttribute('position')
      let leaderRot = this.leader.object3D.rotation
      // this.el.setAttribute('debugged', 'follower: tick')
      // this.el.setAttribute('debugged', this.leader.tagName)
      // this.el.setAttribute('debugged', 'follower: position: ' + leaderPos)
      if (this.lock != 'position') {
        this.el.object3D.position.set(leaderPos.x, leaderPos.y, leaderPos.z)             
      }
      if (this.lock != 'rotation') {
        this.el.object3D.rotation.copy(leaderRot)
      }
    }
    catch (e) {
      // this.el.setAttribute('debugged', 'oops - error')
      this.el.setAttribute('color', 'red')
      // this.el.setAttribute('debugged', e.toString())
    }
  }
});
