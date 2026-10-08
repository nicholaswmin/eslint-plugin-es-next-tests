import { RuleTester } from 'eslint'
import rule from '../../src/rules/no-process-exit.js'

const tester = new RuleTester()

tester.run('no-process-exit', rule, {
  valid: [
    `import nodeProcess from 'node:process'
const process = { exit() {} }
function cleanup(action = () => process.exit()) {
  const process = nodeProcess
  action()
}
cleanup()`,
    `process.exitCode = 1`,
    `process.kill(process.pid)`,
    `const process = { exit() {} }; process.exit()`,
    `function finish(process) { process.exit(1) }`,
    `import process from './process.js'; process.exit()`,
    `import process from 'node:process'
function finish(process) { process.exit() }`,
    `import { exit } from './process.js'; exit()`,
    `import process from 'node:process'; process[method]()`,
    `let target = process; target = fixture; target.exit()`,
    `const first = second; const second = first; first.exit()`,
  ],
  invalid: [
    {
      code: `import process from 'node:process'
function cleanup(action = () => process.exit()) {
  const process = { exit() {} }
  action()
}
cleanup()`,
      errors: [{
        messageId: 'unexpectedExit',
        line: 2, column: 33, endLine: 2, endColumn: 45
      }]
    },
    {
      code: `process.exit(1)`,
      errors: [
        {
          messageId: 'unexpectedExit',
          line: 1, column: 1,
          endLine: 1, endColumn: 13
        },
      ]
    },
    {
      code: `import process from 'node:process'
process.exit()`,
      errors: [
        {
          messageId: 'unexpectedExit',
          line: 2, column: 1,
          endLine: 2, endColumn: 13
        },
      ]
    },
    {
      code: `import * as runtime from 'node:process'
runtime.exit(1)`,
      errors: [
        {
          messageId: 'unexpectedExit',
          line: 2, column: 1,
          endLine: 2, endColumn: 13
        },
      ]
    },
    {
      code: `import { exit as finish } from 'node:process'
finish(1)`,
      errors: [
        {
          messageId: 'unexpectedExit',
          line: 2, column: 1,
          endLine: 2, endColumn: 7
        },
      ]
    },
    {
      code: `import runtime from 'process'
runtime['exit'](1)`,
      errors: [
        {
          messageId: 'unexpectedExit',
          line: 2, column: 1,
          endLine: 2, endColumn: 16
        },
      ]
    },
    {
      code: `const runtime = process
runtime.exit()`,
      errors: [
        {
          messageId: 'unexpectedExit',
          line: 2, column: 1,
          endLine: 2, endColumn: 13
        },
      ]
    },
    {
      code: `const { exit: finish } = process
finish()`,
      errors: [
        {
          messageId: 'unexpectedExit',
          line: 2, column: 1,
          endLine: 2, endColumn: 7
        },
      ]
    },
    {
      code: `process.exit(1); process.exit(2)`,
      errors: [
        {
          messageId: 'unexpectedExit',
          line: 1, column: 1,
          endLine: 1, endColumn: 13
        },
        {
          messageId: 'unexpectedExit',
          line: 1, column: 18,
          endLine: 1, endColumn: 30
        },
      ]
    },
    {
      code: `process?.exit?.(1)`,
      errors: [
        {
          messageId: 'unexpectedExit',
          line: 1, column: 1,
          endLine: 1, endColumn: 14
        },
      ]
    },
  ]
})
