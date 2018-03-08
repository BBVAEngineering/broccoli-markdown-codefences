'use strict';

const path = require('path');
const Filter = require('broccoli-persistent-filter');
const md5Hex = require('md5-hex');
const markdownIt = require('markdown-it')();
const stringify = require('json-stable-stringify');
const testGenerators = require('./test-generators');
const isString = require('./is-string');
const isFunction = require('./is-function');
const functionStringifier = require('./function-stringifier');
const codeTransforms = require('./code-transforms');

const testGeneratorNames = Object.keys(testGenerators);

function MarkdownTest(inputNode, _options) {
	if (!(this instanceof MarkdownTest)) {
		return new MarkdownTest(inputNode, _options);
	}

	const options = _options || {};

	if (!options.hasOwnProperty('persist')) {
		options.persist = true;
	}

	if (!options.hasOwnProperty('annotation')) {
		options.annotation = 'MarkdownTest';
	}

	Filter.call(this, inputNode, {
		annotation: options.annotation,
		persist: options.persist
	});

	if (isString(options.testGenerator)) {
		this.testGenerator = testGenerators[options.testGenerator];

		if (!this.testGenerator) {
			throw new Error(`Could not find '${this.internalOptions.testGenerator}' test generator.`);
		}
	} else {
		this.testGenerator = options.testGenerator;
	}

	if (!this.testGenerator) {
		throw new Error('\'testGenerator\' option is mandatory.');
	}

	this.codeTransforms = Object.assign({}, codeTransforms, options.codeTransforms);
	this.options = options;
}

MarkdownTest.prototype = Object.create(Filter.prototype);
MarkdownTest.prototype.constructor = MarkdownTest;

MarkdownTest.prototype.extensions = ['md'];
MarkdownTest.prototype.targetExtension = 'codefences-test.js';

MarkdownTest.prototype.baseDir = function() {
	return path.join(__dirname, '..');
};

MarkdownTest.prototype.cacheKeyProcessString = function(content, relativePath) {
	return md5Hex([
		content,
		relativePath,
		stringify(this.options, { replacer: functionStringifier })
	]);
};

MarkdownTest.prototype.markdownParse = function markdownParse(content) {
	const parts = markdownIt.parse(content);

	return parts.filter((part) => part.tag === 'code').map((part) => ({
		type: part.info,
		content: part.content.trim()
	}));
};

MarkdownTest.prototype.testTransform = function testTransform(blocks) {
	return blocks.map(({ type, content }) => {
		const transform = this.codeTransforms[type];

		if (!isFunction(transform)) {
			return null;
		}

		return transform(content);
	}).filter(Boolean);
};

MarkdownTest.prototype.processString = function processString(content, relativePath) {
	const blocks = this.markdownParse(content);
	const tests = this.testTransform(blocks);

	return this.testGenerator(relativePath, tests);
};

Object.defineProperty(MarkdownTest, 'testGenerators', {
	get() {
		return testGeneratorNames.slice(0);
	}
});

module.exports = MarkdownTest;
