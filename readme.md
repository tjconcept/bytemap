# Byte-keys map

A map supporting `Uint8Array` (or Node.js' `Buffer`) for keys.

The native EcmaScript `Map` does not support binary keys (bytes) without these
being encoded as another primitive, such as a string, number, or similar. This
is an attempt to avoid that encoding overhead.

```js
const map = createMap(equals) // → {get, set, delete}
map.get(key, value) // → value
map.set(key, value) // → true/false ("added a new key")
map.delete(key, value) // → undefined/existing value
map.getReference(key, (insertIfUnknown = false)) // → {key, value}
```

`map.getReference` is a low-level feature for doing in-place updates, updates
relying on the existing value, or otherwise replace the value at a given key
without doing new lookups. The `key` must not be altered.

## Examples

```js
import {equals} from 'https://esm.sh/jsr/@std/bytes@1.0.3/equals.js'
import createMap from 'https://esm.sh/gh/tjconcept/bytemap@1.0.0'

const keyA = new Uint8Array([42, 128, 35, 77])
const keyB = new Uint8Array([21, 64, 35, 21])

const map = createMap(equals)
map.set(keyA, 'A') // → true
map.set(keyB, 'B') // → true

// Overwrite
map.set(keyA, 'C') // → false
map.get(keyA) // 'C'

map.delete(keyB) // → 'B'
map.delete(keyB) // → undefined

// Deleted key
map.get(keyB) // → undefined

const r = map.getReference(keyA) // → {key, value}
r.value = 123
map.get(keyA) === value // → 123
```

In Node.js, if all key input is of `Buffer` type, use the built-in equals
function:

```js
const equals = (a, b) => a.equals(b)
```

## Keys

Supported key values are `Uint8Array` and Node.js' `Buffer`. They may be used
interchangeably in the same map.

The map is optimized for keys being uniformly distributed (e.g. cryptographic
hashes or other suitable hash table keys). If your keys are not so, consider
hashing them.

Keys do not have to be of any particular length, or even the same length, but it
is assumed (and necessary) that **no key is a prefix of another key**.

## Size

The return values should allow you to keep track of the map's size:

```js
if (map.set(key, value)) {
  size++
}
if (map.delete(key) !== undefined) {
  size--
}
```

## Test

```sh
deno --allow-read --allow-env test.js
```
