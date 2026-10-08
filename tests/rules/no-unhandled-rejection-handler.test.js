import { RuleTester } from 'eslint'
import rule from '../../src/rules/no-unhandled-rejection-handler.js'

const tester = new RuleTester()

tester.run('no-unhandled-rejection-handler', rule, {
  valid: [
    `process.on('exit', cleanup)`,
    `process.on(event, handler)`,
    `process.removeListener('unhandledRejection', handler)`,
    `process.emit('unhandledRejection', error)`,
    `const process = fixture; process.on('unhandledRejection', handler)`,
    `function install(process) { process.on('unhandledRejection', handler) }`,
    `import process from './process.js'
process.on('unhandledRejection', handler)`,
    `emitter.on('unhandledRejection', handler)`,
    `process[method]('unhandledRejection', handler)`,
  ],
  invalid: [
    {
      code: `process.on('unhandledRejection', handler)`,
      errors: [
        {
          messageId: 'unexpectedHandler',
          line: 1, column: 12,
          endLine: 1, endColumn: 32
        },
      ]
    },
    {
      code: `process.once('unhandledRejection', handler)`,
      errors: [
        {
          messageId: 'unexpectedHandler',
          line: 1, column: 14,
          endLine: 1, endColumn: 34
        },
      ]
    },
    {
      code: `process.addListener('unhandledRejection', handler)`,
      errors: [
        {
          messageId: 'unexpectedHandler',
          line: 1, column: 21,
          endLine: 1, endColumn: 41
        },
      ]
    },
    {
      code: `process.prependListener('unhandledRejection', handler)`,
      errors: [
        {
          messageId: 'unexpectedHandler',
          line: 1, column: 25,
          endLine: 1, endColumn: 45
        },
      ]
    },
    {
      code: `process.prependOnceListener('unhandledRejection', handler)`,
      errors: [
        {
          messageId: 'unexpectedHandler',
          line: 1, column: 29,
          endLine: 1, endColumn: 49
        },
      ]
    },
    {
      code: `import * as runtime from 'node:process'
runtime.on('unhandledRejection', handler)`,
      errors: [
        {
          messageId: 'unexpectedHandler',
          line: 2, column: 12,
          endLine: 2, endColumn: 32
        },
      ]
    },
    {
      code: `import { on as listen } from 'node:process'
listen('unhandledRejection', handler)`,
      errors: [
        {
          messageId: 'unexpectedHandler',
          line: 2, column: 8,
          endLine: 2, endColumn: 28
        },
      ]
    },
    {
      code: `const runtime = process
runtime['on']('unhandledRejection', handler)`,
      errors: [
        {
          messageId: 'unexpectedHandler',
          line: 2, column: 15,
          endLine: 2, endColumn: 35
        },
      ]
    },
    {
      code: `process.on('unhandledRejection', first)
  .once('unhandledRejection', second)`,
      errors: [
        {
          messageId: 'unexpectedHandler',
          line: 1, column: 12,
          endLine: 1, endColumn: 32
        },
      ]
    },
  ]
})
