/* global AFRAME clog */

function findTouchSourceWeAreAttachedTo($host) {
  let $touchSourceAncestor = $host.closest('[touch-source]')
  if ($touchSourceAncestor.length == 0) {
    return undefined
  }
  return $touchSourceAncestor.get(0).components['touch-source']
}

AFRAME.registerComponent('color-tweaker', {
  init: function() {
    let host = self.el
    let $host = $(host)
    $host.append(`<a-box class="color-tweaker-bounds" opacity="0.1" color="white"></a-box>`)
    let $model = $(`<a-sphere class="color-tweaker-model" radius="0.5"></a-sphere>`).appendTo($host)
    $model.append(`<a-cylinder position="1.2 0 0" rotation="0 0 90" radius="0.5" height="0.3" color="red">`)
    $model.append(`<a-cylinder position="0 1.2 0" rotation="0 0 0" radius="0.5" height="0.3" color="green">`)
    $model.append(`<a-cylinder position="0 0 1.2" rotation="90 0 0" radius="0.5" height="0.3" color="blue">`)
    let tracking
    let touchSource = findTouchSourceWeAreAttachedTo($host)
    if (touchSource) {
      touchSource.onTouchStart((touched) => {
      })
    }
    
    
    self.tick = () => {
      host.setAttribute('color', colorFromEntityRotation(host))
    }
  }
});

