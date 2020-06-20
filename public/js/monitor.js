/* global AFRAME entityInfo catching */
let MonitorPart = function(component, host) {
  
  function enableColliderTrackingWhenMoves() {
    host.setAttribute('omit-from-plan', '')    
  }
  function doNotSaveMonitorToPlan() {
    host.setAttribute('data-aabb-collider-dynamic', '')
  }
  return {
    init: function() {
      enableColliderTrackingWhenMoves()
      doNotSaveMonitorToPlan()
    }
  }
}
AFRAME.registerComponent('monitor', {
  init: function() {
    let self = this
    let host = self.el
    let part = MonitorPart(self, host)
    part.init()
    self.ticks = 0
    let $host = $(host)
    $host.addClass('touchable')
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
    }
    self.getMonitored = function() {
      return self.monitored
    }
  },
  tick: function(time, timeDelta) {
    const RUN_INTERVAL = 10
    const WAITING_INTERVAL = RUN_INTERVAL * 10
    let self = this
    self.ticks++
    if (self.ticks % RUN_INTERVAL != 0) {
      return
    }
    catching(() => {
      if (self.ticks % WAITING_INTERVAL == 0) {
        self.setOutput(self.getOutput() + '.')
      }
      if (self.monitored) {
        self.setOutput(entityInfo(self.monitored))      
      }      
    })
  }
});

