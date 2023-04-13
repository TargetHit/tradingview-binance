# Sample of Broker API implementation

## Folders content

- `./src` folder contains source code on TypeScript.

- `./lib` folder contains transpiled in es5 code. So, if you do not know how to use TypeScript - you can use these JS files as a template for your broker implementation.

- `./dist` folder contains bundled JavaScript files, which can be inlined into HTML page and used in the [Widget Constructor](https://www.tradingview.com/charting-library-docs/docs/api/interfaces/Charting_Library.TradingTerminalWidgetOptions).

## Build & bundle

Before build or bundle code you need to run `npm install` to install dependencies.

`package.json` contains some handy scripts to build or generate the bundle:

- `npm run compile` to compile TypeScript source code into JavaScript files (output will be in `./lib` folder)
- `npm run bundle-js` to bundle multiple JavaScript files into one bundle (it also bundle polyfills)
- `npm run build` to compile and bundle (it is a combination of all above commands)

NOTE: if you want to minify the bundle code, you need to set `ENV` environment variable to a value different from `development`.

For example:

```bash
export ENV=prod
npm run bundle-js # or npm run build
```

or

```bash
ENV=prod npm run bundle-js
```

or

```bash
ENV=prod npm run build
```
