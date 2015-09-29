var triangle = require('a-big-triangle')
var Shader = require('gl-shader')
var WeakMap = require('weak-map')
var glslify = require('glslify')

module.exports = glTexture2DPIP

var cache = new WeakMap()

function glTexture2DPIP (textures) {
  if (!textures.length) return

  var gl = textures[0].gl
  var width = gl.drawingBufferWidth
  var height = gl.drawingBufferHeight

  var shader = cache.get(gl)
  if (!shader) {
    cache.set(gl, shader = Shader(gl
      , glslify('./triangle.vert')
      , glslify('./triangle.frag')
    ))
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.disable(gl.DEPTH_TEST)
  gl.disable(gl.CULL_FACE)

  var padding = 10
  var localWidth = width * 0.15
  var localHeight = localWidth * textures[0].shape[1] / textures[0].shape[0]
  var startX = width - localWidth - padding
  var startY = height - localHeight - padding

  shader.bind()
  shader.uniforms.res = [localWidth, localHeight]

  for (var i = 0; i < textures.length; i++) {
    var x = startX
    var y = startY - (localHeight) * i - padding * i

    gl.viewport(x, y, localWidth, localHeight)
    shader.uniforms.tex = textures[i].bind(0)

    triangle(gl)
  }
}
