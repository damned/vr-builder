/* global AFRAME createSceneFixture */
var chai = chai || {}
var expect = chai.expect

describe('functional testing with aframe', function() {
  const colors = ['yellow', 'red', 'blue', 'green', 'lightyellow', 'pink', 'lightgreen', 'white']
  
  let scene = createSceneFixture({stats: false})
  
  afterEach(() => scene.cleanUp())
  
  const TEST_PERF_TEST_COUNT = 5
  
  describe('perf test aframe scene test', () => {
    for (let i=0; i < TEST_PERF_TEST_COUNT; i++) {
      it('does this scene test: ' + i, (done) => {
        let color = colors[i % colors.length]
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
      let leader = $('<a-box id="theleader" opacity="0.2" color="yellow" position="-1 1 -3"></a-box>').get(0)
      let follower = $('<a-sphere id="thefollower" color="red" follower="leader: #theleader" radius="0.4" position="1 1 -2"></a-sphere>').get(0)
      
      scene.append(leader)
      scene.append(follower)

      let leaderPos
      let followerPos
      scene.actions(() => {
        leaderPos = leader.object3D.position
        followerPos = follower.object3D.position
      },
      () => {
        expect(followerPos).to.shallowDeepEqual(leaderPos)        
        leaderPos.set(2, 2, 2)
      },
      () => {
        expect(followerPos).to.shallowDeepEqual({x: 2, y: 2, z: 2})
        done()
      })
    })

  })
})
