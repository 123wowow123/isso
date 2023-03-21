"use strict";

// return `cookie` string if set
var cookie = function(cookie) {
    return (document.cookie.match('(^|; )' + cookie + '=([^;]*)') || 0)[2];
};

var pad = function(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

// Normalize a BCP47 language tag.
// Quoting https://tools.ietf.org/html/bcp47 :
//   An implementation can reproduce this format without accessing
//   the registry as follows.  All subtags, including extension
//   and private use subtags, use lowercase letters with two
//   exceptions: two-letter and four-letter subtags that neither
//   appear at the start of the tag nor occur after singletons.
//   Such two-letter subtags are all uppercase (as in the tags
//   "en-CA-x-ca" or "sgn-BE-FR") and four-letter subtags are
//   titlecase (as in the tag "az-Latn-x-latn").
// We also map underscores to dashes.
var normalize_bcp47 = function(tag) {
    var subtags = tag.toLowerCase().split(/[_-]/);
    var afterSingleton = false;
    for (var i = 0; i < subtags.length; i++) {
        if (subtags[i].length === 1) {
            afterSingleton = true;
        } else if (afterSingleton || i === 0) {
            afterSingleton = false;
        } else if (subtags[i].length === 2) {
            subtags[i] = subtags[i].toUpperCase();
        } else if (subtags[i].length === 4) {
            subtags[i] = subtags[i].charAt(0).toUpperCase()
                + subtags[i].substr(1);
        }
    }
    return subtags.join("-");
};

// Safari private browsing mode supports localStorage, but throws QUOTA_EXCEEDED_ERR
var localStorageImpl;
try {
    localStorage.setItem("x", "y");
    localStorage.removeItem("x");
    localStorageImpl = localStorage;
} catch (ex) {
    localStorageImpl = (function(storage) {
        return {
            setItem: function(key, val) {
                storage[key] = val;
            },
            getItem: function(key) {
                return typeof(storage[key]) !== 'undefined' ? storage[key] : null;
            },
            removeItem: function(key) {
                delete storage[key];
            }
        };
    })({});
}

// Check if something is ready, and if not, register self as listener to be
// triggered once it is ready
var wait_for = function() {
    var listeners = [];
    var is_ready = false;
    return {
        is_ready: function(){return is_ready},
        register: function(listener) {
            // Ignore duplicate listeners
            if (listeners.indexOf(listener) < 0) {
                listeners.push(listener);
            };
        },
        reset: function() { is_ready = false },
        on_ready: function() {
            is_ready = true;
            for (var listener in listeners) {
                // Ignore dead listeners
                if (!listeners[listener]) {
                    continue;
                }
                // Run listener
                listeners[listener]();
            }
            // Clear listeners
            listeners = [];
        },
    };
};

var isTrue = function(value) {
    return /^true$/i.test(value);
}

module.exports = {
    cookie: cookie,
    localStorageImpl: localStorageImpl,
    normalize_bcp47: normalize_bcp47,
    pad: pad,
    wait_for: wait_for,
    isTrue: isTrue
};
