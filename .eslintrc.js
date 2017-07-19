module.exports = {
  root: true,
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": "airbnb-base",
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'comma-dangle': 0,
    'no-unused-vars': 1,
    'indent': [2, 4],
    'camelcase': 0,
    'space-before-function-paren': 0,
  }
}