import globals from "globals";
import pluginJs from "@eslint/js";
import stylisticJs from '@stylistic/eslint-plugin-js'

export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', 3],
      '@stylistic/js/linebreak-style': ['error', 'windows'],
      '@stylistic/js/quotes': ['error', 'double'],
      '@stylistic/js/semi': ['error', 'never'],
    },
  },
  {
    ignores: ["dist/*"],
  },
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended,
];