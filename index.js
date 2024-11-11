export default function createMap(equals) {
	const map = new Array(256)
	return {
		get: (key) => lookup(equals, map, key, 0),
		set: (key, value) => set(equals, map, key, 0, value),
		delete: (key) => remove(equals, map, key, 0),
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
	} else {
		if (equals(key, r.key)) {
			map[k] = {key, value}
			return false
		} else {
			const n = (map[k] = new Array(256))
			set(equals, n, r.key, keyOffset + 1, r.value)
			set(equals, n, key, keyOffset + 1, value)
			return true
		}
	}
}

function lookup(equals, map, key, keyOffset) {
	const r = map[key[keyOffset]]
	if (Array.isArray(r)) {
		return lookup(equals, r, key, keyOffset + 1)
	} else if (r !== undefined && equals(key, r.key)) {
		return r.value
	} else {
		return undefined
	}
}

function remove(equals, map, key, keyOffset) {
	const k = key[keyOffset]
	const r = map[k]
	if (Array.isArray(r)) {
		return remove(equals, r, key, keyOffset + 1)
	} else if (r !== undefined) {
		if (equals(key, r.key)) {
			map[k] = undefined
			return r.value
		}
	}
}
