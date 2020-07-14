/* global AFRAME whalley clog catching */
var whalley = whalley || {}
whalley.log = {
  level: 'info',
  debug: function() {
    if (whalley.log.level == 'debug') {
      clog.apply(null, ['card move'].concat(arguments))
    }
  },
  info: function() {
    // clog.apply(null, ['card move'].concat(arguments))
  },
  log: function() {
    // clog.apply(null, ['card move'].concat(arguments))
  }
};

const DEFAULT_EMPTY_TEXT_THAT_CREATES_BOUNDING_BOX_FOR_COLLIDER = '.'

let VrCardViewFactory = function(vrWall, $wall) {
  let wallHeight = parseFloat($wall.attr('height'))
  let wallWidth = parseFloat($wall.attr('width'))
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
    
    let getText = (data) => {
      if (data.text && data.text.length > 0) {
        return data.text
      }
      return DEFAULT_EMPTY_TEXT_THAT_CREATES_BOUNDING_BOX_FOR_COLLIDER
    }

    let getTextWrapCount = (data) => data.width / 8
    const TEXT_SCALE = 0.1
    const TEXT_TOP_MARGIN = 0.008
    let font = '' // roboto dejavu mozillavr monoid sourcecodepro exo2bold aileronsemibold kelsonsans exo2semibold
    
    let cardTextEntityWidth = data.width * 10 * CARD_TO_METRES_SCALE
    let textOffsetY = (height / 2) - TEXT_TOP_MARGIN
    
    let $card
    setTimeout(() => {
      $card = $(`<a-box data-aabb-collider-dynamic color="${data.colour}" whalley-card class="touchable" follower-constraint="axis-lock: z; lock: rotation"` 
                 + `position="${getX(data)} ${getY(data)} ${z}" width="${width}" height="${height}" depth="0.01">`
                     + `<a-text font="${font}" position="0 ${textOffsetY} 0.01" wrap-count="${getTextWrapCount(data)}" width="${cardTextEntityWidth}"`
                        + `align="center" baseline="top" scale="${TEXT_SCALE} ${TEXT_SCALE} ${TEXT_SCALE}" value="${getText(data)}" color="black">`
                    + '</a-box>')
      $card.appendTo($wall)
      
      $card.on('movestart', () => {
        logical.move_started()
      })
      $card.on('moveend', () => {
        logical.move_completed()
        let data = logical.data()
        // setTimeout(() => {
        //   clog('card move', 'move_completed() called!!!!')
        //   clog('card move', `logical: ${data.x}, ${data.y}`, `calculated: ${getX(data)}, ${getY(data)}`)
        //   clog('card move', `wall basics: height ${wallHeight}, width ${wallWidth}, left ${wallLeft}, top ${wallTop}`)
        // }, 0)
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

function allowMovementWithoutRotation(entity) {
  entity.classList.add('touchable')
  entity.setAttribute('follower-constraint', 'lock: rotation')  
}

AFRAME.registerComponent('whalley-wall', {
  schema: {type: 'string', default: ''},
  init: function() {
    let self = this
    let host = self.el
    
    whalley.host = 'https://damned-whalley.glitch.me'
    
    allowMovementWithoutRotation(host)

    self.update = function(oldData) {
      let wallId = self.data
      if (!wallId) {
        return
      }
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
