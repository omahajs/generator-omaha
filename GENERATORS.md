Web Application
---------------
> **default** generator

**Usage:**
```sh
yo techtonic
```
**Options:**
- `defaults`: scaffold app with no user input using defaults
- `script-bundler`: **`requirejs`** | `browserify`
- `css-preprocessor`: **`less`** | `sass` | `none`
- `template-technology`: **`handlebars`** | `underscore`

**Examples:**

Scaffold web app with pre-defined answers:
```sh
yo techtonic --css-preprocessor sass
```

Scaffold techtonic web app with default settings and no user interaction:
```sh
yo techtonic --defaults
```

Scaffold techtonic web app with customized default settings and no user interaction:
```sh
yo techtonic --defaults --script-bundler browserify
```

Plugin
------
> Scaffold a UMD plugin with selected dependencies

**Usage:**
```sh
yo techtonic:plugin name
```
**Arguments:**
- `name`: **(required)** The name of the plugin

**Options:**
- `jquery`
- `underscore`
- `backbone` (automatically includes underscore as a dependencies)
- `marionette` (automatically includes underscore and backbone as dependencies)
- `lodash`
- `ramda`
- `custom-dependency`: Specify custom dependency name (must be used with `alias` option)
- `alias`: Used in tandem with `custom-dependency` to define a custom dependency

**Examples:**

Create a lodash plugin:
```sh
yo techtonic:plugin myPlugin --lodash
```
Create a plugin for a dependency not listed as an option:
```sh
yo techtonic:plugin myCustomPlugin --custom-dependency FooBar --alias foo
```
