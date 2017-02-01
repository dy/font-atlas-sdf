const atlasSDF = require('./')
const atlas = require('font-atlas')
const createPanel = require('settings-panel')
const assign = require('object-assign')

let c1 = document.body.appendChild(document.createElement('canvas'))
let c2 = document.body.appendChild(document.createElement('canvas'))

let opts = {
	family: 'Helvetica',
	size: 21,
	chars: 'xyz'
}

function update (o) {
	console.time('sdf')
	assign(opts, o)

	let w = [Math.min(400, opts.size*16)]
	let size = opts.size

	atlasSDF({
		canvas: c1,
	  family: opts.family
	  , size: opts.size
	  , shape: [w,w]
	  , step: [size*2, size*2],
	  chars: opts.chars
	})
	console.timeEnd('sdf')


	console.time('bm')
	atlas({
		canvas: c2,
	  family: opts.family
	  , size: opts.size
	  , shape: [w,w]
	  , step: [size*2, size*2],
	  chars: opts.chars
	})
	console.timeEnd('bm')
}

createPanel([
{id: 'size', type: 'range', min: 1, max: 128, value: opts.size, step: 1, change: v => {
	update({size: v})
}},
{id: 'family', type: 'text', value: opts.family, change: v => {
	update({family: v})
}},
{id: 'chars', type: 'text', value: opts.chars, change: v => {
	update({chars: v})
}}
// {id: 'step', type: 'range', min: 1, max: 128, value: 21, step: 1, change: v => {
// 	update({size: v})
// }}
])
