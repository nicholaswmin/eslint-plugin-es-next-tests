import { test } from 'node:test'
import { readdir, readFile } from 'node:fs/promises'
import { ESLint } from 'eslint'
import { defineConfig } from 'eslint/config'
import plugin from 'eslint-plugin-es-next-tests'
import pkg from '../package.json' with { type: 'json' }

test('Plugin', async t => {
  await t.test('exports package metadata', t => {
    t.assert.deepStrictEqual(plugin.meta, {
      name: pkg.name, version: pkg.version, namespace: 'es-next-tests'
    })
    t.assert.deepStrictEqual(Object.keys(plugin), ['meta', 'rules', 'configs'])
  })

  await t.test('exports every rule with matching tests and docs', async t => {
    const files = await readdir(new URL('../src/rules/', import.meta.url))
    const names = files.map(file => file.slice(0, -3)).sort()

    t.assert.deepStrictEqual(Object.keys(plugin.rules).sort(), names)

    for (const name of names) {
      const module = await import(`../src/rules/${name}.js`)
      const docs = await readFile(
        new URL(`../docs/rules/${name}.md`, import.meta.url), 'utf8')
      const tests = await readFile(
        new URL(`./rules/${name}.test.js`, import.meta.url), 'utf8')

      t.assert.strictEqual(plugin.rules[name], module.default)
      t.assert.ok(docs.startsWith(`# ${name}\n`))
      t.assert.ok(tests.includes(`tester.run('${name}', rule, {`))
    }
  })

  await t.test('recommended', async t => {
    t.beforeEach(t => {
      t.eslint = new ESLint({
        overrideConfigFile: true,
        overrideConfig: defineConfig([{
          files: ['**/*.test.js', '**/test/utils/setup.js'],
          extends: [plugin.configs.recommended]
        }])
      })
    })

    await t.test('registers the plugin and its recommended rules', t => {
      const config = plugin.configs.recommended

      t.assert.strictEqual(config.plugins['es-next-tests'], plugin)
      t.assert.deepStrictEqual(config.rules,
        Object.fromEntries(Object.entries(plugin.rules)
          .filter(([, rule]) => rule.meta.docs.recommended)
          .map(([name]) => [`es-next-tests/${name}`, 'error'])))
    })

    await t.test('reports all five violations', async t => {
      const [result] = await t.eslint.lintText(`
import { test } from 'node:test'
import assert from 'node:assert/strict'
process.on('unhandledRejection', handler)
test('subject', t => {
  assert.ok(true)
  t.todo()
  prepare(t)
  process.exit(1)
})`, { filePath: 'consumer.test.js' })

      t.assert.deepStrictEqual(result.messages.map(message => message.ruleId), [
        'es-next-tests/no-unhandled-rejection-handler',
        'es-next-tests/prefer-context-assert',
        'es-next-tests/todo-reason',
        'es-next-tests/no-context-passing',
        'es-next-tests/no-process-exit'
      ])
      t.assert.strictEqual(result.errorCount, 5)
    })

    await t.test('accepts context utilities and helper results', async t => {
      const [result] = await t.eslint.lintText(`
import { test } from 'node:test'
test('subject', t => {
  const value = prepare()
  t.assert.ok(value)
  t.todo('Coverage missing')
})`, { filePath: 'consumer.test.js' })

      t.assert.deepStrictEqual(result.messages, [])
    })

    await t.test('checks explicitly selected setup files', async t => {
      const [result] = await t.eslint.lintText('process.exit(1)', {
        filePath: 'test/utils/setup.js'
      })

      t.assert.deepStrictEqual(result.messages.map(message => message.ruleId),
        ['es-next-tests/no-process-exit'])
    })

    await t.test('leaves files outside consumer scope alone', async t => {
      const [result] = await t.eslint.lintText('process.exit(1)', {
        filePath: 'src/index.js'
      })

      t.assert.deepStrictEqual(result.messages, [])
    })
  })
})
