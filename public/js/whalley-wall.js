/* global AFRAME THREE whalley clog catching */
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
  const CARD_TO_METRES_SCALE = 0.002
  
  let wallHeight = parseFloat($wall.attr('height'))
  let wallWidth = parseFloat($wall.attr('width'))
  let wallTop = wallHeight / 2
  let wallLeft = -wallWidth / 2
  
  let getCardX = (position) => Math.floor((position.x - wallLeft) / CARD_TO_METRES_SCALE)
  let getCardY = (position) => Math.floor(-(position.y - wallTop) / CARD_TO_METRES_SCALE)

  let getLocalX = (data) => wallLeft + (data.x * CARD_TO_METRES_SCALE)
  let getLocalY = (data) => wallTop - (data.y  * CARD_TO_METRES_SCALE)
  let z = 0.1
  
  let localPositionToCardCoords = function(position) {
    return {
      x: getCardX(position), 
      y: getCardY(position)
    }
  }


  let VrCardView = function(logical) {
        
    let data = logical.data()
    let height = data.height * CARD_TO_METRES_SCALE
    let width = data.width * CARD_TO_METRES_SCALE
    
    let getText = (data) => {
      if (data.text && data.text.length > 0) {
        return data.text
      }
      return DEFAULT_EMPTY_TEXT_THAT_CREATES_BOUNDING_BOX_FOR_COLLIDER
    }

    let getTextWrapCount = (data) => data.width / 7
    const TEXT_SCALE = 0.1
    const TEXT_TOP_MARGIN = 0.008
    let font = '' // roboto dejavu mozillavr monoid sourcecodepro exo2bold aileronsemibold kelsonsans exo2semibold
    
    let cardTextEntityWidth = data.width * 10 * CARD_TO_METRES_SCALE
    let textOffsetY = (height / 2) - TEXT_TOP_MARGIN
    
    let avatar = data.avatar ? true : false
    
    let $card
    setTimeout(() => {
      $card = $(`<a-box data-aabb-collider-dynamic color="${data.colour}" whalley-card="avatar: ${avatar}" follower-constraint="axis-lock: z; lock: rotation"` 
                 + `position="${getLocalX(data)} ${getLocalY(data)} ${z}" width="${width}" height="${height}" depth="0.01">`
                     + `<a-text font="${font}" position="0 ${textOffsetY} 0.01" wrap-count="${getTextWrapCount(data)}" width="${cardTextEntityWidth}"`
                        + `align="center" baseline="top" scale="${TEXT_SCALE} ${TEXT_SCALE} ${TEXT_SCALE}" value="${getText(data)}" color="black">`
                    + '</a-box>')
      $card.appendTo($wall)
      
      $card.attr('remote-touchable', '')
      $card.on('remotetouched', () => {
        vrWall.highlightCardsOnAllWalls([data.id])
      })
      
      $card.on('movestart', () => {
        logical.move_started()
      })
      $card.on('moveend', () => {
        logical.move_completed()
        let data = logical.data()
        // setTimeout(() => {
        //   clog('card move', 'move_completed() called!!!!')
        //   clog('card move', `logical: ${data.x}, ${data.y}`, `calculated: ${getLocalX(data)}, ${getLocalY(data)}`)
        //   clog('card move', `wall basics: height ${wallHeight}, width ${wallWidth}, left ${wallLeft}, top ${wallTop}`)
        // }, 0)
      })
      $card.on('move', (event) => {
        let position = event.detail.position
        logical.move_happening(getCardX(position), getCardY(position))
      })
      
      setTimeout(() => {
        $card.get(0).components['whalley-card'].card = logical
      }, 0)
    }, 100)
    
    logical.on_position_value_changed(() => {
      let dataAfterMove = logical.data()
      $card.get(0).object3D.position.set(getLocalX(dataAfterMove), getLocalY(dataAfterMove), z)
    })
    
    return {
      remove: () => {
        if (!$card) return
        $card.remove()
      },
      moveToPosition: (position) => {
        if (!$card) return
        
        $card.get(0).object3D.position.set(position.x, position.y, z)
      },
      getCardCoords: () => localPositionToCardCoords($card.get(0).object3D.position),
      highlight: function() {
        $card.attr('color', 'red')
        setTimeout(() => {
          $card.attr('color', data.colour)
        }, 2000)
      }
    }
  }
  
  return {
    create_card_view: function(card) {
      return VrCardView(card)    
    },
    localPositionToCardCoords: localPositionToCardCoords
  }
}

