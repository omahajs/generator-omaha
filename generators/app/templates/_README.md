<%= projectName %>
==================
> Super cool project

Folder Structure
----------------
    +- app
    |   +- models
    |   +- views
    |   +- controllers
    |   +- modules
    |   +- helpers
    |   +- shims
    |   |- app.js
    |   |- router.js
    |   |- main.js
    |   |- config.js
    |   \- index.html
    +- assets
    |   +- fonts
    |   +- images
    |   +- templates
    |   +- less
    |       |- reset.less
    |       \- style.less
    +- config
    |   |- .csslintrc
    |   |- .jscsrc
    |   |- .jscsrc-jsdoc
    |   |- .jshintrc
    |   |- default.js
    |   \- karma.conf.js
    +- tasks
    |   |- build.js
    |   |- test.js
    |   \- main.js
    +- tests
    |   +- data
    |   +- jasmine
    |       +- specs
    |   \- test-main.js
    |- GruntFile.js
    \- package.json

Grunt Tasks
-----------
- `grunt lint`
- `grunt linting`      _(watch task)_
- `grunt build`        _(transpile LESS, pre-compile templates and optimize JS into one file)_
- `grunt test`
- `grunt testing`      _(watch task)_
- `grunt cover`
- `grunt covering`     _(watch task)_
- `grunt serve       ` _(watch task)_ **[default task]**
- `grunt inspect`      _(detect copy-pasted and structurally similar code)_
- `grunt aria`         _(lint HTML files for accessibility)_
- `grunt docs`         _(generate documentation in `./reports/docs`)_
- `grunt plato`        _(generate plato report in `./reports/plato`)_
- `grunt reports`      _(generate code coverage, plato report, and documentation - then open in the browser)_

JSCS Rules ([JSHint rules](config/.jshintrc))
----------
 - [Disallow Dangling Underscores](http://jscs.info/rule/disallowDanglingUnderscores.html)
 - [Disallow Empty Blocks](http://jscs.info/rule/disallowEmptyBlocks.html)
 - [Disallow Keywords: ("with")](http://jscs.info/rule/disallowKeywords.html)
 - [Disallow Keywords on New Line: ["else"]](http://jscs.info/rule/disallowKeywordsOnNewLine.html)
 - [Disallow Mixed Spaces and Tabs](http://jscs.info/rule/disallowMixedSpacesAndTabs.html)
 - [Disallow Multiple Line Breaks](http://jscs.info/rule/disallowMultipleLineBreaks.html)
 - [Disallow Multiple Line Strings](http://jscs.info/rule/disallowMultipleLineStrings.html)
 - [Disallow Multiple Variable Declarations](http://jscs.info/rule/disallowMultipleVarDecl.html)
 - [Disallow Space After Object Keys](http://jscs.info/rule/disallowSpaceAfterObjectKeys.html)
 - [Disallow Space After Prefix Unary Operators ("++", "--", "+", "-", "~", "!")](http://jscs.info/rule/disallowSpaceAfterPrefixUnaryOperators.html)
 - [Disallow Space Before Postfix Unary Operators: ("++", "--")](http://jscs.info/rule/disallowSpaceBeforePostfixUnaryOperators.html)
 - [Disallow Spaces in Anonymous Function Expressions](http://jscs.info/rule/disallowSpacesInAnonymousFunctionExpression.html)
 - [Disallow Spaces in Function Expressions Before Opening Round Braces](http://jscs.info/rule/disallowSpacesInFunctionDeclaration.html)
 - [Disallow Spaces in Named Function Expressions Before Opening Round Braces](http://jscs.info/rule/disallowSpacesInNamedFunctionExpression.html)
 - [Disallow Spaces Inside Array Brackets](http://jscs.info/rule/disallowSpacesInsideArrayBrackets.html)
 - [Disallow Spaces Inside Object Brackets](http://jscs.info/rule/disallowSpacesInsideObjectBrackets.html)
 - [Disallow Spaces Inside Parentheses](http://jscs.info/rule/disallowSpacesInsideParentheses.html)
 - [Disallow Trailing Commas](http://jscs.info/rule/disallowTrailingComma.html)
 - [Disallow Trailing Whitespaces](http://jscs.info/rule/disallowTrailingWhitespace.html)
 - [Disallow Yoda Conditions](http://jscs.info/rule/disallowYodaConditions.html)
 - [Maximum Line Length (150)](http://jscs.info/rule/maximumLineLength.html)
 - [Require Camel Case or Upper Case Identifiers](http://jscs.info/rule/requireCamelCaseOrUpperCaseIdentifiers.html)
 - [Require Capitalized Constructors](http://jscs.info/rule/requireCapitalizedConstructors.html)
 - [Require Commas Before Line Breaks](http://jscs.info/rule/requireCommaBeforeLineBreak.html)
 - [Require Curly Braces ("else", "for", "while", "do", "try", "catch")](http://jscs.info/rule/requireCurlyBraces.html)
 - [Require Space After Keywords ("if", "else", "for", "while", "do", "switch", "return", "try", "catch")](http://jscs.info/rule/requireSpaceAfterKeywords.html)
 - [Require Space Before Binary Operators ("+", "-", "/", "*", "=", "==", "===", "!=", "!==")](http://jscs.info/rule/requireSpaceAfterBinaryOperators.html)
 - [Require Space Before Block Statements](http://jscs.info/rule/requireSpaceBeforeBlockStatements.html)
 - [Validate Indentation (4)](http://jscs.info/rule/validateIndentation.html)
 - [Validate Line Breaks ("CRLF")](http://jscs.info/rule/validateLineBreaks.html)
 - [Validate Quote Marks (Use single quotes)](http://jscs.info/rule/validateQuoteMarks.html)
