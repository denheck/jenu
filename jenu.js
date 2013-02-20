// jenu the javascript menu enhancer

(function (global) {
    var options = {
        slideDown: {
            duration: 700
        },
        slideUp: {
            duration: 700
        },
        stayOpen: false
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
        },
        trim: function (str) {
            return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');
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
        },
        addTextToElement: function (element, text) {
            element.appendChild(document.createTextNode(text));
            return element;
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
        getElementText: function (element) {
            var nodes = element.childNodes;

            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].tagName === 'A' && nodes[i].firstChild.nodeType == 3 && utility.trim(nodes[i].firstChild.nodeValue)) {
                    return nodes[i].firstChild.nodeValue;
                } else if (nodes[i].nodeType == 3 && utility.trim(nodes[i].nodeValue)) {
                    return nodes[i].nodeValue;
                }
            }
        },
        getTextWidth: function (element) {
            var div = this.addTextToElement(document.createElement('div'), this.getElementText(element));
            document.body.appendChild(div);
            var styles = ['font-size','font-style', 'font-weight', 'font-family','line-height', 'text-transform', 'letter-spacing'];
            utility.each(styles, function (style) {
                element.style[style] = this.getStyle(element, style);
            }.bind(this));

            div.style.position = 'absolute';
            div.style.left = -1000;
            div.style.top = -1000;
            div.display = 'none';

            var width = (div.clientWidth + 1) + "px";
            div.parentNode.removeChild(div);

            return width;
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

                // show current target LI flyout menu
                dom.showElement(dom.getChildren(targetElement, 'UL')[0]);

                utility.each(dom.getSiblings(targetElement), function () {
                    utility.each(dom.getChildren(this, 'UL'), dom.hideElement);
                });
            }
        },
        attachFlyOutEvent: function (element) {
            dom.attachEvent(element, 'mouseover', this.flyOut);
        },
        // resize li element to width of text
        resizeLi: function (liElement) {
            liElement.style.width = dom.getTextWidth(liElement);
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
                utility: utility
            };
        }
    };
})(this);