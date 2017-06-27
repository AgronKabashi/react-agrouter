import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";

export default {
  entry: "src/index.js",
  external: ["react", "prop-types", "agrouter"],
  targets: [
    {
      dest: "build/react-agrouter.js",
      format: "cjs"
    },
    {
      dest: "build/react-agrouter.es.js",
      format: "es"
    }
  ],
  plugins: [
    replace({
      "process.env.NODE_ENV": "'production'"
    }),
    babel()
  ]
}