const canvas = document.body.appendChild(document.createElement('canvas'))
const camera = require('canvas-orbit-camera')(canvas)
const gl = require('gl-context')(canvas, render)
const triangle = require('a-big-triangle')
const Geom = require('gl-geometry')
const Shader = require('gl-shader')
const normals = require('normals')
const glslify = require('glslify')
const eye = require('eye-vector')
const mat4 = require('gl-mat4')
const bunny = require('bunny')
const FBO = require('gl-fbo')

const glTexture2DPIP = require('../')

gl.getExtension('OES_standard_derivatives')

bunny.normals = normals.vertexNormals(bunny.cells, bunny.positions)

const start = Date.now()
const geom = Geom(gl)
  .attr('position', bunny.positions)
  .attr('normal', bunny.normals)
  .faces(bunny.cells)

const res = new Float32Array(2)
const eyev = new Float32Array(3)
const view = mat4.create()
const proj = mat4.create()

const outShader = Shader(gl
  , glslify('./screen.vert')
  , glslify('./screen.frag')
)

const fbos = {
  position: FBO(gl, [2, 2], { float: true }),
  albedo: FBO(gl, [2, 2]),
  normal: FBO(gl, [2, 2]),
  screen: FBO(gl, [2, 2])
}

const vert = glslify('./shader.vert')

const shaders = {
  position: Shader(gl, vert, glslify('./position.frag')),
  albedo: Shader(gl, vert, glslify('./albedo.frag')),
  normal: Shader(gl, vert, glslify('./normal.frag'))
}

function render () {
  const width = res[0] = gl.drawingBufferWidth
  const height = res[1] = gl.drawingBufferHeight

  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)

  mat4.perspective(proj, Math.PI / 4, width / height, 0.1, 100)
  camera.view(view)
  camera.tick()
  eye(view, eyev)

  for (var key in shaders) {
    if (!shaders.hasOwnProperty(key)) continue
    var shader = shaders[key]
    var fbo = fbos[key]

    fbo.bind()
    fbo.shape = [width, height]

    gl.viewport(0, 0, width, height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    geom.bind(shader)
    shader.uniforms.view = view
    shader.uniforms.proj = proj
    shader.uniforms.res = res
    geom.draw()
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.viewport(0, 0, width, height)
  gl.disable(gl.DEPTH_TEST)
  gl.disable(gl.CULL_FACE)

  var x = 0

  outShader.bind()
  outShader.uniforms.eye = eyev
  outShader.uniforms.time = (Date.now() - start) / 1000
  for (key in shaders) {
    if (!shaders.hasOwnProperty(key)) continue
    outShader.uniforms['t_' + key] = fbos[key].color[0].bind(x++)
  }

  triangle(gl)

  glTexture2DPIP([
    fbos.position.color[0],
    fbos.albedo.color[0],
    fbos.normal.color[0]
  ])
}

window.addEventListener('resize'
  , require('canvas-fit')(canvas)
  , false
)
