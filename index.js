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
	let bufferSize = Math.floor(size/1.5)
	let sdf = new SDF(size, bufferSize, bufferSize, 0, family)

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
	ctx.textAlign = 'center'

	let x = step[0] / 2
	let y = step[1] / 2
	let len = Math.min(chars.length, Math.floor(shape[0]/step[0]) * Math.floor(shape[1]/step[1]))

	for (let i = 0; i < len; i++) {
		let metric = ctx.measureText(chars[i])
		let data = sdf.draw(chars[i])

		ctx.putImageData(data, x - data.width/4 - metric.width/2, y - data.height/2)

		if ((x += step[0]) > shape[0] - step[0]/2) (x = step[0]/2), (y += step[1])
	}


	return canvas
}
