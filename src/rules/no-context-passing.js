import { resolve } from '../util.js'

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Keep test context inside tests and their hooks',
      recommended: true,
      url: 'https://github.com/nicholaswmin/eslint-plugin-es-next-tests/' +
        'blob/main/docs/rules/no-context-passing.md'
    },
    messages: {
      contextPassed: 'Keep test context inside the test and its hooks.'
    },
    schema: []
  },

  create(context) {
    return {
      CallExpression(node) {
        for (const argument of node.arguments) {
          const api = resolve(context.sourceCode, argument)

          if (api?.root === 'context' && !api.path.length)
            context.report({ node: argument, messageId: 'contextPassed' })
        }
      }
    }
  }
}
