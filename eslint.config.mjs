// Code: eslint.config.mjs
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file eslint.config.mjs
 * @module eslint.config
 * @description Questo file gestisce la configurazione di eslint!
 */

import globals from "globals";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  { languageOptions: { globals: globals.browser } },
  { rules: { "no-unused-vars": ["error", { "vars": "all", "args": "none" }] } },
  { extends: ["eslint:recommended", "plugin:prettier/recommended"] }
];