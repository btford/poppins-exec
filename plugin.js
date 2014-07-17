
var exec = require('child_process').exec;
var format = require('util').format;

module.exports = function (poppins) {
  var plugins = poppins.plugins;

  plugins.exec = {
    commands: [
      { re: /^\s*LGTM\s*$/, exec: 'echo "merged!"' }
    ],

    owners: [ 'btford' ]
  };


  function execCommands (data) {
    if (plugins.exec.owners.indexOf(data.comment.user.login) > -1) {
      plugins.exec.commands.forEach(function (command) {
        var match;
        if (match = data.comment.body.match(command.re)) {
          var commandString = typeof command.exec === 'function' ?
              command.exec(match, data) :
              format.apply(null, [command.exec].concat(match.slice(1)));

          exec(commandString, function (err, stdout, stderr) {
            poppins.emit('log', [stdout, stderr].join('\n'));
          });
        }
      });
    }
  }

  poppins.on('issueCommentCreated', execCommands);
};
