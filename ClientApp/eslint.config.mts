import js from '@eslint/js'
import type { Linter } from 'eslint'

export default [
  js.configs.recommended,
  {
    ignores: ['node_modules/**', 'dist/**'],
    rules: {
      'no-console': [0],
    },
  },
] satisfies Linter.FlatConfig[]

// dist/
// node_modules/
