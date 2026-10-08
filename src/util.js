const functions = new Set(['ArrowFunctionExpression', 'FunctionExpression'])
const hooks = new Set(['before', 'after', 'beforeEach', 'afterEach'])
const variants = new Set(['only', 'skip', 'todo'])

const name = node => node.computed
  ? node.property.type === 'Literal' && typeof node.property.value === 'string'
    ? node.property.value
    : null
  : node.property.name

export const property = (node, key) => {
  if (node == null)
    return null

  if (node.type !== 'ObjectExpression')
    return undefined

  let value = null

  for (const entry of node.properties)
    if (entry.type === 'SpreadElement' || entry.computed)
      value = undefined
    else if ((entry.key.name ?? entry.key.value) === key)
      value = entry.kind === 'init' ? entry.value : undefined

  return value
}

const variable = (source, node) => {
  for (let scope = source.getScope(node); scope; scope = scope.upper)
    for (const reference of scope.references)
      if (reference.identifier === node)
        return reference.resolved
}

const owner = node => {
  for (let parent = node.parent; parent; parent = parent.parent)
    if (functions.has(parent.type) || parent.type === 'FunctionDeclaration')
      return parent
}

const imported = definition => {
  const module = definition.parent.source.value
  const specifier = definition.node
  const member = specifier.type === 'ImportSpecifier'
    ? specifier.imported.name ?? specifier.imported.value
    : specifier.type === 'ImportDefaultSpecifier' ? 'default' : null

  if (module === 'node:test')
    return { root: 'test', path: member === 'default' ? ['test'] :
      member ? [member] : [] }

  if (module === 'node:process' || module === 'process')
    return { root: 'process', path: member && member !== 'default'
      ? [member] : [] }

  if (['node:assert', 'node:assert/strict', 'assert', 'assert/strict']
    .includes(module))
    return { root: 'assert', path: member && member !== 'default'
      ? [member] : [], callable: member === 'default' }
}

export const resolve = (source, node, seen = new Set()) => {
  if (!node)
    return null

  if (node.type === 'ChainExpression')
    return resolve(source, node.expression, seen)

  if (node.type === 'MemberExpression') {
    const object = resolve(source, node.object, seen)
    const member = name(node)

    return object && member != null
      ? { ...object, path: [...object.path, member], callable: false }
      : null
  }

  if (node.type !== 'Identifier')
    return null

  const binding = variable(source, node)

  if (!binding || !binding.defs.length)
    return node.name === 'process'
      ? { root: 'process', path: [] } : null

  if (seen.has(binding) || binding.defs.length !== 1)
    return null

  seen.add(binding)

  if (binding.references.some(ref => ref.isWrite() && !ref.init))
    return null

  const [definition] = binding.defs

  if (definition.type === 'ImportBinding')
    return imported(definition) ?? null

  if (definition.type === 'Parameter') {
    const fn = definition.node

    if (fn.params[0] !== definition.name)
      return null

    const kind = callbackKind(source, fn)

    return kind ? { root: kind, path: [], callback: fn } : null
  }

  if (definition.type !== 'Variable' || definition.parent.kind !== 'const')
    return null

  const declarator = definition.node
  const origin = resolve(source, declarator.init, seen)

  if (declarator.id.type === 'Identifier')
    return origin

  if (declarator.id.type !== 'ObjectPattern' || !origin)
    return null

  const entry = declarator.id.properties.find(prop =>
    prop.type === 'Property' && !prop.computed &&
    prop.value === definition.name)

  return entry
    ? { ...origin, path: [...origin.path, entry.key.name ?? entry.key.value],
      callable: false }
    : null
}

export const registration = (source, call) => {
  const api = resolve(source, call.callee)

  if (!api)
    return null

  const path = [...api.path]
  const variant = variants.has(path.at(-1)) ? path.pop() : null
  let kind

  if (api.root === 'test' && path.length === 2 && path[0] === 'test')
    path.shift()

  if (api.root === 'test' && path.length === 1) {
    const [method] = path

    kind = method === 'test' || method === 'it' ? 'context' :
      method === 'suite' || method === 'describe' ? 'suite-context' :
        hooks.has(method) && !variant ? 'hook' : null
  } else if (api.root === 'context' && path.length === 1 && !variant)
    kind = path[0] === 'test' ? 'context' :
      hooks.has(path[0]) ? 'context' : null

  if (!kind)
    return null

  const method = path[0]
  const hook = hooks.has(method)
  const args = call.arguments
  const last = args.at(-1)
  const positional = hook ? args[0] : last
  const remaining = functions.has(last?.type) ? args.slice(0, -1) : args
  const first = remaining[0]
  const options = hook ? args[1] : remaining.length > 1 ? remaining[1] :
    first?.type === 'TemplateLiteral' ||
      first?.type === 'Literal' && typeof first.value === 'string'
      ? null : functions.has(first?.type) ? null : first
  const configured = hook ? null : property(options, 'fn')
  const callback = configured === null ? positional : configured

  return { kind, method, variant, options,
    callback: functions.has(callback?.type) ? callback : null }
}

const callbackKind = (source, fn) => {
  let call = fn.parent

  if (call?.type === 'Property' && call.value === fn)
    call = call.parent.parent

  if (call?.type !== 'CallExpression')
    return null

  const entry = registration(source, call)

  if (entry?.callback !== fn)
    return null

  if (entry.kind !== 'hook')
    return entry.kind

  const parent = owner(call)

  return entry.method.endsWith('Each') ? 'context' :
    parent ? callbackKind(source, parent) : 'context'
}

export const enclosing = (source, node) => {
  const fn = owner(node)

  return fn ? callbackKind(source, fn) : null
}
