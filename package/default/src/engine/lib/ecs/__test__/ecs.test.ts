/**
 * Testing the ECS Database
 */

import test from 'ava';
import { ECSDB } from '../ECSDB';

console.log("test inside src");

test('foo', t => {
	t.pass();
});

test('bar', async t => {
	const bar = Promise.resolve('bar');
	t.is(await bar, 'bar');
});

test('baz', (t) => {
	const a = new ECSDB();
	console.log(a);
	t.pass();
});