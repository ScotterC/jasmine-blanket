// version 1.1.5
// https://raw.githubusercontent.com/alex-seville/blanket/master/src/adapters/jasmine-2.x-blanket.js

(function() {

    if (! jasmine) {
        throw new Exception("jasmine library does not exist in global namespace!");
    }

    function elapsed(startTime, endTime) {
        return (endTime - startTime)/1000;
    }

    function ISODateString(d) {
        function pad(n) { return n < 10 ? '0'+n : n; }

        return d.getFullYear() + '-' +
            pad(d.getMonth()+1) + '-' +
            pad(d.getDate()) + 'T' +
            pad(d.getHours()) + ':' +
            pad(d.getMinutes()) + ':' +
            pad(d.getSeconds());
    }

    function trim(str) {
        return str.replace(/^\s+/, "" ).replace(/\s+$/, "" );
    }

    function escapeInvalidXmlChars(str) {
        return str.replace(/\&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/\>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/\'/g, "&apos;");
    }

    /**
     * based on https://raw.github.com/larrymyers/jasmine-reporters/master/src/jasmine.junit_reporter.js
     */
    var BlanketReporter = function(savePath, consolidate, useDotNotation) {

        blanket.setupCoverage();
    };
    BlanketReporter.finished_at = null; // will be updated after all files have been written

    BlanketReporter.prototype = {
        specStarted: function(spec) {
            blanket.onTestStart();
        },

        specDone: function(result) {
            var passed = result.status === "passed" ? 1 : 0;
            blanket.onTestDone(1,passed);
        },

        jasmineDone: function() {
            blanket.onTestsDone();
        },

        log: function(str) {
            var console = jasmine.getGlobal().console;

            if (console && console.log) {
                console.log(str);
            }
        }
    };

    // export public
    jasmine.BlanketReporter = BlanketReporter;

    //override existing jasmine execute
    var originalJasmineExecute = jasmine.getEnv().execute;
    jasmine.getEnv().execute = function(){ console.log("waiting for blanket..."); };


    blanket.beforeStartTestRunner({
        checkRequirejs:true,
        callback:function(){
            jasmine.getEnv().addReporter(new jasmine.BlanketReporter());
            jasmine.getEnv().execute = originalJasmineExecute;
            jasmine.getEnv().execute();
        }
    });
})();

// https://github.com/alex-seville/travis-cov
(typeof exports !== "undefined" ? exports : window).travisCov = (function(){
    var main = {
      check: function(cov,userOptions){
        if (!cov){
          return false;
        }

        var options = {
          threshold: 50 //defaults to 50%
        };

        if (userOptions){
          options.threshold = userOptions.threshold || options.threshold;
        }

        var totals =[];
        for (var filename in cov) {
          var data = cov[filename];
          totals.push(this.reportFile( data,options));
        }

        var totalHits = 0;
        var totalSloc = 0;
        totals.forEach(function(elem){
          totalHits += elem[0];
          totalSloc += elem[1];
        });

        var globCoverage = (totalHits === 0 || totalSloc === 0) ?
                              0 : totalHits / totalSloc * 100;
        console.log("Coverage: "+Math.floor(globCoverage)+"%");
        if (globCoverage < options.threshold || isNaN(globCoverage)){
          console.log("Code coverage below threshold: "+Math.floor(globCoverage)+ " < "+options.threshold);
          if (typeof process !== "undefined"){
            process.exit(1);
          }
          return false;

        }else{
          console.log("Coverage succeeded.");
        }
        return true;
      },
      reportFile: function( data,options) {
        var ret = {
          coverage: 0,
          hits: 0,
          misses: 0,
          sloc: 0
        };
        data.source.forEach(function(line, num){
          num++;
          if (data[num] === 0) {
            ret.misses++;
            ret.sloc++;
          } else if (data[num] !== undefined) {
            ret.hits++;
            ret.sloc++;
          }
        });
        ret.coverage = ret.hits / ret.sloc * 100;

        return [ret.hits,ret.sloc];

      }
  };
  return main;
})();