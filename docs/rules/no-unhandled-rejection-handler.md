# no-unhandled-rejection-handler

Let Node handle unhandled rejections.

Implements [the es.next guideline][guide].

## Rule Details

Reports `unhandledRejection` listeners registered on Node's process through
`on`, `once`, `addListener`, `prependListener`, or `prependOnceListener`.
Listener removal, other events, and unrelated emitters remain allowed.

Incorrect:

```js
process.on('unhandledRejection', handler)
```

Correct:

```js
process.on('exit', cleanup)
```

## Options

This rule has no options.

## Matching limits

Matches literal event names. Does not resolve event-name variables,
listener registrations chained from a call result, or custom wrappers.

## When Not to Use It

Disable this rule where the project's test conventions differ.

[guide]: https://github.com/nicholaswmin/styleguide#propagate-errors-and-set-timeouts
