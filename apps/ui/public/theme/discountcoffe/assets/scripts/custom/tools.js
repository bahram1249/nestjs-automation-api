(function($) {
    ! function(e, n, t) {
        function o(e, n) {
            return typeof e === n
        }

        function s() {
            var e, n, t, s, a, i, r;
            for (var l in c)
                if (c.hasOwnProperty(l)) {
                    if (e = [], n = c[l], n.name && (e.push(n.name.toLowerCase()), n.options && n.options.aliases && n.options.aliases.length))
                        for (t = 0; t < n.options.aliases.length; t++) e.push(n.options.aliases[t].toLowerCase());
                    for (s = o(n.fn, "function") ? n.fn() : n.fn, a = 0; a < e.length; a++) i = e[a], r = i.split("."), 1 === r.length ? Modernizr[r[0]] = s : (!Modernizr[r[0]] || Modernizr[r[0]] instanceof Boolean || (Modernizr[r[0]] = new Boolean(Modernizr[r[0]])), Modernizr[r[0]][r[1]] = s), f.push((s ? "" : "no-") + r.join("-"))
                }
        }

        function a(e) {
            var n = u.className,
                t = Modernizr._config.classPrefix || "";
            if (p && (n = n.baseVal), Modernizr._config.enableJSClass) {
                var o = new RegExp("(^|\\s)" + t + "no-js(\\s|$)");
                n = n.replace(o, "$1" + t + "js$2")
            }
            Modernizr._config.enableClasses && (n += " " + t + e.join(" " + t), p ? u.className.baseVal = n : u.className = n)
        }

        function i() {
            return "function" != typeof n.createElement ? n.createElement(arguments[0]) : p ? n.createElementNS.call(n, "http://www.w3.org/2000/svg", arguments[0]) : n.createElement.apply(n, arguments)
        }

        function r() {
            var e = n.body;
            return e || (e = i(p ? "svg" : "body"), e.fake = !0), e
        }

        function l(e, t, o, s) {
            var a, l, f, c, d = "modernizr",
                p = i("div"),
                h = r();
            if (parseInt(o, 10))
                for (; o--;) f = i("div"), f.id = s ? s[o] : d + (o + 1), p.appendChild(f);
            return a = i("style"), a.type = "text/css", a.id = "s" + d, (h.fake ? h : p).appendChild(a), h.appendChild(p), a.styleSheet ? a.styleSheet.cssText = e : a.appendChild(n.createTextNode(e)), p.id = d, h.fake && (h.style.background = "", h.style.overflow = "hidden", c = u.style.overflow, u.style.overflow = "hidden", u.appendChild(h)), l = t(p, e), h.fake ? (h.parentNode.removeChild(h), u.style.overflow = c, u.offsetHeight) : p.parentNode.removeChild(p), !!l
        }
        var f = [],
            c = [],
            d = {
                _version: "3.6.0",
                _config: {
                    classPrefix: "",
                    enableClasses: !0,
                    enableJSClass: !0,
                    usePrefixes: !0
                },
                _q: [],
                on: function(e, n) {
                    var t = this;
                    setTimeout(function() {
                        n(t[e])
                    }, 0)
                },
                addTest: function(e, n, t) {
                    c.push({
                        name: e,
                        fn: n,
                        options: t
                    })
                },
                addAsyncTest: function(e) {
                    c.push({
                        name: null,
                        fn: e
                    })
                }
            },
            Modernizr = function() {};
        Modernizr.prototype = d, Modernizr = new Modernizr;
        var u = n.documentElement,
            p = "svg" === u.nodeName.toLowerCase(),
            h = d._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : ["", ""];
        d._prefixes = h;
        var m = d.testStyles = l;
        Modernizr.addTest("touchevents", function() {
            var t;
            if ("ontouchstart" in e || e.DocumentTouch && n instanceof DocumentTouch) t = !0;
            else {
                var o = ["@media (", h.join("touch-enabled),("), "heartz", ")", "{#modernizr{top:9px;position:absolute}}"].join("");
                m(o, function(e) {
                    t = 9 === e.offsetTop
                })
            }
            return t
        }), s(), a(f), delete d.addTest, delete d.addAsyncTest;
        for (var v = 0; v < Modernizr._q.length; v++) Modernizr._q[v]();
        e.Modernizr = Modernizr
    }(window, document);
    if ("undefined" == typeof jQuery) throw new Error("JavaScript requires jQuery"); + function(t) {
        "use strict";
        var e = t.fn.jquery.split(" ")[0].split(".");
        if (e[0] < 2 && e[1] < 9 || 1 == e[0] && 9 == e[1] && e[2] < 1 || e[0] > 3) throw new Error("requires jQuery version 1.9.1 or higher, but lower than version 4")
    }(jQuery), + function(t) {
        "use strict";

        function e(e, n) {
            return this.each(function() {
                var o = t(this),
                    s = o.data("bs.modal"),
                    a = t.extend({}, i.DEFAULTS, o.data(), "object" == typeof e && e);
                s || o.data("bs.modal", s = new i(this, a)), "string" == typeof e ? s[e](n) : a.show && s.show(n)
            })
        }
        var i = function(e, i) {
            this.options = i, this.$body = t(document.body), this.$element = t(e), this.$dialog = this.$element.find(".modal-dialog"), this.$backdrop = null, this.isShown = null, this.originalBodyPad = null, this.scrollbarWidth = 0, this.ignoreBackdropClick = !1, this.fixedContent = ".navbar-fixed-top, .navbar-fixed-bottom", this.options.remote && this.$element.find(".modal-content").load(this.options.remote, t.proxy(function() {
                this.$element.trigger("loaded.bs.modal")
            }, this))
        };
        i.VERSION = "3.4.1", i.TRANSITION_DURATION = 300, i.BACKDROP_TRANSITION_DURATION = 150, i.DEFAULTS = {
            backdrop: !0,
            keyboard: !0,
            show: !0
        }, i.prototype.toggle = function(t) {
            return this.isShown ? this.hide() : this.show(t)
        }, i.prototype.show = function(e) {
            var n = this,
                o = t.Event("show.bs.modal", {
                    relatedTarget: e
                });
            this.$element.trigger(o), this.isShown || o.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', t.proxy(this.hide, this)), this.$dialog.on("mousedown.dismiss.bs.modal", function() {
                n.$element.one("mouseup.dismiss.bs.modal", function(e) {
                    t(e.target).is(n.$element) && (n.ignoreBackdropClick = !0)
                })
            }), this.backdrop(function() {
                var o = t.support.transition && n.$element.hasClass("fade");
                n.$element.parent().length || n.$element.appendTo(n.$body), n.$element.show().scrollTop(0), n.adjustDialog(), o && n.$element[0].offsetWidth, n.$element.addClass("in"), n.enforceFocus();
                var s = t.Event("shown.bs.modal", {
                    relatedTarget: e
                });
                o ? n.$dialog.one("bsTransitionEnd", function() {
                    n.$element.trigger("focus").trigger(s)
                }).emulateTransitionEnd(i.TRANSITION_DURATION) : n.$element.trigger("focus").trigger(s)
            }))
        }, i.prototype.hide = function(e) {
            e && e.preventDefault(), e = t.Event("hide.bs.modal"), this.$element.trigger(e), this.isShown && !e.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), t(document).off("focusin.bs.modal"), this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"), this.$dialog.off("mousedown.dismiss.bs.modal"), t.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", t.proxy(this.hideModal, this)).emulateTransitionEnd(i.TRANSITION_DURATION) : this.hideModal())
        }, i.prototype.enforceFocus = function() {
            t(document).off("focusin.bs.modal").on("focusin.bs.modal", t.proxy(function(t) {
                document === t.target || this.$element[0] === t.target || this.$element.has(t.target).length || this.$element.trigger("focus")
            }, this))
        }, i.prototype.escape = function() {
            this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", t.proxy(function(t) {
                27 == t.which && this.hide()
            }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
        }, i.prototype.resize = function() {
            this.isShown ? t(window).on("resize.bs.modal", t.proxy(this.handleUpdate, this)) : t(window).off("resize.bs.modal")
        }, i.prototype.hideModal = function() {
            var t = this;
            this.$element.hide(), this.backdrop(function() {
                t.$body.removeClass("modal-open"), t.resetAdjustments(), t.resetScrollbar(), t.$element.trigger("hidden.bs.modal")
            })
        }, i.prototype.removeBackdrop = function() {
            this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
        }, i.prototype.backdrop = function(e) {
            var n = this,
                o = this.$element.hasClass("fade") ? "fade" : "";
            if (this.isShown && this.options.backdrop) {
                var s = t.support.transition && o;
                if (this.$backdrop = t(document.createElement("div")).addClass("modal-backdrop " + o).appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", t.proxy(function(t) {
                        return this.ignoreBackdropClick ? void(this.ignoreBackdropClick = !1) : void(t.target === t.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide()))
                    }, this)), s && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !e) return;
                s ? this.$backdrop.one("bsTransitionEnd", e).emulateTransitionEnd(i.BACKDROP_TRANSITION_DURATION) : e()
            } else if (!this.isShown && this.$backdrop) {
                this.$backdrop.removeClass("in");
                var a = function() {
                    n.removeBackdrop(), e && e()
                };
                t.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", a).emulateTransitionEnd(i.BACKDROP_TRANSITION_DURATION) : a()
            } else e && e()
        }, i.prototype.handleUpdate = function() {
            this.adjustDialog()
        }, i.prototype.adjustDialog = function() {
            var t = this.$element[0].scrollHeight > document.documentElement.clientHeight;
            this.$element.css({
                paddingLeft: !this.bodyIsOverflowing && t ? this.scrollbarWidth : "",
                paddingRight: this.bodyIsOverflowing && !t ? this.scrollbarWidth : ""
            })
        }, i.prototype.resetAdjustments = function() {
            this.$element.css({
                paddingLeft: "",
                paddingRight: ""
            })
        }, i.prototype.checkScrollbar = function() {
            var t = window.innerWidth;
            if (!t) {
                var e = document.documentElement.getBoundingClientRect();
                t = e.right - Math.abs(e.left)
            }
            this.bodyIsOverflowing = document.body.clientWidth < t, this.scrollbarWidth = this.measureScrollbar()
        }, i.prototype.setScrollbar = function() {
            var e = parseInt(this.$body.css("padding-right") || 0, 10);
            this.originalBodyPad = document.body.style.paddingRight || "";
            var i = this.scrollbarWidth;
            this.bodyIsOverflowing && (this.$body.css("padding-right", e + i), t(this.fixedContent).each(function(e, n) {
                var o = n.style.paddingRight,
                    s = t(n).css("padding-right");
                t(n).data("padding-right", o).css("padding-right", parseFloat(s) + i + "px")
            }))
        }, i.prototype.resetScrollbar = function() {
            this.$body.css("padding-right", this.originalBodyPad), t(this.fixedContent).each(function(e, i) {
                var n = t(i).data("padding-right");
                t(i).removeData("padding-right"), i.style.paddingRight = n ? n : ""
            })
        }, i.prototype.measureScrollbar = function() {
            var t = document.createElement("div");
            t.className = "modal-scrollbar-measure", this.$body.append(t);
            var e = t.offsetWidth - t.clientWidth;
            return this.$body[0].removeChild(t), e
        };
        var n = t.fn.modal;
        t.fn.modal = e, t.fn.modal.Constructor = i, t.fn.modal.noConflict = function() {
            return t.fn.modal = n, this
        }, t(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(i) {
            var n = t(this),
                o = n.attr("href"),
                s = n.attr("data-target") || o && o.replace(/.*(?=#[^\s]+$)/, ""),
                a = t(document).find(s),
                r = a.data("bs.modal") ? "toggle" : t.extend({
                    remote: !/#/.test(o) && o
                }, a.data(), n.data());
            n.is("a") && i.preventDefault(), a.one("show.bs.modal", function(t) {
                t.isDefaultPrevented() || a.one("hidden.bs.modal", function() {
                    n.is(":visible") && n.trigger("focus")
                })
            }), e.call(a, r, this)
        })
    }(jQuery), + function(t) {
        "use strict";

        function e(e) {
            return this.each(function() {
                var n = t(this),
                    o = n.data("bs.tab");
                o || n.data("bs.tab", o = new i(this)), "string" == typeof e && o[e]()
            })
        }
        var i = function(e) {
            this.element = t(e)
        };
        i.VERSION = "3.4.1", i.TRANSITION_DURATION = 150, i.prototype.show = function() {
            var e = this.element,
                i = e.closest("ul:not(.dropdown-menu)"),
                n = e.data("target");
            if (n || (n = e.attr("href"), n = n && n.replace(/.*(?=#[^\s]*$)/, "")), !e.parent("li").hasClass("active")) {
                var o = i.find(".active:last a"),
                    s = t.Event("hide.bs.tab", {
                        relatedTarget: e[0]
                    }),
                    a = t.Event("show.bs.tab", {
                        relatedTarget: o[0]
                    });
                if (o.trigger(s), e.trigger(a), !a.isDefaultPrevented() && !s.isDefaultPrevented()) {
                    var r = t(document).find(n);
                    this.activate(e.closest("li"), i), this.activate(r, r.parent(), function() {
                        o.trigger({
                            type: "hidden.bs.tab",
                            relatedTarget: e[0]
                        }), e.trigger({
                            type: "shown.bs.tab",
                            relatedTarget: o[0]
                        })
                    })
                }
            }
        }, i.prototype.activate = function(e, n, o) {
            function s() {
                a.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1), e.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0), r ? (e[0].offsetWidth, e.addClass("in")) : e.removeClass("fade"), e.parent(".dropdown-menu").length && e.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0), o && o()
            }
            var a = n.find("> .active"),
                r = o && t.support.transition && (a.length && a.hasClass("fade") || !!n.find("> .fade").length);
            a.length && r ? a.one("bsTransitionEnd", s).emulateTransitionEnd(i.TRANSITION_DURATION) : s(), a.removeClass("in")
        };
        var n = t.fn.tab;
        t.fn.tab = e, t.fn.tab.Constructor = i, t.fn.tab.noConflict = function() {
            return t.fn.tab = n, this
        };
        var o = function(i) {
            i.preventDefault(), e.call(t(this), "show")
        };
        t(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', o).on("click.bs.tab.data-api", '[data-toggle="pill"]', o)
    }(jQuery), + function(t) {
        "use strict";

        function e() {
            var t = document.createElement("FOUR_SIDES"),
                e = {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "oTransitionEnd otransitionend",
                    transition: "transitionend"
                };
            for (var i in e)
                if (void 0 !== t.style[i]) return {
                    end: e[i]
                };
            return !1
        }
        t.fn.emulateTransitionEnd = function(e) {
            var i = !1,
                n = this;
            t(this).one("bsTransitionEnd", function() {
                i = !0
            });
            var o = function() {
                i || t(n).trigger(t.support.transition.end)
            };
            return setTimeout(o, e), this
        }, t(function() {
            t.support.transition = e(), t.support.transition && (t.event.special.bsTransitionEnd = {
                bindType: t.support.transition.end,
                delegateType: t.support.transition.end,
                handle: function(e) {
                    return t(e.target).is(this) ? e.handleObj.handler.apply(this, arguments) : void 0
                }
            })
        })
    }(jQuery);

}(jQuery));