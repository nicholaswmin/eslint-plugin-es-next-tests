import { RuleTester } from 'eslint'
import rule from '../../src/rules/no-context-passing.js'

const tester = new RuleTester()

tester.run('no-context-passing', rule, {
  valid: [
    `import test from 'test'
test('subject', t => prepare(t))`,
    `import { test } from 'node:test'
test('subject', t => { t.value = prepare(); check(t.value) })`,
    `import { test } from 'node:test'
test('subject', t => t.beforeEach(t => { t.value = prepare() }))`,
    `const t = fixture; prepare(t)`,
    `import { test } from './runner.js'; test('subject', t => prepare(t))`,
    `import { test } from 'node:test'
test('subject', t => { function prepare(t) { check(t) } })`,
    `import { test } from 'node:test'
test('subject', t => { t = fixture; prepare(t) })`,
    `import { describe } from 'node:test'
describe('subject', s => prepare(s))`,
    `import { test } from 'node:test'
test('subject', t => prepare({ context: t }))`,
    `function callback(t) { prepare(t) }`,
  ],
  invalid: [
    {
      code: `import test from 'node:test'
test('subject', () => test.before(t => prepare(t)))`,
      errors: [{
        messageId: 'contextPassed',
        line: 2, column: 48, endLine: 2, endColumn: 49
      }]
    },
    {
      code: `import { test } from 'node:test'
test('subject', t => prepare(t))`,
      errors: [
        {
          messageId: 'contextPassed',
          line: 2, column: 30,
          endLine: 2, endColumn: 31
        },
      ]
    },
    {
      code: `import test from 'node:test'
test('subject', context => prepare(context))`,
      errors: [
        {
          messageId: 'contextPassed',
          line: 2, column: 36,
          endLine: 2, endColumn: 43
        },
      ]
    },
    {
      code: `import { test as check } from 'node:test'
check('subject', ctx => prepare(ctx))`,
      errors: [
        {
          messageId: 'contextPassed',
          line: 2, column: 33,
          endLine: 2, endColumn: 36
        },
      ]
    },
    {
      code: `import * as runner from 'node:test'
runner.test('subject', ctx => prepare(ctx))`,
      errors: [
        {
          messageId: 'contextPassed',
          line: 2, column: 39,
          endLine: 2, endColumn: 42
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
test('subject', t => { const ctx = t; prepare(ctx) })`,
      errors: [
        {
          messageId: 'contextPassed',
          line: 2, column: 47,
          endLine: 2, endColumn: 50
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
test('subject', t => t.beforeEach(ctx => prepare(ctx)))`,
      errors: [
        {
          messageId: 'contextPassed',
          line: 2, column: 50,
          endLine: 2, endColumn: 53
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
test('subject', t => t.test('nested', child => prepare(child)))`,
      errors: [
        {
          messageId: 'contextPassed',
          line: 2, column: 56,
          endLine: 2, endColumn: 61
        },
      ]
    },
    {
      code: `import { beforeEach } from 'node:test'
beforeEach(ctx => prepare(ctx), { timeout: 50 })`,
      errors: [
        {
          messageId: 'contextPassed',
          line: 2, column: 27,
          endLine: 2, endColumn: 30
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
test('subject', ctx => { first(ctx); second(ctx) })`,
      errors: [
        {
          messageId: 'contextPassed',
          line: 2, column: 32,
          endLine: 2, endColumn: 35
        },
        {
          messageId: 'contextPassed',
          line: 2, column: 45,
          endLine: 2, endColumn: 48
        },
      ]
    },
  ]
})
