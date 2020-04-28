import nodeResolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import memory from "rollup-plugin-memory";

const license = require("rollup-plugin-license");
const pkg = require("../package.json");
const licensePlugin = license({
  banner:
    " sving v" +
    pkg.version +
    "  http://omijs.org\r\nFront End Cross-Frameworks Framework.\r\nBy dntzhang https://github.com/dntzhang \r\n Github: https://github.com/dntzhang/sving\r\n MIT Licensed."
});

export default {
  input: "src/sving.js",
  output: {
    format: "iife",
    file: "dist/sving.dev.js",
    name: "sving",
    sourcemap: true,
    strict: true
  },
  plugins: [
    memory({
      path: "src/sving.js",
      contents: `
				import sving from './sving';
				if (typeof module!='undefined') module.exports = sving;
				else self.sving = sving;
			`
    }),
    nodeResolve({
      main: true
    }),
    babel({
      sourceMap: true,
      exclude: "node_modules/**",
      babelrc: false,
      presets: [
        [
          "env",
          {
            modules: false,
            loose: true,
            exclude: ["transform-es2015-typeof-symbol"],
            targets: {
              browsers: ["last 2 versions", "IE >= 9"]
            }
          }
        ]
      ],
      plugins: [
        "transform-class-properties"
      ]
    }),
    licensePlugin
  ]
};
