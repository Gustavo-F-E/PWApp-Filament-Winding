# Pruebas de Plotly.js

## Scatern

```js
var Plotly = require('plotly.js-dist-min')
/*
var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
var layout = {fileopt : "overwrite", filename : "simple-node-example"};

plotly.plot(data, layout, function (err, msg) {
	if (err) return console.log(err);
	console.log(msg);
});*/

Plotly.plot([{
	x: [1, 2, 3, 4, 5],
	y: [1, 2, 4, 8, 16] }], {
	margin: { t: 0 } } );

```

```text
node:internal/modules/cjs/loader:1148
  throw err;
  ^

Error: Cannot find module 'plotly.js-dist-min'
Require stack:
- C:\Users\Gustavo\AppData\Local\Temp\mdl\main.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1145:15)
    at Module._load (node:internal/modules/cjs/loader:986:27)
    at Module.require (node:internal/modules/cjs/loader:1233:19)
    at require (node:internal/modules/helpers:179:18)
    at Object.<anonymous> (C:\Users\Gustavo\AppData\Local\Temp\mdl\main.js:3:14)
    at Module._compile (node:internal/modules/cjs/loader:1358:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1416:10)
    at Module.load (node:internal/modules/cjs/loader:1208:32)
    at Module._load (node:internal/modules/cjs/loader:1024:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:174:12) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [ 'C:\\Users\\Gustavo\\AppData\\Local\\Temp\\mdl\\main.js' ]
}

Node.js v20.14.0
```