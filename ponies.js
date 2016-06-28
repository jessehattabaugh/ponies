/*global HTMLElement*/

const yo = require('yo-yo');

exports.register = register;
exports.render = yo;

function register(def) {
  
  if (typeof def !== 'object') {
    throw new Error("Definition param must be an object");
  }  
  if (!def.render || typeof def.render !== 'function') {
    throw new Error("Definition object must have a render method");
  }
  
  // Get the tagName of the root node returned from render() 
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
      //console.info(tagName + " updated");
      yo.update(this, this.render());
    }
    
    createdCallback() {
      //console.info(tagName + " created");
      if (this.created) this.created();
    }
    
    attachedCallback() {
      //console.info(tagName + " attached");
      this.update();
      this.isAttached = true;
      if (this.attached) this.attached();
    }
    
    attributeChangedCallback(attrName, oldVal, newVal) {
      //console.info(`${tagName}'s ${attrName} changed from ${oldVal} to ${newVal}`);
      
      // don't update unattached elements
      if (!this.isAttached) return;
      
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