'use strict';

module.exports = {
	root: true,
	extends: 'eslint-config-bbva',
	parserOptions: {
		ecmaVersion: 2017,
		sourceType: 'module'
	},
	env: {
		node: true
	},
	rules: {
		'no-unused-expressions': 0
	}
};
