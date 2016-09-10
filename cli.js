#!/usr/bin/env node

'use strict';

const dns = require('dns');
const os = require('os');
const fs = require('fs');
const got = require('got');
const cheerio = require('cheerio');
const logUpdate = require('log-update');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();

const arg = process.argv[2];

const uniDir = '/node_modules/';

const curDir = process.cwd() + uniDir + arg;
const homeDir = os.homedir() + uniDir + arg;
const remoteDir = '/usr/local/lib' + uniDir + arg

const lodLocal = `${curDir}${'/package.json'}`;
const lodGlobal = `${homeDir}${'/package.json'}`;
const lodRemote = `${remoteDir}${'/package.json'}`;

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

if (!fs.existsSync(curDir) && !fs.existsSync(homeDir) && !fs.existsSync(remoteDir)) {
	dns.lookup('npmjs.com', err => {
		if (err && err.code === 'ENOTFOUND') {
			logUpdate(`\n${fov} Please check your internet connection\n`);
		} else {
			logUpdate(`\n${pre} ${arg} ${chalk.dim('is not installed, fetching description from npmjs')}\n`);
		}
	});
	got(url).then(res => {
		const $ = cheerio.load(res.body);
		const pkgDescription = $('.package-description').text();
		logUpdate(`\n${pre} ${pkgDescription}\n`);
	}).catch(err => {
		if (err) {
			logUpdate(`\n${fov} ${chalk.dim('Package')} ${arg} ${chalk.dim('does not exist')}\n`);
		}
	});
} else if (fs.existsSync(curDir)) {
	logUpdate(`\n${pre} ${require(lodLocal).description}\n`);
} else if (fs.existsSync(remoteDir)) {
	logUpdate(`\n${pre} ${require(lodRemote).description}\n`);
} else{
	logUpdate(`\n${pre} ${require(lodGlobal).description}\n`);
}
