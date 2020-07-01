/* global AFRAME clog catching */

function findTouchSourceWeAreAttachedTo($host) {
  let $touchSourceAncestor = $host.closest('[touch-source]')
  if ($touchSourceAncestor.length == 0) {
    return undefined
  }
  return $touchSourceAncestor.get(0).components['touch-source']
}

function createTweakerModel($host) {
  let $model = $(`<a-sphere touchable class="color-tweaker-model" radius="0.5"></a-sphere>`).appendTo($host)
  $model.append(`<a-cylinder position="1.2 0 0" rotation="0 0 90" radius="0.5" height="0.3" color="red">`)
  $model.append(`<a-cylinder position="0 1.2 0" rotation="0 0 0" radius="0.5" height="0.3" color="green">`)
  $model.append(`<a-cylinder position="0 0 1.2" rotation="90 0 0" radius="0.5" height="0.3" color="blue">`)
  return $model  
}

AFRAME.registerComponent('color-tweaker', {
  init: function() {
    let self = this
    let host = self.el
    let $host = $(host)
    
    let tickInterval = 10
    
    $host.append(`<a-box class="color-tweaker-bounds" opacity="0.1" color="white"></a-box>`)
    let $model = createTweakerModel($host)
    let tracking
    let touchSource
    let acquireTouchSource = function() {
      touchSource = findTouchSourceWeAreAttachedTo($host)
      if (touchSource) {
        clog('color-tweaker', 'found touch-source ancestor')
        touchSource.onTouchStart((touched) => {
          clog('color-tweaker', 'got a touch:', touched)
          tracking = touched
        })
      }
      else {
        clog('color-tweaker', 'could not find touch-source ancestor')
      }
    }
    let tickCount = 0

    let matchTrackedColor = function() {
      let trackedColor = tracking.getAttribute('material').color
      clog('color-tweaker', 'tick, tracked color:', trackedColor)
      host.setAttribute('color', trackedColor)
    }
    
    let rgbComponentFromAxis = function(axisValue) {
      return Math.max(Math.min(255 * axisValue, 1), 0).toString(16)
    }
    
    let updateTrackedColor = function() {
      let pos = host.getAttribute('position')
      let color = '#' + rgbComponentFromAxis(pos.x) + rgbComponentFromAxis(pos.y) + rgbComponentFromAxis(pos.z)
      // tracking.setAttribute('color')
      clog('')
    }
    
    self.tick = () => {
      catching(() => {
        if (tickCount % tickInterval == 0) {
          if (touchSource) {
            if (tracking) {
              matchTrackedColor()
              updateTrackedColor()
            }
          }
          else {
            acquireTouchSource()
          }
        }
        tickCount++        
      })
    }
  }
});

