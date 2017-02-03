'use strict'

const SDF = require('tiny-sdf')

module.exports = atlas

function atlas(options) {
	options = options || {}

	let canvas = options.canvas || document.createElement('canvas')
	let family = options.family || 'monospace'
	let shape = options.shape || [512, 512]
	let step = options.step || [32, 32]
	let size = options.size || 16
	let chars = options.chars || [32, 126]
	let bufferSize = Math.floor((step[0] - size)/2)
	let radius = options.radius || bufferSize*1.5
	let sdf = new SDF(size, bufferSize, radius, 0, family)

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
		let newchars = []

		for (let i = chars[0], j = 0; i <= chars[1]; i++) {
			newchars[j++] = String.fromCharCode(i)
		}

		chars = newchars
	}

	shape = shape.slice()
	canvas.width  = shape[0]
	canvas.height = shape[1]

	let ctx = canvas.getContext('2d')

	ctx.fillStyle = '#000'
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	ctx.font = size + ' ' + family
	ctx.textBaseline = 'middle'

	let x = 0
	let y = 0
	let len = Math.min(chars.length, Math.floor(shape[0]/step[0]) * Math.ceil(shape[1]/step[1]))

	// hack tiny-sdf to render centered
	//FIXME: get rif of it by [possibly] PR to tiny-sdf
	let align = sdf.ctx.textAlign
	let buffer = sdf.buffer

	sdf.ctx.textAlign = 'center'
	sdf.buffer = sdf.size/2

	for (let i = 0; i < len; i++) {
		let data = sdf.draw(chars[i])

		ctx.putImageData(data, x, y)

		x += step[0]
		if (x >= shape[0] - step[0]) {
			x = 0
			y += step[1]
		}
	}

	// unhack tiny-sdf
	sdf.ctx.textAlign = align
	sdf.buffer = buffer

	return canvas
}
