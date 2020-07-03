/* global Hand */
var chai = chai || {}
var expect = chai.expect

describe('Hand', () => {
  let $hand
  let hand
  beforeEach(() => {
    $hand = $('<a-entity hand-side="right"></a-entity>')
    hand = Hand($hand)
  })
  
  it('creates a Hand instance', () => {
    expect(hand).to.not.be.null
  })
  
  describe('hand-model', () => {
    let $model, model
    beforeEach(() => {
      $model = $hand.find('.hand-model')
      model = $model.get(0)
    })
    
    it('adds in the visible hand-model on creation', () => {
      expect($model.length).to.equal(1)
      expect($model.hasClass('hand-model')).to.be.true
    })

    it('attaches to the appropriate oculus quest (touch) controller ' + 
       ' but does NOT display the default model', () => {
      expect($hand.attr('oculus-touch-controls')).to.equal('hand: right; model: false')
    })
    
    it('is a really small box', () => {
      expect($model.get(0).tagName).to.equal('A-BOX')
      let scale = model.object3D.scale
      expect(scale.x).to.equal(0.03)
      expect(scale.y).to.equal(0.03)
      expect(scale.z).to.equal(0.03)
    })
    
    it('is marked as the correct hand', () => {
      expect($model.attr('hand-side')).to.equal('right')
    })
    
    it('is a grabber (has grabber component)', () => {
      expect(model.hasAttribute('grabber')).to.be.true
    })

    it('is debugged (has debugged component)', () => {
      expect(model.hasAttribute('debugged')).to.be.true
    })
  })
  
  describe('sleeve', () => {
    let $sleeve, sleeve
    beforeEach(() => {
      $sleeve = $hand.find('.sleeve')
      sleeve = $sleeve.get(0)
    })

    it('adds in the sleeve on creation', () => {
      expect($sleeve.length).to.equal(1)
      expect($sleeve.hasClass('sleeve')).to.be.true
    })

    it('is a home for tweakers', () => {
      expect(sleeve.hasAttribute('tweaker-home')).to.be.true
    })

    it('is a home for spare stock', () => {
      expect(sleeve.hasAttribute('stock-home')).to.be.true
    })

  })
})
