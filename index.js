/**
 * @module  font-atlas-sdf
 */

'use strict'

var SDF = require('tiny-sdf')
var optical = require('optical-properties')
var Font = require('css-font')

module.exports = atlas

function atlas(o) {
	o = o || {}

	var canvas = o.canvas || document.createElement('canvas')
	var shape = o.shape || [512, 512]
	var step = o.step || [32, 32]
	var font = !o.font ? {} : typeof o.font === 'string' ? Font.parse(o.font) : o.font
	var size = parseFloat(font.size) || 16
	var family = font.family || 'sans-serif'
	var chars = o.chars || [32, 126]
	var bufferSize = Math.floor((step[0] - size)/2)
	var radius = o.radius || bufferSize*1.5
	var sdf = new SDF(size, bufferSize, radius, 0, family)
	var vAlign = o.align == null ? 'optical' : o.align
	var fit = o.fit == null || o.fit == true ? .5 : o.fit
	var i, j

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
	ctx.textBaseline = 'middle'

	var w = step[0], h = step[1]
	var x = 0
	var y = 0
	var ratio = size/h
	var len = Math.min(chars.length, Math.floor(shape[0]/w) * Math.ceil(shape[1]/h))

	// hack tiny-sdf to render centered
	//FIXME: get rif of it by [possibly] PR to tiny-sdf
	var align = sdf.ctx.textAlign
	var buffer = sdf.buffer
	var middle = sdf.middle

	sdf.ctx.textAlign = 'center'
	sdf.buffer = sdf.size/2

	for (i = 0; i < len; i++) {
		if (!chars[i]) continue;

		var props = getProps(chars[i], family, ratio)
		var scale = 1, diff = [0, 0]

		//hack tinysdf char-draw method
		if (fit) {
			var fitRatio = fit
			if (Array.isArray(fit)) {
				fitRatio = fit[i]
			}
			var vert = (props.bounds[3]-props.bounds[1])*.5
			var horiz = (props.bounds[2]-props.bounds[0])*.5
			var maxSide = Math.max( vert , horiz )
			var diag = Math.sqrt(vert*vert + horiz*horiz)
			var maxDist = props.radius*.333 + maxSide*.333 + diag*.333

			scale = h*fitRatio / (maxDist*h*2)
			sdf.ctx.font = size*scale + 'px ' + family;
		}
		else {
			sdf.ctx.font = size + 'px ' + family;
		}

		if (vAlign) {
			if (vAlign === 'optical' || vAlign === true) {
				diff = [
					w*.5 - w*props.center[0],
					h*.5 - h*props.center[1]
				]
			}
			else {
				diff = [
					w*.5 - w*(props.bounds[2] + props.bounds[0])*.5,
					h*.5 - h*(props.bounds[3] + props.bounds[1])*.5
				]
			}
			sdf.middle = middle + diff[1]*scale
		}

		//calc sdf
		var data = sdf.draw(chars[i])

		// ctx.putImageData(data, x + diff[0]*scale, y + diff[1]*scale, 0, -diff[1]*scale, data.width, data.height)
		ctx.putImageData(data, x + diff[0]*scale, y)

		x += step[0]
		if (x > shape[0] - step[0]) {
			x = 0
			y += step[1]
		}
	}

	// unhack tiny-sdf
	sdf.ctx.textAlign = align
	sdf.buffer = buffer
	sdf.middle = middle

	return canvas
}

var cache = {}
function getProps(char, family, ratio) {
	if (cache[family] && cache[family][char]) return cache[family][char]

	var propsSize = 200
	var propsFs = propsSize * ratio
	var props = optical(char, {size: propsSize, fontSize: propsFs, fontFamily: family})

	if (!cache[family]) cache[family] = {}

	var relProps = {
		center: [
			props.center[0]/propsSize,
			props.center[1]/propsSize
		],
		bounds: props.bounds.map(function (v) {
			return v/propsSize
		}),
		radius: props.radius/propsSize
	}

	cache[family][char] = relProps

	return relProps
}
