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
    this.lock = this.data.lock || ''
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
      let object3d = this.el.object3D
      let leaderPos = object3d.worldToLocal(this.leader.object3D.getWorldPosition())
      
      let leaderRot = this.leader.object3D.rotation
      // this.el.setAttribute('debugged', 'follower: tick')
      // this.el.setAttribute('debugged', this.leader.tagName)
      // this.el.setAttribute('debugged', 'follower: position: ' + leaderPos)
      if (this.lock != 'position') {
        object3d.position.set(leaderPos.x, leaderPos.y, leaderPos.z)             
      }
      if (this.lock != 'rotation') {
        object3d.rotation.copy(leaderRot)
      }
    }
    catch (e) {
      // this.el.setAttribute('debugged', 'oops - error')
      this.el.setAttribute('color', 'red')
      // this.el.setAttribute('debugged', e.toString())
    }
  }
});
