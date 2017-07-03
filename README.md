<div align="center">
    <a href="https://omaha.js.org/"><img src="https://omaha.js.org/assets/images/logo.png?v=1.0" alt="OMAHA JS" height="225"/></a>
</div>
<div align="center" style="padding-top: 16px;">
    <a href="https://travis-ci.org/omahajs/generator-omaha">
        <img src="https://travis-ci.org/omahajs/generator-omaha.svg?branch=master" alt="Travis-CI Build Status" title="Travis-CI Build Status"/>
    </a>
    <a href="https://coveralls.io/github/omahajs/generator-omaha?branch=master">
        <img src="https://coveralls.io/repos/omahajs/generator-omaha/badge.svg?branch=master&service=github" alt="Coveralls.io Coverage Status" title="Coveralls.io Coverage Status"/>
    </a>
    <a href="http://packagequality.com/#?package=generator-omaha">
        <img src="http://npm.packagequality.com/shield/generator-omaha.svg" alt="Package Quality" title="Package Quality"/>
    </a>
    <a href="https://www.bithound.io/github/omahajs/generator-omaha">
        <img src="https://www.bithound.io/github/omahajs/generator-omaha/badges/score.svg" alt="bitHound Overall Score" title="bitHound Overall Score">
    </a>
</div>
<br/>

> A [Yeoman](http://yeoman.io) generator for the modern front-end artisan designed to help you craft sustainable code for the web.

Quick Start
-----------
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
    <img width="100%" type="image/svg+xml" src="https://jhwohlgemuth.github.io/images/generator-rail-diagram.svg?v=1.1" alt="Generator Choices Rail Diagram" title="Generator Choices Rail Diagram"/>
</div>
</br>
✔ Start creating your app!

Patterns are Paramount
----------------------

`generator-omaha`strives to enable developers of various skill and experience to more easily implement patterns and architectures with minimal time and effort. Specifically, `generator-omaha` enables the following patterns and capabilities:

- Composite architecture using Marionette.js, "The Backbone Framework"
- Event driven interactions using Backbone.Radio (included with Marionette.js)
- View templating with Handlebars (or Lodash) and template pre-compilation
- Predictable state management with Redux
- Workflow with support for linting, optimization, testing, bundling, and more

> See the full webapp tech stack [here](https://github.com/omahajs/generator-omaha/blob/master/generators/app/README.md)

The default sub-generator may be for a web app, but `generator-omaha` also has [sub-generators](https://github.com/omahajs/generator-omaha/blob/master/GENERATORS.md) for crafting:

- [servers](https://github.com/omahajs/generator-omaha/blob/master/GENERATORS.md#server) built on express with security baked in (using lusca and helmet)
- [plugins](https://github.com/omahajs/generator-omaha/blob/master/GENERATORS.md#plugin) to support a modular architecture
- [projects](https://github.com/omahajs/generator-omaha/blob/master/GENERATORS.md#project) with pre-configured modern workflows
- [native desktop applications](https://github.com/omahajs/generator-omaha/blob/master/GENERATORS.md#native) built on Electron --> *quickly turn your web app into a desktop app*!

> **A Note on Semantic Versioning**: This project strives to adhere to the principles of semantic versioning ([semver](http://semver.org/)). However, it seems unreasonable to release major versions for changes to the generated output of `generator-omaha` that are not backwards compatible with the generated output of previous versions. In general, this project will release major versions when the generator API is not backwards compatible ***or*** when the generated outputs undergo substantial changes. In the case of the latter, *a major version increment would serve more as a signifier of significant change* (not necessarily changes that are not backwards compatible). I am perhaps making this more complicated than necessary; however, I want to avoid superficial "churn", but maintain a standardized process for development and enhancement.

Typical Workflows
-----------------
> After scaffolding a new project with `yo omaha` ...

- Serve live-reload enabled app with companion RESTful API using `npm start`, then...
  - :sparkles: lint your code in real-time with a second terminal running `npm run lint:watch`
  - :100: run tests and calculate code coverage in real-time with `npm run test:watch`
  - :lipstick: see your style updates and code changes in the browser with a second terminal running `grunt styling`
- Run tests with `npm test`
- One-time lint with `npm run lint`
- Demo your bundled project in a browser with `npm run demo`
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
yo omaha --defaults --template-technology lodash --skip-coveralls
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
- `--template-technology`: **`handlebars`** | `lodash`

**But wait, there's more!** Read about [all the available generators!](GENERATORS.md)

Alternatives
------------
- See wiki page: [Tools for Creating Web Apps](https://github.com/omahajs/omahajs.github.io/wiki/Tools-for-Creating-Web-Apps)

Credits
-------
- [Yeoman](http://yeoman.io/) (d'uh)
- [railroad-diagrams](https://github.com/tabatkins/railroad-diagrams)
- [electron-forge](https://github.com/electron-userland/electron-forge)
- All the awesome open source projects that make *this project* possible
