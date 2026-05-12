import { defineConfig } from 'rolldown'
import babel from '@rolldown/plugin-babel'
import { transformAsync } from '@babel/core'

const lowerOutputToES5 = () => ({
  name: 'lower-output-to-es5',
  async renderChunk(code, chunk) {
    if (!chunk.fileName.endsWith('.js')) return null
    const result = await transformAsync(code, {
      babelrc: false,
      configFile: false,
      sourceType: 'script',
      compact: false,
      presets: [
        ['@babel/preset-env', {
          targets: { ie: '11' },
          modules: false,
          useBuiltIns: false,
          bugfixes: true,
          shippedProposals: true,
          exclude: ['transform-typeof-symbol'],
        }],
      ],
    })
    return result ? { code: result.code, map: result.map } : null
  }
})

export default defineConfig({
  input: 'src/main.ts',

  output: {
    file: 'dist/script.js',
    format: 'iife',
    name: '__app',
    inlineDynamicImports: true,
    minify: false,
  },

  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '({})',
    'process': '({ env: {} })',
    '__DEV__': 'false',
  },
  plugins: [
    babel({
      include: [
        /src\/.+\.[jt]sx?$/,
        /node_modules\/react\//,
        /node_modules\/react-reconciler\//,
        /node_modules\/scheduler\//,
      ],
      exclude: [
        /\0rolldown/,
        /\.json$/,
      ],
      babelrc: false,
      configFile: false,
      presets: [
        '@babel/preset-react',
        ['@babel/preset-env', {
          targets: { ie: '11' },
          useBuiltIns: 'usage',
          corejs: { version: 3, proposals: false },
          modules: false,
          exclude: ['transform-typeof-symbol'],
        }],
      ],
    }),

    lowerOutputToES5(),
  ],
})
