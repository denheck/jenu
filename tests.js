module("jenu tests");
test("test utiliy.getById", function () {
    ok(document.getElementById('qunit-fixture') === jenu._expose().utility.getById('qunit-fixture'));
});

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

test("test hideElement", function () {
    var element = document.getElementById('test-menu');
    ok(element.style.display !== 'none');
    jenu._expose().hideElement(element);
    ok(element.style.display === 'none');
});

test("test getChildren", function () {
    var methods = jenu._expose();
    var childListItems = methods.getChildren(methods.utility.getById('test-menu'), 'LI');

    for (var i = 0; i < childListItems.length; i++) {
        equal(childListItems[i].id, 'link-' + (i + 1));
    }

    var childUnorderedLists = methods.getChildren(methods.utility.getById('link-2'), 'UL');

    for (var i = 0; i < childUnorderedLists.length; i++) {
        equal(childUnorderedLists[i].id, 'second-level-ul-1');
    }
});

test("test hideChildUnorderedLists", function () {
    var methods = jenu._expose();
    methods.hideChildUnorderedLists(methods.utility.getById('link-2'));
    equal(document.getElementById('second-level-ul-1').style.display, 'none');
});