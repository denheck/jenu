module("jenu utility tests");

test("test utility.each", function () {
    var num1;
    var num2;
    var num3;
    var each = jenu._expose().utility.each;

    each([1], function() {
        num1 = this;
    });
    
    equal(num1, 1);

    each([], function() {
        num2 = this;
    });

    equal(typeof num2, 'undefined');

    each([5], function(i) {
        num3 = i;
    });

    equal(num3, 5);
});

test("test utility.map", function () {
    var map = jenu._expose().utility.map;

    equal(
        JSON.stringify(
            map([1,2,3,4,5], function () {
                return this + 1;
            })
        ),
        '[2,3,4,5,6]'
    );

    equal(
        JSON.stringify(
            map([], function () {})
        ),
        '[]'
    );
});

test("test utility.filter", function () {
    var methods = jenu._expose();

    equal(
        JSON.stringify(
            methods.utility.filter([1,2,3], function () {
                return this == 1;
            })
        ),
        '[1]'
    );

    equal(
        JSON.stringify(
            methods.utility.filter([1,2,3], function () {
                return this % 5 == 0
            })
        ),
        '[]'
    );
});

test("test utility.merge", function () {
    var merge = jenu._expose().utility.merge;
    var testObject = {
        param1: 'test',
        param2: 'foo',
        param3: 'bar'
    };
    var testObject2 = {
        param3: 'blah',
        param4: 10
    };

    var newObject = merge(testObject, testObject2);

    equal(newObject.param1, testObject.param1);
    equal(newObject.param2, testObject.param2);
    equal(newObject.param3, testObject2.param3);
    equal(newObject.param4, testObject2.param4);

    var testObject3 = {};

    var newObject2 = merge(testObject2, testObject3);
    equal(newObject2.param3, testObject2.param3);
    equal(newObject2.param4, testObject2.param4);
});

module("jenu dom tests")

test("tests attachEvent", function () {
    var methods = jenu._expose();
    var element = document.getElementById('link-1');
    element.className = 'blah';

    methods.dom.attachEvent(element, 'click', function () {
        element.className = 'test';
    });

    element.click();
    equal(element.className, 'test');
});

test("test hideElement", function () {
    var element = document.getElementById('test-menu');
    ok(element.style.display !== 'none');
    jenu._expose().dom.hideElement(element);
    ok(element.style.display === 'none');
});

test("test showElement", function () {
    var element = document.getElementById('test-menu');
    element.style.display = 'none';

    jenu._expose().dom.showElement(element);
    ok(element.style.display === 'block');
});

test("test getChildren", function () {
    var methods = jenu._expose();
    var childListItems = methods.dom.getChildren(document.getElementById('test-menu'), 'LI');

    for (var i = 0; i < childListItems.length; i++) {
        equal(childListItems[i].id, 'link-' + (i + 1));
    }

    var childUnorderedLists = methods.dom.getChildren(document.getElementById('link-2'), 'UL');

    for (var i = 0; i < childUnorderedLists.length; i++) {
        equal(childUnorderedLists[i].id, 'second-level-ul-1');
    }

    var noChildItems = methods.dom.getChildren(document.getElementById('test-menu'), 'B');
    equal(noChildItems.length, 0);
});

test("test hasChild", function () {
    var methods = jenu._expose();

    equal(methods.dom.hasChild(document.getElementById('link-1'), 'UL'), false)
    equal(methods.dom.hasChild(document.getElementById('link-2'), 'UL'), true)
    equal(methods.dom.hasChild(document.getElementById('link-3'), 'UL'), false)
    equal(methods.dom.hasChild(document.getElementById('second-level-link-1'), 'UL'), true)
    equal(methods.dom.hasChild(document.getElementById('third-level-link-1'), 'UL'), false)
});

test("test getSiblings", function () {
    var methods = jenu._expose();
    var siblings = methods.dom.getSiblings(document.getElementById('link-2'));

    equal(siblings.length, 2);
    equal(siblings[0].id, 'link-1');
    equal(siblings[1].id, 'link-3');

    siblings = methods.dom.getSiblings(document.getElementById('test-menu'));
    equal(siblings.length, 0);
});

module("jenu timeoutQueue tests");

test("test add", function () {
    var methods = jenu._expose();
    methods.timeoutQueue.add(1);
    methods.timeoutQueue.add(2);

    equal(methods.timeoutQueue.queue.length, 2);
    equal(methods.timeoutQueue.queue[0], 1);
    equal(methods.timeoutQueue.queue[1], 2);
});

test("jenu clear", function () {
    var methods = jenu._expose();

    var num = 1;
    methods.timeoutQueue.add(
        setTimeout(function () { 
            num = 2;
        }, 500)
    );
    methods.timeoutQueue.clear();

    setTimeout(function () {}, 600);

    equal(methods.timeoutQueue.queue.length, 0);
    equal(num, 1);
});

// TODO: test flyout and flyin