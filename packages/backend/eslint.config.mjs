// eslint.config.js (flat)
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    ignores: ["dist/**", "node_modules/**"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: "module", ecmaVersion: "latest" },
      globals: { ...globals.node, ...globals.browser }
    },
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin
    },
    settings: {
      "import/parsers": { "@typescript-eslint/parser": [".ts", ".tsx"] },
      "import/resolver": {
        typescript: true,
        node: true
      }
    },
    rules: {
      quotes: ["error", "single", { avoidEscape: true }],
      semi: ["error", "always"],
      indent: ["error", 2, { SwitchCase: 1 }],
      "arrow-parens": ["error", "always"],

      "import/extensions": ["error", "ignorePackages", { js: "never", ts: "never" }],
      "import/order": [
        "warn",
        {
          "groups": ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          "newlines-between": "always",
          "alphabetize": { order: "asc", caseInsensitive: true }
        }
      ],

      "no-console": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],

      "no-undef": "off",
      "callback-return": "error",
      "handle-callback-err": "warn"
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended
];
