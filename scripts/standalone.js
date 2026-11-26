// Builds a self-contained TSX (and JSX) file for one exported component of a family file:
// the component, every top-level helper, type and constant it uses, and only the imports those need.
const ts = require('typescript');

function parse(src) {
  return ts.createSourceFile('f.tsx', src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

function declNames(st) {
  const out = [];
  if ((ts.isFunctionDeclaration(st) || ts.isClassDeclaration(st) || ts.isInterfaceDeclaration(st) || ts.isTypeAliasDeclaration(st) || ts.isEnumDeclaration(st)) && st.name) out.push(st.name.text);
  else if (ts.isVariableStatement(st)) {
    st.declarationList.declarations.forEach((d) => {
      const walk = (n) => { if (ts.isIdentifier(n)) out.push(n.text); else if (ts.isObjectBindingPattern(n) || ts.isArrayBindingPattern(n)) n.elements.forEach((e) => { if (!ts.isOmittedExpression(e)) walk(e.name); }); };
      walk(d.name);
    });
  }
  return out;
}

function idsIn(node, set) {
  const visit = (n) => {
    if (ts.isIdentifier(n)) set.add(n.text);
    ts.forEachChild(n, visit);
  };
  visit(node);
}

function buildIndex(src) {
  const sf = parse(src);
  const top = new Map(); // name -> statement
  const imports = []; // {decl, names:Map(local->specifier text)}
  const order = [];
  sf.statements.forEach((st, idx) => {
    if (ts.isImportDeclaration(st)) {
      const names = new Map();
      const c = st.importClause;
      if (c) {
        if (c.name) names.set(c.name.text, { kind: 'default', text: c.name.text });
        if (c.namedBindings) {
          if (ts.isNamespaceImport(c.namedBindings)) names.set(c.namedBindings.name.text, { kind: 'ns', text: '* as ' + c.namedBindings.name.text });
          else c.namedBindings.elements.forEach((e) => names.set(e.name.text, { kind: 'named', text: e.getText(), typeOnly: e.isTypeOnly }));
        }
      }
      imports.push({ st, names, from: st.moduleSpecifier.text, sideEffect: !c });
      return;
    }
    declNames(st).forEach((n) => top.set(n, { st, idx }));
    order.push(st);
  });
  return { sf, top, imports, src };
}

function closure(index, names, seedUsed) {
  const { top } = index;
  const need = new Set(), used = new Set(seedUsed || []);
  const queue = [...names];
  while (queue.length) {
    const n = queue.pop();
    if (need.has(n)) continue;
    const entry = top.get(n);
    if (!entry) continue;
    need.add(n);
    const ids = new Set();
    idsIn(entry.st, ids);
    ids.forEach((i) => { used.add(i); if (top.has(i) && !need.has(i)) queue.push(i); });
  }
  const idxs = [...new Set([...need].map((n) => top.get(n).idx))].sort((a, b) => a - b);
  const stmts = idxs.map((i) => [...top.values()].find((e) => e.idx === i).st);
  return { stmts, used };
}

function importLinesFor(index, used, skipRelative) {
  const lines = [];
  index.imports.forEach((im) => {
    if (im.sideEffect) return;
    if (skipRelative && im.from.startsWith('.')) return;
    const def = [], named = [], ns = [];
    im.names.forEach((v, local) => {
      if (!used.has(local)) return;
      if (v.kind === 'default') def.push(v.text); else if (v.kind === 'ns') ns.push(v.text); else named.push(v.text);
    });
    if (!def.length && !named.length && !ns.length) return;
    const parts = [];
    if (def.length) parts.push(def[0]);
    if (ns.length) parts.push(ns[0]);
    if (named.length) parts.push('{ ' + named.join(', ') + ' }');
    lines.push({ from: im.from, def: def[0], ns: ns[0], named });
  });
  return lines;
}

function standalone(index, name, cssImport, dir, loadIndex) {
  const { top, src } = index;
  if (!top.get(name)) return null;
  const main = closure(index, [name]);
  const extraCss = [];
  const extraBodies = [];
  const merged = [];
  const mainLines = importLinesFor(index, main.used, false);
  const finalLines = [];
  mainLines.forEach((l) => {
    if (!l.from.startsWith('.')) { finalLines.push(l); return; }
    const mod = loadIndex(dir, l.from);
    if (!mod) return;
    const wanted = [...(l.def ? [l.def] : []), ...l.named.map((t) => t.replace(/^type\s+/, '').split(/\s+as\s+/).pop().trim())];
    const c2 = closure(mod, wanted);
    extraBodies.push(c2.stmts.map((st) => mod.src.slice(st.getFullStart(), st.getEnd()).trim().replace(/^export\s+/, '').replace(/^export default\s+/, '')).join('\n\n'));
    importLinesFor(mod, c2.used, true).forEach((x) => finalLines.push(x));
    mod.imports.filter((im) => im.sideEffect && im.from.endsWith('.css')).forEach((im) => extraCss.push(im.from.replace('./', '')));
  });
  // merge duplicates of the same module
  const byMod = new Map();
  finalLines.forEach((l) => {
    const m = byMod.get(l.from) || { from: l.from, def: null, ns: null, named: new Set() };
    if (l.def) m.def = l.def; if (l.ns) m.ns = l.ns; l.named.forEach((n) => m.named.add(n));
    byMod.set(l.from, m);
  });
  const importLines = [...byMod.values()].map((m) => {
    const parts = [];
    if (m.def) parts.push(m.def);
    if (m.ns) parts.push(m.ns);
    if (m.named.size) parts.push('{ ' + [...m.named].join(', ') + ' }');
    return `import ${parts.join(', ')} from "${m.from}";`;
  });
  const body = [...extraBodies, main.stmts.map((st) => src.slice(st.getFullStart(), st.getEnd()).trim()).join('\n\n')].join('\n\n');
  const cssLines = [cssImport, ...extraCss].filter(Boolean).map((c) => `import "./${c}";`);
  const head = ['"use client";', '', ...cssLines, ...importLines].join('\n');
  const tsx = head + '\n\n' + body + '\n';
  const jsx = ts.transpileModule(tsx, { compilerOptions: { jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, importsNotUsedAsValues: 0, removeComments: false } }).outputText;
  return { tsx, jsx, css: [cssImport, ...extraCss].filter(Boolean) };
}

module.exports = { buildIndex, standalone };
