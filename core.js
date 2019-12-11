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

// adds an event listener to the element.  The handler element is what gets attached (as is)
ƒA.prototype.ready = function (handler) {
    
    this.each(function () {

        this.addEventListener("DOMContentLoaded", handler, false);

    });

};

// returns the width of the element in scope.  Sets it as well if the newWidth param is provided
ƒA.prototype.width = function (newWidth) {
    
    newWidth = newWidth || null;

    if (newWidth !== null) {

        this.each(function () {

            this.style.width = newWidth;
            
        });

    }

    return this[0].clientWidth;

};

// returns the height of the element in scope.  Sets it as well if the newHeight param is provided
ƒA.prototype.height = function (newHeight) {
    
    newHeight = newHeight || null;

    if (newHeight !== null) {

        this.each(function () {

            this.style.height = newHeight;
            
        });

    }

    return this[0].clientHeight;

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

// information about the library for documentation purposes
let about = {

    Verison: 0.1,
    Author: "Brian Sullivan",
    Created: "29 October 2019",
    Updated: "8 November 2019"

};