let VrWall = function(logical_wall, wallEntity) {
  let external = {}
  let $wall = $(wallEntity)
  let wall3d = wallEntity.object3D
  let cardViewFactory = VrCardViewFactory(external, $wall)
  let avatarCardView = null
  
  var wall_view_api = {
    create_card_view: function(card) {
      return cardViewFactory.create_card_view(card)
    },
    group: function(width, height) {
      console.warn('VrWall', 'group - NYI - doing nothing')
      return {}
    },
    show_card: function(card) {
      console.warn('VrWall', 'show_card - NYI - doing nothing')
    }
  }
  
  let visibleCards = {}

  let highlightCards = function(cardIds) {
    cardIds.forEach((id) => {
      let card = visibleCards[id]
      if (card) card.highlight()
    })
  }  

  function CardsApi(logical_cards_api) {
    return {
      add: function (cardlike) {
        console.log('adding card: ' + cardlike)
        let logicalCard = logical_cards_api.add(cardlike);
        let visibleCard = wall_view_api.create_card_view(logicalCard);
        visibleCards[cardlike.id] = visibleCard
        let relation = cardlike.relation
        if (relation && relation.source && relation.source.id) {
          visibleCards[relation.source.id] = visibleCard
        }
        return logicalCard;
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
  
  let lastRemoteTouchGrabId = null
  let remoteTouchPosition = new THREE.Vector3()
  
  let getCardCoordinatesOfWorldTouchPosition = (touchWorldPosition) => {
    remoteTouchPosition.copy(touchWorldPosition)
    let localTouchPosition = wall3d.worldToLocal(remoteTouchPosition)
    return cardViewFactory.localPositionToCardCoords(localTouchPosition)
  }

  let addSourceRelationData = function (cardData, options) {
    let sourceCardData = options.sourceCard
    if (!cardData.relation) {
      cardData.relation = {}
    }
    let source = {
      id: sourceCardData.id
    }
    cardData.relation.source = source
    return cardData
  }
  
  let wallSystem = wallEntity.sceneEl.systems['whalley-wall']
  let highlightCardsOnAllWalls = function(cardIds) {
    wallSystem.highlightCards(cardIds)
  }
  
  function remoteTouchHandler(event) {
    // $wall.attr('color', 'red')
    catching(() => {
      let toucherHost = event.detail.toucherHost
      let toucherGrabber = event.detail.toucherGrabber
      if (!toucherGrabber) {
        clog('got remote touch but toucher has no grabber')
        return
      }
      if (toucherGrabber.grabbed == null) {
        clog('got remote touch but nothing grabbed')
        return
      }
      if (toucherGrabber.grabId == lastRemoteTouchGrabId) {
        clog('already dealt with remote touch for this grab event (by grabId)')
        return
      }
      lastRemoteTouchGrabId = toucherGrabber.grabId
      let grabbed = toucherGrabber.grabbed
      let isOnThisWall = $(grabbed).closest($wall).length > 0
      if (isOnThisWall) {
        clog('got remote touch for grabbed card, but from this wall already')
        return
      }
      let grabbedCardComponent = grabbed.components['whalley-card']
      if (!grabbedCardComponent) {
        clog('not grabbing a card')
        return        
      }
      clog('remote card clone to wall really happening')
      let grabbedCardData = grabbedCardComponent.card.data()
      toucherGrabber.cancelGrabbedMovement()
      
      let coords = getCardCoordinatesOfWorldTouchPosition(event.detail.worldPosition)
      
      let avatarCardData = {
        avatar: true,
        id: Date.now().toString(),
        x: coords.x,
        y: coords.y,
        width: grabbedCardData.width,
        height: grabbedCardData.height,
        colour: 'orange',
        type: 'text',
        text: 'copying...\n' + grabbedCardData.text
      }
      let avatarLogicalCard = {
        data: () => avatarCardData,
        on_position_value_changed: () => {},
        move_started: () => {},
        move_completed: () => {},
        move_happening: () => {},
        copyData: () => {
          let finalAvatarCoords = avatarCardView.getCardCoords()
          return Object.assign(avatarCardData, addSourceRelationData({ 
            avatar: false,
            x: finalAvatarCoords.x,
            y: finalAvatarCoords.y,
            colour: grabbedCardData.colour,
            text: grabbedCardData.text
          }, { sourceCard: grabbedCardData }))
        }
      }
      avatarCardView = wall_view_api.create_card_view(avatarLogicalCard);

      let avatarSolidifier = () => {
        cards_api.add(avatarLogicalCard.copyData())
        avatarCardView.remove()
        avatarCardView = null
        lastRemoteTouchGrabId = null
        toucherHost.removeEventListener('ungrasp', avatarSolidifier)
      }
      toucherHost.addEventListener('ungrasp', avatarSolidifier)
      // $wall.attr('color', 'orange')
      // setTimeout(() => {
      //   $wall.attr('color', 'lightgray')
      // }, 1000)        
    })
  }
  
  function remoteUntouchHandler() {
    // $wall.attr('color', 'blue')
    // setTimeout(() => {
    //   $wall.attr('color', 'lightgray')
    // }, 1000)
  }

  function remoteTouchedMoveHandler(event) {
    if (avatarCardView) {
      remoteTouchPosition.copy(event.detail.worldPosition)
      let localPosition = wall3d.worldToLocal(remoteTouchPosition)
      avatarCardView.moveToPosition(localPosition)
    }
  }
  
  function configureWallModel() {
    $wall.attr('remote-touchable', '')
    $wall.on('remotetouched', remoteTouchHandler)
    $wall.on('remoteuntouched', remoteUntouchHandler)
    $wall.on('remotetouchedmove', remoteTouchedMoveHandler)
  }

  configureWallModel()
  
  Object.assign(external, {
    build: build,
    
    cards: function() {
      return logical_wall.cards.map(function(card) { return card.data() })
    },
    wall_data: function(data) {
      return logical_wall.wall_data(data)
    },

    move_card: logical_wall.move_card,
    add_card: cards_api.add,
    
    highlightCards: highlightCards,
    highlightCardsOnAllWalls: highlightCardsOnAllWalls,

    on_card_add: logical_wall.on_card_add,
    on_card_moving: logical_wall.on_card_moving,
    on_card_changed: logical_wall.on_card_changed
  })
  return external
}

function allowMovementWithoutRotation(entity) {
  entity.classList.add('touchable')
  entity.setAttribute('follower-constraint', 'lock: rotation')  
}

AFRAME.registerSystem('whalley-wall', {
  init: function() {
    let self = this
    let walls = []
    self.registerWall = function(wall) {
      walls.push(wall)
    }
    self.highlightCards = function (cardIds) {
      walls.forEach((wall) => {
        if (wall) {
          wall.highlightCards(cardIds)
        }
      })
    }
  }
})

AFRAME.registerComponent('whalley-wall', {
  schema: {
    spaceId: {type: 'string', default: ''},
    idSuffix: {type: 'string', default: ''},
  },
  init: function() {
    let self = this
    let host = self.el
    
    whalley.host = 'https://damned-whalley.glitch.me'
    
    allowMovementWithoutRotation(host)

    let visibleWall
    
    self.update = function(oldData) {
      console.log(self.data)
      let spaceId = self.data.spaceId
      let idSuffix = self.data.idSuffix
      let wallId = spaceId + idSuffix
      if (!spaceId) {
        return
      }
      let logical_wall = new whalley.LogicalWall()
      visibleWall = VrWall(logical_wall, host);
      let sync_client = whalley.SocketIoSyncClient(visibleWall); // NB tied to visible wall at mo because visible wall needs to create view
                                                                  // when it forwards card add to logical wall
                                                                  // could tie directly to logical wall if made wall view create card view
                                                                  // in response to "card created" event
      sync_client.load_wall(wallId, () => {
        host.setAttribute('color', 'white')
      });
    }
    
    self.highlightCards = function (cardIds) {
      visibleWall.highlightCards(cardIds)
    }
    
    self.system.registerWall(self)
  }
});
