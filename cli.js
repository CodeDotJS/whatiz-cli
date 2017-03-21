#!/usr/bin/env node

'use strict';

const dns = require('dns');
const os = require('os');
const fs = require('fs');
const got = require('got');
const cheerio = require('cheerio');
const logUpdate = require('log-update');
const chalk = require('chalk');
const ora = require('ora');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();

const arg = process.argv[2];
const spinner = ora();

const nextPath = `/node_modules/${arg}/package.json`;
const curDir = `${process.cwd()}${nextPath}`;
const homeDir = `${os.homedir()}${nextPath}`;
const remoteDir = `/usr/local/lib${nextPath}`;
const nvmDir = `${os.homedir()}/.nvm/versions/node/v5.5.0/lib${nextPath}`;

const url = `${'https://www.npmjs.com/package/'}${arg}`;

const pre = chalk.bold.cyan('›');
const fov = chalk.bold.red('›');

if (!arg || arg === '-h' || arg === '--help') {
	console.log(`
 ${chalk.cyan('Usage   :')} whatiz [package-name]

 ${chalk.cyan('Example :')} whatiz browserify
	`);
	process.exit(1);
}

const message = module => {
	spinner.stop();
	logUpdate(`\n${pre} ${require(module).description}\n`);
};

if (!fs.existsSync(curDir) && !fs.existsSync(homeDir) && !fs.existsSync(remoteDir) && !fs.existsSync(nvmDir)) {
	dns.lookup('npmjs.com', err => {
		if (err) {
			logUpdate(`\n${fov} ${chalk.dim('Please check your internet connection')}\n`);
			process.exit(1);
		} else {
			logUpdate();
			spinner.text = `${arg} ${chalk.dim('is not installed, fetching description from npmjs')}`;
			spinner.start();
		}
	});
	got(url).then(res => {
		const $ = cheerio.load(res.body);
		const pkgDescription = $('.markdown p, .markdown li').eq(0).text();
		spinner.stop();
		logUpdate(`\n${pre} ${pkgDescription}\n`);
	}).catch(err => {
		if (err) {
			spinner.stop();
			logUpdate(`\n${fov} ${chalk.dim('Package')} ${arg} ${chalk.dim('does not exist')}\n`);
		}
	});
} else if (fs.existsSync(curDir)) {
	message(curDir);
} else if (fs.existsSync(remoteDir)) {
	message(remoteDir);
} else if (fs.existsSync(nvmDir)) {
	message(nvmDir);
} else {
	message(homeDir);
}
