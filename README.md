# broccoli-markdown-test

[![Build Status](https://travis-ci.org/BBVAEngineering/broccoli-markdown-test.svg?branch=master)](https://travis-ci.org/BBVAEngineering/broccoli-markdown-test)
[![GitHub version](https://badge.fury.io/gh/BBVAEngineering%2Fbroccoli-markdown-test.svg)](https://badge.fury.io/gh/BBVAEngineering%2Fbroccoli-markdown-test)
[![npm version](https://badge.fury.io/js/broccoli-markdown-test.svg)](https://badge.fury.io/js/broccoli-markdown-test)
[![Dependency Status](https://david-dm.org/BBVAEngineering/broccoli-markdown-test.svg)](https://david-dm.org/BBVAEngineering/broccoli-markdown-test)

> Generate tests for markdown codefences.

The internal code is heavily inspired by [broccoli-lint-eslint](https://github.com/ember-cli/broccoli-lint-eslint).

## Information

[![NPM](https://nodei.co/npm/broccoli-markdown-test.png?downloads=true&downloadRank=true)](https://nodei.co/npm/broccoli-markdown-test/)

## Installation

```
npm install --save broccoli-markdown-test
```

## Usage

```
const MarkdownTest = require('broccoli-markdown-test');
const outputNode = MarkdownTest.create(inputNode, options);
```

### API

- `inputNode` A [Broccoli node](https://github.com/broccolijs/broccoli/blob/master/docs/node-api.md)

- `options` {Object}: Options to control how `broccoli-markdown-test` is run.

  - `testGenerator` {`function(relativePath, asserts), returns test output string`}: The function used to generate test modules. You can provide a custom function for your client side testing framework of choice.

    Default: `null`.

      - `relativePath` {String}: The relative path to the file being tested.
      - `asserts` {Array}: List of assertions made from codeTransforms.

    If you provide a string one of the predefined test generators is used. Currently supported are `qunit` and `mocha`.

    Example usage:

    ```javascript
      var path = require('path');

      function testGenerator(relativePath, asserts) {
        return "module('" + path.dirname(relativePath) + "');\n";
               "test('" + relativePath + "' should work', function() {\n" +
               "  " + asserts.join('\n') + "\n" +
               "});\n";
      }

      return new MarkdownTest(inputNode, {
        testGenerator: testGenerator
      });
    ```

  - `persist` {Boolean}: Persist the state of filter output across restarts

    Default: `false`.

  - `codeTransforms` {Object}: An object with codefences types and functions for converting code to code assertions. By default, there are implemented `javascript`, `html` and `json` code transforms. This option is merged with defaults.

    Example usage:

    ```javascript
      var path = require('path');

      return new MarkdownTest(inputNode, {
        testGenerator: 'qunit',
        codeTransforms: {
          text: (code) => "console.log('" + code + "');"
        }
      });
    ```

  - `extensions` {Array}: File extensions to lint.

    Default: [markdown-extensions](https://github.com/sindresorhus/markdown-extensions/blob/master/markdown-extensions.json).

## Contribute

If you want to contribute to this addon, please read the [CONTRIBUTING.md](CONTRIBUTING.md).

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/BBVAEngineering/broccoli-markdown-test/tags).

## Authors

See the list of [contributors](https://github.com/BBVAEngineering/broccoli-markdown-test/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
