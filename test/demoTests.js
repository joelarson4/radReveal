/**
 * These tests are run as part of the default gulp build process.  You can run them in the browser by adding "test" as
 * a url parameter, e.g. loading "demo.html?test".
 */

//tests
describe('Rad API', function() { //TODO: split into multiple describe calls
    it('RadReveal is require-able and exists with initialize function', function() { 
        var RadReveal = require('rad-reveal');
        assert.isObject(RadReveal); 
        assert.isFunction(RadReveal.initialize);
    });

    it('section data-rad-main-slide-index attributes added', function() {
        //just check a few
        assert.isObject(document.querySelector('section[data-rad-main-slide-index="0"]'));
        assert.isObject(document.querySelector('section[data-rad-main-slide-index="1"]'));
        assert.isObject(document.querySelector('section[data-rad-main-slide-index="2"]'));

        assert.equal(document.querySelectorAll('section').length, document.querySelectorAll('[data-rad-main-slide-index]').length);
    });

    it('fragment data-rad-main-fragment-index attributes added', function() {
        //just check a few
        assert.isObject(document.querySelector('.fragment[data-rad-main-fragment-index="0"]'));
        assert.isObject(document.querySelector('.fragment[data-rad-main-fragment-index="1"]'));
        assert.isObject(document.querySelector('.fragment[data-rad-main-fragment-index="2"]'));

        assert.equal(document.querySelectorAll('.fragment').length, document.querySelectorAll('[data-rad-main-fragment-index]').length);
    });

    it('fragment data-rad-main-fragment-slide attributes added', function() {
        assert.isObject(document.querySelector('.fragment[data-rad-main-fragment-slide]'));
        assert.equal(document.querySelectorAll('.fragment').length, document.querySelectorAll('[data-rad-main-fragment-slide]').length);

        //check that the slide value equals the index of the slide it is inside of
        var frag = document.querySelector('.fragment');
        var slide = getSlideForFragment(frag);
        assert.equal(frag.getAttribute('data-rad-main-fragment-slide'), slide.getAttribute('data-rad-main-slide-index'));
    });

    it('RadReveal.getSlideObjects returns all slide objects', function() { 
        var RadReveal = require('rad-reveal');
        assert.isArray(RadReveal.getSlideObjects()); 
        assert.isTrue(RadReveal.getSlideObjects().length === document.querySelectorAll('section').length);
    });

    it('RadReveal.on respects array parms', function() {
        var RadReveal = require('rad-reveal');
        var attrNameArray = ['data-rad-functionrunner-load', 'data-rad-functionrunner-show', 'data-rad-functionrunner-hide'];
        var attrMatchCount = 0;
        attrNameArray.forEach(function(attrName) {
            attrMatchCount+= document.querySelectorAll('section[' + attrName + ']').length;
            attrMatchCount+= document.querySelectorAll('.fragment[' + attrName + ']').length;
        });
        var eventNameArray = ['load', 'load', 'load'];

        var actualCalls = 0;

        function handler() { actualCalls++; }
        var handlerArray = [handler, handler, handler];

        RadReveal.on(attrNameArray, eventNameArray, handlerArray);

        var expectedCalls = attrMatchCount * eventNameArray.length * handlerArray.length;
        assert.equal(actualCalls, expectedCalls, 'Handler is called expected number of times for array arguments to RadReveal.on');
    });

    it('RadReveal.on respects CSV parms', function() {
        var RadReveal = require('rad-reveal');
        var attrNameArray = ['data-rad-functionrunner-load', 'data-rad-functionrunner-show', 'data-rad-functionrunner-hide'];
        var attrMatchCount = 0;
        attrNameArray.forEach(function(attrName) {
            attrMatchCount+= document.querySelectorAll('section[' + attrName + ']').length;
            attrMatchCount+= document.querySelectorAll('.fragment[' + attrName + ']').length;
        });
        var eventNameArray = ['load', 'load', 'load'];

        var actualCalls = 0;

        function handler() { actualCalls++; }

        RadReveal.on(attrNameArray.join(', '), eventNameArray.join(', '), handler);

        var expectedCalls = attrMatchCount * eventNameArray.length;
        assert.equal(actualCalls, expectedCalls, 'Handler is called expected number of times for CSV arguments to RadReveal.on');
    });

    it('RadReveal.on respects single parms', function() {
        var RadReveal = require('rad-reveal');
        var attrName = 'data-rad-functionrunner-load';
        var attrMatchCount = 0;
        attrMatchCount+= document.querySelectorAll('section[' + attrName + ']').length;
        attrMatchCount+= document.querySelectorAll('.fragment[' + attrName + ']').length;

        var actualCalls = 0;

        function handler() { actualCalls++; }

        RadReveal.on(attrName, 'load', handler);

        assert.equal(actualCalls, attrMatchCount, 'Handler is called expected number of times for single arguments to RadReveal.on');
    });

    it('RadReveal.on respects asterisk attr name', function() {
        var RadReveal = require('rad-reveal');
        var attrNamePrefix = 'data-rad-functionrunner-';
        var attrMatchCount = 0;
        var elements = Array.prototype.slice.apply(document.querySelectorAll('section'));
        elements = elements.concat(Array.prototype.slice.apply(document.querySelectorAll('.fragment')));
        elements.slice(document.querySelectorAll('section')).forEach(function(ele) {
            var attrArray = Array.prototype.slice.apply(ele.attributes);
            attrArray.forEach(function(attr) {
                if(attr.specified && attr.name.indexOf(attrNamePrefix) > -1) {
                    attrMatchCount++;
                }
            });
        })

        var actualCalls = 0;

        function handler() { actualCalls++; }

        RadReveal.on(attrNamePrefix + '*', 'load', handler);

        assert.equal(actualCalls, attrMatchCount, 'Handler is called expected number of times for asterisk attrName to RadReveal.on');
    });


});


