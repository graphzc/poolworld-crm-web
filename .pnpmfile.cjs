// typescript-eslint does not support TypeScript 7 yet (peer: typescript <6.1).
// Give its packages their own TypeScript 6 instead of the project's TS 7.
const TS_FOR_ESLINT = '^6.0.3'

function readPackage(pkg) {
  if (pkg.name === 'typescript-eslint' || pkg.name.startsWith('@typescript-eslint/')) {
    if (pkg.peerDependencies?.typescript) {
      delete pkg.peerDependencies.typescript
      if (pkg.peerDependenciesMeta) delete pkg.peerDependenciesMeta.typescript
      pkg.dependencies = { ...pkg.dependencies, typescript: TS_FOR_ESLINT }
    }
  }
  return pkg
}

module.exports = { hooks: { readPackage } }
