# font-atlas-sdf [![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Populate a `<canvas>` element with a font texture atlas – can be used to quickly
generate SDF (Signed Distance Field) fonts. SDF is the most efficient way to draw text in WebGL, see [article](https://www.mapbox.com/blog/text-signed-distance-fields/). For bitmap fonts see [font-atlas](https://github.com/hughsk/font-atlas).

## Usage

[![NPM](https://nodei.co/npm/font-atlas-sdf.png)](https://nodei.co/npm/font-atlas-sdf/)

### canvas = fontAtlas([options])

Populates and returns a `<canvas>` element with a font texture atlas. Takes
the following options:

* `canvas`: use an existing `<canvas>` element. By default, a new one will
  be created for you.
* `family`: the font family to use when drawing the text. Default: `monospace`.
* `shape`: an array containing the `[width, height]` for the canvas in pixels.
  Default: `[512, 512]`.
* `step`: an array containing the `[width, height]` for each cell in pixels.
  Default: `[32, 32]`.
* `size`: the font size to use when drawing the text. Default: `16px`
* `chars`: may be one of either:
  * a string containing all of the characters to use.
  * an array of all the characters to use.
  * an array specifying the `[start, end]` character codes to use. By default,
    this is `[32, 126]`.

## Related

* [font-atlas](https://github.com/hughsk/font-atlas) — bitmap font atlas.
* [tiny-sdf](https://github.com/mapbox/tiny-sdf) — fast glyph signed distance field generation.

<img src="https://raw.githubusercontent.com/dfcreative/font-atlas-sdf/master/atlas.png" alt="Font atlas texture" width="280"/>
