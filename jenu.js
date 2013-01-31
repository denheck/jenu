// jenu the javascript menu enhancer

(function() {
    // utility functions
    var getbyId = document.getElementById;
    var each = function (items, callback) {
        for (var i = 0; i < items.length; i++) {
            callback.call(items[i]);
        }

        return items;
    };

    var map = function (items, callback) {
        var newItems = [];
        for (var i = 0; i < items; i++) {
            newItems.push(callback.call(items[i]));
        }
    };

    var hideElement = function (element) {
        element.style.display = 'none';
    };

    var getChildListItems = function (element) {
        return map(element.children, function() {
            if (this.tagName === 'LI') {
                return this;
            }
        });
    };

    var getChildUnorderedLists = function (element) {

    };
})();