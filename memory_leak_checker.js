(function (window) {
    "use strict";

    var mlc = {
        "uniq_id": String((new Date()).getTime()),
        "checked": 1,
        "is_seen": [],

        "log": function () {
            if (window.console && window.console.log) {
                window.console.log.apply(window.console, arguments);
            }
        },

        "checkLeaks": function (obj) {
            var key, i, j;

            if (!obj || (typeof obj === "function") || mlc.checked > 20000) {
                return;
            }

            if (mlc.isArray(obj) || mlc.isObject(obj)) {
                if (mlc.isArray(obj)) {
                    mlc.logTooBig(obj, obj.length);
                    j = obj.length;
                    for (i = 0; i < j; i += 1) {
                        mlc.checkIfNeeded(obj[i]);
                    }
                } else if (mlc.isObject(obj)) {
                    mlc.logTooBig(obj, mlc.getKeys(obj).length);

                    for (key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            mlc.checkIfNeeded(obj[key]);
                        }
                    }
                }
            }
        },

        "checkIfNeeded": function (obj) {
            if (!obj) {
                return;
            }

            mlc.checked += 1;

            if (mlc.isArray(obj) || mlc.isObject(obj)) {
                obj.x_leaks_checked = obj.x_leaks_checked || "";
                if (obj.x_leaks_checked === mlc.uniq_id) {
                    return;
                }

                try {
                    obj.x_leaks_checked = mlc.uniq_id;
                } catch (ee) {
                    mlc.log(obj, ee);
                }

                window.setTimeout(mlc.partial(mlc.checkLeaks, obj), 5);
            }
        },

        "logTooBig": function (obj, limit) {
            if (limit > 200) {
                mlc.log("Object too big, memory leak? [size: " + limit + "]");
                mlc.log(obj);
                mlc.log("-------");
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
            return typeof obj === "object";
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

    window.MemoryLeakChecker = mlc;
    mlc.checkLeaks(window);
}(window));
