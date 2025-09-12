import { resolve } from 'node:path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index'),
      fileName: format => `index.${format}.js`,
      formats: ['es', 'cjs'],
      name: 'zds-pickers',
    },
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: id => {
        return [
          'react',
          'react-dom',
          'react/jsx-runtime',
          'react-select',
          'd3-drag',
          'd3-scale',
          'd3-selection',
          'classnames',
          'zds-mappings',
        ].some(pkg => id === pkg || id.startsWith(`${pkg}/`))
      },
      output: {
        exports: 'named',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-select': 'ReactSelect',
        },
      },
    },
    // minify: true,
  },
})
