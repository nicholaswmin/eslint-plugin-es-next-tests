import { RuleTester } from 'eslint'
import rule from '../../src/rules/prefer-context-assert.js'

const tester = new RuleTester()

tester.run('prefer-context-assert', rule, {
  valid: [
    `import test from 'test'
import assert from 'node:assert'
test('subject', t => assert.ok(true))`,
    `import { test } from 'node:test'
test('subject', t => t.assert.ok(true))`,
    `import assert from 'node:assert/strict'
assert.ok(true)`,
    `import { test } from 'node:test'
test('subject', t => { const assert = fixture; assert.ok(true) })`,
    `import { test } from './runner.js'
import assert from 'node:assert/strict'
test('subject', t => assert.ok(true))`,
    `import { test } from 'node:test'
import assert from './assert.js'
test('subject', t => assert.ok(true))`,
    `import { describe, before } from 'node:test'
import assert from 'node:assert/strict'
describe('subject', () => before(() => assert.ok(true)))`,
    `import { describe } from 'node:test'
import assert from 'node:assert/strict'
describe('subject', () => assert.ok(true))`,
    `import { test } from 'node:test'
import assert from 'node:assert/strict'
test('subject', () => { function helper() { assert.ok(true) } })`,
    `import { test } from 'node:test'
import assert from 'node:assert/strict'
test('subject', () => new assert.AssertionError({ message: 'x' }))`,
    `import { test } from 'node:test'
import assert from 'node:assert/strict'
test('subject', () => assert[method](true))`,
    `import { test } from 'node:test'
import assert from 'node:assert/strict'
test('subject', () => assert.custom(true))`,
  ],
  invalid: [
    {
      code: `import test from 'node:test'
import assert from 'node:assert'
test('subject', () => test.before(() => assert.ok(true)))`,
      errors: [{
        messageId: 'useContext',
        line: 3, column: 41, endLine: 3, endColumn: 50
      }]
    },
    {
      code: `import { test } from 'node:test'
import assert from 'node:assert/strict'
test('subject', t => assert.ok(true))`,
      errors: [
        {
          messageId: 'useContext',
          line: 3, column: 22,
          endLine: 3, endColumn: 31
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
import assert from 'node:assert/strict'
test('subject', () => assert(true))`,
      errors: [
        {
          messageId: 'useContext',
          line: 3, column: 23,
          endLine: 3, endColumn: 29
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
import { strictEqual as equal } from 'node:assert'
test('subject', () => equal(1, 1))`,
      errors: [
        {
          messageId: 'useContext',
          line: 3, column: 23,
          endLine: 3, endColumn: 28
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
import * as check from 'node:assert'
test('subject', () => check.strictEqual(1, 1))`,
      errors: [
        {
          messageId: 'useContext',
          line: 3, column: 23,
          endLine: 3, endColumn: 40
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
import assert from 'node:assert/strict'
test('subject', () => { const equal = assert.strictEqual; equal(1, 1) })`,
      errors: [
        {
          messageId: 'useContext',
          line: 3, column: 59,
          endLine: 3, endColumn: 64
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
import assert from 'node:assert/strict'
test('subject', () => { const { ok } = assert; ok(true) })`,
      errors: [
        {
          messageId: 'useContext',
          line: 3, column: 48,
          endLine: 3, endColumn: 50
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
import assert from 'node:assert'
test('subject', () => assert.strict.equal(1, 1))`,
      errors: [
        {
          messageId: 'useContext',
          line: 3, column: 23,
          endLine: 3, endColumn: 42
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
import assert from 'node:assert/strict'
test('subject', t => t.beforeEach(() => assert.ok(true), { timeout: 50 }))`,
      errors: [
        {
          messageId: 'useContext',
          line: 3, column: 41,
          endLine: 3, endColumn: 50
        },
      ]
    },
    {
      code: `import { describe, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
describe('subject', () => beforeEach(() => assert.ok(true)))`,
      errors: [
        {
          messageId: 'useContext',
          line: 3, column: 44,
          endLine: 3, endColumn: 53
        },
      ]
    },
    {
      code: `import { before } from 'node:test'
import assert from 'node:assert/strict'
before(() => assert.ok(true))`,
      errors: [
        {
          messageId: 'useContext',
          line: 3, column: 14,
          endLine: 3, endColumn: 23
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
import assert from 'node:assert/strict'
test('subject', t => t.test('nested', () => assert.ok(true)))`,
      errors: [
        {
          messageId: 'useContext',
          line: 3, column: 45,
          endLine: 3, endColumn: 54
        },
      ]
    },
    {
      code: `import { test } from 'node:test'
import assert from 'node:assert/strict'
test('subject', () => { assert.ok(true); assert.strictEqual(1, 1) })`,
      errors: [
        {
          messageId: 'useContext',
          line: 3, column: 25,
          endLine: 3, endColumn: 34
        },
        {
          messageId: 'useContext',
          line: 3, column: 42,
          endLine: 3, endColumn: 60
        },
      ]
    },
  ]
})
