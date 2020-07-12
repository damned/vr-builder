var VrBuilder = function($scene, left, right) {
  let spaceId = $scene.attr('space-id')
  let $spawn = $('<a-entity id="spawn"></a-entity>').appendTo($scene)
  let $camera = $scene.children('a-camera')
  
  let initPlanSave = function() {
    $camera.attr('planner', 'plan-id: ' + spaceId)
  }

  let loadFromPlan = function() {
    console.log('getting plan ' + spaceId)
    $.get('/plan/' + spaceId, function(data) {
      console.log('received plan')
      data.items.forEach(item => $spawn.append(item))
    })
  }
  initPlanSave()
  
  return {
    load: loadFromPlan
  }
}