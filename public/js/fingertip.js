/* global AFRAME */

AFRAME.registerComponent('fingertip', {
  init: function() {
    let self = this
    let host = self.el

    host.classList.add('touchable')
    
    host.setAttribute('aabb-collider', 'objects: .letterbox;' 
                         // + '; debug: true'
                         )
    
    host.addEventListener('hitclosest', (event) => {
      clog('letterbox', 'event target', event.target)
      // clog('letterbox', 'event detail', event.detail)
      clog('letterbox', 'key: ' + key)
      let logValue = $keyed.attr('value')
      logValue = keyAction(logValue)
      $keyed.attr("value", logValue);

      host.setAttribute('color', 'white')
      setTimeout(() => host.setAttribute('color', 'gray'), 100)
      host.emit('keydown', { presser: event.target })
    })

  }
})