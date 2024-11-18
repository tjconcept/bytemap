import Benchmark from 'npm:benchmark'
import crypto from 'node:crypto'
import create from './index.js'

const events = [
	'log',
	'is-authorized',
	'3dsecureio-preauth@3',
	'3dsecureio-postauth@3',
	'identity',
]

;[1, 5, 10, 100, 1000].forEach((entries) => {
	const hashedEvents = hashEvents(entries, events)
	let count1 = 0
	let count2 = 0
	const map = new Map(
		hashedEvents.map(([hash, event, base64]) => [base64, event])
	)
	const byteMap = create((a, b) => a.equals(b))
	hashedEvents.forEach(([hash, event]) => byteMap.set(hash, event))

	const suite = new Benchmark.Suite()

	suite
		.add(`Map(${entries})`, function () {
			const [key, expectedValue] = hashedEvents[count1 % entries]
			const value = map.get(key.toString('base64'))
			// if (value !== expectedValue)
			// 	throw new Error(`should return ${expectedValue}`)
			count1++
		})
		.add(`ByteMap(${entries})`, function () {
			const [key, expectedValue] = hashedEvents[count2 % entries]
			const value = byteMap.get(key)
			// if (value !== expectedValue)
			// 	throw new Error(`should return ${expectedValue}`)
			count2++
		})
		.on('cycle', function (event) {
			console.log(String(event.target))
		})
		// .on('complete', function () {
		// 	// console.log('Fastest is ' + this.filter('fastest').map('name'))
		// 	console.log(count1, count2)
		// })
		.run({async: false})
})

function hashEvents(count, events) {
	while (events.length < count) {
		events.push(crypto.randomBytes(16).toString('base64'))
	}
	return events.slice(0, count).map((event) => {
		const hash = crypto.createHash('MD5').update(event).digest()
		return [hash, event, hash.toString('base64')]
	})
}
