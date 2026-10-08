import { test } from 'node:test'
import { Linter } from 'eslint'
import { resolve, registration, property } from '../src/util.js'

test('API recognition', async t => {
  t.beforeEach(t => {
    t.linter = new Linter()
    t.calls = []
    t.rule = {
      meta: { schema: [] },
      create(context) {
        return {
          CallExpression(node) {
            const api = resolve(context.sourceCode, node.callee)
            const entry = registration(context.sourceCode, node)

            t.calls.push({
              root: api?.root, path: api?.path, kind: entry?.kind
            })
          }
        }
      }
    }
    t.config = {
      plugins: { probe: { rules: { identity: t.rule } } },
      rules: { 'probe/identity': 'error' }
    }
  })

  await t.test('separates suite, test, and nested hook contexts', t => {
    const messages = t.linter.verify(`
import { describe, test } from 'node:test'
describe('suite', suite => {
  suite.diagnostic('suite')
  test('test', context => {
    context.beforeEach(hook => hook.todo('Missing coverage'))
  })
})`, t.config)

    t.assert.deepStrictEqual(messages, [])
    t.assert.deepStrictEqual(t.calls, [
      { root: 'test', path: ['describe'], kind: 'suite-context' },
      { root: 'suite-context', path: ['diagnostic'], kind: undefined },
      { root: 'test', path: ['test'], kind: 'context' },
      { root: 'context', path: ['beforeEach'], kind: 'context' },
      { root: 'context', path: ['todo'], kind: undefined }
    ])
  })

  await t.test('resolves aliases without confusing shadowed bindings', t => {
    const messages = t.linter.verify(`
import { test as check } from 'node:test'
const run = check
run('test', context => {
  const local = context
  local.todo('Missing coverage')
  { const local = fixture; local.todo() }
})`, t.config)

    t.assert.deepStrictEqual(messages, [])
    t.assert.deepStrictEqual(t.calls, [
      { root: 'test', path: ['test'], kind: 'context' },
      { root: 'context', path: ['todo'], kind: undefined },
      { root: undefined, path: undefined, kind: undefined }
    ])
  })

  await t.test('rejects circular aliases and reassigned contexts', t => {
    const messages = t.linter.verify(`
import { test } from 'node:test'
const first = second
const second = first
first.todo()
test('test', context => { context = fixture; context.todo() })`, t.config)

    t.assert.deepStrictEqual(messages, [])
    t.assert.deepStrictEqual(t.calls, [
      { root: undefined, path: undefined, kind: undefined },
      { root: 'test', path: ['test'], kind: 'context' },
      { root: undefined, path: undefined, kind: undefined }
    ])
  })

  await t.test('keeps object spread precedence when reading options', t => {
    const values = []
    const rule = {
      meta: { schema: [] },
      create() {
        return {
          ObjectExpression(node) {
            values.push(property(node, 'todo')?.value)
          }
        }
      }
    }
    const messages = t.linter.verify(`
const first = { todo: true, ...options }
const second = { ...options, todo: 'Missing coverage' }
const third = { todo: true, todo: false }`, {
      plugins: { probe: { rules: { options: rule } } },
      rules: { 'probe/options': 'error' }
    })

    t.assert.deepStrictEqual(messages, [])
    t.assert.deepStrictEqual(values, [undefined, 'Missing coverage', false])
  })
})
