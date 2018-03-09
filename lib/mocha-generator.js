'use strict';

const escape = require('./escape');

const generator = {
	suiteHeader(name) {
		return `describe(${escape(name)}, function() {\n`;
	},
	suiteFooter() {
		return '});';
	},
	test(testName, assertion) {
		return (
			`	it(${escape(testName)}, function() {\n` +
			`		${assertion}\n` +
			'	});\n'
		);
	}
};

module.exports = generator;
