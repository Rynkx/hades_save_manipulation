const indentSpaces = 4;

module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    rules: {
        'prettier/prettier': [
            'warn',
            {
                semi: true,
                singleQuote: true,
                tabWidth: indentSpaces,
                trailingComma: 'none',
                printWidth: 80,
                arrowParens: 'avoid'
            }
        ],
        indent: ['warn', indentSpaces, { SwitchCase: 1 }],
        'comma-dangle': ['warn', 'only-multiline'],
        'eslint-comments/no-unlimited-disable': 'off',
        'no-extra-boolean-cast': 'off',
        'no-shadow': 'off',
        'no-labels': ['error', { allowLoop: true }]
    }
};
