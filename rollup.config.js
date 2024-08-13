import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts", // Cambia esto a tu archivo de entrada TypeScript
  output: [
    {
      format: "esm",
      file: "bundle.js",
    },
  ],
  plugins: [
    resolve(),
    typescript({
      tsconfig: "tsconfig.json", // Asegúrate de que apunte a tu tsconfig.json
    }),
  ],
};
