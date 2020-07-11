/* global AFRAME whalley */

let VrWall = function(logical) {
  
}

AFRAME.registerComponent('whalley-wall', {
  schema: {type: 'string', default: ''},
  init: function() {
  },
  update: function(oldData) {
    let wallId = this.data
    let logical_wall = new whalley.LogicalWall()
    let visible_wall = VrWall(logical_wall);
    let sync_client = whalley.SocketIoSyncClient(visible_wall); // NB tied to visible wall at mo because visible wall needs to create view
                                                                // when it forwards card add to logical wall
                                                                // could tie directly to logical wall if made wall view create card view
                                                                // in response to "card created" event
  }
});
