const atlasSDF = require('./')
const atlas = require('font-atlas')
const createPanel = require('settings-panel')
const assign = require('object-assign')

let c1 = document.body.appendChild(document.createElement('canvas'))
let c2 = document.body.appendChild(document.createElement('canvas'))

let opts = {
	family: 'Helvetica',
	size: 21
}

function update (o) {
	console.time('sdf')
	assign(opts, o)

	let w = [Math.min(400, opts.size*16)]

	atlasSDF({
		canvas: c1,
	  family: opts.family
	  , size: opts.size
	  , shape: [w,w]
	  , step: [opts.size*2, opts.size*2]
	})
	console.timeEnd('sdf')


	console.time('bm')
	atlas({
		canvas: c2,
	  family: opts.family
	  , size: opts.size
	  , shape: [w,w]
	  , step: [opts.size*2, opts.size*2]
	})
	console.timeEnd('bm')
}

createPanel([
{id: 'size', type: 'range', min: 1, max: 128, value: 21, step: 1, change: v => {
	update({size: v})
}},
{id: 'family', type: 'text', value: 'sans-serif', change: v => {
	update({family: v})
}
}
// {id: 'step', type: 'range', min: 1, max: 128, value: 21, step: 1, change: v => {
// 	update({size: v})
// }}
])
