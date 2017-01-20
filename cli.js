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
 ${chalk.cyan('Usage   :')} ${chalk.blue('whatiz')} [${chalk.dim(' package-name ')}]

 ${chalk.cyan('Example :')} ${chalk.blue('whatiz')} ${chalk.yellow('browserify')}
	`);
	process.exit(1);
}

if (!fs.existsSync(curDir) && !fs.existsSync(homeDir) && !fs.existsSync(remoteDir) && !fs.existsSync(nvmDir)) {
	dns.lookup('npmjs.com', err => {
		if (err && err.code === 'ENOTFOUND') {
			logUpdate(`\n${fov} Please check your internet connection\n`);
		} else {
			logUpdate();
			spinner.text = `${arg} ${chalk.dim('is not installed, fetching description from npmjs')}`;
			spinner.start();
		}
	});
	got(url).then(res => {
		const $ = cheerio.load(res.body);
		const pkgDescription = $('.package-description').text();
		spinner.stop();
		logUpdate(`\n${pre} ${pkgDescription}\n`);
	}).catch(err => {
		if (err) {
			spinner.stop();
			logUpdate(`\n${fov} ${chalk.dim('Package')} ${arg} ${chalk.dim('does not exist')}\n`);
		}
	});
} else if (fs.existsSync(curDir)) {
	spinner.stop();
	logUpdate(`\n${pre} ${require(curDir).description}\n`);
} else if (fs.existsSync(remoteDir)) {
	spinner.stop();
	logUpdate(`\n${pre} ${require(remoteDir).description}\n`);
} else if (fs.existsSync(nvmDir)){
	spinner.stop();
	logUpdate(`\n${pre} ${require(nvmDir).description}\n`);
} else {
	spinner.stop();
	logUpdate(`\n${pre} ${require(homeDir).description}\n`);
}
