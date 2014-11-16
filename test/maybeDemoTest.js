if(window.mochaPhantomJS || document.location.href.indexOf('test') > -1) {
    var TEST_PATH = '../test/';
    //headjs 0.96 which ships with reveal.js doesn't support CSS loading...
    if(!window.mochaPhantomJS) {
        var cssElement = document.createElement('link');
        cssElement.setAttribute('rel', 'stylesheet');
        cssElement.setAttribute('href', TEST_PATH + 'lib/mocha.css');
        document.head.appendChild(cssElement);
    };
    head.js(
        TEST_PATH + 'lib/mocha.js',
        TEST_PATH + 'lib/chai.js',
        function() {
            var mochaElement = document.createElement('div');
            mochaElement.id = 'mocha';
            document.body.appendChild(mochaElement);

            mocha.ui('bdd');
            mocha.reporter('html');

            window.assert = chai.assert;

            head.js(TEST_PATH + 'demoTests.js', function() {
                if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
                else { mocha.run(); }
            });
        }
    );
}