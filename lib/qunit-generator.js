'use strict';

const escape = require('./escape');

const generator = {
	suiteHeader(name) {
		return `QUnit.module(${escape(name)});\n`;
	},
	suiteFooter() {
		return '';
	},
	test(testName, assertion) {
		return (
			`QUnit.test(${escape(testName)}, function(assert) {\n` +
			'	assert.expect(0);\n' +
			`	${assertion}\n` +
			'});\n'
		);
	}
};

module.exports = generator;
