// eslint.config.js
export default [
    {
      files: ["**/*.js", "**/*.ts"],
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      rules: {
        semi: ["error", "always"],
        quotes: ["error", "double"],
      },
    },
  ];
  