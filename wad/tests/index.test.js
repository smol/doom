import test from 'ava';

import Parser from '../src/parser';

test('foo', t => {
	console.log(t);
	t.pass();
});

test('bar', async t => {
	const bar = Promise.resolve('bar');

	t.is(await bar, 'bar');
});