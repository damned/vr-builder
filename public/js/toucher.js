/* global AFRAME clog */
AFRAME.registerComponent('toucher', {
  init: function() {
    let self = this
    // this.el.setAttribute('aabb-collider', 'objects: .touchable; collideNonVisible: true' 
    //                      // + '; debug: true'
    //                     )
    // var $host = $(this.el)
    // var host = this.el
    // $host.on('hitstart', function() {
    //   // todo this is a bit chonky finding this through parent!
    //   let $monitor = $host.parent().find('[monitor]')
    //   if ($monitor.length > 0)
    //   $monitor.get(0).components['monitor'].monitor(host.components['aabb-collider'].closestIntersectedEl)
    // })
    // // end: needs move out through toucher
  }
});
