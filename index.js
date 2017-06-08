/**
 * @module  font-atlas-sdf
 */

'use strict'

var SDF = require('tiny-sdf')

module.exports = atlas

function atlas(options) {
	options = options || {}

	var canvas = options.canvas || document.createElement('canvas')
	var family = options.family || 'monospace'
	var shape = options.shape || [512, 512]
	var step = options.step || [32, 32]
	var size = options.size || 16
	var chars = options.chars || [32, 126]
	var bufferSize = Math.floor((step[0] - size)/2)
	var radius = options.radius || bufferSize*1.5
	var sdf = new SDF(size, bufferSize, radius, 0, family)
	var vAlign = options.align || true
	var i, j

	if (typeof size === 'number') {
		size = size + 'px'
	}

	if (!Array.isArray(chars)) {
		chars = String(chars).split('')
	}
	else if (
		chars.length === 2
		&& typeof chars[0] === 'number'
		&& typeof chars[1] === 'number'
	) {
		var newchars = []

		for (i = chars[0], j = 0; i <= chars[1]; i++) {
			newchars[j++] = String.fromCharCode(i)
		}

		chars = newchars
	}

	shape = shape.slice()
	canvas.width  = shape[0]
	canvas.height = shape[1]

	var ctx = canvas.getContext('2d')

	ctx.fillStyle = '#000'
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	ctx.font = size + ' ' + family
	ctx.textBaseline = 'middle'

	var x = 0
	var y = 0
	var len = Math.min(chars.length, Math.floor(shape[0]/step[0]) * Math.ceil(shape[1]/step[1]))

	// hack tiny-sdf to render centered
	//FIXME: get rif of it by [possibly] PR to tiny-sdf
	var align = sdf.ctx.textAlign
	var buffer = sdf.buffer

	sdf.ctx.textAlign = 'center'
	sdf.buffer = sdf.size/2

	for (i = 0; i < len; i++) {
		var data = sdf.draw(chars[i])

		var offY = 0
		if (vAlign) {
			// offY = getAlignOffset(data)
			var center = getOpticalCenter(data)
			offY = -data.height/2 + center[1]
		}

		ctx.putImageData(data, x, y - offY)

		x += step[0]
		if (x > shape[0] - step[0]) {
			x = 0
			y += step[1]
		}
	}

	// unhack tiny-sdf
	sdf.ctx.textAlign = align
	sdf.buffer = buffer

	return canvas


	function getAlignOffset (data) {
		console.time(1)
		var buf = data.data, w = data.width, h = data.height

		var top = 0, bottom = 0, x, y, r, line

		//find top boundary
		for (y = 0; y < h; y++) {
			line = y * w * 4
			for (x = 0; x < w; x++) {
				r = buf[line + x * 4]

				if (r > 0) {
					top = y
					break
				}
			}
			if (top) break
		}

		//find bottom boundary
		for (y = h; y--;) {
			line = y * w * 4
			for (x = 0; x < w; x++) {
				r = buf[line + x * 4]

				if (r > 0) {
					bottom = y
					break
				}
			}
			if (bottom) break
		}
		console.timeEnd(1)

		return top - .5 * (top + (h - bottom))
	}

	//walks over imagedata, returns {average: [x, y], variance: [x, y]}
	function getOpticalCenter (data) {
		var buf = data.data, w = data.width, h = data.height

		var x, y, r, i, j, sum, sum2, xSum, ySum, avg = Array(h), avgX = Array(h), cx, cy;

		for (y = 0; y < h; y++) {
			sum = 0, sum2 = 0, xSum = 0, j = y*4*w
			for (x = 0; x < w; x++) {
				i = x*4
				r = buf[j + i]
				sum += r
				xSum += x*r
				sum2 += r*r
			}
			avg[y] = sum === 0 ? 0 : sum/w
			avgX[y] = sum === 0 ? 0 : xSum/sum
		}

		sum = 0, ySum = 0, xSum = 0
		for (y = 0; y < h; y++) {
			ySum += avg[y]*y
			sum += avg[y]
			xSum += avgX[y]*avg[y]
		}

		cy = ySum/sum
		cx = xSum/sum

		return [cx, cy]
	}
}

