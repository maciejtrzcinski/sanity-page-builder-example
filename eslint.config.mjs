import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier'

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
  // core-web-vitals brings the Next + React rules; typescript adds the
  // @typescript-eslint recommended set (core-web-vitals registers the plugin
  // but ships no TS rules of its own).
  ...nextCoreWebVitals,
  ...nextTypeScript,
  // Last: turn off any ESLint rules that would conflict with Prettier.
  prettier,
]

export default eslintConfig
