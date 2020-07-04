/* global AFRAME THREE */
var chai = chai || {}
var expect = chai.expect

let vector = (x, y, z) => new THREE.Vector3(x, y, z)
let bounds = (object3d) => new THREE.Box3().setFromObject(object3d)

describe('a-frame and three.js nested entities and transforms', () => {
  const identityMatrix = new THREE.Matrix4().identity()
  let $scene = $('<a-scene style="height: 200px" embedded>').appendTo('body')
  let v3 = new THREE.Vector3()
  
  beforeEach(() => {
    $scene.empty()
  })

  after(() => {
    $scene.remove()
    $scene = null
  })
  
  let localMatrix
  let worldMatrix
  
  describe('a nested sphere being reparented under another entity it sits on top of, but keeping original world representation', () => {
    let child
    
    beforeEach((done) => {
      let parent = $('<a-entity id="original-parent">' +
                      '<a-sphere id="child" position="-1 1 0" scale="0.1 0.1 0.1"></a-sphere>' +
                      '<a-box id="target-parent" position="-1 0 0" scale="2 2 2"></a-box>' +
                     '</a-entity>').appendTo($scene).get(0)

      child = $('#child').get(0)
      parent.addEventListener('loaded', () => done())
    })
    
    it('originally has world bounding box at top of target parent box', () => {
      expect(child.getWorldPosition(v3)).to.shallowDeepEqual({ x: -1, y: 1; })
    })
  })
  
  describe('a boring single entity in default placement', () => {
    let boring
    
    beforeEach((done) => {
      boring = $('<a-box></a-box>').appendTo($scene).get(0)
      boring.addEventListener('loaded', () => done())
    })
    
    it('will have local a-frame position at origin', () => {
      expect(boring.getAttribute('position'))
        .to.shallowDeepEqual({x: 0, y: 0, z: 0})
    })

    it('will have local three.js position at origin', () => {
      expect(boring.object3D.position)
        .to.shallowDeepEqual({x: 0, y: 0, z: 0})
    })
    
    it('will have a bounding box of unit dimensions centred on origin', () => {
      expect(bounds(boring.object3D).min).to.shallowDeepEqual({x:-0.5, y:-0.5, z:-0.5})
      expect(bounds(boring.object3D).max).to.shallowDeepEqual({x: 0.5, y: 0.5, z: 0.5})
    })

    describe('the underlying matrices', () => {
      beforeEach(() => {
        localMatrix = boring.object3D.matrix
        worldMatrix = boring.object3D.matrixWorld
      })
      
      it('will have an identity local matrix: one that transforms a point or matrix to itself', () => {
        expect(localMatrix.equals(identityMatrix)).to.be.true
        expect(vector(1, 2, 3).applyMatrix4(localMatrix)).to.deep.equal(vector(1, 2, 3))
      })
      
      it('will also have an identity world matrix', () => {
        expect(worldMatrix.equals(identityMatrix)).to.be.true
        expect(vector(1, 2, 3).applyMatrix4(worldMatrix)).to.deep.equal(vector(1, 2, 3))
      })      
    })
  })

  describe('a single entity translated somewhere', () => {
    let translated
    
    beforeEach((done) => {
      translated = $('<a-box position="1 2 3"></a-box>').appendTo($scene).get(0)
      translated.addEventListener('loaded', () => done())
    })
    
    it('will have offset local a-frame position', () => {
      expect(translated.getAttribute('position'))
        .to.shallowDeepEqual({x: 1, y: 2, z: 3})
    })
    
    it('will have offset local three.js position', () => {
      expect(translated.object3D.position)
        .to.shallowDeepEqual({x: 1, y: 2, z: 3})
    })
    
    describe('the underlying matrices', () => {
      beforeEach(() => {
        let object3d = translated.object3D
        object3d.updateMatrix()
        object3d.updateMatrixWorld()
        localMatrix = object3d.matrix
        worldMatrix = object3d.matrixWorld
      })
      
      it('will have a local matrix that translates a point by its own translation', () => {
        expect(vector(2, 4, 6).applyMatrix4(localMatrix)).to.shallowDeepEqual(vector(3, 6, 9))
      })
      
      it('will have a world matrix equal to the local matrix', () => {
        expect(worldMatrix).to.shallowDeepEqual(localMatrix)
        expect(vector(0, 1, 0).applyMatrix4(worldMatrix)).to.shallowDeepEqual(vector(1, 3, 3))
      })      
    })

  })

  describe('a single entity scaled uniformly at origin', () => {
    let scaled
    
    beforeEach((done) => {
      scaled = $('<a-box scale="2 2 2"></a-box>').appendTo($scene).get(0)
      scaled.addEventListener('loaded', () => done())
    })
    
    it('will be at origin', () => {
      expect(scaled.getAttribute('position'))
        .to.shallowDeepEqual({x: 0, y: 0, z: 0})
      expect(scaled.object3D.position)
        .to.shallowDeepEqual({x: 0, y: 0, z: 0})
    })
    
    it('will have a bounding box of unit dimensions centred on origin', () => {
      expect(bounds(scaled.object3D).min).to.shallowDeepEqual({x:-1, y:-1, z:-1})
      expect(bounds(scaled.object3D).max).to.shallowDeepEqual({x: 1, y: 1, z: 1})
    })

    describe('the underlying matrices', () => {
      beforeEach(() => {
        let object3d = scaled.object3D
        object3d.updateMatrix()
        object3d.updateMatrixWorld()
        localMatrix = object3d.matrix
        worldMatrix = object3d.matrixWorld
      })
      
      it('will have a local matrix that transforms a point away from the origin by its scaling factor', () => {
        expect(vector(2, 4, 6).applyMatrix4(localMatrix)).to.shallowDeepEqual(vector(4, 8, 12))
      })
      
      it('will have a world matrix equal to the local matrix', () => {
        expect(worldMatrix).to.shallowDeepEqual(localMatrix)
        expect(vector(0, 1, 0).applyMatrix4(worldMatrix)).to.shallowDeepEqual(vector(0, 2, 0))
      })      
    })

  })

  describe('a single entity scaled and translated', () => {
    let transformed
    
    beforeEach((done) => {
      transformed = $('<a-box position="-1 -2 1" scale="2 2 2"></a-box>').appendTo($scene).get(0)
      transformed.addEventListener('loaded', () => done())
    })
    
    it('will be locally positioned at its unscaled position coordinates', () => {
      expect(transformed.getAttribute('position')).to.shallowDeepEqual({x: -1, y: -2, z: 1})
      expect(transformed.object3D.position)       .to.shallowDeepEqual({x: -1, y: -2, z: 1})
    })

    it('will be world-positioned at its unscaled position coordinates', () => {
      expect(transformed.object3D.getWorldPosition(v3)).to.shallowDeepEqual({x: -1, y: -2, z: 1})
    })

    it('will have a bounding box of scaled dimensions around the translated origin', () => {
      expect(bounds(transformed.object3D).min).to.shallowDeepEqual({x:-2, y:-3, z: 0})
      expect(bounds(transformed.object3D).max).to.shallowDeepEqual({x: 0, y:-1, z: 2})
    })

    describe('the underlying matrices', () => {
      beforeEach(() => {
        let object3d = transformed.object3D
        object3d.updateMatrix()
        object3d.updateMatrixWorld()
        localMatrix = object3d.matrix
        worldMatrix = object3d.matrixWorld
      })
      
      it('will have a local matrix that transforms a point by its scale then moves it by the translation', () => {
        expect(vector(2, 4, 6).applyMatrix4(localMatrix)).to.shallowDeepEqual(vector(3, 6, 13))
      })
      
      it('will have a world matrix equal to the local matrix', () => {
        expect(worldMatrix).to.shallowDeepEqual(localMatrix)
        expect(vector(0, 1, 0).applyMatrix4(worldMatrix)).to.shallowDeepEqual(vector(-1, 0, 1))
      })      
    })

  })
  
  describe('a entity with nesting: a present (box) with decoration (a small sphere) on top', () => {
    let present
    let decoration
    
    beforeEach((done) => {
      let presentBoxMaxY = 0.5
      let decorationRadiusAtTenthScale = 0.1
      let decorationOriginInY = presentBoxMaxY + decorationRadiusAtTenthScale

      present = $('<a-box>' +
                    `<a-sphere id="decoration" position="0 ${decorationOriginInY} 0" scale="0.1 0.1 0.1"></a-sphere>` +
                  '</a-box>').appendTo($scene).get(0)

      decoration = $('#decoration').get(0)
      present.addEventListener('loaded', () => done())
    })
    
    describe('scaled and translated the parent, in aframe', () => {
      beforeEach(() => {
        present.setAttribute('scale', '2 2 2')
        present.setAttribute('position', '2 2 2')
        present.object3D.updateMatrixWorld()
      })
      describe('the present', () => {
        it('will still be locally shifted by translation amount', () => {
          expect(present.getAttribute('position')).to.shallowDeepEqual({x: 2, y: 2, z: 2})
          expect(present.object3D.position)       .to.shallowDeepEqual({x: 2, y: 2, z: 2})
        })        
        it('will be world-positioned translated by the specified amount', () => {
          expect(present.object3D.getWorldPosition(v3)).to.shallowDeepEqual({x: 2, y: 2, z: 2})
        })

        it('will have a bounding box of scaled dimensions (including extra height for diameter of decoration) around the translated origin', () => {
          let decorationDiameter = 0.2 // 100% scale a-sphere is radius 1, diameter 2
          
          expect(bounds(present.object3D).min).to.shallowDeepEqual({x: 1, y: 1, z: 1})
          
          let maxBounds = bounds(present.object3D).max
          expect(maxBounds.x).to.be.equal(3)
          expect(maxBounds.y).to.be.closeTo(3 + (2 * decorationDiameter), 0.001)
          expect(maxBounds.z).to.be.equal(3)
        })

        describe('the underlying matrices', () => {
          beforeEach(() => {
            localMatrix = present.object3D.matrix
            worldMatrix = present.object3D.matrixWorld
          })

          it('will have a local matrix that transforms a point by its scale then moves it by the translation', () => {
            expect(vector(2, 4, 6).applyMatrix4(localMatrix)).to.shallowDeepEqual(vector(6, 10, 14))
          })

          it('will have a world matrix equal to the local matrix', () => {
            expect(worldMatrix).to.shallowDeepEqual(localMatrix)
            expect(vector(0, 1, 0).applyMatrix4(worldMatrix)).to.shallowDeepEqual(vector(2, 4, 2))
          })      
        })
      })

      describe('the decoration', () => {        
        it('will be locally positioned as ever', () => {
          expect(decoration.getAttribute('position')).to.shallowDeepEqual({x: 0, y: 0.6, z: 0})
          expect(decoration.object3D.position)       .to.shallowDeepEqual({x: 0, y: 0.6, z: 0})
        })        
        it('will be world-positioned incorporating present offset and parent-scale-increased decoration offset', () => {
          expect(decoration.object3D.getWorldPosition(v3)).to.shallowDeepEqual({x: 2, y: (2 + 1.2), z: 2})
        })

        it('will have a world-positioned bounding box of its scaled dimensions around the translated origin', () => {
          expect(bounds(decoration.object3D).min).to.shallowDeepEqual({x: 1.8, y: 3.0, z: 1.8})

          let maxBounds = bounds(decoration.object3D).max
          expect(maxBounds.x).to.be.equal(2.2)
          expect(maxBounds.y).to.be.closeTo(3.4, 0.001)
          expect(maxBounds.z).to.be.equal(2.2)
        })

        describe('the underlying matrices', () => {
          beforeEach(() => {
            localMatrix = decoration.object3D.matrix
            worldMatrix = decoration.object3D.matrixWorld
          })

          it('will have an unchanged local matrix - from origin offset in Y at top of present, convert vector tenth scale', () => {
            let inputLocalPositionRelativeToDecoration = vector(10, 10, 10)
            let expectedPositionRelativeToParent = vector(1, 1.6, 1)
            expect(inputLocalPositionRelativeToDecoration.applyMatrix4(localMatrix)).to.shallowDeepEqual(expectedPositionRelativeToParent)
          })

          it('will have a world matrix that combines them both', () => {
            let inputLocalPositionRelativeToDecoration = vector(10, 10, 10)
            let expectedWorldPosition = vector(4, 5.2, 4)
            expect(inputLocalPositionRelativeToDecoration.applyMatrix4(worldMatrix)).to.shallowDeepEqual(expectedWorldPosition)
          })      
        })
      })
    })
    
    describe('without translation or scale', () => {

      describe('the present', () => {
        it('will be locally positioned at origin', () => {
          expect(present.getAttribute('position')).to.shallowDeepEqual({x: 0, y: 0, z: 0})
          expect(present.object3D.position)       .to.shallowDeepEqual({x: 0, y: 0, z: 0})
        })        
        it('will be world-positioned at origin', () => {
          expect(present.object3D.getWorldPosition(v3)).to.shallowDeepEqual({x: 0, y: 0, z: 0})
        })
      })
      describe('the decoration', () => {        
        it('will be locally positioned on top of present', () => {
          expect(decoration.getAttribute('position')).to.shallowDeepEqual({x: 0, y: 0.6, z: 0})
          expect(decoration.object3D.position)       .to.shallowDeepEqual({x: 0, y: 0.6, z: 0})
        })        
        it('will be world-positioned at same position', () => {
          expect(decoration.object3D.getWorldPosition(v3)).to.shallowDeepEqual({x: 0, y: 0.6, z: 0})
        })
      })
      
    })

    describe('translated the parent, present, in aframe', () => {
      beforeEach(() => {
        present.setAttribute('position', '3 3 1')
        present.object3D.updateMatrixWorld()
      })
      describe('the present', () => {
        it('will be locally positioned as specified', () => {
          expect(present.getAttribute('position')).to.shallowDeepEqual({x: 3, y: 3, z: 1})
          expect(present.object3D.position)       .to.shallowDeepEqual({x: 3, y: 3, z: 1})
        })        
        it('will be world-positioned at specified position', () => {
          expect(present.object3D.getWorldPosition(v3)).to.shallowDeepEqual({x: 3, y: 3, z: 1})
        })
      })
      describe('the decoration', () => {        
        it('will be locally positioned on top of present, irrespective of translation of present', () => {
          expect(decoration.getAttribute('position')).to.shallowDeepEqual({x: 0, y: 0.6, z: 0})
          expect(decoration.object3D.position)       .to.shallowDeepEqual({x: 0, y: 0.6, z: 0})
        })        
        it('will be world-positioned at new translated position of present with addition decoration offset', () => {
          expect(decoration.object3D.getWorldPosition(v3)).to.shallowDeepEqual({x: 3, y: 3.6, z: 1})
        })
      })
    })

    describe('scaled uniformly the parent, present, in aframe', () => {
      beforeEach(() => {
        present.setAttribute('scale', '0.5 0.5 0.5')
        present.object3D.updateMatrixWorld()
      })
      describe('the present', () => {
        it('will still be locally positioned at origin', () => {
          expect(present.getAttribute('position')).to.shallowDeepEqual({x: 0, y: 0, z: 0})
          expect(present.object3D.position)       .to.shallowDeepEqual({x: 0, y: 0, z: 0})
        })        
        it('will be world-positioned at origin', () => {
          expect(present.object3D.getWorldPosition(v3)).to.shallowDeepEqual({x: 0, y: 0, z: 0})
        })
      })
      describe('the decoration', () => {        
        it('will be locally positioned on top of present, irrespective of scale of present', () => {
          expect(decoration.getAttribute('position')).to.shallowDeepEqual({x: 0, y: 0.6, z: 0})
          expect(decoration.object3D.position)       .to.shallowDeepEqual({x: 0, y: 0.6, z: 0})
        })        
        it('will be world-positioned incorporating down-scaling of present, halving its distance to origin', () => {
          expect(decoration.object3D.getWorldPosition(v3)).to.shallowDeepEqual({x: 0, y: 0.3, z: 0})
        })
      })
    })
  })

})
