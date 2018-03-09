'use strict';

const jsesc = require('jsesc');

function escape(str) {
	return jsesc(str, { wrap: true });
}

module.exports = escape;
