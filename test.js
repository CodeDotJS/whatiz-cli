import childProcess from 'child_process';
import test from 'ava';

test.cb(t => {
	childProcess.execFile('./cli.js', ['redux'], {
		cwd: __dirname
	}, (err, stdout) => {
		t.ifError(err);
		t.true(stdout.trim() === `\u001b[?25l\n\u001b[?25l\u001b[1000D\u001b[K\u001b[1A\u001b[1000D\u001b[K\n› Predictable state container for JavaScript apps\n\n\u001b[?25h`);
		t.end();
	});
});
