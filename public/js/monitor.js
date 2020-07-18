/* global AFRAME entityInfo catching clog */
AFRAME.registerSystem('monitor', {
  init: function () {
    let self = this
    let componentRenderers = {}
    let componentRendererNames = []
    
    self.registerComponentRenderer = (name, componentRenderer) => {
      
      componentRendererNames.push(name)
      componentRenderers[name] = componentRenderer
    }
    
    self.applyCustomComponentRenderers = (infos, monitored) => {
      for (let i=0; i < componentRendererNames.length; i++) {
        let name = componentRendererNames[i]
        if (monitored.components[name]) {
          infos = componentRenderers[name](infos, monitored.components[name], monitored)
        }
      }
      return infos
    }
  }
})

let MonitorPart = function(component, host) {
  
  function enableColliderTrackingWhenMoves() {
    host.setAttribute('data-aabb-collider-dynamic', '')
  }
  function doNotSaveMonitorToPlan() {
    host.setAttribute('omit-from-plan', '')    
  }
  return {
    init: function() {
      enableColliderTrackingWhenMoves()
      doNotSaveMonitorToPlan()
    }
  }
}
AFRAME.registerComponent('monitor', {
  schema: {
    wrapCount: {type: 'number', default: 25 },
    dynamic: {type: 'boolean', default: true }
  },
  init: function() {
    let self = this
    let host = self.el
    let part = MonitorPart(self, host)
    part.init()
    self.ticks = 0
    let $host = $(host)
    let $text
    let monitorType = 'unconfigured'
    self.update = function() {
      monitorType = self.data.dynamic ? 'DYNAMIC' : 'FIXED'
      $text = $(`<a-text data-aabb-collider-dynamic font="monoid" color="black" baseline="top" width="1" wrap-count="${self.data.wrapCount}" position="-0.5 0.5 0.51" value="-${monitorType} monitor-">`)
      $host.append($text)
      self.textEl = $text.get(0)
      $host.addClass('touchable')
    }
    let touchSource
    let isDynamic = () => self.data.dynamic
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
    let touchHandler = (touched) => {
      clog('touch', 'in monitor i got a touch start for: ' + touched.tagName)
      self.monitor(touched)
    }
    self.setTouchSource = function(source) {
      touchSource = source
      touchSource.onTouchStart(touchHandler)
      touchSource.el.addEventListener('remotetouchstart', (event) => {
        let touched = event.detail.touched
        clog('touch', 'in monitor i got a remote touch start')
        touchHandler(touched)
      })
    }
    self.copyTo = function(targetMonitor) {
      if (isDynamic()) {
        targetMonitor.setTouchSource(touchSource)
      }
      else {
        targetMonitor.monitor(self.getMonitored())        
      }
    }
    setTimeout(() => {
      let $touchSourceAncestor = $host.closest('[touch-source]')
      if ($touchSourceAncestor.length == 0) {
        return
      }
      self.setTouchSource($touchSourceAncestor.get(0).components['touch-source'])
    }, 0)
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
        let infos = [entityInfo(self.monitored)]
        let extraInfo = self.monitored.monitorExtraInfo
        if (extraInfo) {
          for (let name in extraInfo) {
            infos.push(name + extraInfo[name])
          }
        }
        infos = self.system.applyCustomComponentRenderers(infos, self.monitored)
        self.setOutput(infos.join('\n'))
      }      
    })
  }
});

