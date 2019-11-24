/*

    The logic below sets up the object that contains the collection

*/

// underlying object behind the ƒ interaction.  This is what we prototype with the functions we want
let ƒA = function (collection, initialSelector) {

    for ( let i = 0; i < collection.length; ++i ) {

        this[i] = collection[i];

    }

    this.length = collection.length;

    this.selector = initialSelector;

};

/*
    Prototype functions go here
*/

// return a proper collection object for the element at the provided index from the existing collection
ƒA.prototype.addClass = function (newClass) {

    this.each(function() {
        
        let currentClasses = this.getAttribute("class");

        if ( (" " + currentClasses + " ").indexOf(newClass) === -1 ) {

            this.setAttribute("class", currentClasses + " " + newClass);

        }

    });

}

// return a proper collection object for the element at the provided index from the existing collection
ƒA.prototype.at = function (index) {

    let elements = [];

    try {

        elements.push(this[index]);

    }
    catch{ }
    
    let newSelector = null;

    return new ƒA(elements, newSelector);

}

// append the given html to the end of each element matched by the selector
ƒA.prototype.append = function (html) {

    this.each(function() {

        let currentInnerHTML = this.innerHTML;

        let newHTML = currentInnerHTML + html;

        this.innerHTML = newHTML;

    });

}

// call the function provided given the context of each element in the collection
ƒA.prototype.each = function (innerFunction) {
    
    for ( let i = 0; i < this.length; ++i ) {
        
        let element = this[i];

        innerFunction.call(element);

    }

};

// Overrides the HTML within the given elements with the HTML provided
ƒA.prototype.html = function (html) {
    
    this.each(function () {

        this.innerHTML = html;

    });

};

// Returns true if the selected element is an element of the type provided.
// Expected values: "div", "ul", "li", "select", etc
ƒA.prototype.isA = function (expectedDOMElementType) {

    let upper = expectedDOMElementType.toUpperCase().trim();

    try {

        let actualElementType = this[0].nodeName;
        let upperActual = actualElementType.toUpperCase().trim();

        return (upperActual === upper);

    }
    catch {
        return undefined;
    }

};

// Find the closest child element that matches the selector provided
ƒA.prototype.find = function (childSelector) {

    let elements = [];

    for ( let i = 0; i < this.length; ++i ) {

        let parentElement = this[i];

        let childElements = parentElement.querySelectorAll(childSelector);

        for ( let j = 0; j < childElements.length; ++j ) {

            elements.push(childElements[j]);

        }

    }

    let newSelector = null;

    if ( this.selector !== null ) {

        newSelector = this.selector + " " + childSelector;

    }

    return new ƒA(elements, this.selector + " " + childSelector);

};

// Find the closest parent element that matches the selector provided
ƒA.prototype.closest = function (parentSelector) {
    
    for ( let i = 0; i < this.length; ++i ) {

        let currentElement = this[i];

        let currentNode = currentElement;

        while ( currentNode !== null ) {

            if ( currentNode.matches(parentSelector) ) {

                return new ƒA([currentNode], parentSelector);

            }

            currentNode = currentNode.parentNode;

        }

    }

    return new ƒA([], parentSelector);

};

// Template for prototype functions
ƒA.prototype.supportedFunction = function (param) {

    console.log("param = " + param);

};

/*

    The logic below sets up the collection fetcher, very similar to how JQuery operates.

*/

// Pass in a single object or a selector and it will become wrapped in a collection with accessible functions
let ƒ = function (selector) {

    let elements = [];

    try {

        let foundElements = Array.from(document.querySelectorAll(selector));
        
        if ( foundElements.length > 0 ) {
            elements = foundElements;
        }

    }
    catch{

        elements.push(selector);
        selector = null;

    }    

    return new ƒA(elements, selector);

};

// Template for prototype functions
ƒ.ajax = async function (settings) {

    let url = checkProperty(settings, "url", "");
    if ( url === "" ) {
        console.log("ajax request attempted without a valid url property");
        return;
    }

    let type = checkProperty(settings, "type", "get");

    let contentType = checkProperty(settings, "contentType", "application/json");
    
    let dataType = checkProperty(settings, "dataType", "json");
    
    let data = checkProperty(settings, "data", {});
    
    let processData = checkProperty(settings, "processData", true);
    
    let async = checkProperty(settings, "async", true);
    
    let success = checkProperty(settings, "success", function () {});

    let response = "";

    return new Promise(function (resolve, reject) {

        let request = new XMLHttpRequest();
        request.onload = function () {
            response = this.responseText;
            success.call(this);
            resolve(response);
        };
        request.open(type, url, async);
        request.send(data);

    });

};

// return the value of an object's property or an empty string if it does not exist
let checkProperty = function (object, property, defaultValue) {

    if ( object[property] !== undefined ) {

        return object[property];

    }

    return defaultValue;

};

/*

    Promise Polyfill

*/

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

/**
 * @this {Promise}
 */
function finallyConstructor(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function() {
        // @ts-ignore
        return constructor.reject(reason);
      });
    }
  );
}

// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function isArray(x) {
  return Boolean(x && typeof x.length !== 'undefined');
}

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

/**
 * @constructor
 * @param {Function} fn
 */
function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  /** @type {!number} */
  this._state = 0;
  /** @type {!boolean} */
  this._handled = false;
  /** @type {Promise|undefined} */
  this._value = undefined;
  /** @type {!Array<!Function>} */
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

/**
 * @constructor
 */
function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  // @ts-ignore
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = finallyConstructor;

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.all accepts an array'));
    }

    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.race accepts an array'));
    }

    for (var i = 0, len = arr.length; i < len; i++) {
      Promise.resolve(arr[i]).then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  // @ts-ignore
  (typeof setImmediate === 'function' &&
    function(fn) {
      // @ts-ignore
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

/** @suppress {undefinedVars} */
var globalNS = (function() {
  // the only reliable means to get the global object is
  // `Function('return this')()`
  // However, this causes CSP violations in Chrome apps.
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
  throw new Error('unable to locate global object');
})();

if (!('Promise' in globalNS)) {
  globalNS['Promise'] = Promise;
} else if (!globalNS.Promise.prototype['finally']) {
  globalNS.Promise.prototype['finally'] = finallyConstructor;
}

})));

/*
    End Promise Polyfill

*/

// information about the library for documentation purposes
let about = {

    Verison: 0.1,
    Author: "Brian Sullivan",
    Created: "29 October 2019",
    Updated: "8 November 2019"

};