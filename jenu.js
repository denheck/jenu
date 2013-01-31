// jenu the javascript menu enhancer

(function(global) {
    var methods = {
        // utility functions
        utility: {
            getById: function(id) {
                return document.getElementById(id);
            },
            each: function (items, callback) {
                for (var i = 0; i < items.length; i++) {
                    callback.call(items[i]);
                }

                return items;
            },
            map: function (items, callback) {
                var newItems = [];
                for (var i = 0; i < items.length; i++) {
                    newItems.push(callback.call(items[i]));
                }
                return newItems;
            }
        },
        hideElement: function (element) {
            element.style.display = 'none';
        },
        getChildListItems: function (element) {
            return map(element.children, function() {
                if (this.tagName === 'LI') {
                    return this;
                }
            });
        },
        getChildUnorderedLists: function (element) {

        },
        hideChildUnorderedLists: function(element) {

        }
    };

    global.jenu = {
        init: function () {
            // Hide all child ul elements
        },
        _expose: function() {
            return methods;
        }
    };
})(this);