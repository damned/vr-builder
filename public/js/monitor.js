/* global AFRAME entityInfo catching */

AFRAME.registerComponent('monitor', {
  init: function() {
    let self = this
    self.ticks = 0
    let host = self.el
    let $host = $(host)
    $host.addClass('touchable')
    $host.attr('data-aabb-collider-dynamic')
    let $text = $(`<a-text font="monoid" color="black" baseline="top" width="1" wrap-count="25" position="-0.5 0.5 0.51" value="-monitor output-">`)
    $host.append($text)
    self.textEl = $text.get(0)
    self.setOutput = function(output) {
      self.textEl.setAttribute('value', output)
    }
    self.getOutput = function(output) {
      return self.textEl.getAttribute('value')
    }
    self.monitor = function(tomonitor) {
      self.monitored = tomonitor
      tomonitor.setAttribute('color', 'lightgreen')
    }
    self.getMonitored = function() {
      return self.monitored
    }
  },
  tick: function() {
    let self = this
    catching(() => {
      self.ticks++
      if (self.ticks % 100 == 0) {
        self.setOutput(self.getOutput() + '.')
      }
      if (self.monitored) {
        self.setOutput(entityInfo(self.monitored))      
      }      
    })
  }
});

