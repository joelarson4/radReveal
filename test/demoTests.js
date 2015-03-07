/**
 * These tests are run as part of the default gulp build process.  You can run them in the browser by adding "test" as
 * a url parameter, e.g. loading "demo.html?test".
 */


//tests
describe('Rad startup', function() {
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

});


describe('functionRunner fillSlides fills all slides with now attr', function() {
    it('working', function() { 
        //fillSlides should mean all sections have this attribute
        assert.equal(document.querySelectorAll('section').length, document.querySelectorAll('[data-rad-functionrunner-now]').length);

        var filledSlide = document.querySelector('[data-testing-functionrunner-fillslides="true"]');
        assert.isObject(filledSlide);
    });
});

describe('data-rad-functionrunner-now modifies HTML properly', function() {
    it('working', function() { 
        var sectionElements = Array.prototype.slice.call(document.querySelectorAll('section'));
        sectionElements.forEach(function(ele, index) {
            var attrVal = JSON.parse(ele.getAttribute('data-rad-functionrunner-now'));
            if(attrVal === null) return;

            var html = ele.innerHTML;
            if(attrVal.fun == 'foo') {
                assert.isTrue(elementContains(slide, 'now'));
                assert.isTrue(elementContains(slide, attrVal.args[0]));
                assert.isTrue(elementContains(slide, attrVal.args[1]));
            } else if(attrVal.fun == 'bar') {
                assert.isTrue(elementContains(slide, bar.value));
            }
        });
    });

});

describe('data-rad-functionrunner-shown modifies HTML properly', function() {
    this.timeout(3000);
    var slide = document.querySelector('[data-rad-functionrunner-shown]');
    var attrVal = JSON.parse(slide.getAttribute('data-rad-functionrunner-shown'));
    var slideOriginalHtml = slide.innerHTML;

    navigateTo(slide);

    it('working', function() { 
        assert.notEqual(slide.innerHTML, slideOriginalHtml);
        assert.isTrue(elementContains(slide, 'shown'));
        assert.isTrue(elementContains(slide, attrVal.args[0]));
        assert.isTrue(elementContains(slide, attrVal.args[1]));
    });
});

describe('data-rad-functionrunner-hidden modifies HTML properly', function() {
    this.timeout(3000);
    var slide = document.querySelector('[data-rad-functionrunner-hidden]');
    var attrVal = JSON.parse(slide.getAttribute('data-rad-functionrunner-hidden'));
    var slideIndex = Number(slide.getAttribute('data-rad-main-slide-index'));
    var nextSlide = document.querySelector('[data-rad-main-slide-index="' + (slideIndex + 1) + '"]');
    
    navigateTo(nextSlide);

    it('working', function() { 
        assert.isTrue(elementContains(slide, 'hidden'));
        assert.isTrue(elementContains(slide, attrVal.args[0]));
        assert.isTrue(elementContains(slide, attrVal.args[1]));
    });
});

describe('data-rad-functionrunner-fragment-now modifies HTML properly', function() {
    this.timeout(3000);
    var frag = document.querySelector('.fragment[data-rad-functionrunner-fragment-now]');
    var attrVal = JSON.parse(frag.getAttribute('data-rad-functionrunner-fragment-now'));
    
    it('working', function() { 
        assert.isTrue(elementContains(frag, 'now'), 'now appended');
        assert.isTrue(elementContains(frag, attrVal.args[0]), 'arg[0] appended');
        assert.isTrue(elementContains(frag, attrVal.args[1]), 'arg[1] appended');
    });
});

describe('data-rad-functionrunner-fragment-shown modifies HTML properly', function() {
    this.timeout(3000);
    var frag = document.querySelector('.fragment[data-rad-functionrunner-fragment-shown]');
    
    var attrVal = JSON.parse(frag.getAttribute('data-rad-functionrunner-fragment-shown'));
    
    navigateTo(frag);

    it('working', function() { 
        assert.isTrue(elementContains(frag, 'shown'));
        assert.isTrue(elementContains(frag, attrVal.args[0]));
        assert.isTrue(elementContains(frag, attrVal.args[1]));
    });
});

describe('data-rad-functionrunner-fragment-hidden modifies HTML properly', function() {
    this.timeout(3000);
    var frag = document.querySelector('.fragment[data-rad-functionrunner-fragment-hidden]');
   
    var attrVal = JSON.parse(frag.getAttribute('data-rad-functionrunner-fragment-hidden'));
    
    navigateTo(frag, function() {
        Reveal.prevFragment(); //back up one
    });

    it('working', function() {
        assert.isTrue(elementContains(frag, 'hidden'));
        assert.isTrue(elementContains(frag, attrVal.args[0]));
        assert.isTrue(elementContains(frag, attrVal.args[1]));
    });
});