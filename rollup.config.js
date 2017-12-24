import babel from "rollup-plugin-babel";

const packageJson = require("./package.json");

export default {
  input: packageJson.module,
  external: ["agrouter", "react", "prop-types"],
  output: {
    file: packageJson.main,
    format: "cjs"
  },
  plugins: [
    babel({
      presets: [
        ["es2015", { modules: false }]
      ],
      plugins: [
        "external-helpers",
        "transform-object-rest-spread",
        "transform-class-properties",
        "transform-react-jsx"
      ]
    })
  ]
};
