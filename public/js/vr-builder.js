var VrBuilder = function($scene, left, right) {
  let $spawn = $('<a-entity id="spawn"></a-entity>').appendTo($scene)
  let $camera = $scene.children('a-camera')
  
  let initPlanSave = function() {
    $camera.attr('planner', '')
  }

  let loadFromPlan = function() {
    console.log('getting plan a')
    $.get('/plan/a', function(data) {
      console.log('received plan')
      data.items.forEach(item => $spawn.append(item))
    })
  }
  initPlanSave()
  
  return {
    load: loadFromPlan
  }
}