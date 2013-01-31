// jenu the javascript menu enhancer

(function (global) {
    var methods = {
        // utility functions
        utility: {
            getById: function (id) {
                return document.getElementById(id);
            },
            each: function (items, callback) {
                for (var i = 0; i < items.length; i++) {
                    callback.call(items[i], items[i]);
                }

                return items;
            },
            map: function (items, callback) {
                var newItems = [];
                for (var i = 0; i < items.length; i++) {
                    newItems.push(callback.call(items[i]));
                }
                return newItems;
            },
            filter: function (items, callback) {
                var newItems = [];
                this.each(items, function () {
                    if (callback.call(this) === true) {
                        newItems.push(this);
                    }
                });
                return newItems;
            }
        },
        hideElement: function (element) {
            element.style.display = 'none';
        },
        getChildren: function (element, tagName) {
            return this.utility.filter(element.children, function () {
                if (this.tagName === tagName) {
                    return true;
                }
            });
        },
        hideChildUnorderedLists: function (parentElement) {
            this.utility.each(this.getChildren(parentElement, 'UL'), this.hideElement);
        }
    };

    global.jenu = {
        init: function (menuId) {
            // hide sub menus
            var menuElement = methods.utility.getById(menuId);
            methods.utility.each(menuId.children, methods.hideChildUnorderedLists);

            // add hover/click event to LIs with ULs
            // show flyout menu when triggered
        },
        _expose: function () {
            return methods;
        }
    };
})(this);