'use strict';

const testGenerators = {
	qunit: require('./qunit-generator'),
	mocha: require('./mocha-generator')
};

const generators = {};

Object.keys(testGenerators).forEach((name) => {
	const testGenerator = testGenerators[name];

	generators[name] = function(relativePath, asserts) {
		return (
			testGenerator.suiteHeader(`Markdown Codefences | ${relativePath}`) +
			asserts.map((assert) => testGenerator.test('fenced code should work', assert)).join('') +
			testGenerator.suiteFooter()
		);
	};
});

module.exports = generators;
