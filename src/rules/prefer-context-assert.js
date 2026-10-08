import assert from 'node:assert'
import { enclosing, resolve } from '../util.js'

const methods = new Set(Object.keys(assert).filter(key =>
  typeof assert[key] === 'function' &&
  key !== 'AssertionError' && key !== 'CallTracker'))

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Use context assertions in tests and their hooks',
      recommended: true,
      url: 'https://github.com/nicholaswmin/eslint-plugin-es-next-tests/' +
        'blob/main/docs/rules/prefer-context-assert.md'
    },
    messages: { useContext: 'Use the test context assertion API.' },
    schema: []
  },

  create(context) {
    return {
      CallExpression(node) {
        const source = context.sourceCode
        const api = resolve(source, node.callee)

        if (api?.root !== 'assert' || enclosing(source, node) !== 'context')
          return

        const path = api.path[0] === 'strict'
          ? api.path.slice(1) : api.path
        const assertion = path.length === 1 && methods.has(path[0]) ||
          !path.length && (api.callable || api.path[0] === 'strict')

        if (assertion)
          context.report({ node: node.callee, messageId: 'useContext' })
      }
    }
  }
}
