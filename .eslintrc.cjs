module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    // Plain-JS React project — prop shapes are documented in the plan/spec,
    // not enforced with prop-types.
    'react/prop-types': 'off',
    // SectionWrapper HOC exports intentionally wrap components.
    'react-refresh/only-export-components': 'off',
  },
}
