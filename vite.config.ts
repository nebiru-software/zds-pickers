import { resolve } from 'node:path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.json'),
      include: ['lib'],
      rollupTypes: true,
      entryRoot: 'lib',
      outDir: 'dist/types',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index'),
      fileName: format => `index.${format}.js`,
      formats: ['es', 'cjs'],
      name: 'zds-pickers',
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-select',
        'd3-drag',
        'd3-scale',
        'd3-selection',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-select': 'ReactSelect',
          'd3-drag': 'd3',
          'd3-scale': 'd3',
          'd3-selection': 'd3',
        },
      },
    },
    // minify: true,
  },
})
