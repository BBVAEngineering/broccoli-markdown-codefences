'use strict';

function transformJS(content) {
	return content;
}

function transformHTML(content) {
	return [
		`const error = new DOMParser().parseFromString(\'${content}\', \'text/xml\').querySelector(\'parsererror\');`,
		'if (error) throw new Error(\'invalid html\');'
	].join('\n');
}

function transformJSON(content) {
	content = content.replace(/(\n|\t)/g, '');

	return `JSON.parse(\'${content}\');`;
}

const codeTransforms = {
	javascript: transformJS,
	html: transformHTML,
	json: transformJSON
};

module.exports = codeTransforms;
