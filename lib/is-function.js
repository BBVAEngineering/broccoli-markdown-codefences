'use strict';

function isFunction(x) {
	return toString.call(x) === '[object Function]';
}

module.exports = isFunction;
