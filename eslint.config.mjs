import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const config = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@next/next/no-img-element': 'off', // images come from the CMS with their own sizes
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  { ignores: ['.next/', 'node_modules/', 'src/payload-types.ts', 'src/app/(payload)/', 'src/migrations/'] },
]

export default config
