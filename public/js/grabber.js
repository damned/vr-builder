/* global AFRAME THREE colorFromEntityRotation collider clog catching addDebugColor removeDebugColor cloneEntity positionRelativeTo */
let debug = { useColor: false }
var options = { colorTwist: false }

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
  clog('group', 'adding', child, 'to', groupRoot)
  clog('group', 'child', child)
  clog('group', 'parent', groupRoot)
  groupRoot.setAttribute('opacity', '0.2')
  cloneEntity(child, true, groupRoot)
  child.parentElement.remove(child) // REMOVE OLD CHILD
  clog('group', 'reparented')
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
  grasp: function(event) {
    catching(function (){
      let host = this.el
      let self = this
      debugColor(host, 'black')
      if (self.toucher.isTouching()) {
        let tograb = self.toucher.closest()
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
        debugColor(host, 'white')
        debugColor(tograb, 'white')
        host.setAttribute('debugged', `grabbing: ${tograb.tagName} with ${this.grabbedLeaderSpec}`)
        console.log('grabberId', this.grabbedLeaderSpec)
        let cloneable = tograb.components['cloneable']
        if (cloneable) {
          clog('grasp', 'its cloneable')
          tograb = cloneable.clone()
        }
        tograb.setAttribute('follower', 'leader: ' + this.grabbedLeaderSpec)
        this.grabbed = tograb
        this.grabbed.currentlyGrabbed = true
        this.grabbed.currentGrabber = host
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
          this.grabbed.removeAttribute('follower')
          let otherHandTouching = currentlyTouching(otherHand(this))
          if (otherHandTouching) {
            groupUnder(otherHandTouching, this.grabbed)
          }
        }
      }
      removeDebugColor(this.grabbed)
      removeDebugColor(this.el)
      this.grabbed = null
      this.el.setAttribute('opacity', 1)      
    })
  }
});
