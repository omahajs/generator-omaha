<div align="center">
    <a href="http://jhwohlgemuth.github.com/techtonic"><img src="http://images.jhwohlgemuth.com/techtonic/logo.png?v=1" alt="techtonic"/></a>
</div>
<div align="center">
    <a href="https://ci.appveyor.com/project/jhwohlgemuth/generator-techtonic">
        <img src="https://ci.appveyor.com/api/projects/status/n7tv489wdlkuyi0i?svg=true" alt="AppVeyor CI Build Status" title="AppVeyor CI Build Status"/>
    </a>
    <a href="https://travis-ci.org/jhwohlgemuth/generator-techtonic">
        <img src="https://travis-ci.org/jhwohlgemuth/generator-techtonic.svg?branch=master" alt="Travis-CI Build Status" title="Travis-CI Build Status"/>
    </a>
    <a href="https://coveralls.io/github/jhwohlgemuth/generator-techtonic?branch=master">
        <img src="https://coveralls.io/repos/jhwohlgemuth/generator-techtonic/badge.svg?branch=master&service=github" alt="Coveralls.io Coverage Status" title="Coveralls.io Coverage Status"/>
    </a>
</div>

<br/>

> A [Yeoman](http://yeoman.io) generator for the modern front-end artisan designed to help you craft maintainable code for the web.

Getting Started  [![Gitter](https://img.shields.io/gitter/room/jhwohlgemuth/techtonic.svg)](https://gitter.im/jhwohlgemuth/techtonic?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) [![API Doc](https://doclets.io/jhwohlgemuth/generator-techtonic/master.svg)](https://doclets.io/jhwohlgemuth/generator-techtonic/master)
---------------
✔ Install [Yeoman](http://yeoman.io/) CLI tool, [Grunt](http://gruntjs.com/) CLI tool,  and [generator-techtonic node module](https://www.npmjs.com/package/generator-techtonic) globally
```bash
npm install --global yo grunt-cli generator-techtonic
```
✔ Create an empty directory and cd into it
```bash
mkdir my-project && cd my-project
```
✔ Run techtonic generator
```bash
yo techtonic
```
✔ Make some choices
<div align="center">
    <img width="100%" type="image/svg+xml" src="http://images.jhwohlgemuth.com/techtonic/generator-rail-diagram.svg?v=8.0" alt="Generator Choices Rail Diagram" title="Generator Choices Rail Diagram"/>
</div>
</br>
✔ Start creating your app!

Typical Workflows
-----------------
> After scaffolding a new project with `yo techtonic` ...

- Serve live-reload enabled app with companion RESTful API using `npm start`
- Demo your bundled project in a browser with `npm run demo`
- Start a live-reload enabled server and open a browser with `grunt`, then...
  - :lipstick: see your style updates and code changes in the browser with a second terminal running `grunt styling`
  - :sparkles: lint your code in real-time with a second terminal running `grunt linting`
  - :100: run tests and calculate code coverage with `grunt covering`
- View reports, documentation and styleguide:
  - code coverage: `grunt cover open:coverage`
  - Plato report: `grunt plato open:plato`
  - JSDocs documentation: `grunt docs open:docs`
  - Living styleguide: `grunt docs open:styleguide`
- [Review the code](/generators/app/templates/tasks) to see all the available tasks

> View the [technologies used by the app generator](generators/app/README.md) and the [lint rules that make your code more secure](generators/app/templates/config/README.md)

Command Line Options
--------------------
> Beyond `yo techtonic --help`

- Scaffold app "auto-magically" with defaults and no user input

```bash
yo techtonic --defaults
```

- Use "silent" defaults with non-default scritpt bundler, css pre-processor, and/or template technology

```bash
yo techtonic --defaults --script-bundler browserify
```

**Available options**
> Default in **bold**

- `defaults`: scaffold app with no user input using defaults
- `script-bundler`: **`requirejs`** | `browserify`
- `css-preprocessor`: **`less`** | `sass` | `none`
- `template-technology`: **`handlebars`** | `underscore`

**But wait, there's more!** Read about [all the available generators!](GENERATORS.md)

Why "techtonic"?
----------------
> **techtonic** comes from the Ancient Greek noun, [tektōn (τέκτων)](https://en.wikipedia.org/wiki/Tekt%C5%8Dn),
> (term for a carpenter or **_builder_**)

Tools, References & Resources
-----------------------------
- See wiki page: [Front-end Link Library](https://github.com/jhwohlgemuth/techtonic/wiki/Front-end-Link-Library)

Future
------
- See [techtonic Trello board](https://trello.com/b/WEMB9CEL/techtonic)

Alternatives
------------
- See wiki page: [Tools for Creating Web Apps](https://github.com/jhwohlgemuth/techtonic/wiki/Tools-for-Creating-Web-Apps)
