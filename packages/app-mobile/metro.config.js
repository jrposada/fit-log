const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Only `expo start` (see the `dev` script) sets this. It resolves local
// workspace packages straight from their source instead of their built
// `dist`, so there's no separate `tsc --build --watch` step to keep running
// alongside the dev server. Production bundles (eas build, expo export)
// don't set it, so they keep resolving through `dist` as normal.
if (process.env.EXPO_USE_SOURCE) {
  // Watch the whole monorepo so Metro can see and hot-reload local package
  // source files (see resolver.resolveRequest below), not just app-mobile.
  config.watchFolders = [monorepoRoot];
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(monorepoRoot, 'node_modules'),
  ];

  const sourceAliases = {
    '@jrposada/fit-log-shared': path.join(monorepoRoot, 'packages/shared/src'),
    '@jrposada/fit-log-shared-react': path.join(
      monorepoRoot,
      'packages/shared-react/src'
    ),
  };

  const { resolveRequest } = config.resolver;
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    for (const [packageName, srcDir] of Object.entries(sourceAliases)) {
      if (
        moduleName === packageName ||
        moduleName.startsWith(`${packageName}/`)
      ) {
        const subpath = moduleName.slice(packageName.length + 1);
        const filePath = subpath ? path.join(srcDir, subpath) : srcDir;
        return (resolveRequest ?? context.resolveRequest)(
          context,
          filePath,
          platform
        );
      }
    }

    return (resolveRequest ?? context.resolveRequest)(
      context,
      moduleName,
      platform
    );
  };
}

module.exports = config;
