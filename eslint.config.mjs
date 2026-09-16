import { plugin as shadcn } from "@shadcn/lint";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // @shadcn/lint — linter de design system.
  //
  // Le plugin est enregistré, aucune règle n'est activée : c'est à nous de
  // décider ce qui est autorisé une fois que les composants du site seront
  // stabilisés. Les règles disponibles et leur configuration sont documentées
  // sur https://github.com/shadcn-ui/lint#rules
  //
  // Le parser vient de eslint-config-next, on ne le redéfinit pas.
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { shadcn },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
