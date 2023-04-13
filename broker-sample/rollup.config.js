/* globals process */

import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const environment = process.env.ENV || 'development';
const isDevelopmentEnv = (environment === 'development');

export default [
	{
		input: 'lib/broker.js',
		output: {
			name: 'Brokers',
			format: 'umd',
			file: 'dist/bundle.js',
		},
		plugins: [
			nodeResolve(),
			!isDevelopmentEnv && terser({
				ecma: 2018,
				output: { inline_script: true },
			}),
		],
	},
];
