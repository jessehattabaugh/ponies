/*global HTMLElement*/

const yo = require('yo-yo');

exports.register = register;
exports.render = yo;

function register(def) {
  /** def = { 
    render() { return vtree },
    is (string): the tagName of an HTML element to inherit from, defaults to 'div',
    created() { called after the element is created },
    attached() { called after the element is attached to the dom },
    changed(attrName, oldVal, newVal) { called after the element's attributes have changed },
    detached() { called after the element is detached },
  } */
  
  if (typeof def !== 'object') {
    throw new Error("Definition param must be an object");
  }  
  if (!def.render || typeof def.render !== 'function') {
    throw new Error("Definition object must have a render method");
  }
  
  // Get the tagName of the vnode returned from render() 
  // since we are doing this before an element is instantiated we bind to a blank element
  let el = def.render.bind(document.createElement('DIV'))();
  if (!el instanceof HTMLElement) {
    throw new Error("Render function must return a dom node");
  }
  
  // Check for a dash in the tagname
  let tagName = el.tagName;
  if (tagName.indexOf('-') === -1) {
    throw new Error("The tagName of the root vnode returned by render() must contain a dash");
  }
  
  class CustomElement extends HTMLElement {
    
    update() {
      console.info(tagName + " updated");
      yo.update(this, this.render());
    }
    
    createdCallback() {
      //console.info(tagName + " created");
      if (this.created) this.created();
    }
    
    attachedCallback() {
      console.info(tagName + " attached");
      this.update();
      this.isAttached = true;
      if (this.attached) this.attached();
    }
    
    attributeChangedCallback(attrName, oldVal, newVal) {
      //console.dir(arguments);
      if (!this.isAttached) return;
      //console.log(this);
      console.info(`${tagName}'s ${attrName} changed from ${oldVal} to ${newVal}`);
      this.update();
      if (this.changed) this.changed(attrName, oldVal, newVal);
    }
    
    detachedCallback() {
      //console.info(tagName + " detached");
      if (this.detached) this.detached();
    }
  }
  
  // mixin the definition object
  Object.assign(CustomElement.prototype, def);
  
  document.registerElement(tagName, CustomElement);
}