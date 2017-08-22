import babel from "rollup-plugin-babel";

const packageJson = require("./package.json");

export default {
  input: packageJson.module,
  external: Object.keys(packageJson.dependencies),
  output: {
    file: packageJson.main,
    format: "cjs"
  },
  plugins: [
    babel()
  ]
};
