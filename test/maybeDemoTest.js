if(window.mochaPhantomJS || document.location.href.indexOf('test') > -1) {
    var MODULES_PATH = 'node_modules/';
    //headjs 0.96 which ships with reveal.js doesn't support CSS loading...
    if(!window.mochaPhantomJS) {
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

            head.js('test/demoTests.js', function() {
                if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
                else { mocha.run(); }
            });
        }
    );
}