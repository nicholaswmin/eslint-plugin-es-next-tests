# ESLint Node Test Plugin

Five ESLint rules for the Node test conventions in [es.next][guide].
Plain ESM JavaScript, Node 24+, and ESLint 10; no build step or runtime
dependencies beyond the ESLint peer.

## Configure test files

Import the plugin and select the test and setup files to check.
The recommended config enables all five rules as errors.

```js
import { defineConfig } from 'eslint/config'
import tests from 'eslint-plugin-es-next-tests'

export default defineConfig([
  {
    files: ['**/*.test.js', '**/test/utils/setup.js'],
    extends: [tests.configs.recommended]
  }
])
```

For individual rules, register the plugin and select their severity:

```js
import tests from 'eslint-plugin-es-next-tests'

export default [
  {
    files: ['**/*.test.js'],
    plugins: { 'es-next-tests': tests },
    rules: { 'es-next-tests/todo-reason': 'warn' }
  }
]
```

Use your project's actual setup path in `files`.
General JavaScript formatting and browser test conventions belong in
their own configurations.

## Rules

| Rule | Checks |
|:-----|:-------|
| [no-process-exit](docs/rules/no-process-exit.md) | Forced shutdown |
| [no-unhandled-rejection-handler](docs/rules/no-unhandled-rejection-handler.md) | Custom rejection handlers |
| [prefer-context-assert](docs/rules/prefer-context-assert.md) | Imported assertions inside tests and hooks |
| [no-context-passing](docs/rules/no-context-passing.md) | Context passed directly to calls |
| [todo-reason](docs/rules/todo-reason.md) | Active todo markings without reasons |

Rules have no options, automatic fixes, or editor suggestions.

## Matching limits

- Resolve ESM imports from Node built-ins, import aliases, static member
  names, immutable local aliases, and simple object destructuring.
- Recognize inline test, suite, and hook callbacks; distinguish TestContext
  from SuiteContext and respect lexical shadowing.
- Treat the unshadowed `process` identifier as Node's global process.
- Contexts inside wrappers and named callbacks are not recognized.
  Re-exports, dynamic member names, and mutable aliases remain unresolved.
- Do not infer object mutations, runtime option values, or helper behavior.
- Each rule documents its additional limits.

## Package layout

Source, tests, and rule docs follow the [official ESLint plugin][example].

```text
src/
├── index.js               # plugin object and recommended config
├── util.js                # shared binding and callback recognition
└── rules/<rule>.js        # rule metadata and visitors
tests/
├── plugin.test.js         # exports and consumer configuration
├── util.test.js           # shared recognition
├── rules/<rule>.test.js   # RuleTester valid and invalid cases
└── utils/setup.js         # connect RuleTester to node:test
docs/rules/<rule>.md       # behavior, examples, and matching limits
```

## Run tests

```sh
npm install
npm test
```

Tests use ESLint's `RuleTester` through Node's built-in runner.
The test command discovers all `.test.js` files and sets a per-test timeout.

[guide]: https://github.com/nicholaswmin/styleguide#testing
[example]: https://github.com/eslint/markdown
