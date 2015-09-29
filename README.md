# gl-texture2d-pip

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Preview the contents of a set of gl-texture instances alongside your main render pass. Useful for debugging framebuffer operations, especially in the case of deferred rendering.

[![gl-texture2d-pip](http://i.imgur.com/xCNJDQe.gif)](http://stack.gl/gl-texture2d-pip/)

[**view demo**](http://stack.gl/gl-texture2d-pip/)

## Usage

[![NPM](https://nodei.co/npm/gl-texture2d-pip.png)](https://www.npmjs.com/package/gl-texture2d-pip)

### `glTexture2dPIP(textures)`

Takes an array of `textures`, where each element is an instance of [gl-texture2d](http://github.com/stackgl/gl-texture2d), and draws them to the canvas.

Note that this will update your context's GL state, namely:

* Disabling `gl.CULL_FACE` and `gl.DEPTH_TEST`.
* Changing the viewport.
* Disabling the currently bound framebuffer.

You'll generally want to run this as the very last operation in your render loop.

``` javascript
const pip = require('gl-texture2d-pip')

const fbo1 = FBO(gl, [512, 512])
const fbo2 = FBO(gl, [512, 512])
const fbo3 = FBO(gl, [512, 512])

function render () {
  // ...update your fbo instances here...

  pip([
    fbo1.color[0],
    fbo2.color[0],
    fbo3.color[0]
  ])
}
```

For a full usage example, see the demo code available in [demo/index.js](http://github.com/stackgl/gl-texture2d-pip/blob/master/demo/index.js)

## License

MIT, see [LICENSE.md](http://github.com/stackgl/gl-texture2d-pip/blob/master/LICENSE.md) for details.
