[`radio.logging.js`](radio.logging.js)
==================
### **Why?**
- Stylized console messages with local line numbers
- levarage power and purpose of Backbone.Radio (channels, events, and stuff)
- Easily add to project via one line

### Extend application object
```javascript
var logging = require('./plugins/radio.logging');
var App = new Marionette.Application();
_.extend(App, logging);
module.exports = App;
```

### Use wrapped console message methods
```javascript
var App = require('app');
App.log('hello world');
App.info('hello world');
App.warn('hello world');
App.error('hello world');
```

### "Tune" in and out on channels
```javascript
var App = require('app');
setInterval(function() {
   App.radio.channel('test').trigger('log', 'message');
}, 1000);
App.radio.level('log');   //set logging level
App.radio.tuneIn('test'); //no need to create the channel first
// See some beautiful log messages in the console
App.radio.tuneOut('test'); //messages on test channel will no longer be shown
//Note: Remove 'test' channel with App.radio.reset('test')
```

### Choose what level of logs get shown
```javascript
var App = require('app');
App.radio.level('log'); //show all logs
App.radio.tuneIn('test'); //no need to create the channel first
setInterval(function() {
   App.radio.channel('test').trigger('log', 'message');
   App.radio.channel('test').trigger('info', 'message');
   App.radio.channel('test').trigger('warn', 'message');
   App.radio.channel('test').trigger('error', 'message');
}, 1000);
App.radio.level('none');  //show no logs
App.radio.level('error'); //only show 'error' logs
App.radio.level('warn');  //show 'error' and 'warn' logs
//Note: Unless directly set with level(), the default behavior is to show no logs
//Note: Return current logging level with App.radio.level()
//Note: Return channels with App.radio.channels()
```

[`redux.state.js`](redux.state.js)
==================
### **Why?**
- Enhanced `getState` that accepts path parameter
- "dispatch logging" middleware
- Basic reducer showcasing how to leverage lodash for updating state

### Extend application object
```javascript
var state = require('./plugins/redux.state');
var app = new Marionette.Application();
module.exports = Object.assign(app, state);
```

### Enhanced getState accepts path parameter
```javascript
app.getState();// {name: 'omaha-project', count: 42}
app.getState('count');// 42
```

### Update state with Redux API
```javascript
app.getState('count');// 42
app.dispatch('INCREMENT');
app.getState('count');// 43
```
