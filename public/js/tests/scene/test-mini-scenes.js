/* global AFRAME createSceneFixture testable */
var chai = chai || {}
var expect = chai.expect

describe('functional testing with aframe', function() {
  const colors = ['yellow', 'red', 'blue', 'green', 'lightyellow', 'pink', 'lightgreen', 'white']
  
  let scene = createSceneFixture({stats: false})
  
  // afterEach(() => scene.cleanUp())
  
  const TEST_PERF_TEST_COUNT = 5
  
  describe('perf test aframe scene test', () => {
    for (let i=0; i < TEST_PERF_TEST_COUNT; i++) {
      let color = colors[i % colors.length]
      it('checks a scene renders: ' + color, (done) => {
        scene.append(`<a-box color="${color}" position="0 1 -2"></a-box>`)
        scene.actions(() => {
          expect(scene.scene.renderStarted).to.eql(true)
          done()
        })
      })
    }
  })

  describe('follow component', () => {
    it('should follow another component functionally', (done) => {
      let leaderEl = $('<a-box id="theleader" opacity="0.2" color="yellow" position="-1 1 -3"></a-box>').get(0)
      let followerEl = $('<a-sphere id="thefollower" color="red" follower="leader: #theleader" radius="0.4" position="1 1 -2"></a-sphere>').get(0)
      
      scene.append(leaderEl)
      scene.append(followerEl)

      let leader = testable(leaderEl)
      let follower = testable(followerEl)
      
      scene.actions(() => {
        expect(follower.position).to.shallowDeepEqual(leader.position)        
        leader.position.set(2, 2, 2)
      },
      () => {
        expect(follower.position).to.shallowDeepEqual({x: 2, y: 2, z: 2})
        done()
      })
    })
  })
  
  describe('grabber component', () => {
    it('should allow grab to move an object', function(done) {
      let moverEl = $('<a-box id="mover" grabber="#mover" position="0 0 0" scale="0.1 0.1 0.1" ></a-box>').get(0)
      let moveableEl = $('<a-sphere id="moveable" class="touchable" position="-1 1 -1" color="red" opacity="0.2" radius="0.2"></a-sphere>').get(0)
      
      scene.append(moverEl)
      scene.append(moveableEl)

      let mover = testable(moverEl, 'grabber')
      let moveable = testable(moveableEl)
      
      let finalPos = {x: 2, y: 2, z: -2}

      scene.setActionDelay(100)
      scene.actions(() => {
        mover.moveTo(moveable.position)
      },
      () => {
        mover.grabber().grasp({})
      },
      () => {
        mover.moveTo(finalPos)
      },
      () => {
        expect(mover.grabber.grabbed).to.not.be.null
        expect(moveable.position).to.shallowDeepEqual(finalPos)
        done()
      })
    })
  })
})
