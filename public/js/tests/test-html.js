/* global patchHtml */
var chai = chai || {}
var expect = chai.expect

describe('patchHtml', () => {
  it('will replace an integer position attribute', () => {
    let original = '<a-box position="4 0 1"></a-box>'
    expect(patchHtml(original, { position: 'bob' })).to.eql('<a-box position="bob"></a-box>')
  })
  
  it('will replace position with negatives and decimals', () => {
    let original = '<a-box position=" 0 2.005 -0.1"></a-box>'
    expect(patchHtml(original, { position: 'foo' })).to.eql('<a-box position="foo"></a-box>')
  })

  it('will replace multiple properties', () => {
    let original = '<a-box position=" 0 2.005 -0.1" scale="1 1 1" rotation="90 90 90"></a-box>'
    expect(patchHtml(original, { 
      position: 'foo',
      scale: 'bar',
      rotation: 'snafu'
    })).to.eql('<a-box position="foo" scale="bar" rotation="snafu"></a-box>')
  })

  it('will replace add a property if it doesn't exist, () => {
    let original = '<a-box></a-box>'
    expect(patchHtml(original, { 
      rotation: 'fubar'
    })).to.eql('<a-box rotation="fubar"></a-box>')
  })
})