describe('functionRunner fillSlides fills all slides with load attr', function() {
    it('working', function() { 
        //fillSlides should mean all sections have this attribute
        assert.equal(document.querySelectorAll('section').length, document.querySelectorAll('section[data-rad-functionrunner-load]').length);

        var filledSlide = document.querySelector('[data-testing-functionrunner-fillslides="true"]');
        assert.isObject(filledSlide);
    });
});

describe('data-rad-functionrunner-load modifies HTML properly', function() {
    it('working', function() { 
        var sectionElements = Array.prototype.slice.call(document.querySelectorAll('section'));
        sectionElements.forEach(function(ele, index) {
            var attrVal = JSON.parse(ele.getAttribute('data-rad-functionrunner-load'));
            if(attrVal === null) return;

            var html = ele.innerHTML;
            if(attrVal.fun == 'foo') {
                assert.isTrue(elementContains(slide, 'load'));
                assert.isTrue(elementContains(slide, attrVal.args[0]));
            } else if(attrVal.fun == 'bar') {
                assert.isTrue(elementContains(slide, bar.value));
            }
        });
    });

});

describe('data-rad-functionrunner-show modifies HTML properly', function() {
    this.timeout(3000);
    var slide = document.querySelector('section[data-rad-functionrunner-show]');
    var attrVal = JSON.parse(slide.getAttribute('data-rad-functionrunner-show'));
    var slideOriginalHtml = slide.innerHTML;

    navigateTo(slide);

    it('working', function() { 
        assert.notEqual(slide.innerHTML, slideOriginalHtml);
        assert.isTrue(elementContains(slide, 'show'));
        assert.isTrue(elementContains(slide, attrVal.args[0]));
    });
});

describe('data-rad-functionrunner-hide modifies HTML properly', function() {
    this.timeout(3000);
    var slide = document.querySelector('section[data-rad-functionrunner-hide]');
    var attrVal = JSON.parse(slide.getAttribute('data-rad-functionrunner-hide'));
    var slideIndex = Number(slide.getAttribute('data-rad-main-slide-index'));
    var nextSlide = document.querySelector('[data-rad-main-slide-index="' + (slideIndex + 1) + '"]');
    
    navigateTo(nextSlide);

    it('working', function() { 
        assert.isTrue(elementContains(slide, 'hide'));
        assert.isTrue(elementContains(slide, attrVal.args[0]));
    });
});

describe('fragment data-rad-functionrunner-load modifies HTML properly', function() {
    this.timeout(3000);
    var frag = document.querySelector('.fragment[data-rad-functionrunner-load]');
    var attrVal = JSON.parse(frag.getAttribute('data-rad-functionrunner-load'));
    
    it('working', function() { 
        assert.isTrue(elementContains(frag, 'load'));
        assert.isTrue(elementContains(frag, attrVal.args[0]));
    });
});

describe('fragment data-rad-functionrunner-show modifies HTML properly', function() {
    this.timeout(3000);
    var frag = document.querySelector('.fragment[data-rad-functionrunner-show]');
    
    var attrVal = JSON.parse(frag.getAttribute('data-rad-functionrunner-show'));
    
    navigateTo(frag);

    it('working', function() { 
        assert.isTrue(elementContains(frag, 'show'));
        assert.isTrue(elementContains(frag, attrVal.args[0]));
    });
});

describe('fragment data-rad-functionrunner-hide modifies HTML properly', function() {
    this.timeout(3000);
    var frag = document.querySelector('.fragment[data-rad-functionrunner-hide]');
   
    var attrVal = JSON.parse(frag.getAttribute('data-rad-functionrunner-hide'));
    
    navigateTo(frag, function() {
        Reveal.prevFragment(); //back up one
    });

    it('working', function() {
        assert.isTrue(elementContains(frag, 'hide'));
        assert.isTrue(elementContains(frag, attrVal.args[0]));
    });
});