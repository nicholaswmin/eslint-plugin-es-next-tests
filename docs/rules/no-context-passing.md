# no-context-passing

Keep test context inside tests and their hooks.

Implements [the es.next guideline][guide].

## Rule Details

Reports a recognized TestContext passed directly as a call argument.
Helpers should return values for the test to use. Context utilities,
fixture properties, and unrelated same-named values remain allowed.

Incorrect:

```js
import { test } from 'node:test'

test('subject', t => prepare(t))
```

Correct:

```js
import { test } from 'node:test'

test('subject', t => { t.fixture = prepare() })
```

## Options

This rule has no options.

## Matching limits

Checks direct context arguments and immutable aliases. It does not follow
context values wrapped in arrays, objects, or function arguments, or track
exports, constructor arguments, or spread arguments. SuiteContext arguments
are outside this rule.

## When Not to Use It

Disable this rule where the project's test conventions differ.

[guide]: https://github.com/nicholaswmin/styleguide#keep-test-context-inside-the-test-body
