import withNuxt from './.nuxt/eslint.config.mjs';
import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import vueEslintParser from 'vue-eslint-parser';

const customConfigs = [
  {
    ignores: ['node_modules/**', '**/node_modules/**', 'dist/**', '.nuxt/**', '.output/**']
  },
  js.configs.recommended,
  vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'vue/html-indent': [
        'error',
        2,
        {
          attribute: 1,
          baseIndent: 1,
          closeBracket: 0,
          alignAttributesVertically: false
        }
      ]
    }
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx,vue}'],
    plugins: {
      prettier,
      vue
    },
    languageOptions: {
      globals: {
        chrome: 'readonly'
      }
    },
    rules: {
      'prettier/prettier': [
        'warn',
        {
          trailingComma: 'none',
          cssWhitespaceSensitivity: 'ignore',
          htmlWhitespaceSensitivity: 'ignore'
        }
      ],
      'vue/multi-word-component-names': 'off',
      'comma-dangle': ['error', 'never'],
      'no-trailing-spaces': 'off'
    }
  },
  {
    rules: {
      'no-trailing-spaces': 'off',
      'prettier/prettier': 'off'
    }
  },
  prettierConfig
];

export default withNuxt(...customConfigs);
