/**
 * If running via phantom or in a browser with the a 'test' url parameter,
 * this script will load mocha and chai and kick off test.
 */
if(window.mochaPhantomJS || document.location.href.indexOf('test') > -1) {
    var MODULES_PATH = 'node_modules/';
    if(!window.mochaPhantomJS) {
        //headjs 0.96 which ships with reveal.js doesn't support CSS loading...
        var cssElement = document.createElement('link');
        cssElement.setAttribute('rel', 'stylesheet');
        cssElement.setAttribute('href', MODULES_PATH + 'mocha/mocha.css');
        document.head.appendChild(cssElement);
    };
    head.js(
        MODULES_PATH + 'mocha/mocha.js',
        MODULES_PATH + 'chai/chai.js',
        function() {
            var mochaElement = document.createElement('div');
            mochaElement.id = 'mocha';
            document.body.appendChild(mochaElement);

            mocha.ui('bdd');
            mocha.reporter('html');

            window.assert = chai.assert;

            var testScript = 'test/test.js';
            var scripts = Array.prototype.slice.apply(document.getElementsByTagName('script'));
            //expects to find only one
            for(var si = 0; si < scripts.length; si++) {
                if(scripts[si].src && scripts[si].src.indexOf('maybeTest.js?test=') >-1) {
                    testScript = scripts[si].src.split('maybeTest.js?test=').pop(); //naive
                    break;
                }
            };

            head.js(testScript, function() {
                if(window.mochaPhantomJS) { mochaPhantomJS.run(); }
                else { mocha.run(); }
            });
        }
    );
}