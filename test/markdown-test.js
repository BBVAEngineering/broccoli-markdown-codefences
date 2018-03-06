'use strict';

const expect = require('./chai').expect;
const testHelpers = require('broccoli-test-helper');
const Markdown = require('..');

const createBuilder = testHelpers.createBuilder;
const createTempDir = testHelpers.createTempDir;

describe('broccoli-markdown-test', () => {
	let input, output;

	beforeEach(async () => {
		input = await createTempDir();
	});

	afterEach(async () => {
		await input.dispose();
		if (output) {
			output.dispose();
		}
	});

	it('exports a static immutable "testGenerators" list', () => {
		expect(Markdown.testGenerators).to.deep.equal(['qunit', 'mocha']);

		Markdown.testGenerators.push('jest');

		expect(Markdown.testGenerators).to.deep.equal(['qunit', 'mocha']);
	});

	describe('test generators', () => {
		it('generates qunit tests (using factory function)', async () => {
			input.write({
				'a.md': [
					'```javascript',
					'var a = \'foo\';',
					'```',
					'```html',
					'<p>foo</p>',
					'```',
					'```json',
					'{',
					'	"foo": "bar"',
					'}',
					'```',
					'```',
					'Dummy code',
					'```'
				].join('\n')
			});

			output = createBuilder(Markdown(input.path(), { testGenerator: 'qunit' }));

			await output.build();

			const result = output.read();

			expect(result['a.codefences-test.js'].trim()).to.equal([
				'QUnit.module(\'Markdown Codefences | a.md\');',
				'QUnit.test(\'fenced code should work\', function(assert) {',
				'	assert.expect(0);',
				'	var a = \'foo\';',
				'});',
				'QUnit.test(\'fenced code should work\', function(assert) {',
				'	assert.expect(0);',
				'	const error = new DOMParser().parseFromString(\'<p>foo</p>\').querySelector(\'parsererror\');',
				'if (error) throw new Error(\'invalid html\');',
				'});',
				'QUnit.test(\'fenced code should work\', function(assert) {',
				'	assert.expect(0);',
				'	JSON.parse(\'{',
				'	"foo": "bar"',
				'}\');',
				'});'
			].join('\n'));
		});

		it('generates qunit tests (using new)', async () => {
			input.write({
				'a.md': '```javascript\na = \'foo\';\n```'
			});

			output = createBuilder(new Markdown(input.path(), { testGenerator: 'qunit' }));

			await output.build();

			const result = output.read();

			expect(Object.keys(result)).to.deep.equal(['a.codefences-test.js']);
		});

		it('generates mocha tests (using factory function)', async () => {
			input.write({
				'a.md': [
					'```javascript',
					'var a = \'foo\';',
					'```',
					'```html',
					'<p>foo</p>',
					'```',
					'```json',
					'{',
					'	"foo": "bar"',
					'}',
					'```',
					'```',
					'Dummy code',
					'```'
				].join('\n')
			});

			output = createBuilder(Markdown(input.path(), { testGenerator: 'mocha' }));

			await output.build();

			const result = output.read();

			expect(result['a.codefences-test.js'].trim()).to.equal([
				'describe(\'Markdown Codefences | a.md\', function() {',
				'	it(\'fenced code should work\', function() {',
				'		var a = \'foo\';',
				'	});',
				'	it(\'fenced code should work\', function() {',
				'		const error = new DOMParser().parseFromString(\'<p>foo</p>\').querySelector(\'parsererror\');',
				'if (error) throw new Error(\'invalid html\');',
				'	});',
				'	it(\'fenced code should work\', function() {',
				'		JSON.parse(\'{',
				'	"foo": "bar"',
				'}\');',
				'	});',
				'});'
			].join('\n'));
		});

		it('generates qunit tests (using new)', async () => {
			input.write({
				'a.md': '```javascript\na = \'foo\';\n```'
			});

			output = createBuilder(new Markdown(input.path(), { testGenerator: 'qunit' }));

			await output.build();

			const result = output.read();

			expect(Object.keys(result)).to.deep.equal(['a.codefences-test.js']);
		});
	});

	describe('code transforms', () => {
		it('transform custom code fences', async () => {
			const custom = (code) => `console.log('${code}');`;

			input.write({
				'a.md': [
					'```javascript',
					'var a = \'foo\';',
					'```',
					'```custom',
					'custom code',
					'```'
				].join('\n')
			});

			output = createBuilder(Markdown(input.path(), { codeTransforms: { custom }, testGenerator: 'qunit' }));

			await output.build();

			const result = output.read();

			expect(result['a.codefences-test.js'].trim()).to.equal([
				'QUnit.module(\'Markdown Codefences | a.md\');',
				'QUnit.test(\'fenced code should work\', function(assert) {',
				'	assert.expect(0);',
				'	var a = \'foo\';',
				'});',
				'QUnit.test(\'fenced code should work\', function(assert) {',
				'	assert.expect(0);',
				'	console.log(\'custom code\');',
				'});'
			].join('\n'));
		});
	});
});

// function compare
