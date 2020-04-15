const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const BabelPolyfill = require("@babel/polyfill");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = env => {

	/**
	 * Environment 
	 */
	let isProduction = (env.platform == "prod");
	let isQA = (env.platform=="qa");
	let isDevelopment = !isProduction;

	let environmentFile =  __dirname + "/src/env/.env.development";
	if (isProduction) {
		environmentFile =  __dirname + "/src/env/.env.production";
	} else if (isQA) {
		environmentFile =  __dirname + "/src/env/.env.qa";
	}

	console.log("Build Environment: " + env.platform );
	console.log("Production Process: " + isProduction);
	console.log("Building from: " + environmentFile);
	
	return  {
		entry: [
			"@babel/polyfill", // polyfill must be included before the app entry point
			"./src/index.js"
		],
		output: {
			path: path.join(__dirname, "/dist"),
			filename: "app.bundle.js",
			publicPath: '/',
		},
		devServer: {
			historyApiFallback: true,
		},
		resolve: {
			extensions: [".js"]
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader"
					},
				},
				{
					test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]',
								outputPath: 'assets/fonts',
								esModule: false
							}
						}
					]
				},
				{
					test: /\.(sa|sc|c)ss$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: {
								hmr: isDevelopment,
							},
						},
						'css-loader',
						'sass-loader',
					],
				}
			]
		},
		plugins: [
			new CopyWebpackPlugin([
				{ from: 'assets', to: 'assets' }
			]),
			new MiniCssExtractPlugin({
				filename: '[name].css',
				chunkFilename: '[id].css'
			}),
			new HtmlWebpackPlugin({
				template: "./src/index.html"
			}),
			new Dotenv({
				path: environmentFile, // Path to .env file (this is the default)
				safe: true // load .env.example (defaults to "false" which does not use dotenv-safe)
			  })
		]
	}
};