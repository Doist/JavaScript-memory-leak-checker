(function (window) {
    "use strict";

    var MemoryLeakChecker = {
        "uniq_id": String((new Date()).getTime()),
        "checked": 1,
        "is_seen": [],

        "log": function () {
            if (window.console && window.console.log) {
                window.console.log.apply(window.console, arguments);
            }
        },

        "checkLeaks": function (obj) {
            var self = MemoryLeakChecker, key, i, j;

            if (!obj || (typeof obj === "function") || self.checked > 20000) {
                return;
            }

            if (self.isArray(obj) || self.isObject(obj)) {
                if (self.isArray(obj)) {
                    self.logTooBig(obj, obj.length);
                    j = obj.length;
                    for (i = 0; i < j; i += 1) {
                        self.checkIfNeeded(obj[i]);
                    }
                } else if (self.isObject(obj)) {
                    self.logTooBig(obj, self.getKeys(obj).length);

                    for (key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            self.checkIfNeeded(obj[key]);
                        }
                    }
                }
            }
        },

        "checkIfNeeded": function (obj) {
            if (!obj) {
                return;
            }

            var self = MemoryLeakChecker;
            self.checked += 1;

            if (self.isArray(obj) || self.isObject(obj)) {
                obj.x_leaks_checked = obj.x_leaks_checked || "";
                if (obj.x_leaks_checked === self.uniq_id) {
                    return;
                }

                try {
                    obj.x_leaks_checked = self.uniq_id;
                } catch (ee) {
                    self.log(obj, ee);
                }

                setTimeout(self.partial(self.checkLeaks, obj), 5);
            }
        },

        "logTooBig": function (obj, limit) {
            if (limit > 200) {
                MemoryLeakChecker.log("Object too big, memory leak? [size: " + limit + "]");
                MemoryLeakChecker.log(obj);
                MemoryLeakChecker.log("-------");
            }
        },

        "getKeys": function (obj) {
            var rval = [], prop;
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    rval.push(prop);
                }
            }
            return rval;
        },

        "isArray": function (obj) {
            try {
                return obj instanceof Array;
            } catch (e) {
                return false;
            }
        },

        "isObject": function (obj) {
            return (typeof obj === "object");
        },

        "partial": function (fn) {
            var args = Array.prototype.slice.call(arguments);
            args.shift();
            return function () {
                var new_args = Array.prototype.slice.call(arguments);
                args = args.concat(new_args);
                return fn.apply(window, args);
            };
        }
    };

    window.MemoryLeakChecker = MemoryLeakChecker;
    MemoryLeakChecker.checkLeaks(window);
}(window));
