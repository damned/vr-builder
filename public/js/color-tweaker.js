/* global AFRAME clog catching */

function findTouchSourceWeAreAttachedTo($host) {
  let $touchSourceAncestor = $host.closest('[touch-source]')
  if ($touchSourceAncestor.length == 0) {
    return undefined
  }
  return $touchSourceAncestor.get(0).components['touch-source']
}

AFRAME.registerComponent('color-tweaker', {
  init: function() {
    let self = this
    let host = self.el
    let $host = $(host)
    $host.append(`<a-box class="color-tweaker-bounds" opacity="0.1" color="white"></a-box>`)
    let $model = $(`<a-sphere class="color-tweaker-model" radius="0.5"></a-sphere>`).appendTo($host)
    $model.append(`<a-cylinder position="1.2 0 0" rotation="0 0 90" radius="0.5" height="0.3" color="red">`)
    $model.append(`<a-cylinder position="0 1.2 0" rotation="0 0 0" radius="0.5" height="0.3" color="green">`)
    $model.append(`<a-cylinder position="0 0 1.2" rotation="90 0 0" radius="0.5" height="0.3" color="blue">`)
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
    
    self.tick = () => {
      catching(() => {
        if (tickCount % 50 == 0) {
          if (touchSource) {
            if (tracking) {
              let trackedColor = tracking.getAttribute('material').color
              clog('color-tweaker', 'tick, tracked color:', trackedColor)
              host.setAttribute('color', trackedColor)
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

