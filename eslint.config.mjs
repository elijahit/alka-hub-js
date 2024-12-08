import globals from "globals";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  { languageOptions: { globals: globals.browser } },
  { rules: { "no-unused-vars": ["error", { "vars": "all", "args": "none" }] } },
  { extends: ["eslint:recommended", "plugin:prettier/recommended"] }
];