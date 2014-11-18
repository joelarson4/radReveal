(function() {
    var config;

    function init(inputConfig, allSlideObjs) {
        config = inputConfig || {};

        if(config.fillSlides) {
            ['setup', 'arriving', 'leaving'].forEach(function(eventName) {
                if(!config.fillSlides[eventName]) return;
                var attrName = 'data-rad-functionrunner-' + eventName;
                var attrVal = config.fillSlides[eventName];
                if(typeof attrVal !== 'string') attrVal = JSON.stringify(attrVal);
                allSlideObjs.forEach(function(slideObj) {
                    if(!slideObj.element.hasAttribute(attrName)) {
                        slideObj.element.setAttribute(attrName, attrVal);
                    }
                });    
            })
        }
    }

    function runner(attrVal, slideObj, event, radEventName) {
        var opts = JSON.parse(attrVal);
        if(!opts) return;

        var root = window;
        if(opts.root) {
            eval("root = " + opts.root);
        }
        if(opts.module) {
            root = require('./' + opts.module);
            if(typeof root !== 'object') {
                console.log('Module ' + opts.module + ' not found');
                return;
            }
        }
        var func = root[opts.func];
        if(typeof func !== 'function') {
            console.log('Function ' + opts.func + ' not found');
            return;
        }
        opts.args = (opts.args || []).concat([ slideObj, event, radEventName ]);
        func.apply(root, opts.args);
    }

    RadReveal.register({
        name: 'functionRunner',
        init: init,
        attributeEventListeners: {
            'data-rad-functionrunner-setup': {
                setup: runner
            },
            'data-rad-functionrunner-shown': {
                shown: runner
            },
            'data-rad-functionrunner-hidden': {
                hidden: runner
            },
            'data-rad-functionrunner-fragment-setup': {
                fragmentSetup: runner
            },
            'data-rad-functionrunner-fragment-shown': {
                fragmentShown: runner
            },
            'data-rad-functionrunner-fragment-hidden': {
                fragmentHidden: runner
            }
        }
    });
})();