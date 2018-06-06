# font-atlas-sdf [![unstable](https://img.shields.io/badge/stability-unstable-green.svg)](http://github.com/badges/stability-badges)

Populate a `<canvas>` element with a font texture atlas – can be used to quickly generate SDF (Signed Distance Field) fonts. SDF is the most efficient way to draw text in WebGL, see [article](https://www.mapbox.com/blog/text-signed-distance-fields/). For bitmap fonts see [font-atlas](https://github.com/hughsk/font-atlas).

[Demo](https://dy.github.io/font-atlas-sdf)

## Usage

[![npm install font-atlas-sdf](https://nodei.co/npm/font-atlas-sdf.png?mini=true)](https://npmjs.org/package/font-atlas-sdf/)

### canvas = fontAtlas(options?)

Populates and returns a `<canvas>` element with a font texture atlas. Takes
the following options:

Property | Default | Meaning
---|---|---
`canvas` | New canvas | use an existing `<canvas>` element.
`font` | `16px sans-serif` | the font family to use when drawing the text. Can be a [css font](https://developer.mozilla.org/en-US/docs/Web/CSS/font) string or an object with font properties: `size`, `family`, `style`, `weight`, `variant`, `stretch`.
`shape` | `[512, 512]` | an array containing the `[width, height]` for the canvas in pixels.
`step` | `[32, 32]` | an array containing the `[width, height]` for each cell in pixels.
`chars` | `[32, 126]` | may be one of either: a string containing all of the characters to use; an array of all the characters to use; an array specifying the `[start, end]` character codes to use.
`radius` | _size × 1.5_ | affects the "slope" of distance-transform.
`align` | `'optical'` | align symbol vertically by bounding box rather than font baseline. Available values: `'optical'` for center of mass alignment (see [optical-properties](https://github.com/dfcreative/optical-properties)), `'bounds'` for bounding box alignment or `false` to use font alignment.
`fit` | `0.5` | normalize glyph sizes to cover same part of `size`. Can be a number or bool, eg. `0.5` covers half of `size`, `1` fits to the full size and `false` disables fit.

<img src="https://raw.githubusercontent.com/dy/font-atlas-sdf/master/atlas.png" alt="Font atlas texture"/>

## Related

* [font-atlas](https://github.com/hughsk/font-atlas) − bitmap font atlas.
* [tiny-sdf](https://github.com/mapbox/tiny-sdf) − fast glyph signed distance field generation.
* [optical-properties](https://github.com/dy/optical-properties) − glyph optical center and bounding box calculation
