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
      {re: /^\s*LGTM: (.*?)\s*$/, exec: function (full, firstMatch) {
        return 'echo "' + firstMatch + '"';
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