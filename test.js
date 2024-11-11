import {equals} from 'https://esm.sh/jsr/@std/bytes@1.0.3/equals.js'
import test from 'https://esm.sh/tape@5.9.0'
import create from './index.js'

test('Single key', (t) => {
	const key = new Uint8Array([4, 2])
	const value = Symbol('value')
	const map = create(equals)
	const r = map.set(key, value)

	t.equal(r, true)
	t.equal(map.get(key), value)
	t.end()
})

test('Equal prefix keys', (t) => {
	const keyA = new Uint8Array([4, 2])
	const keyB = new Uint8Array([4, 3])
	const valueA = Symbol('value A')
	const valueB = Symbol('value B')
	const map = create(equals)
	map.set(keyA, valueA)
	map.set(keyB, valueB)

	t.equal(map.get(keyA), valueA)
	t.equal(map.get(keyB), valueB)
	t.end()
})

test('Uneven prefix keys', (t) => {
	const keyA = new Uint8Array([4, 2, 1])
	const keyB = new Uint8Array([4, 3, 1])
	const keyC = new Uint8Array([4, 3, 2])
	const valueA = Symbol('value A')
	const valueB = Symbol('value B')
	const valueC = Symbol('value C')
	const map = create(equals)
	map.set(keyA, valueA)
	map.set(keyB, valueB)
	map.set(keyC, valueC)

	t.equal(map.get(keyA), valueA)
	t.equal(map.get(keyB), valueB)
	t.equal(map.get(keyC), valueC)
	t.end()
})

test('Overwrite key', (t) => {
	const key = new Uint8Array([4, 2])
	const valueA = Symbol('value A')
	const valueB = Symbol('value B')
	const map = create(equals)
	map.set(key, valueA)
	const r = map.set(key, valueB)

	t.equal(r, false)
	t.equal(map.get(key), valueB)
	t.end()
})

test('Delete key', (t) => {
	const keyA = new Uint8Array([4, 2, 2])
	const keyB = new Uint8Array([4, 2, 3])
	const valueA = Symbol('value A')
	const valueB = Symbol('value B')
	const map = create(equals)
	map.set(keyA, valueA)
	map.set(keyB, valueB)
	const r = map.delete(keyA)
	const r2 = map.delete(keyA)

	t.equal(r, valueA)
	t.equal(r2, undefined)
	t.equal(map.get(keyA), undefined)
	t.equal(map.get(keyB), valueB)
	t.end()
})