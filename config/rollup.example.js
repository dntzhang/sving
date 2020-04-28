import nodeResolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import memory from "rollup-plugin-memory";
import commonjs from "rollup-plugin-commonjs";

var ENV = process.argv[5]

export default {
	input: "examples/" + ENV + "/main.js",
	output: {
		format: "iife",
		file: "examples/" + ENV + "/b.js",
		name: "sving",
		sourcemap: true,
		strict: true
	},
	plugins: [
		memory({
			path: "src/sving.js",
			contents: `
				import Sving from './sving';
				if (typeof module!='undefined') module.exports = Sving;
				else self.Sving = Sving;
			`
		}),
		nodeResolve({
			main: true
		}),
		commonjs({
			include: 'node_modules/**'
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
				"transform-decorators-legacy",
				"transform-class-properties",
				["transform-react-jsx", { pragma: "Sving.h" }]
			]
		})
	]
};
