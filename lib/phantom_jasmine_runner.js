(function() {
  var PhantomJasmineRunner = (function() {

    function PhantomJasmineRunner(page, exit_func) {
      this.page = page;
      this.exit_func = exit_func != null ? exit_func : phantom.exit;
    }

    PhantomJasmineRunner.prototype.get_status = function() {
      return this.page.evaluate(function() {
        // Hack console.log
        var logged_messages = [];
        var oldLog = window.console.log;
        window.console.log = function(message) {
          logged_messages.push(message);
          oldLog.apply(console, arguments);
        }

        var threshold = $('body').data("coverage-threshold");

        logged_messages.push(window.travisCov.check(window._$blanket, { threshold: threshold }));

        return logged_messages;
      });
    };

    PhantomJasmineRunner.prototype.terminate = function() {
      var messages = this.get_status();
      var status = messages[messages.length-1];

      for(var i = 0; i < messages.length - 1; i++) {
        console.log('coverage_result' + messages[i]);
      }

      switch (status) {
        case true:
          return this.exit_func(0);
        case false:
          return this.exit_func(1);
        default:
          return this.exit_func(2);
      }
    };

    return PhantomJasmineRunner;

  })();

  var url = phantom.args[0];
  var page = require('webpage').create();
  var runner = new PhantomJasmineRunner(page);

  page.onCallback = function(data) {
    if(data.state === 'specDone') {
      console.log('jasmine_result' + JSON.stringify([].concat(data.results)));
    } else {
      runner.terminate();
    }
  };

  page.open(url, function(status) {
    if (status !== "success") {
      runner.terminate();
    }
  });
}).call(this);


