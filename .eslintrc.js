module.exports = {
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2021: true,
    'jest/globals': true
  },
  extends: ['standard', 'plugin:jest/style'],
  parserOptions: {
    ecmaVersion: 12
  },
  plugins: ['jest'],
  rules: {}
}
