/* globals process */

var path = require('path');
var TerserPlugin = require('terser-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

var environment = process.env.ENV || 'development';
var isDevelopmentEnv = (environment === 'development');

var dir = process.cwd();

module.exports = {
	entry: path.join(dir, '/src/index.ts'),
	output: {
		filename: 'bundle.js',
		path: path.join(dir, '/dist'),
		library: 'CustomDialogs',
		libraryTarget: 'umd'
	},
	optimization: {
		minimizer: isDevelopmentEnv ? [] : [
			new TerserPlugin({
				terserOptions: {
					ecma: 2018,
					output: {
						comments: false,
					},
				}
			}),
			new CssMinimizerPlugin(),
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'bundle.css',
		})
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							esModule: false,
						},
					},
					'css-loader'
				]
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
};
