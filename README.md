# poppins-exec

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


## License
MIT
