// jenu the javascript menu enhancer

(function (global) {
    var options = {
        slideDown: {
            duration: 600
        },
        slideUp: {
            duration: 600
        },
        stayOpen: null,
        hoverDelay: 600, // milliseconds
        closeOnMenuMouseOut: true
    };

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
        },
        // TODO: add support for deep copying
        merge: function (defaults) {
            for (var i = 1; i < arguments.length; i++) {
                var additionalOptions = arguments[i];

                for (var n in additionalOptions) {
                    if (additionalOptions[n] !== undefined) {
                        defaults[n] = additionalOptions[n];
                    }
                }
            }

            return defaults;
        }
    };

    var dom = {
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
            if (!element || !element.children) {
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
        },
        getStyle: function (elem, name) {
            if (elem.style[name]) {
                return elem.style[name];
            } else if (elem.currentStyle) {
                return elem.currentStyle[name];
            } else if (document.defaultView && document.defaultView.getComputedStyle) {
                name = name.replace(/([A-Z])/g, "-$1");
                name = name.toLowerCase();
                s = document.defaultView.getComputedStyle(elem, "");
                return s && s.getPropertyValue(name);
            } else {
                return null;
            }
        },
        isChildOf: function (parentElement, childElement) {
            if (parentElement === childElement) {
                return false;
            }

            while (childElement && childElement !== parentElement) {
                childElement = childElement.parentNode;
            }

            return childElement === parentElement;
        }
    };

    var timeoutQueue = {
        queue: [],
        add: function (timeoutId) {
            this.queue.push(timeoutId);
            return this;
        },
        clear: function () {
            utility.each(this.queue, function () {
                clearTimeout(this);
            });
            this.queue = [];
            return this;
        }
    };

    var menu = {
        flyOut: function (event) {
            // event delegation for list items
            var targetElement = event.target.parentElement;

            if (targetElement && targetElement.tagName === 'LI') {
                if (!dom.hasChild(targetElement, 'UL')) {
                    return;
                }

                // delay menu flyout
                timeoutQueue.clear().add(
                    setTimeout(function () {
                        // show current target LI flyout menu
                        dom.showElement(dom.getChildren(targetElement, 'UL')[0]);
                    }, options.hoverDelay)
                );

                if (options.closeOnMenuMouseOut === false) {
                    // hide all other submenus except stayOpen element
                    utility.each(dom.getSiblings(targetElement), function () {
                        if (this !== options.stayOpen) {
                            utility.each(dom.getChildren(this, 'UL'), dom.hideElement);
                        }
                    });
                }
            }
        },
        flyIn: function (event) {
            if (dom.isChildOf(this, event.relatedTarget) || this === event.relatedTarget) {
                return;
            }

            timeoutQueue.clear();

            // hide all other submenus except stayOpen element
            utility.each(dom.getChildren(this, 'LI'), function () {
                if (this !== options.stayOpen) {
                    utility.each(dom.getChildren(this, 'UL'), dom.hideElement);
                }
            });
        },
        attachFlyOutEvent: function (element) {
            dom.attachEvent(element, 'mouseover', this.flyOut);
        },
        attachFlyInEvent: function (ulElement) {
            dom.attachEvent(ulElement, 'mouseout', this.flyIn);
        },
        hideAllChildUls: function (ulElement) {
            // hide all LI elements containing UL elements
            var menuListItems = dom.getChildren(ulElement, 'LI');

            utility.each(menuListItems, function (liElement) {
                var childUl = dom.getChildren(liElement, 'UL')[0];

                if (childUl && childUl.style) {
                    childUl.style.display = 'none';
                }
                this.hideAllChildUls(childUl);
            }.bind(this));
        },
        init: function (ulElement) {
            this.hideAllChildUls(ulElement);
            this.attachFlyOutEvent(ulElement);
            this.attachFlyInEvent(ulElement);

            // open stayOpen
            dom.showElement(dom.getChildren(options.stayOpen, 'UL')[0]);
        }
    };

    // detect existence of jquery
    if (typeof this.jQuery != 'undefined') {
        dom.showElement = function (element) {
            $(element).slideDown(options.slideDown);
        };

        dom.hideElement = function (element) {
            $(element).slideUp(options.slideUp);
        };

        // all ul elements with jenu class automatically become jenu menus
        $(function () {
            $('ul.jenu').each(function () {
                jenu.init(this);
            });
        })
    }

    global.jenu = {
        init: function (element, opts) {
            options = utility.merge(options, opts || {});
            menu.init(element);
        },
        _expose: function () {
            return {
                menu: menu,
                dom: dom,
                utility: utility,
                timeoutQueue: timeoutQueue
            };
        }
    };
})(this);