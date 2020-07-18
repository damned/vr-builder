/* global AFRAME THREE colorFromEntityRotation collider clog catching addDebugColor removeDebugColor cloneEntity reparent */
let debug = { useColor: false }
var options = { 
  colorTwist: false,
  groupOnTouch: false
}

function debugColor(el, color) {
  if (debug.useColor) {
    addDebugColor(el, color)
  }
}

function oppositeSide(side) {
  return side == 'left' ? 'right' : 'left'
}

// todo could have registered hands with hands system
function otherHand(grabber) {
  let otherHandSide = oppositeSide(grabber.el.getAttribute('hand-side'))
  let otherId = `${otherHandSide}-hand`
  clog('group', 'other hand id', otherId)
  let other = document.getElementById(otherId)
  clog('group', 'other hand', other)
  return other
}

let currentlyTouching = (hand) => {
  clog('group', 'hand', hand.id)
  let handModel = $(hand).find('.hand-model').get(0)
  return handModel.components.toucher.closest()  
}

function groupUnder(groupRoot, child) {
  catching(() => {
    if (groupRoot == child) {
      clog('group', 'cannot group under itself!')
      return
    }
    if (groupRoot.currentlyGrabbed || groupRoot.recentlyGrabbed) {
      clog('group', 'will not group under grabbed entity - needs to be just touching')
      return
    }
    clog('group', 'adding', child, 'to', groupRoot)
    groupRoot.setAttribute('opacity', '0.2')
    
    let cloned = reparent(child, groupRoot, () => {})

    clog('group', 'reparented')    
  })
}

// debugColor
AFRAME.registerComponent('grabber', {
  schema: {type: 'string'},
  init: function() {
    let self = this                 
    let $host = $(this.el)
    let host = this.el
    host.setAttribute('toucher', '')
    setTimeout(() => {
      self.grabberCollider = collider(host)
      self.toucher = host.components.toucher
    }, 0)
    self.ticks = 0
    self.grabbed = null
    self.grabId = null
    self.secondGrabHandlers = []
    self.releaseHandlers = []
    self.onSecondGrab = (handler) => { self.secondGrabHandlers.push(handler) }      
    self.onRelease = (handler) => { self.releaseHandlers.push(handler) }
  },
  update: function(oldData) {
    console.log('this.data', this.data)
    this.grabbedLeaderSpec = this.data
  },
  tick: function (time, timeDelta) {
    let self = this
    catching(function (){
      let parent = self.el.parentNode // use localToWorld() rather than specifically using parent??
      self.ticks++
      if (options.colorTwist) {
        self.el.setAttribute('color', colorFromEntityRotation(parent))
      }
    })
  },
  cloneGrabbed: function() {
    let self = this
    catching(() => {
      if (self.grabbed) {
        let cloned = cloneEntity(self.grabbed, true)
        cloned.removeAttribute('follower')
      }      
    })
  },
  cancelGrabbedMovement: function() {
    self.grabbed.follower.unfollow()
  },
  grasp: function(graspInfo) {
    catching(function (){
      let host = this.el
      let self = this
      debugColor(host, 'black')
      if (self.toucher.isTouching()) {
        clog('grasp', "it thinks we're touching")
        let tograb = self.toucher.closest()
        clog('grasp', 'closest', tograb)
        if (tograb.currentlyGrabbed) {
          let otherGrabber = tograb.currentGrabber
          clog('grasp', 'about to call second grab handlers')
  
          self.grabbed = tograb
          self.secondGrabHandlers.forEach((handler) => { 
            handler(self.grabbed, otherGrabber) 
            self.inSecondGrab = true
          })
          return
        }
        if (tograb.hasAttribute('user-move-handle')) {
          host.emit('grab')
          return
        }
        
        debugColor(host, 'white')
        debugColor(tograb, 'white')
        // host.setAttribute('debugged', `grabbing: ${tograb.tagName} with ${this.grabbedLeaderSpec}`)
        console.log('grabberId', this.grabbedLeaderSpec)
        let cloneable = tograb.components['cloneable']
        if (cloneable) {
          clog('grasp', 'its cloneable')
          tograb = cloneable.clone()
        }
        tograb.setAttribute('follower', 'leader: ' + this.grabbedLeaderSpec)
        this.grabbed = tograb
        this.grabId = graspInfo.graspId
        this.grabbed.currentlyGrabbed = true
        this.grabbed.currentGrabber = host
        this.grabbed.emit('movestart')

        debugColor(this.grabbed, 'blue')
        host.setAttribute('opacity', 0.5)
      }          
    }.bind(this))
  },
  release: function(event) {
    catching(() => {
      if (this.grabbed) {
        this.releaseHandlers.forEach(handler => handler())
        this.el.emit('release', { released: this.grabbed })
        if (this.inSecondGrab) {
          this.inSecondGrab = false
        }
        else {
          this.grabbed.currentlyGrabbed = false
          let recentlyGrabbed = this.grabbed
          this.grabbed.recentlyGrabbed = true
          setTimeout(() => { 
            recentlyGrabbed.recentlyGrabbed = false
          }, 500)
          this.grabbed.removeAttribute('follower')
          this.grabbed.emit('moveend')
          if (options.groupOnTouch) {
            let otherHandTouching = currentlyTouching(otherHand(this))
            if (otherHandTouching) {
              groupUnder(otherHandTouching, this.grabbed)
            }
          }
        }
      }
      removeDebugColor(this.grabbed)
      removeDebugColor(this.el)
      this.grabbed = null
      this.grabId = null
      this.el.setAttribute('opacity', 1)      
    })
  }
});
