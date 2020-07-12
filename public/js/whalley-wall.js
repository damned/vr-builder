/* global AFRAME whalley */
let VrCardViewFactory = function(vrWall, $wall) {
  let wallHeight = parseInt($wall.attr('height'))
  let wallWidth = parseInt($wall.attr('width'))
  let wallTop = wallHeight / 2
  let wallLeft = -wallWidth / 2

  let VrCardView = function(logical) {
    let CARD_TO_METRES_SCALE = 0.002
    let getX = (data) => wallLeft + (data.x * CARD_TO_METRES_SCALE)
    let getY = (data) => wallTop - (data.y  * CARD_TO_METRES_SCALE)
    let z = 0.1
    
    let data = logical.data()
    let height = data.height * CARD_TO_METRES_SCALE
    let width = data.width * CARD_TO_METRES_SCALE
    
    let TEXT_SCALE = 0.1
    let cardTextEntityWidth = data.width * 10 * CARD_TO_METRES_SCALE
    
    let $card
    setTimeout(() => {
      $card = $(`<a-box color="lightyellow" whalley-card class="touchable" follower-constraint="axis-lock: z; lock: rotation"` 
                 + `position="${getX(data)} ${getY(data)} ${z}" width="${width}" height="${height}" depth="0.01">`
                     + `<a-text position="0 ${height / 2} 0.01" wrap-count="${data.width / 5}" width="${cardTextEntityWidth}"`
                        + `align="center" baseline="top" scale="${TEXT_SCALE} ${TEXT_SCALE} ${TEXT_SCALE}" value="${data.text}" color="black">`
                    + '</a-box>')
      $card.appendTo($wall)
      
      $card.on('movestart', () => {
        logical.move_started()
      })
      $card.on('moveend', () => {
        logical.move_completed()
      })
      $card.on('move', (event) => {
        let position = event.detail.position
        logical.move_happening(Math.floor((position.x - wallLeft) / CARD_TO_METRES_SCALE),
                               Math.floor(-(position.y - wallTop) / CARD_TO_METRES_SCALE))
      })
    }, 100)
    
    logical.on_position_value_changed(() => {
      let dataAfterMove = logical.data()
      $card.get(0).object3D.position.set(getX(dataAfterMove), getY(dataAfterMove), z)
    })
    
  }
  
  return {
    create_card_view: function(card) {
      return VrCardView(card)    
    }
  }
}

let VrWall = function(logical_wall, wallEntity) {
  let self = this
  let $wall = $(wallEntity)
  var wall_view_api = {
    create_card_view: function(card) {
      return VrCardViewFactory(self, $wall).create_card_view(card)
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
    $wall.empty()
    cards_api.clear();
    builder(cards_api);
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
    let host = self.el
    
    whalley.host = 'https://damned-whalley.glitch.me'

    self.update = function(oldData) {
      let wallId = self.data
      let logical_wall = new whalley.LogicalWall()
      let visible_wall = VrWall(logical_wall, host);
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
