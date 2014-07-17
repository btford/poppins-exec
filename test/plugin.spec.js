var rewire = require('rewire');
var makeMock = require('poppins-mock').poppins;

describe('plugin', function () {

  var plugin, poppins, execSpy, commentCreated;

  beforeEach(function () {
    var plugin = rewire('../plugin');
    execSpy = jasmine.createSpy('execSpy');
    plugin.__set__('exec', execSpy);
    poppins = makeMock();
    plugin(poppins);

    commentCreated = false;
    poppins.on('issueCommentCreated', function () {
      commentCreated = true;
    });
  });

  it('should work', function () {
    runs(function () {
      poppins.emit('issueCommentCreated', {
        comment: {
          user: {
            login: 'btford'
          },
          body: 'LGTM'
        }
      });
    });

    waitsFor(commentToBeCreated, 10);

    runs(function () {
      expect(execSpy.mostRecentCall.args[0]).toBe('echo "merged!"');
    });
  });

  it('should work with functions', function () {
    poppins.plugins.exec.commands = [
      {re: /^\s*LGTM: (.*?)\s*$/, exec: function (match) {
        return 'echo "' + match[1] + '"';
      }}
    ];

    runs(function () {
      poppins.emit('issueCommentCreated', {
        comment: {
          user: {
            login: 'btford'
          },
          body: 'LGTM: merge it!'
        }
      });
    });

    waitsFor(commentToBeCreated, 10);

    runs(function () {
      expect(execSpy.mostRecentCall.args[0]).toBe('echo "merge it!"');
    });
  });

  it('should pass data to functions', function () {

    var data = {
      comment: {
        user: {
          login: 'btford'
        },
        body: 'LGTM: merge it!'
      }
    };

    var reaction = jasmine.createSpy('reaction');

    poppins.plugins.exec.commands = [
      {re: /^\s*LGTM: (.*?)\s*$/, exec: reaction}
    ];

    runs(function () {
      poppins.emit('issueCommentCreated', data);
    });

    waitsFor(commentToBeCreated, 10);

    runs(function () {
      expect(reaction.mostRecentCall.args[1]).toEqual(data);
    });
  });

  it('should work with format strings', function () {
    poppins.plugins.exec.commands = [
      {re: /^\s*LGTM: (.*?)\s*$/, exec: 'echo "%s"'}
    ];

    runs(function () {
      poppins.emit('issueCommentCreated', {
        comment: {
          user: {
            login: 'btford'
          },
          body: 'LGTM: merge it!'
        }
      });
    });

    waitsFor(commentToBeCreated, 10);

    runs(function () {
      expect(execSpy.mostRecentCall.args[0]).toBe('echo "merge it!"');
    });
  });

  function commentToBeCreated() {
    return commentCreated;
  }
});