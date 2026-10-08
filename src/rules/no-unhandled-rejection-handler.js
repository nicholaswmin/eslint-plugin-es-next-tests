import { resolve } from '../util.js'

const methods = new Set([
  'on', 'once', 'addListener', 'prependListener', 'prependOnceListener'
])

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Let Node handle unhandled rejections',
      recommended: true,
      url: 'https://github.com/nicholaswmin/eslint-plugin-es-next-tests/' +
        'blob/main/docs/rules/no-unhandled-rejection-handler.md'
    },
    messages: {
      unexpectedHandler: 'Let Node handle unhandled rejections.'
    },
    schema: []
  },

  create(context) {
    return {
      CallExpression(node) {
        const api = resolve(context.sourceCode, node.callee)
        const [event] = node.arguments

        if (api?.root === 'process' && api.path.length === 1 &&
          methods.has(api.path[0]) && event?.type === 'Literal' &&
          event.value === 'unhandledRejection')
          context.report({ node: event, messageId: 'unexpectedHandler' })
      }
    }
  }
}
