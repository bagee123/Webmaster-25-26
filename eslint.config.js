import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    settings: {
      react: {
        version: "detect",
        jsxRuntime: "automatic",
      },
    },
    plugins: { js },
    extends: ["js/recommended", pluginReact.configs.flat.recommended],
    rules: {
      "react/react-in-jsx-scope": "off",
    },
    ignores: ["node_modules/**", "build/**", "dist/**"],
  },
]);
