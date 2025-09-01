import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  {
    ignores: ["dist/**"],
  },
  ...tseslint.configs.recommended,
  // React Hooks recommended configuration
  reactHooks.configs.recommended,
  // Your custom overrides and other plugins
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      "react-refresh": reactRefresh,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // You can override rules from the recommended config here
      "react-refresh/only-export-components": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { "varsIgnorePattern": "^_" }],
    },
  }
);
