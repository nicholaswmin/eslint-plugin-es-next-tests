# no-process-exit

Let the test runner exit after cleanup.

Implements [the es.next guideline][guide].

## Rule Details

Reports calls to Node's `process.exit`, including imported and immutable
local aliases. It checks every file selected by the consumer configuration.
Assigning `process.exitCode` remains allowed.

Incorrect:

```js
process.exit(1)
```

Correct:

```js
process.exitCode = 1
```

## Options

This rule has no options.

## Matching limits

Does not follow calls through wrappers or dynamic member names.
An unrelated object or parameter named `process` is not reported.

## When Not to Use It

Disable this rule where the project's test conventions differ.

[guide]: https://github.com/nicholaswmin/styleguide#propagate-errors-and-set-timeouts
