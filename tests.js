module("jenu tests");
test("test utiliy.getById", function () {
    ok(document.getElementById('qunit-fixture') === jenu._expose().utility.getById('qunit-fixture'));
});

test("test utility.each", function () {
    var num1;
    var num2;
    var each = jenu._expose().utility.each;

    each([1], function() {
        num1 = this;
    });

    each([], function() {
        num2 = this;
    });

    equal(num1, 1);
    equal(typeof num2, 'undefined');
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

test("test hideElement", function () {
    var element = document.getElementById('test-div');
    ok(element.style.display !== 'none');
    jenu._expose().hideElement(element);
    ok(element.style.display === 'none');
});

