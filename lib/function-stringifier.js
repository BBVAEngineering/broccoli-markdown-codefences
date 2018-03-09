'use strict';

const isFunction = require('./is-function');

module.exports = function functionStringifier(key, value) {
	if (isFunction(value)) {
		return value.toString();
	}

	return value;
};
