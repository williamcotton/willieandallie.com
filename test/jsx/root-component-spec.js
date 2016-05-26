var test = require('tapes')
var React = require('react')
require('node-jsx').install({extension: '.jsx'})

var RootComponent = require('../../src/jsx/root-component.jsx')

test('Root Component', function (t) {
  var expect = require('./abstract-expect-root-component')({
    RootComponent: RootComponent
  })

  expect.rootComponentToBeRendered(t)
  expect.contentToBeRenderedIntoRoot(t)

  t.end()
})
