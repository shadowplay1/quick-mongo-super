module.exports = {
    root: true,

    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },

    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],

    env: {
        es6: true,
        node: true,
        browser: true,
        amd: true
    },

    globals: {
        $: true,
        require: true,
        process: true
    },

    rules: {
        semi: [
            'warn',
            'never'
        ],

        'no-plusplus': 'off',
        'implicit-arrow-linebreak': 'off',
        'operator-linebreak': 'off',
        'arrow-body-style': 'off',
        'no-param-reassign': 'off',
        'consistent-return': 'off',
        'function-paren-newline': 'off',
        'no-mixed-spaces-and-tabs': 'off',

        'eol-last': 'warn',

        '@typescript-eslint/consistent-type-definitions': [
            'warn',
            'interface'
        ],

        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'warn',

        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',

        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'interface',
                format: [
                    'PascalCase'
                ],
                custom: {
                    regex: 'I[A-Z]',
                    match: true
                }
            }
        ],

        'prefer-const': 'warn',

        'max-len': [
            'warn',
            {
                code: 125
            }
        ],

        indent: [
            'warn',
            4
        ],

        'dot-notation': 'warn',
        'no-continue': 'warn',
        'no-dupe-else-if': 'error',

        'block-spacing': [
            'error',
            'never'
        ],

        'no-spaced-func': 'error',

        'object-curly-spacing': [
            'error',
            'always'
        ],

        'no-trailing-spaces': [
            'error',
            {
                'ignoreComments': false
            }
        ],

        'quotes': [
            'warn',
            'single'
        ],

        'no-return-await': [
            'error'
        ]
    },

    'parser': '@typescript-eslint/parser',

    'plugins': [
        '@typescript-eslint'
    ]
}
