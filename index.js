export default function createMap(equals) {
	const _equals = equals
	const map = new Array(256)
	return {
		get: (key, equals = _equals) => lookup(equals, map, key, 0),
		set: (key, value, equals = _equals) => set(equals, map, key, 0, value),
		delete: (key, equals = _equals) => remove(equals, map, key, 0),
		getReference: (key, insert = false, equals = _equals) =>
			getReference(equals, map, key, 0, insert),
	}
}

function set(equals, map, key, keyOffset, value) {
	const k = key[keyOffset]
	const r = map[k]
	if (Array.isArray(r)) {
		return set(equals, r, key, keyOffset + 1, value)
	} else if (r === undefined) {
		map[k] = {key, value}
		return true
	} else if (equals(r.key, key)) {
		r.value = value
		return false
	} else {
		const n = (map[k] = new Array(256))
		setReference(equals, n, r.key, keyOffset + 1, r)
		set(equals, n, key, keyOffset + 1, value)
		return true
	}
}

function lookup(equals, map, key, keyOffset) {
	const r = map[key[keyOffset]]
	if (Array.isArray(r)) {
		return lookup(equals, r, key, keyOffset + 1)
	} else if (r !== undefined && equals(r.key, key)) {
		return r.value
	}
}

function remove(equals, map, key, keyOffset) {
	const k = key[keyOffset]
	const r = map[k]
	if (Array.isArray(r)) {
		return remove(equals, r, key, keyOffset + 1)
	} else if (r !== undefined && equals(r.key, key)) {
		map[k] = undefined
		return r.value
	}
}

function getReference(equals, map, key, keyOffset, insert) {
	const k = key[keyOffset]
	const r = map[k]
	if (Array.isArray(r)) {
		return getReference(equals, r, key, keyOffset + 1, insert)
	} else if (r === undefined) {
		if (insert) {
			return (map[k] = {key, value: undefined})
		}
	} else if (equals(r.key, key)) {
		return r
	} else {
		if (insert) {
			const n = (map[k] = new Array(256))
			setReference(equals, n, r.key, keyOffset + 1, r)
			return getReference(equals, n, key, keyOffset + 1, true)
		}
	}
}

function setReference(equals, map, key, keyOffset, reference) {
	const k = key[keyOffset]
	const r = map[k]
	if (Array.isArray(r)) {
		return setReference(equals, r, key, keyOffset + 1, reference)
	} else if (r === undefined) {
		map[k] = reference
		return true
	} else if (equals(r.key, key)) {
		map[k] = reference
		return false
	} else {
		const n = (map[k] = new Array(256))
		setReference(equals, n, r.key, keyOffset + 1, r)
		setReference(equals, n, key, keyOffset + 1, reference)
		return true
	}
}
