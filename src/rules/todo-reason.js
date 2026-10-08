import { property, registration, resolve } from '../util.js'

const missing = node => node?.type === 'Literal'
  ? typeof node.value !== 'string' || !node.value.trim()
  : node?.type === 'TemplateLiteral' && !node.expressions.length &&
    !node.quasis[0].value.cooked.trim()

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Include a reason for active todo markings',
      recommended: true,
      url: 'https://github.com/nicholaswmin/eslint-plugin-es-next-tests/' +
        'blob/main/docs/rules/todo-reason.md'
    },
    messages: { missingReason: 'Include a reason for this todo.' },
    schema: []
  },

  create(context) {
    const markings = []
    const reasoned = new WeakSet()

    return {
      CallExpression(node) {
        const source = context.sourceCode
        const api = resolve(source, node.callee)

        if (api?.root === 'context' && api.path.join('.') === 'todo') {
          const [reason] = node.arguments

          if (!reason || missing(reason))
            context.report({ node, messageId: 'missingReason' })
          else
            reasoned.add(api.callback)

          return
        }

        const entry = registration(source, node)

        if (!entry || entry.kind === 'hook')
          return

        const reason = property(entry.options, 'todo')

        if (entry.variant === 'todo' ||
          reason?.value !== false && missing(reason))
          markings.push({
            node: entry.variant === 'todo' ? node.callee : reason,
            callback: entry.callback
          })
      },

      'Program:exit'() {
        for (const marking of markings)
          if (!reasoned.has(marking.callback))
            context.report({ node: marking.node, messageId: 'missingReason' })
      }
    }
  }
}
