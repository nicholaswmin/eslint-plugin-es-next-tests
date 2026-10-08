import { resolve } from '../util.js'

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Let the test runner exit after cleanup',
      recommended: true,
      url: 'https://github.com/nicholaswmin/eslint-plugin-es-next-tests/' +
        'blob/main/docs/rules/no-process-exit.md'
    },
    messages: { unexpectedExit: 'Let the test runner exit after cleanup.' },
    schema: []
  },

  create(context) {
    return {
      CallExpression(node) {
        const api = resolve(context.sourceCode, node.callee)

        if (api?.root === 'process' && api.path.join('.') === 'exit')
          context.report({ node: node.callee, messageId: 'unexpectedExit' })
      }
    }
  }
}
