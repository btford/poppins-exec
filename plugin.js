
var exec = require('child_process').exec;

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
        if (data.comment.body.match(command.re)) {
          exec(command.exec, function (err, stdout, stderr) {
            console.log(stdout, stderr);
          });
        }
      });
    }
  }

  poppins.on('issueCommentCreated', execCommands);
};
