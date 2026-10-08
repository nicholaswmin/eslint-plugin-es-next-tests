# todo-reason

Include a reason for active todo markings.

Implements [the es.next guideline][guide].

## Rule Details

Reports missing or blank reasons on recognized `t.todo(...)` calls, active
literal `todo` options, and todo registration shorthands. Reasons may explain
a failure mode, missing coverage, or a ticket; no naming pattern is required.

`{ todo: false }` disables option-based todo markings and remains allowed.
Unknown reason variables remain unreported. An empty string still marks
the test as todo and requires a reason.

Registration shorthands such as `test.todo` force `todo: true`, overriding
any supplied option reason. Use `test` with a reason-bearing `todo` option
or call `t.todo` with a reason inside the body. A recognized body call that
could supply a reason suppresses the registration diagnostic.

Incorrect:

```js
import { test } from 'node:test'

test('subject', t => t.todo())
```

Correct:

```js
import { test } from 'node:test'

test('subject', t => t.todo('Coverage missing'))
```

## Options

This rule has no options.

## Matching limits

Reads inline literal options and static string templates with property and
spread precedence. Unknown option values remain unresolved. It does not
prove that a body reason executes on every path, follow reasons supplied
through helpers or hooks, or infer whether a TODO comment represents a gap.

## When Not to Use It

Disable this rule where the project's test conventions differ.

[guide]: https://github.com/nicholaswmin/styleguide#mark-known-gaps-with-ttodo
