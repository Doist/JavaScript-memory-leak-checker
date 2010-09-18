MemoryLeakChecker = {

    uniq_id: (new Date()).getTime(),
    checked: 1,
    is_seen: [],

    checkLeaks: function(obj) {
        var self = MemoryLeakChecker

        if(!obj || (typeof obj == 'function') || self.checked > 20000)
            return ;

        if((self._isArray(obj) || self._isObject(obj))) {
            if(self._isArray(obj)) {
                self._logTooBig(obj, obj.length)
                for(var i=0; i < obj.length; i++) {
                    self._checkIfNeeded(obj[i])
                }
            }
            else if(self._isObject(obj)) {
                self._logTooBig(obj, self._keys(obj).length)

                for(var key in obj) {
                    self._checkIfNeeded(obj[key])
                }
            }
        }
    },

    _checkIfNeeded: function(obj) {
        if(!obj)
            return ;

        var self = MemoryLeakChecker;
        self.checked++

        if((self._isArray(obj) || self._isObject(obj))) {
            if(obj.__leaks_checked == self.uniq_id)
                return ;
            obj.__leaks_checked = self.uniq_id

            setTimeout(self._partial(self.checkLeaks, obj), 5);
        }
    },

    _logTooBig: function(obj, limit) {
        if(limit > 200) {
            console.log('Object too big, memory leak? [size: ' + limit + ']')
            console.log(obj)
            console.log('-------')
        }
    },

    _keys: function(obj) {
        var rval = [], prop
        for(prop in obj)
            rval.push(prop)
        return rval
    },

    _isArray: function(obj) {
        try {
            return obj instanceof Array
        }
        catch(e) {
            return false
        }
    },

    _isObject: function(obj) {
        return (typeof obj == 'object')
    },

    _partial: function(fn) {
        var args = Array.prototype.slice.call(arguments)
        args.shift()
        return function() {
            var new_args = Array.prototype.slice.call(arguments)
            args = args.concat(new_args)
            return fn.apply(window, args)
        }
    }
}

MemoryLeakChecker.checkLeaks(window);
