/* global AFRAME createSceneFixture */
var chai = chai || {}
var expect = chai.expect

describe('functional testing with aframe', function() {
  const colors = ['yellow', 'red', 'blue', 'green', 'lightyellow', 'pink', 'lightgreen', 'white']
  
  let scene = createSceneFixture({stats: false})
  
  const TEST_PERF_TEST_COUNT = 5
  
  describe('perf test aframe scene test', () => {
    for (let i=0; i < TEST_PERF_TEST_COUNT; i++) {
      it('does this scene test: ' + i, (done) => {
        let color = colors[i % colors.length]
        scene.append(`<a-box color="${color}" position="0 1 -2"></a-box>`)
        scene.apply(() => {
          expect(scene.scene.renderStarted).to.eql(true)
          done()
        })
      })
    }
  })

  describe('follow component', () => {
    it('should follow another component functionally', (done) => {
      let leader = $('<a-box id="theleader" color="yellow" position="-1 1 -3"></a-box>').get(0)
      let follower = $('<a-sphere id="thefollower" color="red" follower="leader: #theleader" position="0 0 0"></a-sphere>').get(0)
      
      scene.append(leader)
      scene.append(follower)

      scene.apply(() => {
        let leaderPos = leader.object3D.position
        let followerPos = follower.object3D.position

        setTimeout(() => {
          expect(followerPos).to.shallowDeepEqual(leaderPos)        
          setTimeout(() => {
            leaderPos.set(2, 2, 2)
            expect(followerPos).to.shallowDeepEqual(leaderPos)        
            done()
          }, 0)
        }, 0)
      })
    })

  })
})
