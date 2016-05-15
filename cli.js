#!/usr/bin/env node

'use strict';

const whatiz = require('whatiz');

const colors = require('colors/safe');

const args = process.argv.slice(2);

if (process.argv.slice(2).length === 0) {
	console.log(colors.cyan.bold('\n Usage : whatiz [package-name]\n'));
	console.log(colors.green.bold(' ❱ Example : whatiz express\n'));
	process.exit(1);
}

const npmPack = args.toString();

whatiz(npmPack).then(console.log);
