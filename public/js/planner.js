/* global AFRAME patchHtml inDegrees */
AFRAME.registerComponent('planner', {
  init: function() {
    let options = {
      debug: false
    }
    let $self = $(this.el)
    let $scene = $('a-scene')
    let $spawn = $('#spawn')
    let putPlan = function(success, failure) {
      console.log('putting plan a')
      let plan = { items: []}
      $spawn.get(0).flushToDOM(true)
      $spawn.children().each(function() {
        let built3d = this.object3D
        if (this.hasAttribute('omit-from-plan')) {
          return
        }
        let positionValue = `${built3d.position.x} ${built3d.position.y} ${built3d.position.z}`
        let rotationValue = `${inDegrees(built3d.rotation.x)} ${inDegrees(built3d.rotation.y)} ${inDegrees(built3d.rotation.z)}`
        let scaleValue = `${built3d.scale.x} ${built3d.scale.y} ${built3d.scale.z}`
        console.log(positionValue)
        let positionedHtml = patchHtml(this.outerHTML, {
          'position': positionValue,
          'rotation': rotationValue,
          'scale': scaleValue
        })
        console.log(positionedHtml)
        plan.items.push(positionedHtml)
      })
      $.ajax({ // NB: complete attribute does not work in this jquery :()
        url: '/plan/a',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(plan)
      }).done(success).fail(failure)
    }
    let $planControl = $('<a-box id="glasses-collider" side="double"' +
                         ` visible="${options.debug}"` +
                         ' class="touchable" position="0.01 0 0" opacity="0.6" scale="0.22 0.18 0.18"></a-box>').appendTo($self)
    $planControl.on('hitstart', function(event) {
      $planControl.attr('visible', 'true')
      let planControl = $planControl.get(0)
      this.setAttribute('color', 'green')
      this.setAttribute('debugged', 'triggered plan')
      putPlan(() => { $planControl.attr('color', 'white')
                       $planControl.attr('sound', "src: url(sounds/one.mp3); autoplay: true; volume: 5")},
              () => { $planControl.attr('color', 'red') })
    }) 
    $planControl.on('hitend', function(event) {
      $planControl.attr('visible', options.debug)
    }) 
  }
});

