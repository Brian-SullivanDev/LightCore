/*

    The logic below sets up the object that contains the collection

*/

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
    
    ƒA.prototype.setupTeamBuilder = function () {
    
        console.log(this.selector);
        initializeTeamBuilder(this.selector);
    
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
    
    let ƒ = function (selector) {
    
        let elements = [];
    
        let foundElements = Array.from(document.querySelectorAll(selector));
    
        if ( foundElements.length > 0 ) {
            elements = foundElements;
        }
    
        return new ƒA(elements, selector);
    
    };
    
    let about = {
    
        Verison: 0.1,
        Author: "Brian Sullivan",
        Created: "29 October 2019",
        Updated: "8 November 2019"
    
    };