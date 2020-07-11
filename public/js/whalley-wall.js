/* global AFRAME whalley */
let VrCardViewFactory = function() {
  let VrCardView = function() {
    
  }
  return {
    create_card_view: function(vrWall, card) {
      
    }
  }
}

let VrWall = function(logical_wall) {
  let self = this
  var wall_view_api = {
    create_card_view: function(card) {
      return VrCardViewFactory().create_card_view(self, card)
    },
    group: function(width, height) {
      console.warn('VrWall', 'group - NYI - doing nothing')
      return {}
    },
    show_card: function(card) {
      console.warn('VrWall', 'show_card - NYI - doing nothing')
    }
  }

  
  function CardsApi(logical_cards_api) {
    return {
      add: function (cardlike) {
        console.log('adding card: ' + cardlike)
        var logical_card = logical_cards_api.add(cardlike);
        wall_view_api.create_card_view(logical_card);
        return logical_card;
      },
      clear: logical_cards_api.clear
    }
  }
  var cards_api = CardsApi(logical_wall.cards_api);

  function build(builder) {
    // svg.clear();
    cards_api.clear();
    builder(cards_api);
    // shelf.reload();
  }

  let external = {
    build: build,
    
    cards: function() {
      return logical_wall.cards.map(function(card) { return card.data() })
    },
    wall_data: function(data) {
      return logical_wall.wall_data(data)
    },

    move_card: logical_wall.move_card,
    add_card: cards_api.add,

    on_card_add: logical_wall.on_card_add,
    on_card_moving: logical_wall.on_card_moving,
    on_card_changed: logical_wall.on_card_changed
  }
  return external
}

AFRAME.registerComponent('whalley-wall', {
  schema: {type: 'string', default: ''},
  init: function() {
    let self = this
    let host =self.el
    
    whalley.host = 'https://damned-whalley.glitch.me'

    self.update = function(oldData) {
      let wallId = self.data
      let logical_wall = new whalley.LogicalWall()
      let visible_wall = VrWall(logical_wall);
      let sync_client = whalley.SocketIoSyncClient(visible_wall); // NB tied to visible wall at mo because visible wall needs to create view
                                                                  // when it forwards card add to logical wall
                                                                  // could tie directly to logical wall if made wall view create card view
                                                                  // in response to "card created" event
      sync_client.load_wall(wallId, () => {
        host.setAttribute('color', 'white')
      });
    }
  }
});
