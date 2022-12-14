/* global AFRAME clog */

const customActions = {
  space: value => value + ' ',
  enter: value => value + '\n',
  back: value => value.slice(0, -1)
}

AFRAME.registerComponent('letterbox', {
  schema: {type: 'string'},
  init: function() {
    let self = this
    let host = self.el
    let key
    let keyAction
    
    self.update = function() {
      key = self.data
      if (customActions[key]) {
        keyAction = customActions[key]
      }
      else {
        keyAction = (value) => value += key
      }
      $(`<a-text align="center" wrap-count="100" position="0 0 0.061" scale"0.2 0.2 0.2" baseline="center" value="${key}"></a-text>`).appendTo(host)        
    }
    let $keyed = $("#keyed")
    host.classList.add('letterbox')
    host.addEventListener('hitclosest', (event) => {
      clog('letterbox', 'event target', event.target)
      // clog('letterbox', 'event detail', event.detail)
      clog('letterbox', 'key: ' + key)
      let logValue = $keyed.attr('value')
      logValue = keyAction(logValue)
      $keyed.attr("value", logValue);

      host.setAttribute('color', 'white')
      setTimeout(() => host.setAttribute('color', 'gray'), 100)
    })
    host.addEventListener('hitclosestclear', (event) => {
      host.emit('keyup')
    })
  }
})