# prefer-context-assert

Use context assertions in tests and their hooks.

Implements [the es.next guideline][guide].

## Rule Details

Reports known assertion calls imported from `node:assert` or
`node:assert/strict` inside recognized test and TestContext hook callbacks.
Module assertions and SuiteContext callbacks remain allowed.

Incorrect:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'

test('subject', () => assert.strictEqual(1, 1))
```

Correct:

```js
import { test } from 'node:test'

test('subject', t => t.assert.strictEqual(1, 1))
```

## Options

This rule has no options.

## Matching limits

Matches callable default assertions, named assertion imports, namespace
members, and `assert.strict` operations. Constructors and unknown exports
are not assertion operations. Named callbacks and nested helper functions
are not inspected as test bodies.

Replacing `assert(value)` requires `t.assert.ok(value)`. Assertions from
`node:assert/strict` require their strict context equivalents; for example,
`equal` becomes `strictEqual`. The rule does not rewrite either form.

## When Not to Use It

Disable this rule where the project's test conventions differ.

[guide]: https://github.com/nicholaswmin/styleguide#use-context-for-test-utilities
