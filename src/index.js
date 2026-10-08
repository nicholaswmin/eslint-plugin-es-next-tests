import pkg from '../package.json' with { type: 'json' }
import noProcessExit from './rules/no-process-exit.js'
import noUnhandledRejection from './rules/no-unhandled-rejection-handler.js'
import preferContextAssert from './rules/prefer-context-assert.js'
import noContextPassing from './rules/no-context-passing.js'
import todoReason from './rules/todo-reason.js'

const plugin = {
  meta: { name: pkg.name, version: pkg.version, namespace: 'es-next-tests' },
  rules: {
    'no-process-exit': noProcessExit,
    'no-unhandled-rejection-handler': noUnhandledRejection,
    'prefer-context-assert': preferContextAssert,
    'no-context-passing': noContextPassing,
    'todo-reason': todoReason
  },
  configs: {}
}

plugin.configs.recommended = {
  plugins: { 'es-next-tests': plugin },
  rules: Object.fromEntries(Object.entries(plugin.rules)
    .filter(([, rule]) => rule.meta.docs.recommended)
    .map(([name]) => [`es-next-tests/${name}`, 'error']))
}

export default plugin
