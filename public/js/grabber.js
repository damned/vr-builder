/* global AFRAME THREE colorFromEntityRotation collider clog catching addDebugColor removeDebugColor cloneEntity */
let debug = { useColor: false }
var options = { colorTwist: false }

function debugColor(el, color) {
  if (debug.useColor) {
    addDebugColor(el, color)
  }
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
          // move -> aframe-util.js -> positioning.js
        let position = new THREE.Vector3()
        let scale = new THREE.Vector3()
        let quaternion = new THREE.Quaternion()
        let object3d = self.grabbed.object3D
        
        object3d.getWorldScale(scale)
        object3d.getWorldQuaternion(quaternion)
        object3d.getWorldPosition(position)
        
        let cloned = cloneEntity(self.grabbed)
        cloned.addEventListener('loaded', () => {
          // move -> aframe-util.js -> positioning.js
          cloned.object3D.scale.copy(scale)
          cloned.object3D.quaternion.copy(quaternion)
          cloned.object3D.position.copy(position)
        })

        cloned.removeAttribute('follower')
        self.el.setAttribute('color', 'white')
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
    if (this.grabbed) {
      this.releaseHandlers.forEach(handler => handler())
      if (this.inSecondGrab) {
        this.inSecondGrab = false
      }
      else {
        this.grabbed.currentlyGrabbed = false
        this.grabbed.removeAttribute('follower')
      }
    }
    removeDebugColor(this.grabbed)
    removeDebugColor(this.el)
    this.grabbed = null
    this.el.setAttribute('opacity', 1)
  }
});
