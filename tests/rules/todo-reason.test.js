import { RuleTester } from 'eslint'
import rule from '../../src/rules/todo-reason.js'

const tester = new RuleTester()

tester.run('todo-reason', rule, {
  valid: [
    `import { test } from 'node:test'
test.todo('subject', t => t.todo('Coverage missing'))`,
    `import { test } from 'node:test'
test('subject', { todo: true }, t => t.todo('Coverage missing'))`,
    `import { test } from 'node:test'
test.todo('subject', t => t.todo(reason))`,
    `import test from 'test'
test('subject', t => t.todo())`,
    `import { test } from 'node:test'
test('subject', t => t.todo('APP-123: coverage missing'))`,
    `import { test } from 'node:test'
test('subject', { todo: 'coverage missing' }, () => {})`,
    `import { test } from 'node:test'
test('subject', { todo: false }, () => {})`,
    `import { test } from 'node:test'
test('subject', { todo: reason }, () => {})`,
    `import { test } from 'node:test'
test('subject', t => t.todo(reason))`,
    `import { test } from 'node:test'
test('subject', { todo: true, ...options }, () => {})`,
    `const t = fixture; t.todo()`,
    `import { test } from './runner.js'; test('subject', t => t.todo())`,
    `import { test } from 'node:test'
test('subject', t => { { const t = fixture; t.todo() } })`,
    `import { describe } from 'node:test'; describe('subject', s => s.todo())`,
  ],
  invalid: [
    {
      code: `import test from 'node:test'
test('subject', () => test.before(t => t.todo()))`,
      errors: [{
        messageId: 'missingReason',
        line: 2, column: 40, endLine: 2, endColumn: 48
      }]
    },
    {
      code: `import { test } from 'node:test'
test('subject', { todo: \`\` }, () => {})`,
      errors: [{
        messageId: 'missingReason',
        line: 2, column: 25, endLine: 2, endColumn: 27
      }]
    },
    {
      code: `import { test } from 'node:test'
test('subject', { todo: null }, () => {})`,
      errors: [{
        messageId: 'missingReason',
        line: 2, column: 25, endLine: 2, endColumn: 29
      }]
    },
    {
      code: `import { test } from 'node:test'
test('subject', { todo: 0 }, () => {})`,
      errors: [{
        messageId: 'missingReason',
        line: 2, column: 25, endLine: 2, endColumn: 26
      }]
    },
    {
      code: `import { test } from 'node:test'
test(\`subject\`, t => t.todo())`,
      errors: [{
        messageId: 'missingReason',
        line: 2, column: 22, endLine: 2, endColumn: 30
      }]
    },
    {
      code: `import { test } from 'node:test'
test('subject', t => t.todo(\`\`))`,
      errors: [{
        messageId: 'missingReason',
        line: 2, column: 22, endLine: 2, endColumn: 32
      }]
    },
    {
      code: `import { test } from 'node:test'
test.todo('subject', { todo: '' }, () => {})`,
      errors: [{
        messageId: 'missingReason',
        line: 2, column: 1, endLine: 2, endColumn: 10
      }]
    },
    {
      code: `import { test } from 'node:test'
test('subject', { todo: '' }, () => {})`,
      errors: [{
        messageId: 'missingReason',
        line: 2, column: 25, endLine: 2, endColumn: 27
      }]
    },
    {
      code: `import { test } from 'node:test'
test.todo('subject', options, () => {})`,
      errors: [{
        messageId: 'missingReason',
        line: 2, column: 1, endLine: 2, endColumn: 10
      }]
    },
    {
      code: `import { test } from 'node:test'
test.todo('subject', { todo: reason }, () => {})`,
      errors: [{
        messageId: 'missingReason',
        line: 2, column: 1, endLine: 2, endColumn: 10
      }]
    },
    {
      code: `import { test } from 'node:test'
test.todo('subject', { todo: false }, () => {})`,
      errors: [{
        messageId: 'missingReason',
        line: 2, column: 1, endLine: 2, endColumn: 10
      }]
    },
    {
      code: `import { test } from 'node:test'
test.todo('subject', { todo: 'Coverage missing' }, () => {})`,
      errors: [{
        messageId: 'missingReason',
        line: 2, column: 1, endLine: 2, endColumn: 10
      }]
    },
    {
      code: `import { test } from 'node:test'
test('subject', t => t.todo(false))`,
      errors: [{
        messageId: 'missingReason',
        line: 2, column: 22, endLine: 2, endColumn: 35
      }]
    },
    {
      code: `import { test } from 'node:test'
test('subject', t => t.todo(0))`,
      errors: [{
        messageId: 'missingReason',
        line: 2, column: 22, endLine: 2, endColumn: 31
      }]
    },

    {
      code: `import test from 'node:test'
test.test('subject', t => t.todo())`,
      errors: [{
        messageId: 'missingReason',
        line: 2, column: 27, endLine: 2, endColumn: 35
      }]
    },
    {
      code: `import { test } from 'node:test'
test('subject', t => t.todo())`,
      errors: [
        {
          messageId: 'missingReason',
          line: 2, column: 22,
          endLine: 2, endColumn: 30
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
test('subject', t => t.todo(''))`,
      errors: [
        {
          messageId: 'missingReason',
          line: 2, column: 22,
          endLine: 2, endColumn: 32
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
test('subject', t => t.todo('   '))`,
      errors: [
        {
          messageId: 'missingReason',
          line: 2, column: 22,
          endLine: 2, endColumn: 35
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
test('subject', { todo: true }, () => {})`,
      errors: [
        {
          messageId: 'missingReason',
          line: 2, column: 25,
          endLine: 2, endColumn: 29
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
test('subject', { todo: '   ' }, () => {})`,
      errors: [
        {
          messageId: 'missingReason',
          line: 2, column: 25,
          endLine: 2, endColumn: 30
        },
      ]
    },
    {
      code: `import test from 'node:test'
test('subject', ctx => ctx.todo())`,
      errors: [
        {
          messageId: 'missingReason',
          line: 2, column: 24,
          endLine: 2, endColumn: 34
        },
      ]
    },
    {
      code: `import { test as check } from 'node:test'
check('subject', ctx => ctx.todo())`,
      errors: [
        {
          messageId: 'missingReason',
          line: 2, column: 25,
          endLine: 2, endColumn: 35
        },
      ]
    },
    {
      code: `import * as runner from 'node:test'
runner.test('subject', ctx => ctx.todo())`,
      errors: [
        {
          messageId: 'missingReason',
          line: 2, column: 31,
          endLine: 2, endColumn: 41
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
test('subject', ctx => { const t = ctx; t.todo() })`,
      errors: [
        {
          messageId: 'missingReason',
          line: 2, column: 41,
          endLine: 2, endColumn: 49
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
test('subject', t => t.test('nested', ctx => ctx.todo()))`,
      errors: [
        {
          messageId: 'missingReason',
          line: 2, column: 46,
          endLine: 2, endColumn: 56
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
test.todo('subject', () => {})`,
      errors: [
        {
          messageId: 'missingReason',
          line: 2, column: 1,
          endLine: 2, endColumn: 10
        },
      ]
    },
    {
      code: `import { describe } from 'node:test'
describe('subject', { todo: true }, () => {})`,
      errors: [
        {
          messageId: 'missingReason',
          line: 2, column: 29,
          endLine: 2, endColumn: 33
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
test('subject', t => { t.todo(); t.todo('') })`,
      errors: [
        {
          messageId: 'missingReason',
          line: 2, column: 24,
          endLine: 2, endColumn: 32
        },
        {
          messageId: 'missingReason',
          line: 2, column: 34,
          endLine: 2, endColumn: 44
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
test('subject', { ...options, todo: true }, () => {})`,
      errors: [
        {
          messageId: 'missingReason',
          line: 2, column: 37,
          endLine: 2, endColumn: 41
        },
      ]
    },
  ]
})
