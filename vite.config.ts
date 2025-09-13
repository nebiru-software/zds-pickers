import { copyFileSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// Function to copy directory recursively
function copyDir(src: string, dest: string) {
  mkdirSync(dest, { recursive: true })
  const entries = readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = resolve(src, entry.name)
    const destPath = resolve(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-soundfonts-dir',
      writeBundle() {
        // Copy the soundfonts directory to dist after build
        const srcDir = resolve(__dirname, 'lib/soundfonts')
        const destDir = resolve(__dirname, 'dist/soundfonts')

        try {
          if (statSync(srcDir).isDirectory()) {
            copyDir(srcDir, destDir)
            console.log('✅ Copied soundfonts directory to dist')
          }
        } catch (error) {
          console.warn('⚠️  Could not copy soundfonts directory:', error)
        }
      },
    },
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index'),
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs'],
      name: 'zds-pickers',
    },
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: (id) => {
        // Don't externalize soundfont files - bundle them directly
        if (id.includes('soundfonts/acoustic_grand_piano-mp3')) {
          return false
        }

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
        ].some((pkg) => id === pkg || id.startsWith(`${pkg}/`))
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
