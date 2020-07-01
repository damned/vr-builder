/* global AFRAME colorFromEntityRotation */

AFRAME.registerComponent('color-tweaker', {
  init: function() {
    let host = self.el
    let $host = $(host)
    $host.append(`<a-box class="color-tweaker-bounds" opacity="0.1" color="white"></a-box>`)
    $host.append(`<a-sphere class="color-tweaker-bounds" opacity="0.1" color="white"></a-sphere>`)
    $host.append(`<a-cylinder position="1.2 0 0" rotation="0 0 90" radius="0.5" height="0.3" color="red">`)
    $host.append(`<a-cylinder position="0 1.2 0" rotation="0 0 0" radius="0.5" height="0.3" color="green">`)
    $host.append(`<a-cylinder position="0 0 1.2" rotation="90 0 0" radius="0.5" height="0.3" color="blue">`)
    self.tick = () => {
      host.setAttribute('color', colorFromEntityRotation(host))
    }
  }
});

