// jenu the javascript menu enhancer

(function (global) {
    // utility functions
    var utility = {
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
    };

    var dom = {
        getById: function (id) {
            return document.getElementById(id);
        },
        attachEvent: function (element, event, callbackFunction) {
            if (element.addEventListener) {
                element.addEventListener(event, callbackFunction, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + event, callbackFunction);
            }
        },
        hideElement: function (element) {
            if (!element) {
                return;
            }

            element.style.display = 'none';
        },
        showElement: function (element) {
            if (!element) {
                return;
            }

            element.style.display = 'block';
        },
        getChildren: function (element, tagName) {
            if (!element || !element.hasOwnProperty('children')) {
                return [];
            }

            return utility.filter(element.children, function () {
                if (this.tagName === tagName) {
                    return true;
                }
            });
        },
        hasChild: function (element, tagName) {
            return this.getChildren(element, tagName).length > 0;
        },
        hideChildren: function (parentElement, tagName) {
            utility.each(this.getChildren(parentElement, tagName), this.hideElement);
        },
        getSiblings: function (element) {
            var prevElement = element.previousElementSibling;
            var nextElement = element.nextElementSibling;
            var siblings = [];

            while (prevElement) {
                siblings.push(prevElement);
                prevElement = prevElement.previousElementSibling
            }

            while (nextElement) {
                siblings.push(nextElement);
                nextElement = nextElement.nextElementSibling
            }

            return siblings;
        }
    };

    var menu = {
        flyout: function (event) {
            var targetElement = event.target.tagName === 'A' ? event.target.parentElement : event.target;

            if (targetElement && targetElement.tagName === 'LI') {
                // show current target LI flyout menu
                dom.showElement(dom.getChildren(targetElement, 'UL')[0]);
                
                utility.each(dom.getSiblings(targetElement), function () {
                    utility.each(dom.getChildren(this, 'UL'), dom.hideElement);
                });
            }
        },
        attachFlyOutEvent: function (element) {
            dom.attachEvent(element, 'mouseover', this.flyout);
        },
        init: function (ulElement) {
            var menuListItems = dom.getChildren(ulElement, 'LI');
            
            // hide all LI elements containing UL elements
            utility.each(menuListItems, function () {
                dom.hideChildren(this, 'UL');
            });

            // event delegation for list items
            menu.attachFlyOutEvent(ulElement)
        }
    };

    global.jenu = {
        init: function (menuId) {
            menu.init(dom.getById(menuId));
        },
        _expose: function () {
            return {
                menu: menu,
                dom: dom,
                utility: utility
            };
        }
    };
})(this);