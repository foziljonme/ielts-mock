import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Prettier: disable conflicting rules
  prettierConfig,

  // Prettier plugin: enables `prettier/prettier` rule
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Keep your custom ignore rules
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])

export default eslintConfig
