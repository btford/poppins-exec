# poppins-exec [![Build Status](https://travis-ci.org/btford/poppins-exec.svg?branch=master)](https://travis-ci.org/btford/poppins-exec)

A [Mary Poppins](https://github.com/btford/mary-poppins) plugin for running local commands in
response to GitHub comments.

**Note:** depending on how you configure this plugin, it may be exploitable. As a best practice,
you should run `mary-poppins` as an unprivileged user.


## Install

`npm install poppins-exec`


## Configure

To use this plugin, you need to load it in your config file with `couldYouPlease`:


```javascript
// config.js
module.exports = function (poppins) {

  // load the plugin
  poppins.couldYouPlease('poppins-exec');

  // configure it
  poppins.plugins.exec = {

    // regexs to match against and the corresponding script to run in response
    commands: [
      { re: /^\s*LGTM\s*$/, exec: 'echo "merged!"' }
    ],

    // users to respond to
    owners: [ 'btford' ]
  };
};
```


## Security

I think there may be a case where someone with write access to the repo could edit your
comment body before `mary-poppins` reads and parses it so I suggest only running this
on repos that you own.

Be careful how you use this, or you'll subject yourself to
[shell injection](http://en.wikipedia.org/wiki/Code_injection#Shell_injection).

Your best bet is to only use very specific input as parameters like:

* a number: `([0-9]+)`
* a string of alphanumeric characters: `([a-zA-Z]+)`


## License
MIT
