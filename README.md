<div align="center">
    <a href="https://omaha.js.org/"><img src="https://omaha.js.org/assets/images/logo.png?v=1.0" alt="OMAHA JS" height="225"/></a>
</div>
<div align="center" style="padding: 16px 0;">
    <a href="https://travis-ci.org/omahajs/generator-omaha">
        <img src="https://travis-ci.org/omahajs/generator-omaha.svg?branch=master" alt="Travis-CI Build Status" title="Travis-CI Build Status"/>
    </a>
    <a href="https://coveralls.io/github/omahajs/generator-omaha?branch=master">
        <img src="https://coveralls.io/repos/omahajs/generator-omaha/badge.svg?branch=master&service=github" alt="Coveralls.io Coverage Status" title="Coveralls.io Coverage Status"/>
    </a>
    <a href="https://www.bithound.io/github/omahajs/generator-omaha">
        <img src="https://www.bithound.io/github/omahajs/generator-omaha/badges/score.svg" alt="bitHound Overall Score" title="bitHound Overall Score">
    </a>
</div>

> A [Yeoman](http://yeoman.io) generator for the modern front-end artisan designed to help you craft maintainable code for the web.

Getting Started
---------------
✔ Install [Yeoman](http://yeoman.io/) CLI tool, [Grunt](http://gruntjs.com/) CLI tool,  and [generator-omaha node module](https://www.npmjs.com/package/generator-omaha) globally
```bash
npm install --global yo grunt-cli generator-omaha
```
✔ Create an empty directory and cd into it
```bash
mkdir my-project && cd my-project
```
✔ Run omaha generator
```bash
yo omaha
```
✔ Make some choices
<div align="center">
    <img width="100%" type="image/svg+xml" src="https://jhwohlgemuth.github.io/images/generator-rail-diagram.svg?v=1.0" alt="Generator Choices Rail Diagram" title="Generator Choices Rail Diagram"/>
</div>
</br>
✔ Start creating your app!

Typical Workflows
-----------------
> After scaffolding a new project with `yo omaha` ...

- Serve live-reload enabled app with companion RESTful API using `npm start`, then...
  - :lipstick: see your style updates and code changes in the browser with a second terminal running `grunt styling`
  - :sparkles: lint your code in real-time with a second terminal running `grunt linting`
  - :100: run tests and calculate code coverage in real-time with `grunt covering`
- Demo your bundled project in a browser with `npm run demo`
- Run tests with `npm test`
- View reports, documentation and styleguide:
  - code coverage: `grunt cover open:coverage`
  - Plato report: `grunt plato open:plato`
  - JSDocs documentation: `grunt docs open:docs`
  - Living styleguide: `grunt docs open:styleguide`
- [Review the code](/generators/webapp/templates/tasks) to see all the available tasks

> View the [technologies used](generators/app/README.md) and the [lint rules that make your code more secure](https://github.com/omahajs/eslint-config-omaha-prime-grade/blob/master/RULES_FOR_SECURITY.md)

Command Line Options
--------------------
> Beyond `yo omaha --help`

- Scaffold a web app "auto-magically" with defaults and no user input

```bash
yo omaha --defaults
```

- Use "silent" web app defaults with browserify

```bash
yo omaha --defaults --script-bundler browserify
```

- Use "silent" web app defaults with custom modifications

```bash
yo omaha --defaults --template-technology underscore --skip-coveralls
```

**Available options**
> Default in **bold**

- `--defaults`: scaffold app with no user input using defaults
- `--skip-benchmark`: use with `--defaults`
- `--skip-coveralls`: use with `--defaults`
- `--skip-jsinspect`: use with `--defaults`
- `--skip-aria`: use with `--defaults`
- `--skip-imagemin`: use with `--defaults`
- `--script-bundler`: **`requirejs`** | `browserify`
- `--css-preprocessor`: **`less`** | `sass` | `none`
- `--template-technology`: **`handlebars`** | `underscore`

**But wait, there's more!** Read about [all the available generators!](GENERATORS.md)

Alternatives
------------
- See wiki page: [Tools for Creating Web Apps](https://github.com/omahajs/omahajs.github.io/wiki/Tools-for-Creating-Web-Apps)
